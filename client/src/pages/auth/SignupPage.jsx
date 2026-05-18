import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/useToast';
import { Loader2 } from 'lucide-react';
import { SocialAuth } from '@/components/auth/SocialAuth';
import { Logo } from '@/components/shared/Logo';

export default function SignupPage() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const showToast = useToast();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const update = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 8) {
      showToast({
        type: 'error',
        title: 'Validation Error',
        message: 'Password must be at least 8 characters',
        duration: 4000
      });
      return;
    }
    setLoading(true);
    try {
      const data = await signUp({ ...form, redirectTo: `${window.location.origin}/dashboard` });

      if (data?.session) {
        showToast({
          type: 'success',
          title: 'Account Created',
          message: 'Account created! Welcome to Henwork.'
        });
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 100);
      } else {
        showToast({
          type: 'success',
          title: 'Signup Successful',
          message: 'Please check your email to verify your account.'
        });
        setTimeout(() => {
          navigate('/signup-success');
        }, 100);
      }
    } catch (err) {
      showToast({
        type: 'error',
        title: 'Signup Failed',
        message: err.message || 'Signup failed',
        duration: 4000
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-[#fdfaf6] font-sans text-[#1a1a1a] bg-cover bg-no-repeat bg-[center_top] will-change-[background-image]"
      style={{ backgroundImage: "url('/dbg3.png')" }}
    >
      <div className="relative z-10 flex min-h-screen flex-col">
        <header className="absolute top-0 inset-x-0 z-20 mx-auto flex w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 py-4 sm:py-5 lg:py-6">
          <Link to="/" className="flex items-center gap-2.5">
            <Logo className="h-8 w-8 sm:h-9 sm:w-9 lg:h-11 lg:w-11 shrink-0" />
            <img src="/woodhw.png" alt="HenWork" className="h-7 sm:h-8 lg:h-9 object-contain" />
          </Link>
        </header>
        <main className="flex flex-1 items-center justify-center px-4 pt-20 pb-8 sm:py-0">
          <div className="w-full max-w-[340px] sm:max-w-md rounded-2xl border-none bg-white/85 p-5 sm:p-8 shadow-xl backdrop-blur">
            <h1 className="font-serif text-3xl sm:text-4xl text-[#1a1a1a]">Create your account</h1>
            <p className="mt-1.5 text-xs sm:text-sm text-[#1a1a1a]/70">Start organizing work in minutes.</p>

            <form onSubmit={handleSubmit} className="mt-5 sm:mt-6 space-y-3.5 sm:space-y-4">
              <div className="grid grid-cols-2 gap-3.5">
                <label className="block">
                  <span className="mb-1 block sm:mb-1.5 text-xs sm:text-sm font-medium text-[#1a1a1a]/80">First name</span>
                  <input
                    required
                    value={form.firstName}
                    onChange={update('firstName')}
                    placeholder="Jane"
                    className="w-full rounded-md border border-[#1a1a1a]/15 bg-white px-3 py-2 sm:py-2.5 text-sm sm:text-base text-[#1a1a1a] outline-none transition focus:border-[#1a1a1a]/40 focus:ring-2 focus:ring-[#1a1a1a]/10"
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block sm:mb-1.5 text-xs sm:text-sm font-medium text-[#1a1a1a]/80">Last name</span>
                  <input
                    value={form.lastName}
                    onChange={update('lastName')}
                    placeholder="Doe"
                    className="w-full rounded-md border border-[#1a1a1a]/15 bg-white px-3 py-2 sm:py-2.5 text-sm sm:text-base text-[#1a1a1a] outline-none transition focus:border-[#1a1a1a]/40 focus:ring-2 focus:ring-[#1a1a1a]/10"
                  />
                </label>
              </div>

              <label className="block">
                <span className="mb-1 block sm:mb-1.5 text-xs sm:text-sm font-medium text-[#1a1a1a]/80">Email</span>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={update('email')}
                  placeholder="jane@example.com"
                  className="w-full rounded-md border border-[#1a1a1a]/15 bg-white px-3 py-2 sm:py-2.5 text-sm sm:text-base text-[#1a1a1a] outline-none transition focus:border-[#1a1a1a]/40 focus:ring-2 focus:ring-[#1a1a1a]/10"
                />
              </label>

              <label className="block">
                <span className="mb-1 block sm:mb-1.5 text-xs sm:text-sm font-medium text-[#1a1a1a]/80">Password</span>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={form.password}
                  onChange={update('password')}
                  placeholder="Min 8 characters"
                  className="w-full rounded-md border border-[#1a1a1a]/15 bg-white px-3 py-2 sm:py-2.5 text-sm sm:text-base text-[#1a1a1a] outline-none transition focus:border-[#1a1a1a]/40 focus:ring-2 focus:ring-[#1a1a1a]/10"
                />
              </label>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center rounded-md bg-[#1a1a1a] px-4 py-2 sm:py-2.5 text-sm font-medium text-[#fdfaf6] transition hover:bg-[#1a1a1a]/90 disabled:opacity-70"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                {loading ? 'Creating account...' : 'Create account'}
              </button>
            </form>

            <div className="mt-5 sm:mt-6">
              <SocialAuth />
            </div>

            <p className="mt-4 sm:mt-5 text-xs sm:text-sm text-[#1a1a1a]/70 text-center">
              Already have one?{" "}
              <Link to="/login" className="font-medium text-[#1a1a1a] underline underline-offset-4">
                Sign in
              </Link>
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
