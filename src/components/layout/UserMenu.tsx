import React, { useState, useRef, useEffect } from 'react';
import { UserCircleIcon, ArrowRightOnRectangleIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../hooks/useAuth';
import { useAppDispatch } from '../../hooks/redux';
import { addNotification } from '../../store/slices/uiSlice';

const UserMenu: React.FC = () => {
  const { user, logout } = useAuth();
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    dispatch(addNotification({
      type: 'info',
      message: 'You have been logged out successfully'
    }));
    setIsOpen(false);
  };

  if (!user) return null;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        {user.avatar ? (
          <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
        ) : (
          <UserCircleIcon className="w-8 h-8 text-gray-400" />
        )}
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium text-gray-700">{user.name}</p>
          <p className="text-xs text-gray-500 capitalize">{user.role}</p>
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          <div className="px-4 py-2 border-b border-gray-200">
            <p className="text-sm font-medium text-gray-900">{user.name}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
            <p className="text-xs text-gray-400 capitalize">{user.role}</p>
          </div>
          
          <button
            onClick={() => setIsOpen(false)}
            className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <Cog6ToothIcon className="w-4 h-4 mr-3" />
            Settings
          </button>
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            <ArrowRightOnRectangleIcon className="w-4 h-4 mr-3" />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;