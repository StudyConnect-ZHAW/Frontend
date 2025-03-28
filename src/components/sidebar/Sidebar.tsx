'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Sidebar.module.css';
import { FiHome, FiUser, FiUsers, FiMessageSquare, FiCalendar, FiStar, FiFileText } from 'react-icons/fi';

// TODO: Find suitable icon for forum

const navItems = [
    { icon: FiHome, label: 'Home', path: '/' },
    { icon: FiUser, label: 'Profile', path: '/profile' },
    { icon: FiUsers, label: 'Groups', path: '/groups' },
    { icon: FiMessageSquare, label: 'Chat', path: '/chat' },
    { icon: FiCalendar, label: 'Calendar', path: '/calendar' }
]

const Sidebar = () => {
    const pathname = usePathname();

    /// TODO (Abdul): setActiveIcon NOT YET IMPLEMENTED CORRECTLY!!!!!!
    /// JUST A TEMPLATE FOR NOW!!!

    // Tracks which icon is currently active (clicked)
    return (
        <div className={styles.container}>
            <div className={styles.iconWrapper}>
                {navItems.map(({ icon: Icon, label, path }) => {
                    const isActive = pathname === path;

                    return (
                        <Link
                            href={path}
                            key={label}
                            className={`${styles.icon} ${isActive ? styles.active : ''}`}
                            aria-label={label}
                        >
                            <Icon />
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default Sidebar;