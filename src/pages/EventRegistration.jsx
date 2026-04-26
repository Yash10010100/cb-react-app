import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useAsyncError } from 'react-router-dom';
import { ArrowLeft, Users, UserPlus, CreditCard, ShieldCheck, Clock, HelpCircle, CheckCircle2 } from 'lucide-react';
import PublicLayout from '../components/layout/PublicLayout';
import CustomRegistrationForm from '../components/CustomRegistrationForm';
import Button from '../components/ui/Button';
import { getEvent } from '../features/events';
import PageLoader from '../components/ui/PageLoader';

// Mock fields for the CustomRegistrationForm
const MOCK_FIELDS = [
  { id: 'f1', name: 'Full Name', tooltip: '', datatype: 'String', required: true, options: [] },
  { id: 'f2', name: 'University ID', tooltip: 'Typically your student id number', datatype: 'String', required: true, options: [] },
  { id: 'f3', name: 'Email Address', tooltip: 'Must use .edu', datatype: 'Email', required: true, options: [] },
];

const EventRegistration = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isTeamEvent] = useState(true); // Hardcode true for demonstration
  const [event, setEvent] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getEvent(id)
      .then(res => {
        setEvent(res.data)
        if (!res.data.participation?.registrationdetail) {
          setStep(1)
        } else {
          setStep(2)
        }
        setPageLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setPageLoading(false)
      })
  }, [])


  // Step 1 wrapper around CustomRegistrationForm submit
  // We manipulate the DOM to capture the Custom form submission 
  // since CustomRegistrationForm is an isolated component
  const handleStep1Submit = (e) => {
    // If not triggered by a form submission, just go to next
    if (e?.preventDefault) e.preventDefault();
    setStep(isTeamEvent ? 2 : 3);
  };

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    const res = await loadRazorpay();
    if (!res) {
      alert('Razorpay SDK failed to load. Are you online?');
      return;
    }

    const options = {
      key: "rzp_test_YOUR_KEY_ID", // Dummy key
      amount: 2600, // 26.00 in smallest unit
      currency: "USD",
      name: "CampusBuzz",
      description: "Global Tech Summit Registration",
      handler: function (response) {
        alert("Payment Successful! Payment ID: " + response.razorpay_payment_id);
        navigate('/dashboard'); // Route back to student dashboard
      },
      prefill: {
        name: "Campus Student",
        email: "student@university.edu"
      },
      theme: { color: "#4f46e5" }
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.on('payment.failed', function (response) {
      alert("Payment Failed. Reason: " + response.error.description);
    });
    paymentObject.open();
  };

  return pageLoading ? <PageLoader /> : (
    <PublicLayout>
      <div className="max-w-3xl mx-auto px-6 py-12">
        <button onClick={() => step > 1 ? setStep(step - 1) : navigate(-1)} className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors mb-8">
          <ArrowLeft size={16} className="mr-2" /> {step > 1 ? 'Back to previous step' : 'Back to event details'}
        </button>

        {/* Header */}
        <div className="mb-10 text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-widest mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" /> Hackathon 2024
          </span>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">Event Registration</h1>
          <p className="text-gray-500 max-w-lg mx-auto">Complete the details below to secure your spot in the upcoming university-wide hackathon challenge.</p>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <button onClick={() => setStep(1)}><div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${step >= 1 ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' : 'bg-gray-200 text-gray-500'}`}>1</div></button>
          <div className={`h-1 w-12 rounded-full ${step >= 2 ? 'bg-indigo-600' : 'bg-gray-200'}`} />
          {isTeamEvent && (
            <>
              <button onClick={() => { event.participation?.registrationdetail && setStep(2) }}><div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${step >= 2 ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' : 'bg-gray-200 text-gray-500'}`}>2</div></button>
              <div className={`h-1 w-12 rounded-full ${step >= 3 ? 'bg-indigo-600' : 'bg-gray-200'}`} />
            </>
          )}
          <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${step === 3 ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' : 'bg-gray-200 text-gray-500'}`}>
            {isTeamEvent ? '3' : '2'}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-gray-100">

          {step === 1 && (
            <div>
              <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-50">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <UserPlus size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Student Information</h2>
                  <p className="text-xs text-gray-500">Provided customized fields required by the organizer.</p>
                </div>
              </div>

              <div onClick={(e) => {
                // Hack to intercept CustomRegistrationForm submit button directly
                if (e.target.tagName === 'BUTTON' && e.target.type === 'submit') {
                  e.preventDefault();
                  handleStep1Submit();
                }
              }}>
                {/* We use a modified version of CustomRegistrationForm rendered inline to control the flow easily since it's a wizard */}
                <CustomRegistrationForm fields={MOCK_FIELDS} isPreview={false} eventDetails={{ title: '', desc: '', image: '' }} />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-50">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <Users size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Team Selection</h2>
                  <p className="text-xs text-gray-500">You must be part of a team to participate in this event.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button className="flex flex-col text-left p-8 rounded-2xl border-2 border-indigo-600 bg-indigo-50/30 ring-4 ring-indigo-50 transition-all">
                  <div className="w-12 h-12 rounded-full bg-white border border-indigo-100 flex items-center justify-center text-indigo-600 mb-6 shadow-sm">
                    <UserPlus size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Create a New Team</h3>
                  <p className="text-sm text-gray-500">Start a fresh squad and invite your friends to join.</p>
                </button>

                <button className="flex flex-col text-left p-8 rounded-2xl border-2 border-gray-100 bg-gray-50 hover:border-gray-300 hover:bg-gray-100 transition-all opacity-70">
                  <div className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 mb-6 shadow-sm">
                    <Users size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Join an Existing Team</h3>
                  <p className="text-sm text-gray-500">Enter a team code to join a pre-registered group.</p>
                </button>
              </div>

              <div className="mt-12 flex justify-between items-center border-t border-gray-50 pt-8">
                <div>
                  <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-1">Registration Fee</p>
                  <p className="text-2xl font-black text-gray-900">$25.00 <span className="text-sm font-semibold text-gray-400">/ person</span></p>
                </div>
                <Button size="lg" onClick={() => setStep(3)}>Proceed to Payment</Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="relative w-full h-32 rounded-2xl bg-gradient-to-r from-indigo-900 to-purple-900 overflow-hidden mb-8">
                <div className="absolute inset-0 bg-white/10 mix-blend-overlay"></div>
                <div className="absolute bottom-6 left-6">
                  <p className="text-[10px] font-bold tracking-widest text-indigo-200 uppercase mb-1">Event Name</p>
                  <h3 className="text-2xl font-bold text-white">Global Tech Summit</h3>
                </div>
              </div>

              <div className="space-y-4 mb-8 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span className="font-medium">Registration Fee</span>
                  <span className="font-semibold text-gray-900">$25.00</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span className="font-medium">Platform Fee</span>
                  <span className="font-semibold text-gray-900">$1.00</span>
                </div>
                <div className="pt-4 border-t border-dashed border-gray-200">
                  <div className="flex justify-between items-end">
                    <span className="text-base font-bold text-gray-900">Total Amount</span>
                    <span className="text-2xl font-black text-indigo-600">$26.00</span>
                  </div>
                </div>
              </div>

              <div className="mb-10">
                <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-4">Payment Method</p>
                <div className="flex items-center justify-between p-4 rounded-xl border-2 border-indigo-600 bg-indigo-50/50 cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-lg shadow-sm border border-indigo-100 flex items-center justify-center text-blue-600">
                      <CreditCard size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">Razorpay Checkout</p>
                      <p className="text-[11px] text-gray-500">Cards, Netbanking, UPI, Wallets</p>
                    </div>
                  </div>
                  <CheckCircle2 size={24} className="text-indigo-600" />
                </div>
              </div>

              <Button size="lg" fullWidth className="py-4 text-base" onClick={handlePayment}>
                <ShieldCheck size={18} className="mr-2" /> Pay $26.00 Securely
              </Button>
              <p className="text-center text-[11px] text-gray-400 font-medium uppercase tracking-widest mt-4">✓ 256-bit SSL Encrypted Transaction</p>
            </div>
          )}

        </div>

        {/* Footer info blocks */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white rounded-2xl p-6 text-center border border-gray-100 shadow-sm flex flex-col items-center">
            <ShieldCheck size={24} className="text-indigo-500 mb-3" />
            <h4 className="font-bold text-gray-900 text-sm mb-1">Secure Payment</h4>
            <p className="text-xs text-gray-500">End-to-end encrypted transactions via Razorpay.</p>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center border border-gray-100 shadow-sm flex flex-col items-center">
            <Clock size={24} className="text-indigo-500 mb-3" />
            <h4 className="font-bold text-gray-900 text-sm mb-1">Registration Closing</h4>
            <p className="text-xs text-gray-500">{`${Math.floor((event.lastregistrationdate - Date.now()) / (1000 * 60 * 60 * 24))} days left to register before deadline.`}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center border border-gray-100 shadow-sm flex flex-col items-center">
            <HelpCircle size={24} className="text-indigo-500 mb-3" />
            <h4 className="font-bold text-gray-900 text-sm mb-1">Need Help?</h4>
            <p className="text-xs text-gray-500">Contact support available 24/7.</p>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default EventRegistration;