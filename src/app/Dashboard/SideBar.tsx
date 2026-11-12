'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaHome, FaBox, FaClipboardList, FaUsers, FaSignOutAlt } from 'react-icons/fa';

interface NavItem {
    id: string;
    name: string;
    href: string;
    icon: React.ReactNode;
}

const navItems: NavItem[] = [
    { id: 'dashboard', name: 'Dashboard', href: '/Dashboard', icon: <FaHome className="text-xl" /> },
    { id: 'products', name: 'Products', href: '/Dashboard/Products', icon: <FaBox className="text-xl" /> },
    { id: 'requests', name: 'Requests', href: '/Dashboard/Requests', icon: <FaClipboardList className="text-xl" /> },
    { id: 'subscribers', name: 'Subscribers', href: '/Dashboard/Subscribers', icon: <FaUsers className="text-xl" /> },
];

export default function Sidebar() {
    const pathname = usePathname();

    const isActive = (href: string): boolean => {
        return pathname === href;
    };

    return (
        <div className="fixed left-0 top-0 h-full w-64 bg-amber-900 text-white shadow-xl z-40">
            <div className="flex flex-col h-full">
                {/* Logo Section */}
                <div className="p-6 border-b border-amber-800">
                    <div className="flex items-center">
                        <div className="bg-amber-700 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl">
                            M
                        </div>
                        <span className="ml-3 text-xl font-bold">Melcraft Admin</span>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-6">
                    <ul className="space-y-2">
                        {navItems.map((item) => {
                            const active = isActive(item.href);
                            return (
                                <li key={item.id}>
                                    <Link
                                        href={item.href}
                                        className={`flex items-center w-full p-3 rounded-lg transition duration-200 ${
                                            active
                                                ? 'bg-amber-800 text-white shadow-inner'
                                                : 'text-amber-200 hover:bg-amber-800 hover:text-white'
                                        }`}
                                    >
                                        <span className="mr-3">{item.icon}</span>
                                        <span className="font-medium">{item.name}</span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* Store Link & Logout */}
                <div className="p-4 border-t border-amber-800 space-y-1">
                    <Link
                        href="/"
                        className="flex items-center w-full p-2.5 text-amber-200 hover:text-white hover:bg-amber-800 rounded-lg transition duration-200 text-sm"
                    >
                        <span className="font-medium">← View Storefront</span>
                    </Link>
                    <button
                        onClick={async () => {
                            await fetch('/api/auth/logout', { method: 'POST' });
                            window.location.href = '/Login';
                        }}
                        className="flex items-center w-full p-2.5 text-red-300 hover:text-white hover:bg-red-800/50 rounded-lg transition duration-200 text-sm cursor-pointer"
                    >
                        <FaSignOutAlt className="text-lg mr-3" />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </div>
        </div>
    );
}