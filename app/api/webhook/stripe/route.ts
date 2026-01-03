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
    try {
        const supabase = createAdminClient();

        // Helper function for order finalization (Best of both worlds: Session & PaymentIntent)
        const finalizeOrder = async (orderId: string, paymentIntentId: string) => {
            console.log(`[Stripe Webhook] Finalizing order: ${orderId} (PI: ${paymentIntentId})`);

            // 1. Get current order state
            const { data: order, error: fetchError } = await supabase
                .from("orders")
                .select("*")
                .eq("id", orderId)
                .single();

            if (fetchError || !order) {
                console.error("[Stripe Webhook] ❌ Order not found during finalization:", orderId);
                return;
            }

            // 2. Only proceed if not already paid
            if (order.status === 'paid') {
                console.log("[Stripe Webhook] Order is already marked as paid. Skipping finalization.");
                return;
            }

            // 3. Mark as paid
            const { data: updatedOrder, error: updateError } = await supabase
                .from("orders")
                .update({
                    status: "paid",
                    paid_at: new Date().toISOString(),
                    fulfillment_status: "paid",
                    stripe_payment_intent_id: paymentIntentId,
                })
                .eq("id", orderId)
                .select()
                .single();

            if (updateError || !updatedOrder) {
                console.error("[Stripe Webhook] ❌ Failed to mark order as paid:", updateError);
                return;
            }

            console.log("[Stripe Webhook] ✅ Order successfully marked as paid:", orderId);

            // 4. Send Confirmation Email
            try {
                const customerEmail = updatedOrder.shipping_address?.email;
                console.log("[Stripe Webhook] Sending confirmation email to:", customerEmail);

                const { resend } = await import("@/lib/resend");
                const { OrderConfirmationEmail } = await import("@/lib/emails/templates/OrderConfirmation");

                const artworkUrl = order.image_url || "https://thegalleryofus.com/logo.png";

                await resend.emails.send({
                    from: 'The Gallery of Us <shop@thegalleryofus.com>',
                    to: customerEmail || "",
                    subject: 'Deine Bestellung bei The Gallery of Us',
                    react: OrderConfirmationEmail({
                        orderNumber: `#${order.id.substring(0, 8)}`,
                        imageUrl: artworkUrl,
                    }),
                });
                console.log("[Stripe Webhook] ✅ Confirmation email sent.");
            } catch (emailError) {
                console.error("[Stripe Webhook] ❌ Email sending failed:", emailError);
            }
        };

        switch (event.type) {
            case "checkout.session.completed": {
                const session = event.data.object as Stripe.Checkout.Session;
                const orderId = session.metadata?.orderId;
                const piId = session.payment_intent as string;

                console.log("✅ [Stripe Webhook] Checkout Completed:", session.id, { orderId, piId });

                if (!orderId) {
                    console.error("[Stripe Webhook] ❌ No orderId in session metadata");
                    break;
                }

                // First: Save address and PI ID regardless of payment status
                const shippingAddress = session.shipping_details?.address || (session.customer_details?.address as any);
                const shippingName = session.shipping_details?.name || session.customer_details?.name || "Customer";
                const customerEmail = session.customer_details?.email;

                const updateData: any = {
                    stripe_payment_intent_id: piId || null,
                };

                if (shippingAddress) {
                    updateData.shipping_address = {
                        name: shippingName,
                        email: customerEmail,
                        addressLine1: shippingAddress.line1 || "",
                        addressLine2: shippingAddress.line2 || "",
                        city: shippingAddress.city || "",
                        state: shippingAddress.state || "",
                        zipCode: shippingAddress.postal_code || "",
                        country: shippingAddress.country || "",
                    };
                }

                await supabase.from("orders").update(updateData).eq("id", orderId);

                // Second: If payment is already successful (standard for cards), finalize now!
                if (session.payment_status === 'paid' && piId) {
                    await finalizeOrder(orderId, piId);
                }
                break;
            }

            case "payment_intent.succeeded": {
                const pi = event.data.object as Stripe.PaymentIntent;
                const orderId = pi.metadata?.orderId;

                console.log("💰 [Stripe Webhook] PI Succeeded:", pi.id, { orderId });

                if (orderId) {
                    await finalizeOrder(orderId, pi.id);
                } else {
                    // Fallback lookup if metadata is missing (shouldn't happen with Checkout)
                    const { data: order } = await supabase.from("orders").select("id").eq("stripe_payment_intent_id", pi.id).single();
                    if (order) await finalizeOrder(order.id, pi.id);
                }
                break;
            }

            case "payment_intent.payment_failed": {
                const pi = event.data.object as Stripe.PaymentIntent;
                console.error("❌ [Stripe Webhook] PI Failed:", pi.id);
                const orderId = pi.metadata?.orderId;
                if (orderId) {
                    await supabase.from("orders").update({ status: "failed" }).eq("id", orderId);
                }
                break;
            }

            default:
                console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
        }
    } catch (error: any) {
        console.error("[Stripe Webhook] CRITICAL processing error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }

    return NextResponse.json({ received: true });
}
