import { createAdminClient } from '@/lib/supabase/admin'
import OrderManagementClient from '@/components/admin/OrderManagementClient'

export const dynamic = 'force-dynamic'

export default async function AdminOrdersPage() {
    const supabase = createAdminClient()

    // Fetch all orders
    const { data: orders, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        return <div className="text-red-500">Fehler beim Laden der Bestellungen: {error.message}</div>
    }

    return <OrderManagementClient initialOrders={orders || []} />
}
