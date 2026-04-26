import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login as storeLogin } from '../store/authSlice';
import Logo from '../components/ui/Logo';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Eye, EyeOff, Building2 } from 'lucide-react';
import { login } from '../features/auth';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({ usernameoremail: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    setError('');

    try {
      setLoading(true)
      const res = await login(form)

      dispatch(storeLogin({
        user: res.data.user,
        role: res.data.user.role.toLowerCase(),
      }))

      navigate(res.data.user.role.toLowerCase() === 'organizer' ? '/organizer' : '/dashboard');
    } catch (error) {
      setError(error.message)
      setLoading(false)
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5fb] flex flex-col">
      {/* Logo top-left */}
      <div className="px-8 py-5">
        <Logo />
      </div>

      {/* Centered card */}
      <div className="flex-1 flex items-center justify-center px-4 pb-10">
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="text-center mb-7">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome back</h1>
            <p className="text-sm text-gray-500">Continue your academic journey.</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              id="usernameoremail"
              label="Username or Email"
              type="text"
              placeholder="example@domain.com"
              value={form.usernameoremail}
              onChange={handleChange}
              required
            />

            <Input
              id="password"
              label="Password"
              type={showPass ? 'text' : 'password'}
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
            />

            <div className="flex justify-end -mt-2">
              <a href="#" className="text-xs text-indigo-600 hover:underline">Forgot password?</a>
            </div>

            {error && <p className="text-sm text-red-500 text-center">{error}</p>}

            <Button type="submit" variant="primary" size="lg" disabled={loading} fullWidth>
              {loading ? 'Logging in...' : 'Login'}
            </Button>

            <p className="text-center text-sm text-gray-500">
              Don't have an account?{' '}
              <Link to="/register" className="text-indigo-600 font-medium hover:underline">Join Now</Link>
            </p>
          </form>

          {/* SSO */}
          <div className="mt-5 pt-5 border-t border-gray-100">
            <button className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
              <Building2 size={16} className="text-indigo-500" />
              Sign in with University SSO
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center pb-6 text-xs text-gray-400">
        © 2026 CampusBuzz{' '}
        <a href="#" className="hover:underline">Terms</a> ·{' '}
        <a href="#" className="hover:underline">Privacy</a> ·{' '}
        <a href="#" className="hover:underline">Contact</a>
      </footer>
    </div>
  );
};

export default LoginPage;
