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

        const { imageUrl, gelatoProductUid } = body;

        if (!imageUrl || !gelatoProductUid) {
            console.error("[Checkout API] Missing required fields:", { imageUrl: !!imageUrl, gelatoProductUid: !!gelatoProductUid });
            return NextResponse.json(
                { error: "Missing imageUrl or gelatoProductUid", details: { imageUrl: !!imageUrl, gelatoProductUid: !!gelatoProductUid } },
                { status: 400 }
            );
        }

        console.log("[Checkout API] Creating order for user:", user.id);

        // 3. Order in Supabase erstellen
        // Verwende Admin Client um RLS-Policies zu umgehen
        let adminSupabase;
        try {
            // #region agent log
            fetch('http://127.0.0.1:7243/ingest/c4b693a6-e4ee-4d58-9f0a-6cb5db0f1fcc',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/api/checkout/route.ts:68',message:'Creating admin client - checking env vars',data:{hasUrl:!!process.env.NEXT_PUBLIC_SUPABASE_URL,hasServiceKey:!!process.env.SUPABASE_SERVICE_ROLE_KEY,serviceKeyLength:process.env.SUPABASE_SERVICE_ROLE_KEY?.length||0},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
            // #endregion
            adminSupabase = createAdminClient();
            // #region agent log
            fetch('http://127.0.0.1:7243/ingest/c4b693a6-e4ee-4d58-9f0a-6cb5db0f1fcc',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/api/checkout/route.ts:70',message:'Admin client created successfully',data:{clientType:typeof adminSupabase},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
            // #endregion
            console.log("[Checkout API] Admin client created successfully");
        } catch (adminError: any) {
            // #region agent log
            fetch('http://127.0.0.1:7243/ingest/c4b693a6-e4ee-4d58-9f0a-6cb5db0f1fcc',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/api/checkout/route.ts:72',message:'Admin client creation failed',data:{error:adminError?.message,stack:adminError?.stack},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
            // #endregion
            console.error("[Checkout API] Error creating admin client:", adminError);
            return NextResponse.json(
                { 
                    error: "Failed to initialize database connection",
                    details: adminError?.message || "Unknown error"
                },
                { status: 500 }
            );
        }
        
        // Prüfe ob die Tabelle existiert, indem wir versuchen, eine Testabfrage zu machen
        // #region agent log
        fetch('http://127.0.0.1:7243/ingest/c4b693a6-e4ee-4d58-9f0a-6cb5db0f1fcc',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/api/checkout/route.ts:83',message:'Testing table access with admin client',data:{table:'orders'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
        // #endregion
        const { data: testQuery, error: testError } = await adminSupabase
            .from("orders")
            .select("id")
            .limit(0);
        // #region agent log
        fetch('http://127.0.0.1:7243/ingest/c4b693a6-e4ee-4d58-9f0a-6cb5db0f1fcc',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/api/checkout/route.ts:86',message:'Table test query result',data:{hasData:!!testQuery,hasError:!!testError,errorCode:testError?.code,errorMessage:testError?.message},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
        // #endregion
        if (testError && testError.code === '42P01') {
            console.error("[Checkout API] Orders table does not exist!");
            return NextResponse.json(
                { 
                    error: "Database table not found",
                    details: "The orders table does not exist. Please run the database migrations.",
                    hint: "Execute the migration file: supabase/migrations/000_create_orders_table.sql"
                },
                { status: 500 }
            );
        }
        
        // Prüfe ob user_id in auth.users existiert
        // #region agent log
        fetch('http://127.0.0.1:7243/ingest/c4b693a6-e4ee-4d58-9f0a-6cb5db0f1fcc',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/api/checkout/route.ts:98',message:'Checking if user exists in auth.users',data:{userId:user.id},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
        // #endregion
        const { data: userCheck, error: userCheckError } = await adminSupabase.auth.admin.getUserById(user.id);
        // #region agent log
        fetch('http://127.0.0.1:7243/ingest/c4b693a6-e4ee-4d58-9f0a-6cb5db0f1fcc',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/api/checkout/route.ts:100',message:'User check result',data:{userExists:!!userCheck?.user,hasError:!!userCheckError,errorMessage:userCheckError?.message},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
        // #endregion
        
        // Versuche Order zu erstellen
        const insertData = {
            user_id: user.id,
            image_url: imageUrl,
            amount_cents: 4900, // 49,00 €
            currency: "EUR",
            status: "pending" as any, // Cast zu any falls ENUM-Probleme
        };
        // #region agent log
        fetch('http://127.0.0.1:7243/ingest/c4b693a6-e4ee-4d58-9f0a-6cb5db0f1fcc',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/api/checkout/route.ts:100',message:'Before insert - data prepared',data:{userId:insertData.user_id,imageUrlLength:insertData.image_url?.length||0,amountCents:insertData.amount_cents,currency:insertData.currency,status:insertData.status,statusType:typeof insertData.status},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
        // #endregion
        console.log("[Checkout API] Attempting to insert order with data:", {
            user_id: user.id,
            image_url: imageUrl?.substring(0, 50) + "...",
            amount_cents: 4900,
            currency: "EUR",
            status: "pending"
        });
        
        // #region agent log
        fetch('http://127.0.0.1:7243/ingest/c4b693a6-e4ee-4d58-9f0a-6cb5db0f1fcc',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/api/checkout/route.ts:109',message:'Executing insert query',data:{table:'orders'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
        // #endregion
        const { data: order, error: orderError } = await adminSupabase
            .from("orders")
            .insert(insertData)
            .select()
            .single();
        // #region agent log
        fetch('http://127.0.0.1:7243/ingest/c4b693a6-e4ee-4d58-9f0a-6cb5db0f1fcc',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/api/checkout/route.ts:119',message:'After insert - result received',data:{hasOrder:!!order,hasError:!!orderError,errorCode:orderError?.code,errorMessage:orderError?.message,errorHint:orderError?.hint,errorDetails:orderError?.details},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B,C,D,E,F'})}).catch(()=>{});
        // #endregion

        if (orderError || !order) {
            // #region agent log
            fetch('http://127.0.0.1:7243/ingest/c4b693a6-e4ee-4d58-9f0a-6cb5db0f1fcc',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/api/checkout/route.ts:121',message:'Order creation failed - full error details',data:{errorCode:orderError?.code,errorMessage:orderError?.message,errorHint:orderError?.hint,errorDetails:orderError?.details,fullError:JSON.stringify(orderError)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B,C,D,E,F'})}).catch(()=>{});
            // #endregion
            console.error("[Checkout API] ========== ORDER CREATION ERROR ==========");
            console.error("[Checkout API] Error object:", orderError);
            console.error("[Checkout API] Error details (JSON):", JSON.stringify(orderError, null, 2));
            console.error("[Checkout API] Error code:", orderError?.code);
            console.error("[Checkout API] Error message:", orderError?.message);
            console.error("[Checkout API] Error hint:", orderError?.hint);
            console.error("[Checkout API] Error details:", orderError?.details);
            console.error("[Checkout API] Full error:", orderError);
            console.error("[Checkout API] ===========================================");
            
            // Spezifische Fehlermeldungen für häufige Probleme
            let errorMessage = "Failed to create order";
            let errorDetails = orderError?.message || "Unknown error";
            
            if (orderError?.code === '23503') {
                errorMessage = "Foreign key constraint violation";
                errorDetails = "The user_id does not exist in the auth.users table";
            } else if (orderError?.code === '23505') {
                errorMessage = "Duplicate entry";
                errorDetails = "An order with this information already exists";
            } else if (orderError?.code === '42P01') {
                errorMessage = "Table not found";
                errorDetails = "The orders table does not exist. Please run database migrations.";
            } else if (orderError?.code === '42501') {
                errorMessage = "Permission denied";
                errorDetails = "The service role key does not have permission to insert into orders table";
            }
            
            return NextResponse.json(
                { 
                    error: errorMessage,
                    details: errorDetails,
                    code: orderError?.code,
                    hint: orderError?.hint,
                    fullError: process.env.NODE_ENV === 'development' ? orderError : undefined
                },
                { status: 500 }
            );
        }

        console.log("[Checkout API] Order created:", order.id);

        // 4. Stripe Checkout Session erstellen
        const origin = req.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
        const encodedImageUrl = encodeURIComponent(imageUrl);

        // Verwende Price ID falls vorhanden und gültig, sonst price_data
        const lineItems = [];
        
        // Verwende immer price_data, da STRIPE_PRICE_ID möglicherweise nicht existiert
        // oder nicht mehr gültig ist. price_data ist flexibler und funktioniert immer.
        lineItems.push({
            price_data: {
                currency: "eur",
                product_data: {
                    name: "The Connected Soul - Personalisiertes Kunstwerk",
                    description: "Abstract Continuous Line Art, 40x40cm, Echtholz-Rahmen",
                    images: [imageUrl],
                },
                unit_amount: 4900, // 49,00 € in Cent
            },
            quantity: 1,
        });
        console.log("[Checkout API] Using price_data for checkout session");

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            shipping_address_collection: {
                allowed_countries: ["DE", "AT", "CH"], // Deutschland, Österreich, Schweiz
            },
            customer_email: user.email || undefined,
            metadata: {
                orderId: order.id,
                imageUrl: imageUrl,
                gelatoProductUid: gelatoProductUid,
            },
            success_url: `${origin}/orders/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/preview/result?img=${encodedImageUrl}`,
        });

        // 5. Order mit Stripe Checkout ID aktualisieren
        const { error: updateError } = await adminSupabase
            .from("orders")
            .update({ stripe_checkout_id: session.id })
            .eq("id", order.id);

        if (updateError) {
            console.error("[Checkout API] Error updating order with Stripe ID:", updateError);
            // Weiterleiten trotzdem, da Order bereits erstellt wurde
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
