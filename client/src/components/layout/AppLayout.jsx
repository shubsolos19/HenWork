import { useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useOrganizations } from '@/hooks/useOrganizations';
import { useProfile } from '@/hooks/useProfile';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import {
  LayoutDashboard, Building2, Plus, LogOut, Menu, X,
  ChevronDown, FolderKanban, Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';
import wallpaperVideo from '@/assets/dbgg.mp4';
import { Logo } from '@/components/shared/Logo';

export default function AppLayout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { data: orgs } = useOrganizations();
  const { data: profile } = useProfile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const meta = user?.user_metadata || {};
  const firstName = profile?.first_name || meta.first_name || 'User';
  const lastName = profile?.last_name || meta.last_name || '';

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  ];

  return (
    <div className="flex h-screen overflow-hidden font-sans text-white relative">
      {/* Global Background Video Wallpaper */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-cover"
        >
          <source src={wallpaperVideo} type="video/mp4" />
        </video>
        {/* Subtle overlay to reduce brightness ever so slightly */}
        <div className="absolute inset-0 bg-black/25" />
      </div>

      <div className="flex flex-1 relative z-10 overflow-hidden">
        {/* ── Sidebar ────────────────────────────────── */}
        <aside className={cn(
          'fixed inset-y-0 left-0 z-40 w-64 border-r border-white/5 bg-black/40 backdrop-blur-2xl flex flex-col transition-transform duration-300 lg:static lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}>
          {/* Logo */}
          <div className="flex items-center gap-2 px-5 py-5 border-b border-white/5 bg-transparent">
            <Link to="/dashboard" className="flex items-center gap-2.5">
              <Logo className="h-7 w-7 shrink-0" />
              <img src="/woodhw.png" alt="HenWork" className="h-8 object-contain" />
            </Link>
            <button onClick={() => setSidebarOpen(false)} className="ml-auto lg:hidden text-white/50 hover:text-white">
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto p-3 space-y-1 bg-transparent">
            {navItems.map((item) => (
              <Link key={item.to} to={item.to} onClick={() => setSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                  location.pathname === item.to
                    ? 'bg-[#7c3aed]/20 text-[#a78bfa] shadow-[inset_0_0_12px_rgba(124,58,237,0.1)] border border-[#7c3aed]/20'
                    : 'text-white hover:bg-white/5'
                )}>
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}

            <div className="pt-6 pb-2 px-3 flex items-center justify-between">
              <p className="text-[10px] font-bold text-white uppercase tracking-[0.15em]">Organizations</p>
              <Link to="/org/new" onClick={() => setSidebarOpen(false)}
                className="text-white hover:opacity-85 transition-opacity"
                title="New Organization">
                <Plus className="h-4 w-4" />
              </Link>
            </div>

            {(orgs || []).map((org) => (
              <Link key={org.id} to={`/org/${org.id}`} onClick={() => setSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200',
                  location.pathname.startsWith(`/org/${org.id}`)
                    ? 'bg-[#7c3aed]/20 text-[#a78bfa] border border-[#7c3aed]/20'
                    : 'text-white hover:bg-white/5'
                )}>
                <Building2 className="h-4 w-4" />
                <span className="truncate">{org.name}</span>
              </Link>
            ))}
          </nav>

          {/* Sidebar User Avatar */}
          <div className="p-4 border-t border-white/5 mt-auto bg-transparent">
            <Link to="/profile" onClick={() => setSidebarOpen(false)} className="flex items-center gap-3 hover:bg-white/5 p-2 rounded-xl transition-all duration-200 -mx-2">
              <Avatar firstName={firstName} lastName={lastName} src={profile?.profile_picture_url} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-black truncate">{firstName} {lastName}</p>
                <p className="text-xs text-white truncate">{user?.email}</p>
              </div>
            </Link>
          </div>
        </aside>

        {/* Overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* ── Main Content ──────────────────────────── */}
        <div className="flex flex-1 flex-col overflow-hidden bg-transparent">
          {/* Header */}
          <header className="flex items-center justify-between bg-transparent px-4 py-3 lg:px-6">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-white/50 hover:text-white">
              <Menu className="h-5 w-5" />
            </button>

            <div className="flex-1" />

            {/* User menu */}
            <div className="relative">
              <button onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-white/5 transition-all duration-200">
                <Avatar firstName={firstName} lastName={lastName} src={profile?.profile_picture_url} size="sm" />
                <span className="hidden sm:block text-sm text-black font-semibold">{firstName} {lastName}</span>
                <ChevronDown className="h-3.5 w-3.5 text-white/30" />
              </button>

              {userMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 z-50 w-52 rounded-2xl border border-white/10 bg-[#1c1c24]/90 backdrop-blur-xl shadow-2xl p-1.5 animate-in fade-in zoom-in duration-200">
                    <div className="px-3 py-2.5 border-b border-white/5 mb-1.5">
                      <p className="text-sm font-semibold text-white">{firstName} {lastName}</p>
                      <p className="text-[11px] text-white/40 truncate">{user?.email}</p>
                    </div>
                    <Link to="/profile" onClick={() => setUserMenuOpen(false)}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-white/70 hover:bg-white/5 hover:text-white transition-all">
                      <Settings className="h-4 w-4" />
                      Profile Settings
                    </Link>
                    <button onClick={handleSignOut}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-red-400 hover:bg-red-400/10 transition-all">
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 overflow-y-auto p-4 lg:p-8 bg-transparent">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
