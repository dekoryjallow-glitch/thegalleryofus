'use server'

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function updateOrderStatus(orderId: string, status: string) {
    const supabase = createAdminClient();

    const { error } = await supabase
        .from("orders")
        .update({ fulfillment_status: status })
        .eq("id", orderId);

    if (error) {
        throw new Error(`Failed to update order status: ${error.message}`);
    }

    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${orderId}`);
}

export async function updateOrderGelatoId(orderId: string, gelatoOrderId: string, gelatoOrderStatus: string) {
    const supabase = createAdminClient();

    const { error } = await supabase
        .from("orders")
        .update({
            gelato_order_id: gelatoOrderId,
            gelato_order_status: gelatoOrderStatus
        })
        .eq("id", orderId);

    if (error) {
        throw new Error(`Failed to update Gelato info: ${error.message}`);
    }

    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${orderId}`);
}

export async function toggleOrderArchiveStatus(orderId: string, isArchived: boolean) {
    const supabase = createAdminClient();

    const { error } = await supabase
        .from("orders")
        .update({ is_archived: isArchived })
        .eq("id", orderId);

    if (error) {
        throw new Error(`Failed to update archive status: ${error.message}`);
    }

    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${orderId}`);
}
