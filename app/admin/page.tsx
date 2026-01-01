// Updated Admin Dashboard UI
import { createAdminClient } from '@/lib/supabase/admin'
import {
    TrendingUp,
    ShoppingBag,
    CreditCard,
    Clock,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
    const supabase = createAdminClient()

    // Fetch active orders (paid or fulfilled)
    const { data: orders, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        return <div className="text-red-500">Fehler beim Laden der Daten: {error.message}</div>
    }

    const stats = {
        totalRevenue: orders?.filter(o => o.status === 'paid' || o.status === 'fulfilled')
            .reduce((sum, o) => sum + (o.amount_cents || 0), 0) || 0,
        totalOrders: orders?.length || 0,
        paidOrders: orders?.filter(o => o.status === 'paid').length || 0,
        pendingOrders: orders?.filter(o => o.status === 'pending').length || 0,
        fulfilledOrders: orders?.filter(o => o.status === 'fulfilled').length || 0,
    }

    const formatCurrency = (cents: number) => {
        return new Intl.NumberFormat('de-DE', {
            style: 'currency',
            currency: 'EUR',
        }).format(cents / 100)
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-serif font-bold text-gray-900">Dashboard Übersicht</h1>
                <p className="text-gray-500 mt-2">Willkommen zurück! Hier sind die aktuellen KPIs für The Gallery of Us.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Revenue Card */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-green-50 rounded-lg text-green-600">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                        {/* <span className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
              <ArrowUpRight className="w-3 h-3" /> +12%
            </span> */}
                    </div>
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Gesamtumsatz</p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(stats.totalRevenue)}</h3>
                </div>

                {/* Orders Card */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                            <ShoppingBag className="w-6 h-6" />
                        </div>
                    </div>
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Bestellungen gesamt</p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.totalOrders}</h3>
                </div>

                {/* Paid Orders Card */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                            <CreditCard className="w-6 h-6" />
                        </div>
                    </div>
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Bezahlt (Offen)</p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.paidOrders}</h3>
                </div>

                {/* Pending Card */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-yellow-50 rounded-lg text-yellow-600">
                            <Clock className="w-6 h-6" />
                        </div>
                    </div>
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Abgebrochen/Pending</p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.pendingOrders}</h3>
                </div>
            </div>

            {/* Recent Activity Section */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-gray-900">Letzte Aktivitäten</h2>
                    <button className="text-sm font-medium text-terracotta-500 hover:text-terracotta-600">Alle ansehen</button>
                </div>
                <div className="divide-y divide-gray-100">
                    {orders?.slice(0, 5).map((order) => (
                        <div key={order.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className={`w-2 h-2 rounded-full ${order.status === 'paid' ? 'bg-green-500' :
                                    order.status === 'pending' ? 'bg-amber-500' :
                                        order.status === 'fulfilled' ? 'bg-blue-500' :
                                            'bg-gray-400'
                                    }`} />
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Bestellung #{order.id.substring(0, 8)}</p>
                                    <p className="text-xs text-gray-500">{new Date(order.created_at).toLocaleString('de-DE')}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-bold text-gray-900">{formatCurrency(order.amount_cents)}</p>
                                <p className={`text-[10px] font-bold uppercase tracking-wider ${order.status === 'paid' ? 'text-green-600' :
                                    order.status === 'pending' ? 'text-amber-600' :
                                        order.status === 'fulfilled' ? 'text-blue-600' :
                                            'text-gray-500'
                                    }`}>
                                    {order.status === 'paid' ? 'Bezahlt' :
                                        order.status === 'pending' ? 'Ausstehend' :
                                            order.status === 'fulfilled' ? 'Versendet' :
                                                order.status}
                                </p>
                            </div>
                        </div>
                    ))}
                    {(!orders || orders.length === 0) && (
                        <div className="px-6 py-12 text-center text-gray-500">Noch keine Bestellungen vorhanden.</div>
                    )}
                </div>
            </div>
        </div>
    )
}
