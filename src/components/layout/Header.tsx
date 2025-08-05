import React from 'react';
import { BellIcon } from '@heroicons/react/24/outline';
import { useAppSelector } from '../../hooks/redux';
import { selectUser } from '../../store/slices/authSlice';
import { selectNotifications } from '../../store/slices/uiSlice';
import UserMenu from './UserMenu';

const Header: React.FC = () => {
  const user = useAppSelector(selectUser);
  const notifications = useAppSelector(selectNotifications);
  const unreadCount = notifications.length;

  if (!user) return null;

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h2 className="text-2xl font-semibold text-gray-800">
            Welcome back, {user.name}
          </h2>
          <p className="text-sm text-gray-600 capitalize">{user.role}</p>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <BellIcon className="w-6 h-6" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
          
          {/* User Profile */}
          <UserMenu />
        </div>
      </div>
    </header>
  );
};

export default Header;