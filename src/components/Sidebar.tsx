'use client';

import React from 'react';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {FiHome, FiUser, FiUsers, FiMessageSquare, FiCalendar, FiSettings} from 'react-icons/fi';

// TODO: Find suitable icon for forum

const navItems = [
    {icon: FiHome, label: 'Home', path: '/'},
    {icon: FiUser, label: 'Profile', path: '/profile'},
    {icon: FiUsers, label: 'Groups', path: '/groups'},
    {icon: FiMessageSquare, label: 'Chat', path: '/chat'},
    {icon: FiCalendar, label: 'Calendar', path: '/calendar'},
    {icon: FiSettings, label: 'Settings', path: '/settings'},
]

const Sidebar = () => {
    const pathname = usePathname();

    return (
        <div
            className="m-4 mb-0 w-20 bg-[#fafafa] border-[3px] border-[#f03246]/50 shadow-[4px_4px_10px_#EC3349] rounded-xl items-center p-4 gap-4">
            <div className="flex flex-col items-center gap-8">
                {navItems.map(({icon: Icon, label, path}) => {
                    const isActive = pathname === path;

                    return (
                        <Link
                            href={path}
                            key={label}
                            aria-label={label}
                            className={`text-[35px] transition-all duration-200 cursor-pointer ${
                                isActive ? 'text-[#ec3349] scale-125' : 'text-black hover:scale-125 hover:text-[#ec3349]'
                            }`}
                        >
                            <Icon/>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default Sidebar;