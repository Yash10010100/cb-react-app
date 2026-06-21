import React from 'react';
import { CalendarIcon, MapPin } from 'lucide-react';
import Badge from '../ui/Badge';
import Card from '../ui/Card';
import { Link } from 'react-router-dom';
import { getDateAndTimeFromMS } from '../../util/time';

const statusColors = {
  CONFIRMED: 'text-green-600 font-semibold',
  WAITLIST: 'text-amber-500 font-semibold',
  REGISTERED: 'text-indigo-600 font-semibold',
};

const EventCard = ({ event }) => {
  const { title, domain, date, location, attendees, status } = event;

  return (
    // <Card hover className="min-w-[240px] flex-shrink-0">
    //   <div className="flex items-center justify-between mb-3">
    //     <Badge label={domain} type={domain.toLowerCase()} />
    //     <span className="text-xs text-gray-400">{date}</span>
    //   </div>
    //   <h3 className="font-semibold text-gray-900 mb-2 leading-snug">{title}</h3>
    //   <div className="flex items-center gap-1 text-gray-400 mb-3">
    //     <MapPin size={13} />
    //     <span className="text-xs">{location}</span>
    //   </div>
    //   <div className="flex items-center justify-between">
    //     <div className="flex -space-x-2">
    //       {[...Array(Math.min(3, attendees || 0))].map((_, i) => (
    //         <div
    //           key={i}
    //           className="w-6 h-6 rounded-full border-2 border-white bg-indigo-200 text-indigo-700 flex items-center justify-center text-xs font-bold"
    //         >
    //           {String.fromCharCode(65 + i)}
    //         </div>
    //       ))}
    //       {attendees > 3 && (
    //         <div className="w-6 h-6 rounded-full border-2 border-white bg-gray-100 text-gray-500 flex items-center justify-center text-xs">
    //           +{attendees - 3}
    //         </div>
    //       )}
    //     </div>
    //     {status && (
    //       <span className={`text-xs ${statusColors[status] || 'text-gray-500'}`}>{status}</span>
    //     )}
    //   </div>
    // </Card>
    <div key={event.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-indigo-50 transition-all duration-300 group flex flex-col">
      {/* Thumbnail */}
      <div className="relative w-full bg-indigo-50 overflow-hidden">
        {/* <Skeleton className="w-full h-full absolute inset-0" /> */}
        <img src={event.themeimage} alt={event.name} loading="lazy" width={"100%"} />
        {/* Fallback pattern overlaid on skeleton to show it's an image placeholder */}
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-transparent mix-blend-overlay"></div>
        <div className="absolute top-3 left-3 z-10">
          <Badge className={`bg-white text-xs font-bold uppercase tracking-wider ${event.domain === 'Tech' ? 'text-blue-600' :
            event.domain === 'Social' ? 'text-pink-600' :
              event.domain === 'Academic' ? 'text-emerald-600' :
                event.domain === 'Arts' ? 'text-orange-600' :
                  event.domain === 'Sports' ? 'text-red-600' : 'text-indigo-600'
            }`}>
            {event.domain}
          </Badge>
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-lg font-bold text-gray-900 mb-4 group-hover:text-indigo-600 transition-colors line-clamp-1">{event.name}</h3>

        <div className="space-y-2 mb-6 text-sm text-gray-600">
          <div className="flex items-start gap-2">
            <CalendarIcon size={16} className="text-indigo-400 mt-0.5 shrink-0" />
            <span>{getDateAndTimeFromMS(event.date).date}</span>
          </div>
          <div className="flex items-start gap-2">
            <MapPin size={16} className="text-indigo-400 mt-0.5 shrink-0" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
        </div>

        <div className="mt-auto">
          <Link to={`/events/${event._id}`}>
            <button className="w-full py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-indigo-600 hover:bg-indigo-50 hover:border-indigo-100 transition-colors">
              View Details
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
