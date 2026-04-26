import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../store/authSlice';
import Logo from '../components/ui/Logo';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Eye, EyeOff } from 'lucide-react';
import { register } from '../features/auth';

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [role, setRole] = useState('STUDENT');
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [form, setForm] = useState({
    fullname: '',
    email: '',
    username: '',
    password: '',
    confirm: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.id]: e.target.value }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Full name is required';
    if (!form.email.includes('@')) errs.email = 'Enter a valid email';
    if (form.username.length < 3) errs.username = 'Username too short';
    if (form.password.length < 6) errs.password = 'Password must be 6+ characters';
    // if (form.password !== form.confirm) errs.confirm = 'Passwords do not match';
    if (!agreed) errs.agreed = 'You must agree to the terms';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // const errs = validate();
    // if (Object.keys(errs).length > 0) {
    //   setErrors(errs);
    //   return;
    // }
    try {
      setLoading(true);
      const res = await register({ ...form, role });
      if (res.success) {
        setError("");
        setMessage("Your account has been created and verification link sent to your email, navigating to login");
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5fb] flex flex-col">
      {/* Navbar */}
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Logo />
          <nav className="hidden md:flex items-center gap-5">
            <Link to="/" className="text-sm text-gray-600 hover:text-gray-900">Home</Link>
            <Link to="/explore" className="text-sm text-gray-600 hover:text-gray-900">Explore Events</Link>
          </nav>
          <Link to="/login" className="text-sm text-indigo-600 font-medium hover:underline">Sign In</Link>
        </div>
      </header>


      {/* Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Create your account</h1>
            <p className="text-sm text-gray-500">Join the community and start your curated campus journey.</p>
          </div>

          {error && <p className="text-red-500 text-center p-4 text-sm">{error}</p>}
          {message && <p className="text-green-500 text-center p-4 text-sm">{message}</p>}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Role toggle */}
            <div>
              <label className="text-xs font-semibold tracking-widest text-gray-500 uppercase block mb-2">
                Identify Your Role
              </label>
              <div className="flex rounded-lg border border-gray-200 overflow-hidden">
                {['student', 'organizer'].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r.toUpperCase())}
                    className={`flex-1 py-2.5 text-sm font-medium capitalize transition-colors
                      ${role === r.toUpperCase()
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-50'
                      }
                    `}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <Input
              id="fullname"
              label="Full Name"
              placeholder="John Doe"
              value={form.fullname}
              onChange={handleChange}
              // error={errors.name}
              required
            />

            <Input
              id="email"
              label="University Email"
              type="email"
              placeholder="example@domain.com"
              value={form.email}
              onChange={handleChange}
              // error={errors.email}
              required
            />

            <Input
              id="username"
              label="Username"
              placeholder="JohnD45"
              value={form.username}
              onChange={handleChange}
              // error={errors.username}
              required
            />

            <div className="grid grid-cols-1 gap-3">
              <Input
                id="password"
                label="Password"
                type={showPass ? 'text' : 'password'}
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                // error={errors.password}
                rightElement={
                  <button type="button" onClick={() => setShowPass(!showPass)}>
                    {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                }
              />
              {/* <Input
                id="confirm"
                label="Confirm"
                type={showConfirm ? 'text' : 'password'}
                placeholder="••••••••"
                value={form.confirm}
                onChange={handleChange}
                // error={errors.confirm}
                rightElement={
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)}>
                    {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                }
              /> */}
            </div>

            {/* Terms */}
            {/* <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 accent-indigo-600"
              />
              <span className="text-sm text-gray-600">
                I agree to the{' '}
                <a href="#" className="text-indigo-600 hover:underline">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-indigo-600 hover:underline">Privacy Policy</a>.
              </span>
            </label>
            {errors.agreed && <p className="text-xs text-red-500 -mt-2">{errors.agreed}</p>} */}

            <Button disabled={loading} onClick={handleSubmit} type="submit" variant="primary" size="lg" fullWidth className="mt-1">
              {loading ? "Creating account..." : "Create account"}
            </Button>

            <p className="text-center text-sm text-gray-500">
              Already have an account?{' '}
              <Link to="/login" className="text-indigo-600 font-medium hover:underline">Login</Link>
            </p>
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Logo />
            <span className="hidden md:inline">| © 2026 CampusBuzz.</span>
          </div>
          <nav className="flex gap-5">
            {['About', 'Contact', 'Terms', 'FAQ'].map((item) => (
              <a key={item} href="#" className="text-sm text-gray-500 hover:text-gray-800">{item}</a>
            ))}
          </nav>
        </div>
      </footer>
    </div>
  );
};

export default RegisterPage;
