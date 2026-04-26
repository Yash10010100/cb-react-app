import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from '../ui/Logo';
import LogoutButton from '../ui/LogoutButton';
import {
  LayoutDashboard, Compass, Clock, Settings, User, LogOut,
  Bell, ChevronLeft, ChevronRight, PlusCircle, Users, CreditCard,
  HelpCircle
} from 'lucide-react';

const studentNavItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Explore', href: '/explore', icon: Compass },
  { label: 'History', href: '/history', icon: Clock },
  { label: 'Manage', href: '/manage', icon: Settings },
  { label: 'Profile', href: '/profile', icon: User },
];

const organizerNavItems = [
  { label: 'Dashboard', href: '/organizer', icon: LayoutDashboard },
  { label: 'Upload Event', href: '/organizer/upload', icon: PlusCircle },
  { label: 'Explore Events', href: '/explore', icon: Compass },
  { label: 'Manage Participants', href: '/organizer/participants', icon: Users },
  { label: 'Payments', href: '/organizer/payments', icon: CreditCard },
];

const DashboardLayout = ({ children, role = 'student', userName = 'User', userTitle = '' }) => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(localStorage.getItem('sidebarCollapsed') === 'true');

  const navItems = role === 'organizer' ? organizerNavItems : studentNavItems;

  return (
    <div className="flex min-h-screen bg-[#f5f5fb]">
      {/* Sidebar */}
      <aside
        className={`
          relative flex flex-col bg-white border-r border-gray-100 shadow-sm
          transition-all duration-300
          ${collapsed ? 'w-16' : 'w-56'}
        `}
      >
        {/* Logo area */}
        <div className={`px-4 py-5 border-b border-gray-100 ${collapsed ? 'flex justify-center' : ''}`}>
          {collapsed ? (
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">CB</span>
            </div>
          ) : (
            <div>
              {role === 'organizer' ? (
                <div>
                  <p className="text-indigo-600 font-bold text-sm">Organizer Portal</p>
                  <p className="text-gray-400 text-xs uppercase tracking-widest">University Events</p>
                </div>
              ) : (
                <Logo />
              )}
            </div>
          )}
        </div>

        {/* User info (student only) */}
        {role === 'student' && !collapsed && (
          <div className="px-4 py-4 border-b border-gray-100 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold text-sm">
              {userName.charAt(0)}
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-widest">{userTitle || 'Student Hub'}</p>
              <p className="text-sm font-semibold text-gray-800">{userName}</p>
            </div>
          </div>
        )}

        {/* Nav links */}
        <nav className="flex-1 py-4 flex flex-col gap-1 px-2">
          {navItems.map(({ label, href, icon: Icon }) => {
            const isActive = location.pathname === href;
            return (
              <Link
                key={href}
                to={href}
                title={collapsed ? label : ''}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                  transition-all duration-150
                  ${isActive
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                  }
                  ${collapsed ? 'justify-center' : ''}
                `}
              >
                <Icon size={18} className={isActive ? 'text-indigo-600' : ''} />
                {!collapsed && <span>{label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Bottom actions */}
        <div className="px-2 py-4 border-t border-gray-100 flex flex-col gap-1">
          {role === 'organizer' && !collapsed && (
            <Link
              to="/help"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-800"
            >
              <HelpCircle size={18} />
              <span>Help Center</span>
            </Link>
          )}
          <LogoutButton variant="sidebar" collapsed={collapsed} />
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => {
            setCollapsed(!collapsed)
            localStorage.setItem('sidebarCollapsed', !collapsed)
          }}
          className="absolute -right-3 top-20 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors z-10"
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar (organizer) */}
        {role === 'organizer' && (
          <header className="bg-white border-b border-gray-100 h-14 flex items-center px-6 justify-between">
            <Logo />
            <div className="flex items-center gap-3">
              <button className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell size={18} />
              </button>
              <button className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings size={18} />
              </button>
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-semibold">
                {userName.charAt(0)}
              </div>
            </div>
          </header>
        )}

        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
