import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";
import { resend } from "@/lib/resend";
import { ShippingNotificationEmail } from "@/lib/emails/templates/ShippingNotification";

export async function POST(req: Request) {
    try {
        const { orderId, trackingNumber, trackingUrl } = await req.json();

        if (!orderId || !trackingNumber) {
            return NextResponse.json({ error: "Order ID and tracking number are required" }, { status: 400 });
        }

        const supabase = createAdminClient();

        // 1. Hole Order Details (für Kunden-Name und E-Mail)
        const { data: order, error: orderError } = await supabase
            .from("orders")
            .select(`
                *,
                profiles (
                    full_name,
                    email
                )
            `)
            .eq("id", orderId)
            .single();

        if (orderError || !order) {
            console.error("Order not found:", orderError);
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        const customerEmail = order.shipping_address?.email || order.profiles?.email;
        const customerName = order.shipping_address?.name || order.profiles?.full_name || "Art Lover";

        if (!customerEmail) {
            return NextResponse.json({ error: "Customer email not found" }, { status: 400 });
        }

        // 2. Update Order in Database
        const { error: updateError } = await supabase
            .from("orders")
            .update({
                status: "fulfilled",
                fulfillment_status: "shipped",
                tracking_number: trackingNumber,
                tracking_url: trackingUrl || null,
                fulfilled_at: new Date().toISOString(),
            })
            .eq("id", orderId);

        if (updateError) {
            console.error("Error updating order:", updateError);
            return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
        }

        // 3. Versende Versand-E-Mail
        try {
            await resend.emails.send({
                from: 'The Gallery of Us <shop@thegalleryofus.com>',
                to: customerEmail,
                subject: `Große Vorfreude! Deine Kunst ist unterwegs – Bestellung #${order.id.substring(0, 8)}`,
                react: ShippingNotificationEmail({
                    customerName: customerName,
                    orderNumber: `#${order.id.substring(0, 8)}`,
                    trackingNumber: trackingNumber,
                    trackingUrl: trackingUrl || "#",
                }),
            });
            console.log("✅ Shipping notification email sent to:", customerEmail);
        } catch (emailError) {
            console.error("❌ Failed to send shipping email:", emailError);
            // Wir geben trotzdem Erfolg zurück, da die DB aktualisiert wurde
        }

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error("Error in ship route:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
