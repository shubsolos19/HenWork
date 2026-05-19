import { Link } from 'react-router-dom';
import heroLandscape from '@/assets/hero-landscape.jpg';
import { Logo } from '@/components/shared/Logo';
import { Layers, Kanban, Paperclip, Clock } from 'lucide-react';
import NoiseCard from '@/components/ui/noise-card';
import LoveReact from '@/components/ui/LoveReact';
import { Highlighter } from "@/components/ui/highlighter";

export default function LandingPage() {
  const navLinks = ["Product", "Teams", "Pricing", "Stories", "Company"];

  const features = [
    {
      name: 'Siloed Organizations',
      description: 'Separate your different businesses, agencies, or side projects into beautiful, distinct organization workspaces.',
      icon: Layers,
      bgColor: 'bg-[#2c4e3f]', // Sage Foliage / Meadow Grass Green
      textColor: '#2c4e3f',
      buttonText: 'Wanna See!',
    },
    {
      name: 'Serene Workflows',
      description: 'Track progress across simple columns. Clear, high-res visual indicators let you see priorities at a glance without clutter.',
      icon: Kanban,
      bgColor: 'bg-[#50136cff]', // Crimson Sunset Sky
      textColor: '#50136cff',
      buttonText: "Let's Go!",
    },
    {
      name: 'Rich Task Context',
      description: 'Attach documents and images up to 25MB, upload in real time, and download assets directly from task detail views.',
      icon: Paperclip,
      bgColor: 'bg-[#7b4312ff]', // Golden Wheat Field
      textColor: '#7b4312ff',
      buttonText: 'Jump In',
    },
    {
      name: 'Overdue Tracking',
      description: 'Never miss a due date. Intelligent time-tracking highlights overdue tasks instantly to help you maintain momentum.',
      icon: Clock,
      bgColor: 'bg-[#065668]', // Earthy Clay / Soil
      textColor: '#065668',
      buttonText: 'See the Magic',
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
          <header className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8 py-4 sm:py-5 lg:py-6 lg:grid lg:grid-cols-3">
            <Link to="/" className="flex items-center gap-2.5 lg:justify-self-start">
              <Logo className="h-8 w-8 sm:h-9 sm:w-9 lg:h-11 lg:w-11 shrink-0" />
              <img src="/woodhw.png" alt="HenWork" className="h-7 sm:h-8 lg:h-9 object-contain" />
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
              at a calmer pace
            </h1>
            <p className="mx-auto mt-8 max-w-xl text-lg leading-relaxed text-[#1a1a1a]/80 animate-fade-in" style={{ animationDelay: '100ms' }}>
              Organize your team, projects, and tasks in one beautiful workspace
              <br className="hidden sm:block" /> built for clarity, not clutter
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
      <section className="relative bg-gradient-to-b from-[#fdfaf6] via-[#faf5ec] to-[#f5e9d9] pt-10 pb-24 sm:pt-14 sm:pb-32 border-t border-[#1a1a1a]/5 overflow-hidden">
        {/* Serene ambient glows matching the wallpaper's warm sunset colors */}
        <div className="absolute top-1/4 left-[10%] w-96 h-96 bg-[#f4a261]/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-[10%] w-96 h-96 bg-[#e76f51]/4 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center flex flex-col items-center justify-center">
            <div className="mb-2 flex items-center justify-center gap-4">
              <LoveReact size={40} color="rgb(255, 91, 137)" />
              <LoveReact size={56} color="rgb(34, 197, 94)" />
              <LoveReact size={40} color="rgb(139, 92, 246)" />
            </div>
            <p className="mt-4 font-serif text-4xl leading-tight text-[#1a1a1a] sm:text-5xl">
              Everything you need,<br className="sm:hidden" /> nothing you don't.
            </p>
            <p className="mt-6 text-base sm:text-lg leading-relaxed text-[#1a1a1a]/70">
              No noise.{" "}
              <Highlighter action="highlight" color="#fef08a" isView={true} padding={4} animationDuration={600}>
                No distraction.
              </Highlighter>{" "}
              Just clear task management built to help your{" "}
              <Highlighter action="highlight" color="#fbcfe8" isView={true} padding={4} animationDuration={600}>
                team build
              </Highlighter>{" "}
              momentum at a{" "}
              <Highlighter action="underline" color="#2c4e3f" strokeWidth={2} isView={true} padding={2} delay={650} animationDuration={600}>
                calmer pace.
              </Highlighter>
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <div className="grid max-w-xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-4">
              {features.map((feature) => (
                <NoiseCard
                  key={feature.name}
                  width="w-full"
                  className="shadow-2xl flex flex-col hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.15)] border border-[#1a1a1a]/5"
                  animated={false}
                  noiseOpacity={0.12}
                  grainSize={1}
                  bgColor={feature.bgColor}
                >
                  <div className="flex-grow">
                    <div className="rounded-lg bg-white/10 p-2.5 text-white/95 w-fit mb-4">
                      <feature.icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3 text-white font-serif">{feature.name}</h3>
                    <p className="text-gray-200/90 leading-relaxed text-sm">
                      {feature.description}
                    </p>
                  </div>
                  <Link
                    to="/signup"
                    className="mt-6 w-full text-center px-6 py-3 bg-white font-semibold rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white text-sm"
                    style={{ color: feature.textColor }}
                  >
                    {feature.buttonText}
                  </Link>
                </NoiseCard>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="py-6 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-[#000000] text-white text-center">
        {/* Subtle warm ambient glow matching footer landscape */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(255,255,255,0.06),transparent_70%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto flex flex-col items-center justify-center text-center w-full relative z-10">
          <div className="mb-4 flex items-center justify-center gap-4">
            <img
              src="/easter-eggs.png"
              alt="HenWork Icon"
              className="h-10 w-10 object-contain drop-shadow-md select-none pointer-events-none"
            />
            <img
              src="/woodhw.png"
              alt="HenWork"
              className="h-9 object-contain drop-shadow-md select-none pointer-events-none"
            />
          </div>

          <nav className="mb-4 w-full">
            <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-medium">
              {[
                { name: "Features", href: "#" },
                { name: "Solution", href: "#" },
                { name: "Customers", href: "#" },
                { name: "Pricing", href: "#" },
                { name: "Help", href: "#" },
                { name: "About", href: "#" },
              ].map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-white/80 hover:text-white transition-all duration-300 relative after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-0 after:bg-white after:transition-all after:duration-300 hover:after:w-full"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="my-4 flex flex-wrap justify-center gap-6 text-sm">
            {[
              {
                name: "X",
                href: "#",
                svg: (
                  <svg
                    className="w-5 h-5 transition-transform duration-200 hover:scale-110"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M10.488 14.651L15.25 21h7l-7.858-10.478L20.93 3h-2.65l-5.117 5.886L8.75 3h-7l7.51 10.015L2.32 21h2.65zM16.25 19L5.75 5h2l10.5 14z"
                    ></path>
                  </svg>
                ),
              },
              {
                name: "LinkedIn",
                href: "#",
                svg: (
                  <svg
                    className="w-5 h-5 transition-transform duration-200 hover:scale-110"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93zM6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37z"
                    ></path>
                  </svg>
                ),
              },
              {
                name: "Facebook",
                href: "#",
                svg: (
                  <svg
                    className="w-5 h-5 transition-transform duration-200 hover:scale-110"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95"
                    ></path>
                  </svg>
                ),
              },
              {
                name: "Threads",
                href: "#",
                svg: (
                  <svg
                    className="w-5 h-5 transition-transform duration-200 hover:scale-110"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M19.25 8.505c-1.577-5.867-7-5.5-7-5.5s-7.5-.5-7.5 8.995s7.5 8.996 7.5 8.996s4.458.296 6.5-3.918c.667-1.858.5-5.573-6-5.573c0 0-3 0-3 2.5c0 .976 1 2 2.5 2s3.171-1.027 3.5-3c1-6-4.5-6.5-6-4"
                    ></path>
                  </svg>
                ),
              },
              {
                name: "Instagram",
                href: "#",
                svg: (
                  <svg
                    className="w-5 h-5 transition-transform duration-200 hover:scale-110"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4zm9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8A1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5a5 5 0 0 1-5 5a5 5 0 0 1-5-5a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3"
                    ></path>
                  </svg>
                ),
              },
              {
                name: "TikTok",
                href: "#",
                svg: (
                  <svg
                    className="w-5 h-5 transition-transform duration-200 hover:scale-110"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M16.6 5.82s.51.5 0 0A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6c0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64c0 3.33 2.76 5.7 5.69 5.7c3.14 0 5.69-2.55 5.69-5.7V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3s-1.88.09-3.24-1.48"
                    ></path>
                  </svg>
                ),
              },
            ].map((icon) => (
              <a
                key={icon.name}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={icon.name}
                className="text-white/70 hover:text-white transition-colors duration-300"
                href={icon.href}
              >
                {icon.svg}
              </a>
            ))}
          </div>

          <p className="text-center text-xs text-white/60 mt-2">
            &copy; {new Date().getFullYear()} HenWork. All rights reserved.
          </p>
        </div>
      </footer>

    </div>
  );
}
