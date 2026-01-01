import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { gelatoClient } from "@/lib/gelato/client";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    console.log("🔔 [Stripe Webhook] ========== WEBHOOK RECEIVED ==========");
    console.log("[Stripe Webhook] POST request received");
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/c4b693a6-e4ee-4d58-9f0a-6cb5db0f1fcc', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'app/api/webhook/stripe/route.ts:10', message: 'Webhook POST received', data: { hasBody: !!req, hasWebhookSecret: !!process.env.STRIPE_WEBHOOK_SECRET }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'A' }) }).catch(() => { });
    // #endregion
    const body = await req.text();
    const signature = headers().get("Stripe-Signature") as string;
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/c4b693a6-e4ee-4d58-9f0a-6cb5db0f1fcc', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'app/api/webhook/stripe/route.ts:12', message: 'Webhook body and signature extracted', data: { bodyLength: body.length, hasSignature: !!signature }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'A' }) }).catch(() => { });
    // #endregion

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
        console.log("[Stripe Webhook] ✅ Signature verified - Event type:", event.type, "Event ID:", event.id);
        // #region agent log
        fetch('http://127.0.0.1:7243/ingest/c4b693a6-e4ee-4d58-9f0a-6cb5db0f1fcc', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'app/api/webhook/stripe/route.ts:20', message: 'Webhook signature verified', data: { eventType: event.type, eventId: event.id }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'A' }) }).catch(() => { });
        // #endregion
    } catch (error: any) {
        // #region agent log
        fetch('http://127.0.0.1:7243/ingest/c4b693a6-e4ee-4d58-9f0a-6cb5db0f1fcc', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'app/api/webhook/stripe/route.ts:22', message: 'Webhook signature verification failed', data: { error: error?.message }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'A' }) }).catch(() => { });
        // #endregion
        console.error(`[Stripe Webhook] Error verifying signature:`, error.message);
        return NextResponse.json({ error: `Webhook Error: ${error.message}` }, { status: 400 });
    }

    // Handle the event
    if (event.type === "checkout.session.completed") {
        // #region agent log
        fetch('http://127.0.0.1:7243/ingest/c4b693a6-e4ee-4d58-9f0a-6cb5db0f1fcc', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'app/api/webhook/stripe/route.ts:28', message: 'checkout.session.completed event received', data: { sessionId: (event.data.object as Stripe.Checkout.Session).id }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'B' }) }).catch(() => { });
        // #endregion
        const session = event.data.object as Stripe.Checkout.Session;
        console.log("✅ [Stripe Webhook] Payment successful for session:", session.id);
        console.log("[Stripe Webhook] Session metadata:", session.metadata);
        console.log("[Stripe Webhook] Session shipping_details:", session.shipping_details);
        console.log("[Stripe Webhook] Session customer_details:", session.customer_details);

        try {
            // 1. Hole Order aus Supabase
            console.log("[Stripe Webhook] Looking for order with stripe_checkout_id:", session.id);
            const supabase = createAdminClient();
            const { data: order, error: orderError } = await supabase
                .from("orders")
                .select("*")
                .eq("stripe_checkout_id", session.id)
                .single();

            if (orderError || !order) {
                console.error("[Stripe Webhook] ❌ Order not found:", {
                    error: orderError,
                    stripe_checkout_id: session.id,
                    errorCode: orderError?.code,
                    errorMessage: orderError?.message,
                });
                return NextResponse.json({ error: "Order not found" }, { status: 404 });
            }

            console.log("[Stripe Webhook] ✅ Found order:", {
                orderId: order.id,
                orderStatus: order.status,
                hasImageUrl: !!order.image_url,
                imageUrl: order.image_url?.substring(0, 50) + "...",
            });

            // 2. Update Order: status = 'paid'
            const paymentIntentId = typeof session.payment_intent === 'string'
                ? session.payment_intent
                : session.payment_intent?.id;

            const { error: updateError } = await supabase
                .from("orders")
                .update({
                    status: "paid",
                    paid_at: new Date().toISOString(),
                    stripe_payment_intent_id: paymentIntentId || null,
                })
                .eq("id", order.id);

            if (updateError) {
                console.error("[Stripe Webhook] Error updating order:", updateError);
                // Weiterleiten trotzdem, da Payment bereits erfolgreich war
            }

            console.log("[Stripe Webhook] Order updated to paid status");

            // 3. Extrahiere Versandadresse
            // Bei Link Payment kann die Adresse in verschiedenen Feldern sein
            const shippingAddress = session.shipping_details?.address ||
                (session.customer_details?.address as any);
            const shippingName = session.shipping_details?.name ||
                session.customer_details?.name ||
                "Customer";
            // #region agent log
            fetch('http://127.0.0.1:7243/ingest/c4b693a6-e4ee-4d58-9f0a-6cb5db0f1fcc', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'app/api/webhook/stripe/route.ts:69', message: 'Extracting shipping address', data: { hasShippingDetails: !!session.shipping_details, hasCustomerDetailsAddress: !!session.customer_details?.address, hasShippingAddress: !!shippingAddress, shippingName, paymentMethodType: session.payment_method_types?.[0] }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'C' }) }).catch(() => { });
            // #endregion

            if (!shippingAddress) {
                console.warn("[Stripe Webhook] No shipping address found in session");
                console.warn("[Stripe Webhook] Session data:", JSON.stringify({
                    hasShippingDetails: !!session.shipping_details,
                    hasCustomerDetails: !!session.customer_details,
                    paymentMethodTypes: session.payment_method_types,
                }, null, 2));
                // #region agent log
                fetch('http://127.0.0.1:7243/ingest/c4b693a6-e4ee-4d58-9f0a-6cb5db0f1fcc', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'app/api/webhook/stripe/route.ts:78', message: 'No shipping address - returning early', data: { sessionId: session.id, hasShippingDetails: !!session.shipping_details, hasCustomerDetails: !!session.customer_details }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'C' }) }).catch(() => { });
                // #endregion
                // Speichere trotzdem die Order als paid, auch ohne Versandadresse
                // ABER: Versuche trotzdem Gelato Order zu erstellen, falls möglich
                // (Gelato kann auch ohne Versandadresse erstellt werden, wird später aktualisiert)
            }

            // 4. Prüfe GELATO_API_KEY vor dem Erstellen der Order
            console.log("[Stripe Webhook] Checking GELATO_API_KEY:", {
                hasKey: !!process.env.GELATO_API_KEY,
                keyLength: process.env.GELATO_API_KEY?.length || 0,
                keyPrefix: process.env.GELATO_API_KEY?.substring(0, 8) + "...",
            });

            if (!process.env.GELATO_API_KEY || process.env.GELATO_API_KEY.trim().length === 0) {
                console.error("[Stripe Webhook] ❌ GELATO_API_KEY is not set or empty. Cannot create Gelato order.");
                // Order bleibt als "paid" markiert, kann später manuell an Gelato gesendet werden
                return NextResponse.json({
                    received: true,
                    warning: "Order paid but Gelato order not created - GELATO_API_KEY is missing"
                });
            }

            // Erstelle Gelato Draft Order
            const gelatoProductUid = session.metadata?.gelatoProductUid ||
                "framed_poster_mounted_premium_400x400-mm-16x16-inch_black_wood_w20xt20-mm_plexiglass_400x400-mm-16x16-inch_200-gsm-80lb-coated-silk_4-0_hor";
            const imageUrl = session.metadata?.imageUrl || order.image_url;

            console.log("[Stripe Webhook] Preparing Gelato order data:", {
                gelatoProductUid,
                hasGelatoProductUid: !!gelatoProductUid,
                imageUrlSource: session.metadata?.imageUrl ? "metadata" : "order",
                hasImageUrl: !!imageUrl,
                imageUrlLength: imageUrl?.length || 0,
                hasGelatoApiKey: !!process.env.GELATO_API_KEY,
                gelatoApiKeyLength: process.env.GELATO_API_KEY?.length || 0,
                gelatoApiKeyPrefix: process.env.GELATO_API_KEY?.substring(0, 8) + "...",
            });
            // #region agent log
            fetch('http://127.0.0.1:7243/ingest/c4b693a6-e4ee-4d58-9f0a-6cb5db0f1fcc', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'app/api/webhook/stripe/route.ts:79', message: 'Preparing Gelato order data', data: { hasGelatoProductUid: !!gelatoProductUid, gelatoProductUid, hasImageUrl: !!imageUrl, imageUrlLength: imageUrl?.length || 0, imageUrlSource: session.metadata?.imageUrl ? 'metadata' : 'order', hasGelatoApiKey: !!process.env.GELATO_API_KEY }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'D' }) }).catch(() => { });
            // #endregion

            if (!imageUrl) {
                console.error("[Stripe Webhook] No image URL found in metadata or order");
                // #region agent log
                fetch('http://127.0.0.1:7243/ingest/c4b693a6-e4ee-4d58-9f0a-6cb5db0f1fcc', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'app/api/webhook/stripe/route.ts:90', message: 'No image URL found - returning early', data: {}, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'D' }) }).catch(() => { });
                // #endregion
                return NextResponse.json({ received: true, error: "No image URL" });
            }

            // Validiere Versandadresse - Gelato benötigt eine vollständige, gültige Adresse
            console.log("[Stripe Webhook] Validating shipping address:", {
                hasShippingAddress: !!shippingAddress,
                line1: shippingAddress?.line1,
                city: shippingAddress?.city,
                postal_code: shippingAddress?.postal_code,
                country: shippingAddress?.country,
                state: shippingAddress?.state,
            });

            const isValidShippingAddress = shippingAddress &&
                shippingAddress.line1 &&
                shippingAddress.line1.trim() !== "" &&
                shippingAddress.line1 !== "TBD" &&
                shippingAddress.city &&
                shippingAddress.city.trim() !== "" &&
                shippingAddress.city !== "TBD" &&
                shippingAddress.postal_code &&
                shippingAddress.postal_code.trim() !== "" &&
                shippingAddress.postal_code !== "00000" &&
                shippingAddress.country &&
                shippingAddress.country.trim().length === 2;

            if (!isValidShippingAddress) {
                console.error("[Stripe Webhook] ❌ Invalid or missing shipping address. Cannot create Gelato order.", {
                    hasShippingAddress: !!shippingAddress,
                    line1: shippingAddress?.line1,
                    city: shippingAddress?.city,
                    postal_code: shippingAddress?.postal_code,
                    country: shippingAddress?.country,
                    validationResult: {
                        hasLine1: !!shippingAddress?.line1,
                        line1Valid: shippingAddress?.line1?.trim() !== "" && shippingAddress?.line1 !== "TBD",
                        hasCity: !!shippingAddress?.city,
                        cityValid: shippingAddress?.city?.trim() !== "" && shippingAddress?.city !== "TBD",
                        hasPostalCode: !!shippingAddress?.postal_code,
                        postalCodeValid: shippingAddress?.postal_code?.trim() !== "" && shippingAddress?.postal_code !== "00000",
                        hasCountry: !!shippingAddress?.country,
                        countryValid: shippingAddress?.country?.trim().length === 2,
                    },
                });
                // Speichere Order als paid, aber ohne Gelato Order ID
                // Die Order kann später manuell an Gelato gesendet werden, wenn die Adresse verfügbar ist
                await supabase
                    .from("orders")
                    .update({
                        shipping_address: shippingAddress ? {
                            name: shippingName,
                            addressLine1: shippingAddress.line1 || "",
                            addressLine2: shippingAddress.line2 || "",
                            city: shippingAddress.city || "",
                            state: shippingAddress.state || "",
                            zipCode: shippingAddress.postal_code || "",
                            country: shippingAddress.country || "",
                        } : null,
                    })
                    .eq("id", order.id);

                console.warn("[Stripe Webhook] Order marked as paid but Gelato order not created due to missing/invalid shipping address");
                return NextResponse.json({
                    received: true,
                    warning: "Order paid but Gelato order not created - shipping address missing or invalid"
                });
            }

            // Validiere gelatoProductUid
            if (!gelatoProductUid || gelatoProductUid.trim().length === 0) {
                console.error("[Stripe Webhook] gelatoProductUid is missing or empty");
                return NextResponse.json({ received: true, error: "gelatoProductUid is required" });
            }

            console.log("[Stripe Webhook] Creating Gelato draft order with validated data:", {
                productUid: gelatoProductUid,
                imageUrl: imageUrl.substring(0, 50) + "...",
                shippingAddress: {
                    name: shippingName,
                    city: shippingAddress.city,
                    country: shippingAddress.country,
                    zipCode: shippingAddress.postal_code,
                },
            });

            try {
                // #region agent log
                fetch('http://127.0.0.1:7243/ingest/c4b693a6-e4ee-4d58-9f0a-6cb5db0f1fcc', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'app/api/webhook/stripe/route.ts:99', message: 'Calling Gelato createDraftOrder', data: { productUid: gelatoProductUid, imageUrlLength: imageUrl.length, hasShippingAddress: !!shippingAddress, shippingCity: shippingAddress?.city, shippingCountry: shippingAddress?.country, hasGelatoApiKey: !!process.env.GELATO_API_KEY }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'D' }) }).catch(() => { });
                // #endregion
                const gelatoOrder = await gelatoClient.createDraftOrder({
                    productUid: gelatoProductUid,
                    imageUrl: imageUrl,
                    shippingAddress: {
                        name: shippingName,
                        addressLine1: shippingAddress.line1!.trim(),
                        addressLine2: (shippingAddress.line2 || "").trim(),
                        city: shippingAddress.city!.trim(),
                        state: (shippingAddress.state || "").trim(),
                        zipCode: shippingAddress.postal_code!.trim(),
                        country: shippingAddress.country!.trim().toUpperCase(),
                    },
                    quantity: 1,
                });

                console.log("[Stripe Webhook] ✅ Gelato draft order created successfully:", {
                    orderUid: gelatoOrder.orderUid,
                    status: gelatoOrder.status,
                    fullResponse: gelatoOrder,
                });
                // #region agent log
                fetch('http://127.0.0.1:7243/ingest/c4b693a6-e4ee-4d58-9f0a-6cb5db0f1fcc', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'app/api/webhook/stripe/route.ts:105', message: 'Gelato draft order created successfully', data: { gelatoOrderUid: gelatoOrder.orderUid, gelatoStatus: gelatoOrder.status }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'D' }) }).catch(() => { });
                // #endregion

                // 5. Update Order mit Gelato-Informationen
                const { error: gelatoUpdateError } = await supabase
                    .from("orders")
                    .update({
                        gelato_order_id: gelatoOrder.orderUid,
                        gelato_order_status: gelatoOrder.status || "draft",
                        shipping_address: {
                            name: shippingName,
                            addressLine1: shippingAddress.line1,
                            addressLine2: shippingAddress.line2 || "",
                            city: shippingAddress.city,
                            state: shippingAddress.state || "",
                            zipCode: shippingAddress.postal_code,
                            country: shippingAddress.country,
                        },
                    })
                    .eq("id", order.id);

                if (gelatoUpdateError) {
                    console.error("[Stripe Webhook] ❌ Error updating order with Gelato info:", {
                        error: gelatoUpdateError,
                        orderId: order.id,
                        gelatoOrderUid: gelatoOrder.orderUid,
                    });
                } else {
                    console.log("[Stripe Webhook] ✅ Order updated with Gelato draft order ID:", {
                        orderId: order.id,
                        gelatoOrderUid: gelatoOrder.orderUid,
                    });
                }
            } catch (gelatoError: any) {
                console.error("[Stripe Webhook] ❌ Error creating Gelato draft order:", {
                    error: gelatoError?.message,
                    errorName: gelatoError?.name,
                    errorStack: gelatoError?.stack,
                    orderId: order.id,
                    productUid: gelatoProductUid,
                    hasImageUrl: !!imageUrl,
                    hasShippingAddress: !!shippingAddress,
                });
                // #region agent log
                fetch('http://127.0.0.1:7243/ingest/c4b693a6-e4ee-4d58-9f0a-6cb5db0f1fcc', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'app/api/webhook/stripe/route.ts:130', message: 'Gelato draft order creation failed', data: { error: gelatoError?.message, errorStack: gelatoError?.stack, errorName: gelatoError?.name }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'D' }) }).catch(() => { });
                // #endregion

                // Order bleibt als "paid" markiert, kann später manuell an Gelato gesendet werden
                // Speichere Versandadresse trotzdem, falls vorhanden
                if (shippingAddress) {
                    await supabase
                        .from("orders")
                        .update({
                            shipping_address: {
                                name: shippingName,
                                addressLine1: shippingAddress.line1 || "",
                                addressLine2: shippingAddress.line2 || "",
                                city: shippingAddress.city || "",
                                state: shippingAddress.state || "",
                                zipCode: shippingAddress.postal_code || "",
                                country: shippingAddress.country || "",
                            },
                        })
                        .eq("id", order.id);
                }

                // WICHTIG: Wir werfen den Fehler NICHT weiter, damit Stripe den Webhook als erfolgreich markiert
                // Der Fehler wird geloggt und kann manuell behoben werden
            }

        } catch (error: any) {
            console.error("[Stripe Webhook] Error processing checkout.session.completed:", error);
            // #region agent log
            fetch('http://127.0.0.1:7243/ingest/c4b693a6-e4ee-4d58-9f0a-6cb5db0f1fcc', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'app/api/webhook/stripe/route.ts:150', message: 'Error processing checkout.session.completed', data: { error: error?.message, errorStack: error?.stack, errorName: error?.name }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'A,B,C,D' }) }).catch(() => { });
            // #endregion
            // Return 200 OK, damit Stripe den Webhook nicht erneut sendet
            // Der Fehler wird geloggt und kann manuell behoben werden
        }
    } else {
        // #region agent log
        fetch('http://127.0.0.1:7243/ingest/c4b693a6-e4ee-4d58-9f0a-6cb5db0f1fcc', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'app/api/webhook/stripe/route.ts:157', message: 'Webhook event type not handled', data: { eventType: event.type }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'A' }) }).catch(() => { });
        // #endregion
    }

    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/c4b693a6-e4ee-4d58-9f0a-6cb5db0f1fcc', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'app/api/webhook/stripe/route.ts:160', message: 'Webhook handler completed', data: {}, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'A' }) }).catch(() => { });
    // #endregion
    return NextResponse.json({ received: true });
}
