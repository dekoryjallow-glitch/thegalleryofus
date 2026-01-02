'use client';

import { Search, Filter, Archive } from 'lucide-react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

export default function OrdersFilterBar() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const handleSearch = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set('q', term);
        } else {
            params.delete('q');
        }
        replace(`${pathname}?${params.toString()}`);
    }, 300);

    const handleStatusFilter = (status: string) => {
        const params = new URLSearchParams(searchParams);
        if (status && status !== 'all') {
            params.set('status', status);
        } else {
            params.delete('status');
        }
        replace(`${pathname}?${params.toString()}`);
    };

    const toggleArchive = (checked: boolean) => {
        const params = new URLSearchParams(searchParams);
        if (checked) {
            params.set('archived', 'true');
        } else {
            params.delete('archived');
        }
        replace(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search Order ID, Customer..."
                    defaultValue={searchParams.get('q')?.toString()}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-terracotta-500/20 focus:border-terracotta-500"
                />
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto">
                <select
                    defaultValue={searchParams.get('status')?.toString() || 'all'}
                    onChange={(e) => handleStatusFilter(e.target.value)}
                    className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-terracotta-500/20 focus:border-terracotta-500"
                >
                    <option value="all">All Statuses</option>
                    <option value="paid">Paid (To Fulfill)</option>
                    <option value="unfulfilled">Unfulfilled</option>
                    <option value="in_review">In Review</option>
                    <option value="fulfilled">Fulfilled</option>
                </select>

                <label className="flex items-center gap-2 cursor-pointer select-none text-sm text-gray-600 hover:text-gray-900 transition-colors">
                    <div className={`w-5 h-5 flex items-center justify-center rounded border transition-colors ${searchParams.get('archived') === 'true' ? 'bg-terracotta-500 border-terracotta-500 text-white' : 'border-gray-300 bg-white'}`}>
                        {searchParams.get('archived') === 'true' && <Archive className="w-3 h-3" />}
                    </div>
                    <span>Show Archived</span>
                    <input
                        type="checkbox"
                        className="hidden"
                        checked={searchParams.get('archived') === 'true'}
                        onChange={(e) => toggleArchive(e.target.checked)}
                    />
                </label>
            </div>
        </div>
    );
}
