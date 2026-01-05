import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createRouteHandlerClient } from "@/lib/supabase/route-handler";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = 'force-dynamic';

// GET Route für Debugging/Health Check
export async function GET(req: Request) {
    return NextResponse.json({
        status: "ok",
        message: "Checkout API is running",
        timestamp: new Date().toISOString()
    });
}

export async function POST(req: Request) {
    console.log("[Checkout API] POST request received");

    try {
        // 1. User-Authentifizierung
        console.log("[Checkout API] Creating Supabase client...");
        const supabase = await createRouteHandlerClient();
        console.log("[Checkout API] Getting user...");
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError) {
            console.error("[Checkout API] Auth error:", authError);
            return NextResponse.json({ error: "Unauthorized", details: authError.message }, { status: 401 });
        }

        if (!user) {
            console.error("[Checkout API] No user found");
            return NextResponse.json({ error: "Unauthorized", details: "No user found" }, { status: 401 });
        }

        console.log("[Checkout API] User authenticated:", user.id);

        // 2. Request Body parsen
        console.log("[Checkout API] Parsing request body...");
        let body;
        try {
            body = await req.json();
            console.log("[Checkout API] Request body parsed:", { hasImageUrl: !!body.imageUrl, hasGelatoProductUid: !!body.gelatoProductUid });
        } catch (parseError: any) {
            console.error("[Checkout API] Error parsing request body:", parseError);
            return NextResponse.json(
                { error: "Invalid request body", details: parseError.message },
                { status: 400 }
            );
        }

        const { imageUrl, gelatoProductUid, shippingAddress, customerEmail } = body;

        if (!imageUrl || !gelatoProductUid) { // shippingAddress is optional for API level validation but frontend will generic enforce
            console.error("[Checkout API] Missing required fields:", { imageUrl: !!imageUrl, gelatoProductUid: !!gelatoProductUid });
            return NextResponse.json(
                { error: "Missing imageUrl or gelatoProductUid", details: { imageUrl: !!imageUrl, gelatoProductUid: !!gelatoProductUid } },
                { status: 400 }
            );
        }

        console.log("[Checkout API] Processing order for user:", user.id);

        // 3. Admin Client erstellen
        let adminSupabase;
        try {
            adminSupabase = createAdminClient();
            console.log("[Checkout API] Admin client created successfully");
        } catch (adminError: any) {
            console.error("[Checkout API] Error creating admin client:", adminError);
            return NextResponse.json(
                {
                    error: "Failed to initialize database connection",
                    details: adminError?.message || "Unknown error"
                },
                { status: 500 }
            );
        }

        // 4. IMAGE PERSISTENCE: Replicate -> Supabase Storage
        // Wir laden das Bild vom Replicate-Link herunter und speichern es persistent im Storage.
        console.log("[Checkout API] Downloading image from Replicate...");
        let finalStorageUrl = imageUrl; // Fallback: Original URL if upload fails (though we prefer erroring out)
        let storagePath = null;

        try {
            const imageResponse = await fetch(imageUrl);
            if (!imageResponse.ok) {
                throw new Error(`Failed to download image from Replicate: ${imageResponse.statusText}`);
            }

            const imageBuffer = await imageResponse.arrayBuffer();
            const fileName = `${Date.now()}-print.png`;
            const filePath = `${user.id}/${fileName}`; // ordnerstruktur: user_id/filename

            console.log("[Checkout API] Uploading image to Supabase Storage 'print-assets'...", { filePath });

            const { data: uploadData, error: uploadError } = await adminSupabase
                .storage
                .from('print-assets')
                .upload(filePath, imageBuffer, {
                    contentType: 'image/png',
                    upsert: false
                });

            if (uploadError) {
                console.error("[Checkout API] Storage upload failed:", uploadError);
                throw new Error(`Storage upload failed: ${uploadError.message}`);
            }

            // Get Public URL
            const { data: { publicUrl } } = adminSupabase
                .storage
                .from('print-assets')
                .getPublicUrl(filePath);

            finalStorageUrl = publicUrl;
            storagePath = filePath;
            console.log("[Checkout API] Image persisted successfully:", finalStorageUrl);

        } catch (storageError: any) {
            console.error("[Checkout API] CRITICAL ERROR persisting image:", storageError);
            return NextResponse.json(
                {
                    error: "Failed to save print asset",
                    details: storageError.message
                },
                { status: 500 }
            );
        }

        // 5. Order in Supabase erstellen
        const insertData = {
            user_id: user.id,
            image_url: imageUrl,            // Original (Replicate) URL for reference (optional, keeps history)
            print_image_url: finalStorageUrl, // PERSISTENT URL used for printing
            print_image_storage_path: storagePath,
            fulfillment_status: 'unfulfilled',
            amount_cents: 7490, // 74,90 €
            currency: "EUR",
            status: "pending" as any,
            gelato_product_uid: gelatoProductUid, // Store the product UID
            shipping_address: {
                ...shippingAddress,
                email: customerEmail || user.email
            }, // SAVE ADDRESS UPFRONT WITH EMAIL
        };

        console.log("[Checkout API] Attempting to insert order:", { ...insertData, image_url: '...', shipping_address: '...' });

        const { data: order, error: orderError } = await adminSupabase
            .from("orders")
            .insert(insertData)
            .select()
            .single();

        if (orderError || !order) {
            console.error("[Checkout API] Order creation error:", orderError);
            return NextResponse.json(
                {
                    error: "Failed to create order in database",
                    details: orderError?.message
                },
                { status: 500 }
            );
        }

        console.log("[Checkout API] Order created:", order.id);

        // 6. Stripe Checkout Session erstellen
        const origin = req.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
        const encodedImageUrl = encodeURIComponent(imageUrl); // Using original URL for redirect back, acts as key

        const lineItems = [{
            price_data: {
                currency: "eur",
                product_data: {
                    name: "The Connected Soul - Personalisiertes Kunstwerk",
                    description: "Abstract Continuous Line Art, 40x40cm, Echtholz-Rahmen",
                    images: [finalStorageUrl], // Use our persistent URL for Stripe Display
                },
                unit_amount: 7490,
            },
            quantity: 1,
        }];

        console.log("[Checkout API] Creating Stripe Session...");

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card", "paypal"], // Added DACH relevant methods. Note: SEPA often needs separate activation or takes longer
            line_items: lineItems,
            mode: "payment",
            // We collect email upfront in our form
            customer_email: customerEmail || user.email || undefined,
            metadata: {
                orderId: order.id,
                userId: user.id,
                imageUrl: finalStorageUrl,
                gelatoProductUid: gelatoProductUid,
            },
            success_url: `${origin}/orders/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/preview/result?img=${encodedImageUrl}`,
            // Optional: billing_address_collection: 'required' if needed for tax, 
            // but we already have it from the modal. 
        });

        // 7. Order mit Stripe Checkout ID aktualisieren
        const { error: updateError } = await adminSupabase
            .from("orders")
            .update({
                stripe_checkout_id: session.id,
                // Ensure we don't accidentally mark as paid if already confirmed by quick webhook?
            })
            .eq("id", order.id);

        if (updateError) {
            console.error("[Checkout API] Error updating order with Stripe ID:", updateError);
        }

        console.log("[Checkout API] Stripe Checkout Session created:", session.id);

        return NextResponse.json({
            sessionId: session.id,
            url: session.url,
            orderId: order.id,
        });
    } catch (error: any) {
        console.error("[Checkout API] Error:", error);
        return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
    }
}
