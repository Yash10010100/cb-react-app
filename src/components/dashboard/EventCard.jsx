import React from 'react';
import { MapPin } from 'lucide-react';
import Badge from '../ui/Badge';
import Card from '../ui/Card';

const statusColors = {
  CONFIRMED: 'text-green-600 font-semibold',
  WAITLIST: 'text-amber-500 font-semibold',
  REGISTERED: 'text-indigo-600 font-semibold',
};

const EventCard = ({ event }) => {
  const { title, type, date, location, attendees, status } = event;

  return (
    <Card hover className="min-w-[240px] flex-shrink-0">
      <div className="flex items-center justify-between mb-3">
        <Badge label={type} type={type.toLowerCase()} />
        <span className="text-xs text-gray-400">{date}</span>
      </div>
      <h3 className="font-semibold text-gray-900 mb-2 leading-snug">{title}</h3>
      <div className="flex items-center gap-1 text-gray-400 mb-3">
        <MapPin size={13} />
        <span className="text-xs">{location}</span>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex -space-x-2">
          {[...Array(Math.min(3, attendees || 0))].map((_, i) => (
            <div
              key={i}
              className="w-6 h-6 rounded-full border-2 border-white bg-indigo-200 text-indigo-700 flex items-center justify-center text-xs font-bold"
            >
              {String.fromCharCode(65 + i)}
            </div>
          ))}
          {attendees > 3 && (
            <div className="w-6 h-6 rounded-full border-2 border-white bg-gray-100 text-gray-500 flex items-center justify-center text-xs">
              +{attendees - 3}
            </div>
          )}
        </div>
        {status && (
          <span className={`text-xs ${statusColors[status] || 'text-gray-500'}`}>{status}</span>
        )}
      </div>
    </Card>
  );
};

export default EventCard;
