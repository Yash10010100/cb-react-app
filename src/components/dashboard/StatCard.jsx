import React from 'react';
import Card from '../ui/Card';

const StatCard = ({ icon: Icon, label, value, trend, trendLabel, trendColor = 'text-green-500' }) => {
  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div className="w-11 h-11 bg-indigo-50 rounded-xl flex items-center justify-center">
          <Icon size={20} className="text-indigo-600" />
        </div>
        {trend && (
          <span className={`text-xs font-semibold ${trendColor}`}>{trend}</span>
        )}
      </div>
      <div>
        <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-1">{label}</p>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      </div>
      {trendLabel && (
        <p className="text-xs text-gray-400">{trendLabel}</p>
      )}
    </Card>
  );
};

export default StatCard;
