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
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { toggleSidebar, setSidebarOpen, setCurrentModule, selectSidebarOpen, selectCurrentModule } from '../../store/slices/uiSlice';
import { useAuth } from '../../hooks/useAuth';

const Sidebar: React.FC = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(selectSidebarOpen);
  const activeModule = useAppSelector(selectCurrentModule);
  const { hasPermission } = useAuth();

  const menuItems = [
    { 
      id: 'dashboard', 
      name: 'Dashboard', 
      icon: HomeIcon, 
      permission: 'view_dashboard' 
    },
    { 
      id: 'lodges', 
      name: 'Lodges & Rooms', 
      icon: BuildingOfficeIcon, 
      permission: 'manage_lodges' 
    },
    { 
      id: 'bookings', 
      name: 'Bookings', 
      icon: CalendarDaysIcon, 
      permission: 'manage_bookings' 
    },
    { 
      id: 'customers', 
      name: 'Customers', 
      icon: UsersIcon, 
      permission: 'manage_customers' 
    },
    { 
      id: 'staff', 
      name: 'Staff Management', 
      icon: UsersIcon, 
      permission: 'manage_staff' 
    },
    { 
      id: 'invoices', 
      name: 'Invoices & Receipts', 
      icon: DocumentTextIcon, 
      permission: 'manage_invoices' 
    },
    { 
      id: 'payments', 
      name: 'Payments', 
      icon: CurrencyDollarIcon, 
      permission: 'manage_payments' 
    },
    { 
      id: 'reports', 
      name: 'Reports & Analytics', 
      icon: ChartBarIcon, 
      permission: 'view_reports' 
    },
    { 
      id: 'settings', 
      name: 'Settings', 
      icon: Cog6ToothIcon, 
      permission: 'manage_settings' 
    },
  ];

  const visibleMenuItems = menuItems.filter(item => hasPermission(item.permission));

  const handleModuleChange = (moduleId: string) => {
    dispatch(setCurrentModule(moduleId));
    dispatch(setSidebarOpen(false));
  };

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
        
        <nav className="mt-8">
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