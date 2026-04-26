import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, School } from 'lucide-react';

const Logo = ({ className = '' }) => {
  return (
    <Link to="/" className={`flex items-center gap-2 font-bold text-gray-900 no-underline ${className}`}>
      <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
        {/* <School size={16} className="text-white" /> */}
        <Zap size={16} className="text-white fill-white" />
      </div>
      <span className="text-lg tracking-tight">CampusBuzz</span>
    </Link>
  );
};

export default Logo;
