import { Link } from 'react-router-dom';
import heroLandscape from '@/assets/hero-landscape.jpg';
import { Logo } from '@/components/shared/Logo';

export default function LandingPage() {
  const navLinks = ["Product", "Teams", "Pricing", "Stories", "Company"];

  return (
    <div className="min-h-screen bg-[#fdfaf6] font-sans text-[#1a1a1a]">
      <div className="relative overflow-hidden">
        <img
          src={heroLandscape}
          alt=""
          width={1920}
          height={1080}
          className="pointer-events-none absolute inset-x-0 bottom-0 w-full select-none lg:bottom-auto lg:top-0 h-full lg:h-auto object-cover"
          aria-hidden
        />

        <div className="relative z-10">
          <header className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:px-6 sm:py-5 lg:grid lg:grid-cols-3">
            <Link to="/" className="flex items-center gap-2.5 lg:justify-self-start">
              <Logo className="h-8 w-8 sm:h-9 sm:w-9 shrink-0" />
              <img src="/woodhw.png" alt="HenWork" className="h-7 sm:h-8 object-contain" />
            </Link>
            <nav className="hidden items-center gap-7 text-sm font-medium text-[#1a1a1a]/85 lg:flex lg:justify-self-center">
              {navLinks.map((l) => (
                <a key={l} href="#" className="transition hover:text-[#1a1a1a]">
                  {l}
                </a>
              ))}
            </nav>
            <div className="flex shrink-0 items-center gap-2 lg:justify-self-end">
              <Link
                to="/login"
                className="whitespace-nowrap rounded-md border border-[#1a1a1a]/15 bg-white/70 px-3 py-1.5 text-xs font-medium text-[#1a1a1a] transition hover:bg-white sm:px-4 sm:py-2 sm:text-sm"
              >
                Sign in
              </Link>
              <Link
                to="/signup"
                className="whitespace-nowrap rounded-md bg-[#1a1a1a] px-3 py-1.5 text-xs font-medium text-[#fdfaf6] transition hover:bg-[#1a1a1a]/90 sm:px-4 sm:py-2 sm:text-sm"
              >
                Get started
              </Link>
            </div>
          </header>

          <section className="mx-auto max-w-5xl px-6 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] text-center">
            <h1 className="font-serif text-5xl leading-[1.05] text-[#1a1a1a] sm:text-6xl md:text-7xl">
              Team work, finally
              <br />
              at a calmer pace.
            </h1>
            <p className="mx-auto mt-8 max-w-xl text-lg leading-relaxed text-[#1a1a1a]/80">
              Organize your team, projects, and tasks in one beautiful workspace
              <br className="hidden sm:block" /> built for clarity, not clutter.
            </p>
            <div className="mt-10 flex justify-center">
              <Link
                to="/signup"
                className="rounded-md bg-[#1a1a1a] px-8 py-3.5 text-base font-medium text-[#fdfaf6] shadow-lg transition hover:-translate-y-0.5"
              >
                Create your workspace
              </Link>
            </div>
          </section>
        </div>
      </div>

    </div>
  );
}
