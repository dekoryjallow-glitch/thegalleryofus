import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { LayoutDashboard, ShoppingBag, LogOut, ArrowLeft } from 'lucide-react'

const ADMIN_EMAIL = 'dekory@onvisimedia.com'

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login?returnTo=/admin')
    }

    if (user.email !== ADMIN_EMAIL) {
        console.warn(`Access denied for user: ${user.email}`)
        redirect('/')
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
                <div className="p-6">
                    <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors mb-8">
                        <ArrowLeft className="w-4 h-4" />
                        <span className="text-sm font-medium">Site ansehen</span>
                    </Link>
                    <div className="font-serif text-xl font-bold tracking-tight mb-8">
                        Admin Panel
                    </div>

                    <nav className="space-y-1">
                        <Link
                            href="/admin"
                            className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
                        >
                            <LayoutDashboard className="w-4 h-4" />
                            Dashboard
                        </Link>
                        <Link
                            href="/admin/orders"
                            className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
                        >
                            <ShoppingBag className="w-4 h-4" />
                            Bestellungen
                        </Link>
                    </nav>
                </div>

                <div className="mt-auto p-6 border-t border-gray-200">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-full bg-terracotta-500 flex items-center justify-center text-white text-xs font-bold">
                            {user.email?.[0].toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{user.email}</p>
                            <p className="text-xs text-gray-500 uppercase tracking-tighter font-bold">Administrator</p>
                        </div>
                    </div>
                    <form action="/api/auth/sign-out" method="post">
                        <button className="flex items-center gap-3 px-3 py-2 w-full text-sm font-medium text-red-600 rounded-md hover:bg-red-50 transition-colors">
                            <LogOut className="w-4 h-4" />
                            Abmelden
                        </button>
                    </form>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col">
                {/* Mobile Header */}
                <header className="md:hidden bg-white border-b border-gray-200 p-4 flex justify-between items-center">
                    <div className="font-serif text-lg font-bold">Admin Panel</div>
                    <button className="p-2">
                        <LayoutDashboard className="w-6 h-6" />
                    </button>
                </header>

                <div className="flex-1 p-8 md:p-12 overflow-y-auto">
                    {children}
                </div>
            </main>
        </div>
    )
}
