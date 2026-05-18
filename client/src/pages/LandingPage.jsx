import { Link } from 'react-router-dom';
import heroLandscape from '@/assets/hero-landscape.jpg';
import { Logo } from '@/components/shared/Logo';
import { Layers, Kanban, Paperclip, Clock } from 'lucide-react';

export default function LandingPage() {
  const navLinks = ["Product", "Teams", "Pricing", "Stories", "Company"];

  const features = [
    {
      name: 'Siloed Organizations',
      description: 'Separate your different businesses, agencies, or side projects into beautiful, distinct organization workspaces.',
      icon: Layers,
    },
    {
      name: 'Serene Workflows',
      description: 'Track progress across simple columns. Clear, high-res visual indicators let you see priorities at a glance without clutter.',
      icon: Kanban,
    },
    {
      name: 'Rich Task Context',
      description: 'Attach documents and images up to 25MB, upload in real time, and download assets directly from task detail views.',
      icon: Paperclip,
    },
    {
      name: 'Overdue Tracking',
      description: 'Never miss a due date. Intelligent time-tracking highlights overdue tasks instantly to help you maintain momentum.',
      icon: Clock,
    },
  ];

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
            <h1 className="font-serif text-5xl leading-[1.05] text-[#1a1a1a] sm:text-6xl md:text-7xl animate-fade-in">
              Team work, finally
              <br />
              at a calmer pace.
            </h1>
            <p className="mx-auto mt-8 max-w-xl text-lg leading-relaxed text-[#1a1a1a]/80 animate-fade-in" style={{ animationDelay: '100ms' }}>
              Organize your team, projects, and tasks in one beautiful workspace
              <br className="hidden sm:block" /> built for clarity, not clutter.
            </p>
            <div className="mt-10 flex justify-center animate-fade-in" style={{ animationDelay: '200ms' }}>
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

      {/* Features Section */}
      <section className="relative bg-gradient-to-b from-[#fdfaf6] via-[#faf5ec] to-[#f5e9d9] py-24 sm:py-32 border-t border-[#1a1a1a]/5 overflow-hidden">
        {/* Serene ambient glows matching the wallpaper's warm sunset colors */}
        <div className="absolute top-1/4 left-[10%] w-96 h-96 bg-[#f4a261]/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-[10%] w-96 h-96 bg-[#e76f51]/4 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-xs font-semibold leading-7 text-[#1a1a1a]/60 uppercase tracking-widest">
              Calmly Organized
            </h2>
            <p className="mt-4 font-serif text-4xl leading-tight text-[#1a1a1a] sm:text-5xl">
              Everything you need,<br className="sm:hidden" /> nothing you don't.
            </p>
            <p className="mt-6 text-base sm:text-lg leading-relaxed text-[#1a1a1a]/70">
              No noise. No distraction. Just clear task management built to help your team build momentum at a calmer pace.
            </p>
          </div>
          
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
              {features.map((feature) => (
                <div key={feature.name} className="flex flex-col items-start p-6 rounded-2xl transition-all duration-300 bg-white/60 backdrop-blur-sm hover:bg-white/95 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-md border border-[#1a1a1a]/5 group">
                  <div className="rounded-lg bg-[#1a1a1a] p-3 text-white transition-transform duration-300 group-hover:scale-110">
                    <feature.icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <dt className="mt-6 font-serif text-xl font-medium text-[#1a1a1a]">
                    {feature.name}
                  </dt>
                  <dd className="mt-2 text-sm leading-relaxed text-[#1a1a1a]/65">
                    {feature.description}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

    </div>
  );
}
