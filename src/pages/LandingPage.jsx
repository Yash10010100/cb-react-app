import React from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../components/layout/PublicLayout';
import Button from '../components/ui/Button';
import { Calendar, BookOpen, Award, Users } from 'lucide-react';
import { useSelector } from "react-redux";

// SVG illustration representing college events/campus life
const HeroIllustration = () => (
  <svg viewBox="0 0 480 380" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* Background circle */}
    <circle cx="240" cy="190" r="170" fill="#ede9fe" opacity="0.5" />

    {/* Main building / stage */}
    <rect x="100" y="200" width="280" height="120" rx="8" fill="#c7d2fe" />
    <rect x="130" y="180" width="220" height="30" rx="4" fill="#818cf8" />
    <rect x="160" y="155" width="160" height="30" rx="4" fill="#4f46e5" />
    {/* Roof triangle */}
    <polygon points="240,100 150,155 330,155" fill="#4338ca" />

    {/* Windows */}
    <rect x="150" y="215" width="35" height="40" rx="4" fill="#a5b4fc" />
    <rect x="215" y="215" width="50" height="60" rx="4" fill="#fff" opacity="0.9" />
    <rect x="295" y="215" width="35" height="40" rx="4" fill="#a5b4fc" />

    {/* Door */}
    <rect x="215" y="240" width="50" height="80" rx="4" fill="#6366f1" />
    <circle cx="238" cy="283" r="3" fill="#fff" />

    {/* Steps */}
    <rect x="190" y="315" width="100" height="8" rx="2" fill="#818cf8" />
    <rect x="175" y="323" width="130" height="8" rx="2" fill="#a5b4fc" />

    {/* Flags / banner */}
    <line x1="160" y1="155" x2="160" y2="110" stroke="#6366f1" strokeWidth="2" />
    <polygon points="160,110 190,120 160,130" fill="#ef4444" />
    <line x1="320" y1="155" x2="320" y2="110" stroke="#6366f1" strokeWidth="2" />
    <polygon points="320,110 290,120 320,130" fill="#f59e0b" />

    {/* People/Students (simplified) */}
    {/* Person 1 */}
    <circle cx="120" cy="300" r="14" fill="#fde68a" />
    <rect x="108" y="314" width="24" height="28" rx="5" fill="#4f46e5" />
    <line x1="108" y1="320" x2="96" y2="340" stroke="#4f46e5" strokeWidth="5" strokeLinecap="round" />
    <line x1="132" y1="320" x2="144" y2="340" stroke="#4f46e5" strokeWidth="5" strokeLinecap="round" />

    {/* Person 2 */}
    <circle cx="360" cy="298" r="14" fill="#fca5a5" />
    <rect x="348" y="312" width="24" height="28" rx="5" fill="#6366f1" />
    <line x1="348" y1="318" x2="336" y2="338" stroke="#6366f1" strokeWidth="5" strokeLinecap="round" />
    <line x1="372" y1="318" x2="384" y2="338" stroke="#6366f1" strokeWidth="5" strokeLinecap="round" />

    {/* Floating elements */}
    {/* Calendar card */}
    <rect x="30" y="130" width="70" height="60" rx="8" fill="white" filter="url(#shadow)" />
    <rect x="30" y="130" width="70" height="16" rx="8" fill="#4f46e5" />
    <rect x="42" y="156" width="12" height="10" rx="2" fill="#c7d2fe" />
    <rect x="60" y="156" width="12" height="10" rx="2" fill="#c7d2fe" />
    <rect x="78" y="156" width="12" height="10" rx="2" fill="#e0e7ff" />
    <rect x="42" y="170" width="12" height="10" rx="2" fill="#e0e7ff" />
    <rect x="60" y="170" width="12" height="10" rx="2" fill="#4f46e5" />

    {/* Trophy */}
    <rect x="385" y="148" width="65" height="55" rx="8" fill="white" />
    <path d="M405 175 Q385 160 395 148 L435 148 Q445 160 425 175 L405 175Z" fill="#f59e0b" />
    <rect x="412" y="175" width="16" height="12" rx="2" fill="#fbbf24" />
    <rect x="407" y="185" width="26" height="5" rx="2" fill="#d97706" />
    <circle cx="420" cy="163" r="5" fill="#fef3c7" />

    {/* Stars */}
    <circle cx="80" cy="80" r="4" fill="#fbbf24" />
    <circle cx="400" cy="60" r="3" fill="#a78bfa" />
    <circle cx="50" cy="230" r="3" fill="#34d399" />
    <circle cx="440" cy="240" r="4" fill="#f87171" />

    <defs>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="2" stdDeviation="4" floodOpacity="0.1" />
      </filter>
    </defs>
  </svg>
);

const features = [
  {
    icon: Calendar,
    title: 'Discover Events',
    desc: 'A curated feed of campus happenings, filtered by your interests. No clutter, just relevance.',
  },
  {
    icon: BookOpen,
    title: 'Easy Registrations',
    desc: 'One-tap RSVP for any campus event. Synced directly to your calendar of choice.',
  },
  {
    icon: Users,
    title: 'Organizer Tools',
    desc: 'Professional dashboard for club leaders. Manage attendees, feedback, and promotion effortlessly.',
  },
  {
    icon: Award,
    title: 'Certificates',
    desc: 'Automatically generate verified participation certificates for your professional portfolio.',
  },
];

const steps = [
  { num: '1', title: 'Connect Profile', desc: 'Link your university ID to unlock exclusive events and department-specific events.' },
  { num: '2', title: 'Personalize Feed', desc: 'Select your academic interests and career goals to get curated recommendations.' },
  { num: '3', title: 'Engage & Grow', desc: 'Attend events, take on leadership roles, and build a digital record of your campus achievements.' },
];

const LandingPage = () => {
  const user = useSelector(state => state.auth.user)

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <span className="inline-block text-xs font-semibold tracking-widest text-indigo-500 uppercase mb-4 bg-indigo-50 px-3 py-1 rounded-full">
            Curated Campus Life
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-5">
            Your Campus,<br />Your Events,<br />One Platform
          </h1>
          <p className="text-gray-500 text-base leading-relaxed mb-8 max-w-md">
            Escape the noise of generic social media. CampusBuzz provides a focused, editorial experience
            for university events, clubs, and academic life.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to={!user?"/register":"/explore"}>
              <Button variant="primary" size="lg">Explore Events</Button>
            </Link>
            {(!user || user.role==="ORGANIZER") && <Link to={!user?"/register":"/organizer/upload"}>
              <Button variant="outline" size="lg">Host an Event</Button>
            </Link>}
          </div>
        </div>
        <div className="relative">
          <div className="w-full max-w-md mx-auto">
            <HeroIllustration />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Feature Overview</h2>
            {/* <p className="text-gray-500 text-sm">Tools designed to streamline your university experience.</p> */}
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map(({ icon: Icon, title, desc }, i) => (
              <div
                key={i}
                className={`rounded-2xl p-6 flex flex-col gap-3 transition-all duration-200 hover:-translate-y-1
                  ${i === 2 ? 'bg-indigo-600 text-white' : 'bg-[#f8f8fc] text-gray-800'}
                `}
              >
                <Icon
                  size={22}
                  className={i === 2 ? 'text-indigo-200' : 'text-indigo-600'}
                />
                <h3 className={`font-semibold text-sm ${i === 2 ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
                {/* <p className={`text-xs leading-relaxed ${i === 2 ? 'text-indigo-200' : 'text-gray-500'}`}>{desc}</p> */}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      {/* <section className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Simple Integration</h2>
          <p className="text-gray-500 text-sm mb-2">
            We believe technology should be invisible. CampusBuzz integrates with your existing academic life in three simple steps.
          </p>
          <a href="#" className="text-indigo-600 text-sm font-medium hover:underline">Read the full guide →</a>
        </div>
        <div className="flex flex-col gap-6">
          {steps.map(({ num, title, desc }) => (
            <div key={num} className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-bold flex-shrink-0">
                {num}
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-0.5">{title}</h4>
                <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section> */}

      {/* CTA Banner */}
      {!user && <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="bg-indigo-600 rounded-2xl p-10 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Ready to curate your campus life?
          </h2>
          {/* <p className="text-indigo-200 text-sm mb-8">
            Join 15,000+ students and organizers who are transforming the way campus communities connect.
          </p> */}
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/register">
              <button className="inline-flex items-center justify-center gap-2 font-medium rounded-lg px-6 py-3 text-base bg-white text-indigo-700 hover:bg-indigo-50 transition-all duration-200 cursor-pointer">
                Start exploring today
              </button>
            </Link>
            <Link to="/register?role=organizer">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-indigo-700">
                Host your first event
              </Button>
            </Link>
          </div>
        </div>
      </section>}
    </PublicLayout>
  );
};

export default LandingPage;
