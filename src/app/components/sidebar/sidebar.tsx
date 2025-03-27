'use client';

import React, { useState } from 'react';
import styles from './sidebar.module.css';
import {FiHome, FiUser, FiUsers, FiMessageSquare, FiCalendar, FiStar, FiFileText} from 'react-icons/fi';

const Sidebar = () => {
  const [activeIcon, setActiveIcon] = useState('home');

  /// setActiveIcon NOT YET IMPLEMENTED CORRECTLY!!!!!!
  /// JUST A TEMPLATE FOR NOW!!!

  // Tracks which icon is currently active (clicked)
  return (
    <div className={styles.container}>
      <div className={styles.iconWrapper}>
        <FiHome
          className={`${styles.icon} ${activeIcon === 'home' ? styles.active : ''}`}
          onClick={() => setActiveIcon('home')}/>
        <FiUser
          className={`${styles.icon} ${activeIcon === 'user' ? styles.active : ''}`}
          onClick={() => setActiveIcon('user')}/>
        <FiUsers
          className={`${styles.icon} ${activeIcon === 'users' ? styles.active : ''}`}
          onClick={() => setActiveIcon('users')}/>
        <FiMessageSquare
          className={`${styles.icon} ${activeIcon === 'messages' ? styles.active : ''}`}
          onClick={() => setActiveIcon('messages')}/>
        <FiCalendar
          className={`${styles.icon} ${activeIcon === 'calendar' ? styles.active : ''}`}
          onClick={() => setActiveIcon('calendar')}/>
        <FiStar
          className={`${styles.icon} ${activeIcon === 'star' ? styles.active : ''}`}
          onClick={() => setActiveIcon('star')}/>
        <FiFileText
          className={`${styles.icon} ${activeIcon === 'file' ? styles.active : ''}`}
          onClick={() => setActiveIcon('file')}/>
      </div>
    </div>
  );
};

export default Sidebar;
