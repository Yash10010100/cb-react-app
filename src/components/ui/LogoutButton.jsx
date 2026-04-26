import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { logout as storeLogout} from '../../store/authSlice';
import { logout } from '../../features/auth'

const LogoutButton = ({
  variant = 'icon', // 'icon', 'text', 'sidebar', 'button'
  collapsed = false,
  className = '',
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false)

  const handleLogout = async() => {
    try {
      setLoading(true)
      await logout();
      dispatch(storeLogout());
      navigate('/');
    } catch (error) {
      console.log(error);
      setLoading(false)
    }
  };

  if (variant === 'sidebar') {
    return (
      <button
        onClick={handleLogout}
        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors ${collapsed ? 'justify-center' : ''} ${className}`}
        title="Log Out"
      >
        <LogOut size={18} />
        {!collapsed && <span>Log Out</span>}
      </button>
    );
  }

  if (variant === 'button') {
    return (
      <button
        onClick={handleLogout}
        className={`w-full py-2.5 rounded-lg border border-red-200 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors flex items-center justify-center gap-2 ${className}`}
      >
        <LogOut size={16} /> Log Out
      </button>
    );
  }

  // Default 'icon' variant
  return (
    <button
      onClick={handleLogout}
      className={`p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center ${className}`}
      title="Log Out"
    >
      <LogOut size={18} />
    </button>
  );
};

export default LogoutButton;
