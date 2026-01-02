import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/admin";
// Gelato client import removed as per manual fulfillment requirement

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    console.log("🔔 [Stripe Webhook] ========== WEBHOOK RECEIVED ==========");

    const body = await req.text();
    const signature = headers().get("Stripe-Signature") as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
        console.log("[Stripe Webhook] ✅ Signature verified - Event type:", event.type, "Event ID:", event.id);
    } catch (error: any) {
        console.error(`[Stripe Webhook] Error verifying signature:`, error.message);
        return NextResponse.json({ error: `Webhook Error: ${error.message}` }, { status: 400 });
    }

    // Handle the event
    if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log("✅ [Stripe Webhook] Payment successful for session:", session.id);

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
                    stripe_checkout_id: session.id
                });
                return NextResponse.json({ error: "Order not found" }, { status: 404 });
            }

            console.log("[Stripe Webhook] ✅ Found order:", order.id);

            // 2. Extrahiere Versandadresse
            const shippingAddress = session.shipping_details?.address ||
                (session.customer_details?.address as any);
            const shippingName = session.shipping_details?.name ||
                session.customer_details?.name ||
                "Customer";

            // 3. Update Order: status = 'paid', fulfillment_status = 'paid'
            // MANUAL FULFILLMENT: We do NOT create a Gelato order here.
            // We just save the payment info and address.

            const paymentIntentId = typeof session.payment_intent === 'string'
                ? session.payment_intent
                : session.payment_intent?.id;

            const updateData: any = {
                status: "paid",
                paid_at: new Date().toISOString(),
                stripe_payment_intent_id: paymentIntentId || null,
                fulfillment_status: "paid", // Ready for review
            };

            if (shippingAddress) {
                updateData.shipping_address = {
                    name: shippingName,
                    addressLine1: shippingAddress.line1 || "",
                    addressLine2: shippingAddress.line2 || "",
                    city: shippingAddress.city || "",
                    state: shippingAddress.state || "",
                    zipCode: shippingAddress.postal_code || "",
                    country: shippingAddress.country || "",
                };
            }

            const { error: updateError } = await supabase
                .from("orders")
                .update(updateData)
                .eq("id", order.id);

            if (updateError) {
                console.error("[Stripe Webhook] Error updating order:", updateError);
                throw updateError; // Let Stripe retry
            }

            console.log("[Stripe Webhook] Order updated to paid status. Ready for manual fulfillment.");

            // 4. Versende Bestätigungs-E-Mail
            try {
                console.log("[Stripe Webhook] Sending summary notification to customer:", session.customer_details?.email);
                const { resend } = await import("@/lib/resend");
                const { OrderConfirmationEmail } = await import("@/lib/emails/templates/OrderConfirmation");

                // Wir brauchen ein Image für die Mail. Wir nehmen das result_url aus dem Joint (wir haben die order ID).
                // Da wir die order schon geladen haben, schauen wir ob image_url dabei ist.
                const artworkUrl = order.image_url || "https://thegalleryofus.com/logo.png"; // Fallback

                await resend.emails.send({
                    from: 'The Gallery of Us <shop@thegalleryofus.com>',
                    to: session.customer_details?.email || "",
                    subject: `Deine Kunst wird nun lebendig – Bestellung #${order.id.substring(0, 8)}`,
                    react: OrderConfirmationEmail({
                        customerName: shippingName,
                        orderNumber: `#${order.id.substring(0, 8)}`,
                        imageUrl: artworkUrl,
                    }),
                });
                console.log("[Stripe Webhook] ✅ Order confirmation email sent.");
            } catch (emailError) {
                // Wir loggen den Fehler, aber schmeißen ihn nicht, damit die Order als 'paid' markiert bleibt
                console.error("[Stripe Webhook] ❌ Failed to send confirmation email:", emailError);
            }

        } catch (error: any) {
            console.error("[Stripe Webhook] Error processing checkout.session.completed:", error);
            return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
        }
    }

    return NextResponse.json({ received: true });
}
