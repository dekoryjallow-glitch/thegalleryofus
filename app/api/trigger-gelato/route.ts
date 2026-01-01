import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { gelatoClient } from "@/lib/gelato/client";
import Stripe from "stripe";

export const dynamic = 'force-dynamic';

/**
 * Manueller Trigger für Gelato Order Erstellung
 * POST /api/trigger-gelato?session_id=xxx - Erstellt Gelato Order für eine Stripe Session
 * POST /api/trigger-gelato?order_id=xxx - Erstellt Gelato Order für eine Order ID
 */
export async function POST(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const sessionId = searchParams.get("session_id");
        const orderId = searchParams.get("order_id");

        if (!sessionId && !orderId) {
            return NextResponse.json({
                error: "session_id or order_id required",
            }, { status: 400 });
        }

        const supabase = createAdminClient();
        let order;

        if (orderId) {
            // Suche Order nach ID
            const { data, error } = await supabase
                .from("orders")
                .select("*")
                .eq("id", orderId)
                .single();

            if (error || !data) {
                return NextResponse.json({
                    error: "Order not found",
                    orderId,
                    details: error,
                }, { status: 404 });
            }
            order = data;
        } else if (sessionId) {
            // Suche Order nach Stripe Session ID
            const { data, error } = await supabase
                .from("orders")
                .select("*")
                .eq("stripe_checkout_id", sessionId)
                .single();

            if (error || !data) {
                return NextResponse.json({
                    error: "Order not found",
                    sessionId,
                    details: error,
                }, { status: 404 });
            }
            order = data;
        }

        console.log("[Trigger Gelato] Found order:", {
            orderId: order.id,
            status: order.status,
            hasImageUrl: !!order.image_url,
            hasGelatoOrderId: !!order.gelato_order_id,
        });

        // Prüfe ob bereits eine Gelato Order existiert
        if (order.gelato_order_id) {
            return NextResponse.json({
                warning: "Gelato order already exists",
                gelatoOrderId: order.gelato_order_id,
                orderId: order.id,
            });
        }

        // Hole Stripe Session für Versandadresse (falls vorhanden)
        let shippingAddress = null;
        let shippingName = "Customer";

        if (sessionId && process.env.STRIPE_SECRET_KEY) {
            try {
                const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
                    apiVersion: "2023-10-16",
                });
                const session = await stripe.checkout.sessions.retrieve(sessionId);

                shippingAddress = session.shipping_details?.address ||
                    (session.customer_details?.address as any);
                shippingName = session.shipping_details?.name ||
                    session.customer_details?.name ||
                    "Customer";

                console.log("[Trigger Gelato] Stripe session retrieved:", {
                    hasShippingAddress: !!shippingAddress,
                    shippingName,
                });
            } catch (stripeError: any) {
                console.warn("[Trigger Gelato] Could not retrieve Stripe session:", stripeError.message);
            }
        }

        // Prüfe ob Versandadresse vorhanden ist
        if (!shippingAddress && order.shipping_address) {
            // Verwende gespeicherte Versandadresse
            const saved = order.shipping_address as any;
            shippingAddress = {
                line1: saved.addressLine1,
                line2: saved.addressLine2,
                city: saved.city,
                state: saved.state,
                postal_code: saved.zipCode,
                country: saved.country,
            };
            shippingName = saved.name || "Customer";
            console.log("[Trigger Gelato] Using saved shipping address");
        }

        // Validiere Versandadresse
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
            return NextResponse.json({
                error: "Invalid or missing shipping address",
                hasShippingAddress: !!shippingAddress,
                shippingAddress,
                hint: "The order needs a valid shipping address to create a Gelato order",
            }, { status: 400 });
        }

        // Prüfe Image URL
        if (!order.image_url) {
            return NextResponse.json({
                error: "Order has no image_url",
                orderId: order.id,
            }, { status: 400 });
        }

        // Hole gelatoProductUid aus Metadata oder verwende Default
        const gelatoProductUid = "framed_poster_mounted_premium_400x400-mm-16x16-inch_black_wood_w20xt20-mm_plexiglass_400x400-mm-16x16-inch_200-gsm-80lb-coated-silk_4-0_hor";

        console.log("[Trigger Gelato] Creating Gelato draft order:", {
            productUid: gelatoProductUid,
            imageUrl: order.image_url.substring(0, 50) + "...",
            shippingAddress: {
                city: shippingAddress.city,
                country: shippingAddress.country,
            },
        });

        // Erstelle Gelato Order
        const gelatoOrder = await gelatoClient.createDraftOrder({
            productUid: gelatoProductUid,
            imageUrl: order.image_url,
            shippingAddress: {
                name: shippingName,
                addressLine1: shippingAddress.line1.trim(),
                addressLine2: (shippingAddress.line2 || "").trim(),
                city: shippingAddress.city.trim(),
                state: (shippingAddress.state || "").trim(),
                zipCode: shippingAddress.postal_code.trim(),
                country: shippingAddress.country.trim().toUpperCase(),
            },
            quantity: 1,
        });

        console.log("[Trigger Gelato] ✅ Gelato order created:", gelatoOrder.orderUid);

        // Update Order in Supabase
        const { error: updateError } = await supabase
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

        if (updateError) {
            console.error("[Trigger Gelato] Error updating order:", updateError);
            return NextResponse.json({
                success: true,
                warning: "Gelato order created but failed to update database",
                gelatoOrderUid: gelatoOrder.orderUid,
                updateError: updateError.message,
            });
        }

        return NextResponse.json({
            success: true,
            message: "Gelato draft order created successfully",
            orderId: order.id,
            gelatoOrderUid: gelatoOrder.orderUid,
            gelatoStatus: gelatoOrder.status,
        });

    } catch (error: any) {
        console.error("[Trigger Gelato] Error:", error);
        return NextResponse.json({
            error: error.message || "Unknown error",
            errorName: error.name,
            errorStack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
        }, { status: 500 });
    }
}

