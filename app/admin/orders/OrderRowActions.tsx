'use client';

import { Archive, RotateCcw } from 'lucide-react';
import { toggleOrderArchiveStatus } from '../actions';
import { useTransition } from 'react';

interface OrderRowActionsProps {
    orderId: string;
    isArchived: boolean;
}

export default function OrderRowActions({ orderId, isArchived }: OrderRowActionsProps) {
    const [isPending, startTransition] = useTransition();

    const handleToggleArchive = () => {
        startTransition(async () => {
            await toggleOrderArchiveStatus(orderId, !isArchived);
        });
    };

    return (
        <button
            onClick={handleToggleArchive}
            disabled={isPending}
            className={`p-2 rounded-full transition-colors ${isArchived
                    ? 'text-yellow-600 hover:bg-yellow-100'
                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                }`}
            title={isArchived ? "Unarchive Order" : "Archive Order"}
        >
            {isPending ? (
                <div className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
            ) : isArchived ? (
                <RotateCcw className="w-4 h-4" />
            ) : (
                <Archive className="w-4 h-4" />
            )}
        </button>
    );
}
