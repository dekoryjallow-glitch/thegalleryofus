import { createAdminClient } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";
import OrderDetailClient from "@/components/admin/OrderDetailClient";

export const dynamic = 'force-dynamic';

export default async function AdminOrderDetailPage({ params }: { params: { id: string } }) {
    const supabase = createAdminClient();

    const { data: order, error } = await supabase
        .from("orders")
        .select("*")
        .eq("id", params.id)
        .single();

    if (error || !order) {
        console.error("Error fetching order:", error);
        notFound();
    }

    return <OrderDetailClient order={order} />;
}
