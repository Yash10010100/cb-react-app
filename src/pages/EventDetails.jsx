import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Calendar, MapPin, Users, Ticket, ArrowRight, Edit, Trash2, LayoutTemplate, Play } from 'lucide-react';
import PublicLayout from '../components/layout/PublicLayout';
import Skeleton from '../components/ui/Skeleton';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { createParticipation, getEvent, startEventRegistration } from '../features/events';
import { getDateAndTimeFromMS } from '../util/time';
import PageLoader from '../components/ui/PageLoader';

// Mock data fetching based on ID
const MOCK_EVENT = {
  id: 'global-tech-summit',
  title: 'Global Tech Summit 2024',
  category: 'Technology',
  type: 'Workshop',
  date: 'Oct 28, 2024',
  deadline: 'Oct 25, 2024',
  location: 'Main Hall',
  fees: '$25.00',
  organizer: 'University Tech Club',
  availability: '42 / 100 Seats',
  percentage: 42,
  description: `Join us for the most anticipated technological event of the academic year. The Global Tech Summit 2024 brings together visionary speakers, industry leaders, and talented students to explore the frontiers of Artificial Intelligence, Sustainable Engineering, and the Future of Web Development.\n\nThis year's theme, 'Architecting Tomorrow,' focuses on how student-led innovations are shaping the next decade of digital infrastructure. Participants will have access to exclusive breakout sessions, hands-on coding labs, and a networking lounge where recruiters from top-tier tech firms will be scouting for new talent. Don't miss this opportunity to connect with the builders of the future.`,
};

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { role, user } = useSelector(state => state.auth);
  const [event, setEvent] = useState(null)
  const [pageLoading, setPageLoading] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")

  useEffect(() => {
    getEvent(id)
      .then(res => {
        console.log(res.data);
        setEvent(res.data)
        setTimeout(() => {
          setPageLoading(false)
        }, 200)
      })
      .catch(err => {
        console.log(err)
        setTimeout(() => {
          setPageLoading(false)
          navigate("/login")
        }, 200)
      })
  }, [])

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this event? This action cannot be undone.")) {
      alert("Event deleted successfully.");
      navigate('/organizer');
    }
  };

  const handleStartRegistrations = async () => {
    if (window.confirm("WARNING: Starting event registrations will lock the registration form. You will not be able to modify the form fields once registrations are open. Do you wish to proceed?")) {
      try {
        setLoading(true)
        const res = await startEventRegistration(id)
        setMessage(res.message)
        setEvent({ ...event, isRegistrationStarted: true })
        setLoading(false)
        setTimeout(() => {
          setMessage("")
        }, 2000)
      } catch (error) {
        setError(error.message)
        setLoading(false)
      }
    }
  };

  const handleCreateParticipation = async () => {
    if (event.participation._id) {
      navigate(`/events/${id}/register`)
    } else {
      const res = await createParticipation(id)
      console.log(res);
      navigate(`/events/${id}/register`)
    }
  }

  return pageLoading ? <PageLoader /> : (
    <PublicLayout>
      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* Banner Section */}
        <div className="relative w-full h-[400px] rounded-3xl overflow-hidden mb-12 shadow-sm border border-gray-100 bg-indigo-50">
          {/* <Skeleton className="absolute inset-0 w-full h-full" /> */}
          <img src={event.themeimage} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent mix-blend-multiply" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column: Details */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Badge className="bg-indigo-100 text-indigo-700 font-bold uppercase tracking-wider text-xs px-3">{event.domain}</Badge>
              <Badge className="bg-gray-100 text-gray-600 font-bold uppercase tracking-wider text-xs px-3">{event.isteamevent ? "Team Event" : "Individual Event"}</Badge>
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-8 tracking-tight">{event.name}</h1>

            <div className="prose prose-lg text-gray-600 mb-12 max-w-none">
              {event.description.split('\n').map((para, i) => (
                <p key={i} className="mb-4">{para}</p>
              ))}
            </div>

            <div className="bg-gray-50 rounded-2xl p-8 mb-12 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center text-indigo-600 shrink-0">
                    <Calendar size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-1">Date</p>
                    <p className="font-semibold text-gray-900">{`${getDateAndTimeFromMS(event.date).date} ${getDateAndTimeFromMS(event.date).time}`}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center text-indigo-600 shrink-0">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-1">Location</p>
                    <p className="font-semibold text-gray-900">{event.location}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center text-indigo-600 shrink-0">
                    <Ticket size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-1">Fees</p>
                    <p className="font-semibold text-gray-900">{event.fees || "Free"}</p>
                  </div>
                </div>
                {/* <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center text-indigo-600 shrink-0">
                    <Users size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-1">Organizer</p>
                    <p className="font-semibold text-gray-900">{event.organizer}</p>
                  </div>
                </div> */}
              </div>
            </div>

            {/* <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Event Location</h3>
              <div className="w-full h-64 bg-emerald-50 rounded-2xl overflow-hidden relative border border-emerald-100">
                <Skeleton className="absolute inset-0 w-full h-full bg-emerald-100/50" />
                <div className="absolute inset-0 flex items-center justify-center text-emerald-700/50 font-medium">Maps Integration Placeholder</div>
              </div>
            </div> */}
          </div>

          {/* Right Column: Registration / Organizer Controls */}
          <div>
            <div className="sticky top-24">
              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-gray-200/40 mb-6">

                <div className="flex justify-between items-end mb-2">
                  <span className="text-sm font-semibold text-gray-500">Available Slots</span>
                  <span className="text-sm font-bold text-gray-900">{event.maxParticipants ? `${event.maxParticipants - event.totalParticipations} / ${event.maxParticipants}` : "Unlimited"}</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full mb-2 overflow-hidden">
                  <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${event.maxParticipants ? (event.maxParticipants - event.totalParticipations) / event.maxParticipants * 100 : 100}%` }} />
                </div>
                {!event.isRegistrationStarted ?
                  <p className="text-xs text-red-600 leading-relaxed">registrations not started yet</p> : <p className="text-xs text-green-600 leading-relaxed">Registrations open</p>}

                {event.isRegistrationStarted && <div className="my-8">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-500">Registration Deadline</span>
                    <span className="text-sm font-bold text-red-600">{getDateAndTimeFromMS(event.lastregistrationdate).date}</span>
                  </div>
                  {role !== 'organizer' && <p className="text-xs text-gray-400 leading-relaxed">
                    Registration is open to all students. Late registrations will not be accommodated after the deadline.
                  </p>}
                </div>}

                {role === 'organizer' && event.owner === user._id ? (
                  <div className="flex flex-col gap-3 mt-8">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 text-center">Organizer Options</h4>
                    {message && <p className="text-xs text-green-600 leading-relaxed">{message}</p>}
                    <Link to={`/events/${event._id}/edit`}>
                      <Button variant="outline" fullWidth className="justify-center border-indigo-200 text-indigo-700 hover:bg-indigo-50">
                        <Edit size={16} className="mr-2" /> Edit Event Details
                      </Button>
                    </Link>
                    {!event.isRegistrationStarted && <Link to={`/organizer/form-builder/${event._id}`}>
                      <Button variant="outline" fullWidth className="justify-center border-indigo-200 text-indigo-700 hover:bg-indigo-50">
                        <LayoutTemplate size={16} className="mr-2" /> Edit Form
                      </Button>
                    </Link>}
                    {!event.isRegistrationStarted && <Button disabled={loading} variant="outline" fullWidth onClick={handleStartRegistrations} className="justify-center border-indigo-200 text-indigo-700 hover:bg-indigo-50"><Play size={16} className="mr-2" />{loading ? "Wait a bit..." : "Start Registration"}</Button>
                    }
                    <Button variant="outline" fullWidth onClick={handleDelete} className="justify-center border-red-200 text-red-600 hover:bg-red-50">
                      <Trash2 size={16} className="mr-2" /> Delete Event
                    </Button>
                  </div>
                ) : (
                  event.isRegistrationStarted &&
                  <div className='flex flex-col gap-3'>
                    {
                      event.participation?._id && event.participation.success ? <p className='text-xs text-green-600 leading-relaxed'>You have successfully registered for this event</p> :
                        <Button onClick={handleCreateParticipation} variant="primary" size="lg" fullWidth className="justify-center shadow-lg shadow-indigo-200">
                          {event.participation?._id ? "Complete Registration" : "Register Now"} <ArrowRight size={18} className="ml-2" />
                        </Button>
                    }
                  </div>
                )}


                {!role || role === 'student' ? (
                  <ul className="mt-8 space-y-3 text-sm text-gray-600">
                    <li className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">✓</div>
                      Digital certificate provided
                    </li>
                    {/* <li className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">✓</div>
                      Lunch and refreshments included
                    </li> */}
                  </ul>
                ) : null}
              </div>

              {/* {(!role || role === 'student') && (
                <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100">
                  <div className="flex items-start gap-3">
                    <div className="text-indigo-600 mt-1">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-indigo-900 mb-1">Student Discount Available</h4>
                      <p className="text-xs text-indigo-700/80 leading-relaxed">
                        Use your university ID card during check-in to get a campus coffee voucher.
                      </p>
                    </div>
                  </div>
                </div>
              )} */}
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default EventDetails;
