import React from 'react';
import { 
  HomeIcon, 
  BuildingOfficeIcon, 
  CalendarDaysIcon, 
  UsersIcon, 
  DocumentTextIcon, 
  CurrencyDollarIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  Bars3Icon,
  XMarkIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { useAuth } from '../../hooks/useAuth';
import { useLodges } from '../../hooks/useLodges';
import { toggleSidebar, setSidebarOpen, setCurrentModule, selectSidebarOpen, selectCurrentModule } from '../../store/slices/uiSlice';

const Sidebar: React.FC = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(selectSidebarOpen);
  const activeModule = useAppSelector(selectCurrentModule);
  const { user, hasPermission, hasGlobalAccess, assignedLodges } = useAuth();
  const { lodges } = useLodges();

  const menuItems = [
    { 
      id: 'dashboard', 
      name: 'Dashboard', 
      icon: HomeIcon, 
      permission: 'view_dashboard',
      roles: ['admin', 'manager', 'supervisor', 'receptionist', 'cleaner', 'maintenance']
    },
    { 
      id: 'lodges', 
      name: 'Lodges & Rooms', 
      icon: BuildingOfficeIcon, 
      permission: 'manage_lodges',
      roles: ['admin', 'manager', 'supervisor']
    },
    { 
      id: 'bookings', 
      name: 'Bookings', 
      icon: CalendarDaysIcon, 
      permission: 'manage_bookings',
      roles: ['admin', 'manager', 'supervisor', 'receptionist']
    },
    { 
      id: 'customers', 
      name: 'Customers', 
      icon: UsersIcon, 
      permission: 'manage_customers',
      roles: ['admin', 'manager', 'supervisor', 'receptionist']
    },
    { 
      id: 'staff', 
      name: 'Staff Management', 
      icon: UsersIcon, 
      permission: 'manage_staff',
      roles: ['admin', 'manager', 'supervisor']
    },
    { 
      id: 'invoices', 
      name: 'Invoices & Receipts', 
      icon: DocumentTextIcon, 
      permission: 'manage_invoices',
      roles: ['admin', 'manager', 'supervisor', 'receptionist']
    },
    { 
      id: 'payments', 
      name: 'Payments', 
      icon: CurrencyDollarIcon, 
      permission: 'manage_payments',
      roles: ['admin', 'manager']
    },
    { 
      id: 'reports', 
      name: 'Reports & Analytics', 
      icon: ChartBarIcon, 
      permission: 'view_reports',
      roles: ['admin', 'manager', 'supervisor']
    },
    { 
      id: 'settings', 
      name: 'Settings', 
      icon: Cog6ToothIcon, 
      permission: 'manage_settings',
      roles: ['admin']
    },
  ];

  const visibleMenuItems = menuItems.filter(item => 
    hasPermission(item.permission) && 
    item.roles.includes(user?.role || '')
  );

  const handleModuleChange = (moduleId: string) => {
    dispatch(setCurrentModule(moduleId));
    dispatch(setSidebarOpen(false));
  };

  // Get accessible lodges for display
  const accessibleLodges = hasGlobalAccess 
    ? lodges 
    : lodges.filter(lodge => assignedLodges.includes(lodge.id));

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => dispatch(toggleSidebar())}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-blue-600 text-white"
      >
        {isOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-center h-16 bg-blue-600 text-white">
          <h1 className="text-xl font-bold">Harris Lodges</h1>
        </div>
        
        {/* User Info */}
        <div className="p-4 bg-gray-50 border-b">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-full ${
              user?.role === 'admin' ? 'bg-red-100' :
              user?.role === 'manager' ? 'bg-purple-100' :
              user?.role === 'supervisor' ? 'bg-blue-100' :
              'bg-green-100'
            }`}>
              {user?.role === 'admin' || user?.role === 'manager' ? (
                <ShieldCheckIcon className={`w-5 h-5 ${
                  user?.role === 'admin' ? 'text-red-600' : 'text-purple-600'
                }`} />
              ) : (
                <UsersIcon className="w-5 h-5 text-blue-600" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.name}
              </p>
              <p className="text-xs text-gray-500 capitalize">
                {user?.role}
                {hasGlobalAccess && (
                  <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs">
                    Global Access
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Lodge Access Info */}
        {!hasGlobalAccess && assignedLodges.length > 0 && (
          <div className="p-3 bg-blue-50 border-b">
            <p className="text-xs font-medium text-blue-800 mb-2">Assigned Lodges:</p>
            <div className="space-y-1">
              {accessibleLodges.map(lodge => (
                <div key={lodge.id} className="text-xs text-blue-700 flex items-center">
                  <BuildingOfficeIcon className="w-3 h-3 mr-1" />
                  {lodge.name}
                </div>
              ))}
            </div>
          </div>
        )}
        
        <nav className="mt-4">
          {visibleMenuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleModuleChange(item.id)}
                className={`
                  w-full flex items-center px-6 py-3 text-left hover:bg-gray-100 transition-colors
                  ${activeModule === item.id ? 'bg-blue-50 border-r-4 border-blue-600 text-blue-600' : 'text-gray-700'}
                `}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.name}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gray-50 border-t">
          <div className="text-center">
            <p className="text-xs text-gray-500">Employee ID: {user?.employeeId}</p>
            {user?.department && (
              <p className="text-xs text-gray-400">{user.department}</p>
            )}
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => dispatch(setSidebarOpen(false))}
        />
      )}
    </>
  );
};

export default Sidebar;