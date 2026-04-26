import React, { useEffect, useState } from 'react';
import { Calendar, Users, DollarSign, MoreVertical, CalendarIcon, MapPin } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import StatCard from '../components/dashboard/StatCard';
import MiniCalendar from '../components/dashboard/MiniCalendar';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { fetchOrgFutureEvents } from '../features/events';
import PageLoader from '../components/ui/PageLoader';
import { Link } from 'react-router-dom';
import Badge from '../components/ui/Badge';
import { getDateAndTimeFromMS } from '../util/time';
import { useSelector } from 'react-redux';

const stats = [
  {
    icon: Calendar,
    label: 'Total Events',
    value: '8',
    trend: '+2 this month',
    trendColor: 'text-green-500',
  },
  {
    icon: Users,
    label: 'Total Registrations',
    value: '142',
    trend: '+12% vs last week',
    trendColor: 'text-green-500',
  },
  {
    icon: DollarSign,
    label: 'Total Revenue',
    value: '$1,240',
    trend: 'Net Earnings',
    trendColor: 'text-indigo-500',
  },
];

const myEvents = [
  {
    title: 'Global Tech Summit',
    date: 'Oct 28, 2023',
    registered: 58,
    color: 'from-indigo-800 to-indigo-600',
    initial: 'GT',
  },
  {
    title: 'Fall Campus Music Fest',
    date: 'Nov 04, 2023',
    registered: 84,
    color: 'from-purple-700 to-pink-600',
    initial: 'MF',
  },
  {
    title: 'Alumni Mixer & Networking',
    date: 'Nov 12, 2023',
    registered: 21,
    color: 'from-teal-700 to-cyan-500',
    initial: 'AM',
  },
];

const todayHighlights = [
  { title: 'Global Tech Summit', time: 'Starts at 2:00 PM', location: 'Main Hall' },
];

const OrganizerDashboard = () => {
  const user = useSelector(state=>state.auth.user)
  const [events, setEvents] = useState([]);
  const [pendingActions, setPendingActions] = useState([]);
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrgFutureEvents()
      .then((res) => {
        setEvents(res.data);
        console.log(res.data);
        res.data.forEach((event) => {
          if (event.registrationform?.length === 0) {
            setPendingActions((prev) => {
              // if (prev.find((item) => item.id === event._id)) return prev
              return [...prev, {
                title: event.name,
                id: event._id,
                date: getDateAndTimeFromMS(event.date).date,
                action: "Create Registration Form",
                link: `/organizer/form-builder/${event._id}`,
                btnText: "Create Form",
                initial: event.name.split(" ").map((word) => word[0]).join(""),
                color: ['from-indigo-800 to-indigo-600', 'from-purple-700 to-pink-600', 'from-teal-700 to-cyan-500', 'from-orange-700 to-yellow-500', 'from-red-700 to-pink-500'][Math.floor(Math.random() * 5)],
              }]
            })
          }
          else if (!event.isRegistrationStarted) {
            setPendingActions((prev) => {
              // if (prev.find((item) => item.id === event._id)) return prev
              return [...prev, {
                title: event.name,
                id: event._id,
                date: getDateAndTimeFromMS(event.date).date,
                action: "Edit registration form or start registration",
                link: `/organizer/form-builder/${event._id}`,
                btnText: "Edit/Start Registration",
                initial: event.name.split(" ").map((word) => word[0]).join(""),
                color: ['from-indigo-800 to-indigo-600', 'from-purple-700 to-pink-600', 'from-teal-700 to-cyan-500', 'from-orange-700 to-yellow-500', 'from-red-700 to-pink-500'][Math.floor(Math.random() * 5)],
              }]
            })
          }
        })
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

  return loading ? <PageLoader /> : (
    <DashboardLayout role="organizer" userName="Curator">
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Organizer Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">{`Welcome back, ${user.username}. Here's your events at a glance.`}</p>
          </div>
          <Button variant="primary" size="md" className="self-start md:self-auto">
            <Link to="/organizer/upload">+ Create New Event</Link>
          </Button>
        </div>

        {/* Stats row */}
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {stats.map((s, i) => (
            <StatCard key={i} {...s} />
          ))}
        </div> */}

        {/* My Events */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {events.map((event) => (
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

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* My Events Table */}
          <div className="xl:col-span-2">
            <div className="flex items-center justify-between mb-4">
              {/* <h2 className="font-semibold text-gray-800">My Events</h2> */}
              <h2 className="font-semibold text-gray-800">Pending actions</h2>
              {/* <a href="#" className="text-indigo-600 text-sm font-medium hover:underline">View All</a> */}
            </div>
            <Card padding={false} className="overflow-hidden">
              <div className="flex flex-col divide-y divide-gray-50">
                {pendingActions.map(({ title, id, action, date, color, initial, btnText, link }) => (
                  <div key={id} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors">
                    <div className={`w-14 h-10 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0`}>
                      <span className="text-white text-xs font-bold">{initial}</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">{`${title} - ${action}`}</p>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-xs text-indigo-500 font-medium">{date}</span>
                        <span className="flex items-center gap-1 text-xs text-gray-400">
                          {/* <Users size={11} />
                          {registered} Registered */}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Link to={link}>{btnText}</Link>
                      </Button>
                      <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Calendar sidebar */}
          <div>
            <h2 className="font-semibold text-gray-800 mb-4">Event Calendar</h2>
            <MiniCalendar
              highlightedDates={events.map((event) => {
                const date = getDateAndTimeFromMS(event.date).date.split("/")
                return parseInt(date[1])===new Date().getMonth()+1?parseInt(date):null
              })}
              todayHighlights={todayHighlights}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default OrganizerDashboard;
