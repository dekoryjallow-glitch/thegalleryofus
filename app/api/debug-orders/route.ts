import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = 'force-dynamic';

/**
 * Debug-Endpunkt zum Prüfen von Orders
 * GET /api/debug-orders?session_id=xxx - Zeigt Order für eine Stripe Session
 * GET /api/debug-orders - Zeigt alle neuesten Orders
 */
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const sessionId = searchParams.get("session_id");
        const orderId = searchParams.get("order_id");
        
        const supabase = createAdminClient();
        
        if (sessionId) {
            // Suche Order nach Stripe Checkout Session ID
            const { data: order, error } = await supabase
                .from("orders")
                .select("*")
                .eq("stripe_checkout_id", sessionId)
                .single();
            
            if (error || !order) {
                return NextResponse.json({
                    found: false,
                    sessionId,
                    error: error?.message || "Order not found",
                    errorCode: error?.code,
                }, { status: 404 });
            }
            
            return NextResponse.json({
                found: true,
                sessionId,
                order: {
                    id: order.id,
                    user_id: order.user_id,
                    status: order.status,
                    stripe_checkout_id: order.stripe_checkout_id,
                    stripe_payment_intent_id: order.stripe_payment_intent_id,
                    gelato_order_id: order.gelato_order_id,
                    gelato_order_status: order.gelato_order_status,
                    image_url: order.image_url?.substring(0, 50) + "...",
                    shipping_address: order.shipping_address,
                    created_at: order.created_at,
                    paid_at: order.paid_at,
                },
            });
        } else if (orderId) {
            // Suche Order nach ID
            const { data: order, error } = await supabase
                .from("orders")
                .select("*")
                .eq("id", orderId)
                .single();
            
            if (error || !order) {
                return NextResponse.json({
                    found: false,
                    orderId,
                    error: error?.message || "Order not found",
                }, { status: 404 });
            }
            
            return NextResponse.json({
                found: true,
                orderId,
                order: {
                    id: order.id,
                    user_id: order.user_id,
                    status: order.status,
                    stripe_checkout_id: order.stripe_checkout_id,
                    stripe_payment_intent_id: order.stripe_payment_intent_id,
                    gelato_order_id: order.gelato_order_id,
                    gelato_order_status: order.gelato_order_status,
                    image_url: order.image_url?.substring(0, 50) + "...",
                    shipping_address: order.shipping_address,
                    created_at: order.created_at,
                    paid_at: order.paid_at,
                },
            });
        } else {
            // Zeige alle neuesten Orders
            const { data: orders, error } = await supabase
                .from("orders")
                .select("id, status, stripe_checkout_id, gelato_order_id, gelato_order_status, created_at, paid_at")
                .order("created_at", { ascending: false })
                .limit(10);
            
            if (error) {
                return NextResponse.json({
                    error: error.message,
                    errorCode: error.code,
                }, { status: 500 });
            }
            
            return NextResponse.json({
                count: orders?.length || 0,
                orders: orders || [],
            });
        }
    } catch (error: any) {
        return NextResponse.json({
            error: error.message || "Unknown error",
        }, { status: 500 });
    }
}

