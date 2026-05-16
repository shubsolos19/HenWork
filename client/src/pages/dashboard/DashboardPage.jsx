import { Link } from 'react-router-dom';
import { useDashboardStats, useRecentTasks } from '@/hooks/useDashboard';
import { useOrganizations } from '@/hooks/useOrganizations';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/shared/EmptyState';
import { StatsSkeleton, ListSkeleton, CardSkeleton } from '@/components/shared/LoadingSkeleton';
import { getStatusLabel, getStatusColor, getPriorityColor, formatDate, isOverdue } from '@/lib/utils';
import {
  ListTodo, Clock, CheckCircle2, AlertTriangle, Building2, Plus, ArrowRight
} from 'lucide-react';
import wallpaperVideo from '@/assets/dbgg.mp4';

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: recentTasks, isLoading: tasksLoading } = useRecentTasks(8);
  const { data: orgs, isLoading: orgsLoading } = useOrganizations();

  const statCards = [
    { label: 'Total Tasks', value: stats?.totalTasks ?? 0, icon: ListTodo, color: 'text-[#a78bfa]', bg: 'bg-[#7c3aed]/20' },
    { label: 'In Progress', value: stats?.inProgress ?? 0, icon: Clock, color: 'text-[#fbbf24]', bg: 'bg-[#f59e0b]/20' },
    { label: 'Completed', value: stats?.completed ?? 0, icon: CheckCircle2, color: 'text-[#34d399]', bg: 'bg-[#10b981]/20' },
    { label: 'Overdue', value: stats?.overdue ?? 0, icon: AlertTriangle, color: 'text-[#f87171]', bg: 'bg-[#ef4444]/20' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 -mt-2">
      <div className="flex flex-col gap-0.5">
        <h1 className="text-xl font-bold tracking-tight text-white">Dashboard</h1>
        <p className="text-white text-[10px] font-medium">Overview of your tasks and organizations</p>
      </div>

      {/* Stats Grid */}
      {statsLoading ? <StatsSkeleton /> : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {statCards.map((s) => (
            <div key={s.label} className="glass group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 p-3 min-h-[75px] flex items-center">
              <div className="absolute top-0 right-0 -mt-4 -mr-4 h-16 w-16 rounded-full bg-white/5 blur-xl group-hover:bg-white/10 transition-colors" />
              <div className="flex items-center gap-2.5 relative z-10 w-full">
                <div className={`h-8 w-8 rounded-lg ${s.bg} flex items-center justify-center shadow-lg border border-white/5 shrink-0`}>
                  <s.icon className={`h-4 w-4 ${s.color}`} />
                </div>
                <div className="min-w-0">
                  <p className="text-[8px] text-white font-bold uppercase tracking-[0.1em] truncate">{s.label}</p>
                  <p className="text-lg font-bold text-white mt-0.5">{s.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Tasks */}
        <div className="lg:col-span-2">
          <div className="glass p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-[#7c3aed] shadow-[0_0_8px_#7c3aed]" />
                Recent Tasks
              </h2>
            </div>
            {tasksLoading ? <ListSkeleton rows={5} /> : !recentTasks?.length ? (
              <EmptyState icon={ListTodo} title="No tasks yet" description="Create a project and start adding tasks" />
            ) : (
              <div className="space-y-3">
                {recentTasks.map((task) => (
                  <Link key={task.id} to={`/task/${task.id}?projectId=${task.project_id}`}
                    className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/20 hover:bg-white/[0.06] transition-all duration-300 group">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate group-hover:text-[#a78bfa] transition-colors">
                        {task.title}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <Badge variant={task.status === 'completed' ? 'success' : task.status === 'in_progress' ? 'warning' : 'outline'}
                          className="text-[10px] uppercase tracking-tighter px-2 py-0 border-none bg-[#7c3aed]/20 text-[#a78bfa]">
                          {getStatusLabel(task.status)}
                        </Badge>
                        {isOverdue(task.due_date) && task.status !== 'completed' && (
                          <span className="text-[10px] text-red-400 font-bold uppercase tracking-wide flex items-center gap-1">
                            <span className="h-1 w-1 rounded-full bg-red-400 animate-pulse" />
                            Overdue
                          </span>
                        )}
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-white group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Organizations */}
        <div>
          <div className="glass p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-[#10b981] shadow-[0_0_8px_#10b981]" />
                Organizations
              </h2>
              <Link to="/org/new" className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-[#7c3aed] hover:text-white transition-all">
                <Plus className="h-5 w-5" />
              </Link>
            </div>
            {orgsLoading ? <ListSkeleton rows={3} /> : !orgs?.length ? (
              <EmptyState icon={Building2} title="No organizations" description="Create your first team" actionLabel="Create Organization"
                onAction={() => window.location.href = '/org/new'} />
            ) : (
              <div className="space-y-3">
                {orgs.map((org) => (
                  <Link key={org.id} to={`/org/${org.id}`}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/20 hover:bg-white/[0.06] transition-all duration-300 group">
                    <div className="h-12 w-12 rounded-xl bg-[#7c3aed]/10 flex items-center justify-center border border-white/5 shadow-inner">
                      <Building2 className="h-6 w-6 text-[#a78bfa]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate group-hover:text-[#a78bfa] transition-colors">{org.name}</p>
                      <p className="text-[11px] text-white uppercase font-bold tracking-tight mt-0.5">{org.userRole}</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-white group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
