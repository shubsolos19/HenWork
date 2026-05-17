import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import heroLandscape from '@/assets/dbg3.png';
import { SocialAuth } from '@/components/auth/SocialAuth';
import { Logo } from '@/components/shared/Logo';

export default function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn({ email, password });
      toast.success('Logged in successfully');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message || 'Invalid credentials', { duration: 4000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-[#fdfaf6] font-sans text-[#1a1a1a] bg-cover bg-no-repeat bg-[center_top] will-change-[background-image]"
      style={{ backgroundImage: `url(${heroLandscape})` }}
    >
      <div className="relative z-10 flex min-h-screen flex-col">
        <header className="absolute top-0 inset-x-0 z-20 mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-5">
          <Link to="/" className="flex items-center gap-2.5">
            <Logo className="h-9 w-9 shrink-0" />
            <img src="/woodhw.png" alt="HenWork" className="h-8 object-contain" />
          </Link>
        </header>
        <main className="flex flex-1 items-center justify-center px-6">
          <div className="w-full max-w-md rounded-2xl border-none bg-white/85 p-8 shadow-xl backdrop-blur">
            <h1 className="font-serif text-4xl text-[#1a1a1a]">Welcome back</h1>
            <p className="mt-2 text-sm text-[#1a1a1a]/70">Sign in to your workspace.</p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-[#1a1a1a]/80">Email</span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-md border border-[#1a1a1a]/15 bg-white px-3 py-2.5 text-[#1a1a1a] outline-none transition focus:border-[#1a1a1a]/40 focus:ring-2 focus:ring-[#1a1a1a]/10"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-[#1a1a1a]/80">Password</span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-md border border-[#1a1a1a]/15 bg-white px-3 py-2.5 text-[#1a1a1a] outline-none transition focus:border-[#1a1a1a]/40 focus:ring-2 focus:ring-[#1a1a1a]/10"
                />
              </label>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center rounded-md bg-[#1a1a1a] px-5 py-2.5 text-sm font-medium text-[#fdfaf6] transition hover:bg-[#1a1a1a]/90 disabled:opacity-70"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>

            <div className="mt-6">
              <SocialAuth />
            </div>

            <p className="mt-5 text-sm text-[#1a1a1a]/70 text-center">
              New here?{" "}
              <Link to="/signup" className="font-medium text-[#1a1a1a] underline underline-offset-4">
                Create an account
              </Link>
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
