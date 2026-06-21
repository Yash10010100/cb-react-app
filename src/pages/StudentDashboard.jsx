import React, { useEffect, useState } from 'react';
import { Bell, Search, Download, ChevronRight, AlertCircle, CreditCard, Users } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import EventCard from '../components/dashboard/EventCard';
import MiniCalendar from '../components/dashboard/MiniCalendar';
import { fetchStdFutureEvents } from '../features/events';
import PageLoader from '../components/ui/PageLoader';
import { useSelector } from 'react-redux';
import { getDateAndTimeFromMS } from '../util/time';
import { Link } from 'react-router-dom';

const upcomingEvents = [
  { title: 'AI & Ethics Symposium', type: 'Tech', date: 'Oct 24, 2024', location: 'Grand Auditorium', attendees: 15, status: 'CONFIRMED' },
  { title: 'Harvest Moon Mixer', type: 'Social', date: 'Oct 26, 2024', location: 'North Garden', attendees: 48, status: 'WAITLIST' },
  { title: 'Career Path Mapping', type: 'Academic', date: 'Nov 2, 2024', location: 'Room 402, Hall A', attendees: 11, status: 'REGISTERED' },
];

const actions = [
  {
    icon: AlertCircle,
    title: 'Complete registration',
    desc: 'Hackathon 2024 registration ends in 2 hours.',
    urgent: true,
  },
  {
    icon: Users,
    title: 'Select team',
    desc: 'Debate Club requires your final team list.',
    urgent: false,
  },
];

// const certificates = [
//   { title: 'UI/UX Workshop', verified: 'Sept 2024' },
//   { title: 'Volunteer Lead', verified: 'Aug 2024' },
// ];

const todayHighlights = [
  { title: 'Club Meeting', time: '14:00 - 15:30', location: 'West Wing' },
  { title: 'Project Submission', time: '23:59', location: 'Online Portal' },
];

const StudentDashboard = () => {

  const user = useSelector(state => state.auth.user)
  const [loading, setLoading] = useState(true)
  const [registeredEvents, setRegisteredEvents] = useState([])
  const [pendingRegistrations, setPendingRegistrations] = useState([])
  const [pendingActions, setPendingActions] = useState([])
  const [certificates, setCertificates] = useState([])

  useEffect(() => {
    fetchStdFutureEvents()
      .then(res => {
        console.log(res.data);
        setRegisteredEvents(res.data.registeredEvents)
        setPendingRegistrations(res.data.pendingRegistrationEvents)
        const x = res.data.pendingRegistrationEvents.map(event => {
          return {
            urgent: Date.now() - event.lastregistrationdate < 2 * 86400000,
            title: event.name,
            id: event._id,
            date: getDateAndTimeFromMS(event.date).date,
            action: !event.participation.registrationdetail ? "Fill registration form" : event.isteamevent && event.participation.team.members.length < event.minteamsize ? "Add Team Members" : "Pay Fees",
            link: `/events/${event._id}/register`,
            btnText: "Go to registration",
            initial: event.name.split(" ").map((word) => word[0]).join(""),
            color: ['from-indigo-800 to-indigo-600', 'from-purple-700 to-pink-600', 'from-teal-700 to-cyan-500', 'from-orange-700 to-yellow-500', 'from-red-700 to-pink-500'][Math.floor(Math.random() * 5)],
          }

        })
        console.log(x);

        setPendingActions(x)
        setTimeout(() => {
          setLoading(false)
        }, 500)
      })
      .catch(err => {
        console.log(err)
        setTimeout(() => {
          setLoading(false)
        }, 500)
      })
  }, [])

  return loading ? <PageLoader /> : (
    <DashboardLayout role="student" userName={user.username} userTitle="Academic Curator">
      <div className="p-6 max-w-full">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs font-semibold text-indigo-500 uppercase tracking-widest mb-1">Academic Overview</p>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Welcome back, {user.username}</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 w-48">
              <Search size={14} className="text-gray-400" />
              <input
                placeholder="Search events..."
                className="text-sm text-gray-700 outline-none bg-transparent w-full placeholder-gray-400"
              />
            </div>
            <button className="p-2 text-gray-500 hover:text-gray-800 hover:bg-white rounded-lg border border-gray-200 transition-colors">
              <Bell size={18} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Left / Main */}
          <div className="xl:col-span-2 flex flex-col gap-6">
            {/* Registered Events */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-800">Registered Events</h2>
                <a href="#" className="text-indigo-600 text-sm font-medium hover:underline">View All</a>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {registeredEvents.map((event, i) => (
                  <EventCard key={i} event={event} />
                ))}
              </div>
            </div>

            {/* Required Actions */}
            <div>
              <h2 className="font-semibold text-gray-800 mb-4">Required Actions</h2>
              <div className="grid md:grid-cols-2 gap-3">
                {pendingActions.map((action, i) => (
                  <Card key={i} hover className="flex items-start gap-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${action.urgent ? 'bg-red-50' : 'bg-amber-50'}`}>
                      <AlertCircle size={18} className={action.urgent ? 'text-red-500' : 'text-amber-500'} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-800">{action.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{action.action}</p>
                    </div>
                    <Link to={action.link} className="text-gray-300 flex-shrink-0">
                      <ChevronRight size={16} />
                    </Link>
                  </Card>
                ))}
              </div>
            </div>
            
            {/* Certificates */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-800">Certificates</h2>
                <span className="text-sm text-gray-400">{certificates.length} Total</span>
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                {certificates.map(({ title, verified }, i) => (
                  <Card key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2">
                          <circle cx="12" cy="8" r="6" />
                          <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{title}</p>
                        <p className="text-xs text-gray-400 uppercase tracking-wide">Verified • {verified}</p>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-indigo-600 transition-colors">
                      <Download size={16} />
                    </button>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="flex flex-col gap-5">
            <div>
              <h2 className="font-semibold text-gray-800 mb-4">Schedule</h2>
              <MiniCalendar
                highlightedDates={[2, 4, 12, 15, 22, 24, 26]}
              // todayHighlights={todayHighlights}
              />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
