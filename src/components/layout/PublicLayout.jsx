import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Menu, X, Bell, User } from 'lucide-react';
import Logo from '../ui/Logo';
import Button from '../ui/Button';
import LogoutButton from '../ui/LogoutButton';

const PublicNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user, role } = useSelector((state) => state.auth);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Discover', href: '/explore' },
    ...(isAuthenticated && role === 'student' ? [{ label: 'Dashboard', href: '/dashboard' }] : []),
    ...(isAuthenticated && role === 'organizer' ? [{ label: 'Dashboard', href: '/organizer' }] : []),
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Logo />

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`text-sm font-medium transition-colors ${
                location.pathname === link.href
                  ? 'text-indigo-600 border-b-2 border-indigo-600 pb-1 mt-1'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <>
              {role === 'organizer' && (
                <Link to="/organizer/upload">
                  <Button variant="primary" size="sm">Create Event</Button>
                </Link>
              )}
              <button className="text-gray-500 hover:text-gray-900">
                <Bell size={20} />
              </button>
              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold relative cursor-pointer" title={user?.name || "User"}>
                {user?.name?.charAt(0) || <User size={16} />}
              </div>
              <LogoutButton variant="icon" />
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">Join Now</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile burger */}
        <button
          className="md:hidden text-gray-600 p-1"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="text-sm font-medium text-gray-700"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex gap-2 pt-2 border-t border-gray-100">
            {isAuthenticated ? (
              <LogoutButton variant="button" onClickCallback={() => setMenuOpen(false)} />
            ) : (
              <>
                <Link to="/login" className="flex-1">
                  <Button variant="outline" size="sm" fullWidth>Sign In</Button>
                </Link>
                <Link to="/register" className="flex-1">
                  <Button variant="primary" size="sm" fullWidth>Join Now</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

const PublicFooter = () => (
  <footer className="bg-white border-t border-gray-100 mt-auto">
    <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <Logo />
        <span className="text-gray-400 text-sm ml-2">| © 2026 CampusBuzz.</span>
      </div>
      <nav className="flex items-center gap-6">
        {['About', 'Contact', 'Terms', 'FAQ'].map((item) => (
          <a key={item} href="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
            {item}
          </a>
        ))}
      </nav>
    </div>
  </footer>
);

const PublicLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8f8fc]">
      <PublicNavbar />
      <main className="flex-1">{children}</main>
      <PublicFooter />
    </div>
  );
};

export default PublicLayout;
