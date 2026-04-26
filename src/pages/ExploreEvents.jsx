import React, { useEffect, useState } from 'react';
import { Search, ChevronDown, MapPin, Calendar as CalendarIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import PublicLayout from '../components/layout/PublicLayout';
import Skeleton from '../components/ui/Skeleton';
import Badge from '../components/ui/Badge';
import { fetchAllFutureEvents } from '../features/events';
import PageLoader from '../components/ui/PageLoader';
import { getDateAndTimeFromMS } from '../util/time';

// Dummy events based on Image 3
const DEMO_EVENTS = [
  { id: 'innovatex-hackathon-2024', title: 'InnovateX Hackathon 2024', category: 'Tech', date: 'Oct 24, 2024 • 09:00 AM', location: 'Computer Science Hall, Room 402', image: '' },
  { id: 'autumn-networking-mixer', title: 'Autumn Networking Mixer', category: 'Social', date: 'Oct 26, 2024 • 05:30 PM', location: 'Student Union Terrace', image: '' },
  { id: 'ui-design-masterclass', title: 'UI Design Masterclass', category: 'Arts', date: 'Oct 28, 2024 • 02:00 PM', location: 'Creative Arts Lab, B-Wing', image: '' },
  { id: 'quantum-physics-seminar', title: 'Quantum Physics Seminar', category: 'Academic', date: 'Nov 01, 2024 • 11:00 AM', location: 'Main Auditorium, South Campus', image: '' },
  { id: 'buzzer-beater-intervarsity', title: 'Buzzer-Beater Intervarsity', category: 'Sports', date: 'Nov 03, 2024 • 07:00 PM', location: 'Campus Arena, Gate 2', image: '' },
  { id: 'future-leaders-career-fair', title: 'Future Leaders Career Fair', category: 'Career', date: 'Nov 05, 2024 • 10:00 AM', location: 'Great Hall Exhibition Space', image: '' },
];

const ExploreEvents = () => {
  const [activeCategory, setActiveCategory] = useState('All Events');
  const categories = ['All Events', 'Tech', 'Social', 'Academic', 'Arts', 'Sports', 'Career'];
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAllFutureEvents()
      .then((res) => {
        setEvents(res.data);
        console.log(res.data);
        setTimeout(() => {
          setLoading(false)
        }, 100)
      })
      .catch((err) => {
        console.log(err);
        setTimeout(() => {
          setLoading(false)
        }, 100)
      })
  }, [])

  // return <PageLoader/>

  return loading ? <PageLoader /> :
    (
      <PublicLayout>
        <div className="max-w-6xl mx-auto px-6 py-12">
          {/* Header section */}
          <div className="max-w-xl mb-10">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Explore Campus Events</h1>
            <p className="text-lg text-gray-500 leading-relaxed">
              Find your next passion project, social gathering, or academic workshop. Curated experiences for the modern student.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 mb-10 border-b border-gray-100 pb-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${activeCategory === cat
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Toolbar (Search, Location, Sort) */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="relative">
                <label className="text-[10px] font-bold text-gray-400 tracking-wider uppercase absolute -top-5 left-1">Location</label>
                <select className="appearance-none bg-white border border-gray-200 text-gray-700 py-2.5 pl-4 pr-10 rounded-lg text-sm font-medium outline-none cursor-pointer focus:border-indigo-500 shadow-sm w-48">
                  <option>Main Campus</option>
                  <option>North Campus</option>
                  <option>South Campus</option>
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>

              <div className="relative">
                <label className="text-[10px] font-bold text-gray-400 tracking-wider uppercase absolute -top-5 left-1">Sort By</label>
                <select className="appearance-none bg-white border border-gray-200 text-gray-700 py-2.5 pl-4 pr-10 rounded-lg text-sm font-medium outline-none cursor-pointer focus:border-indigo-500 shadow-sm w-40">
                  <option>Upcoming</option>
                  <option>Newest</option>
                  <option>Popular</option>
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div className="text-sm font-medium text-gray-500">
              Showing <span className="text-gray-900 font-bold">{events.length}</span> active events
            </div>
          </div>

          {/* Event Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {!loading && events.length === 0 && <p>No events found</p>}
            {loading ?
              [1, 2, 3, 4, 5, 6].map(e => (
                <div key={e} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-indigo-50 transition-all duration-300 group flex flex-col">
                  <Skeleton className="w-full h-86" />
                </div>
              ))
              :
              events.map((event) => (
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

                  {/* Content */}
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
              ))}
          </div>
        </div>
      </PublicLayout>
    );
};

export default ExploreEvents;
