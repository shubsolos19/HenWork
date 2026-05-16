import { useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useTasks, useCreateTask, useUpdateTask } from '@/hooks/useTasks';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/shared/EmptyState';
import { ListSkeleton } from '@/components/shared/LoadingSkeleton';
import { getStatusLabel, getPriorityColor, formatDate, isOverdue, cn } from '@/lib/utils';
import {
  ArrowLeft, Plus, X, Loader2, ListTodo, LayoutGrid,
  ArrowRight, Calendar, AlertCircle
} from 'lucide-react';
import { TaskCard } from '@/components/tasks/TaskCard';

function TaskFilters({ filters, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      <select value={filters.status || ''} onChange={(e) => onChange({ ...filters, status: e.target.value || undefined })}
        className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-text focus:border-primary focus:outline-none">
        <option value="">All Statuses</option>
        <option value="todo">To Do</option>
        <option value="in_progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>
      <select value={filters.priority || ''} onChange={(e) => onChange({ ...filters, priority: e.target.value || undefined })}
        className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-text focus:border-primary focus:outline-none">
        <option value="">All Priorities</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>
    </div>
  );
}

function KanbanColumn({ title, tasks, projectId, color, orgId }) {
  return (
    <div className="flex-1 min-w-[280px]">
      <div className="flex items-center gap-2 mb-3 px-1">
        <div className={`h-2 w-2 rounded-full ${color}`} />
        <h3 className="text-sm font-medium text-text">{title}</h3>
        <span className="text-xs text-white ml-auto">{tasks.length}</span>
      </div>
      <div className="space-y-2">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} projectId={projectId} orgId={orgId} />
        ))}
        {!tasks.length && (
          <div className="glass flex flex-col items-center justify-center py-6 text-center border-dashed text-white">
            No tasks
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProjectPage() {
  const { projectId } = useParams();
  const [searchParams] = useSearchParams();
  const orgId = searchParams.get('orgId');
  const [filters, setFilters] = useState({});
  const [view, setView] = useState('board');
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: 'todo',
    dueDate: new Date().toLocaleDateString('en-CA')
  });
  const { data: tasks, isLoading } = useTasks(projectId, filters);
  const createTask = useCreateTask(projectId);
  const updateTask = useUpdateTask(projectId);

  const upd = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createTask.mutateAsync({
        title: form.title,
        description: form.description || undefined,
        priority: form.priority,
        dueDate: form.dueDate || undefined,
      });
      toast.success('Task created successfully');
      setShowCreate(false);
      setForm({
        title: '',
        description: '',
        priority: 'medium',
        status: 'todo',
        dueDate: new Date().toLocaleDateString('en-CA')
      });
    } catch (err) {
      toast.error(err.message || 'Failed to create task', { duration: 4000 });
    }
  };

  const todo = (tasks || []).filter((t) => t.status === 'todo');
  const inProgress = (tasks || []).filter((t) => t.status === 'in_progress');
  const completed = (tasks || []).filter((t) => t.status === 'completed');

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        {orgId && (
          <Link to={`/org/${orgId}`} className="text-white hover:text-text transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        )}
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-text">Project Tasks</h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex border border-border rounded-lg overflow-hidden">
            <button onClick={() => setView('board')}
              className={cn('px-3 py-1.5 text-xs', view === 'board' ? 'bg-primary/10 text-primary' : 'text-white hover:bg-surface-hover')}>
              <LayoutGrid className="h-3.5 w-3.5" />
            </button>
            <button onClick={() => setView('list')}
              className={cn('px-3 py-1.5 text-xs', view === 'list' ? 'bg-primary/10 text-primary' : 'text-white hover:bg-surface-hover')}>
              <ListTodo className="h-3.5 w-3.5" />
            </button>
          </div>
          <Button size="sm" onClick={() => setShowCreate(true)}>
            <Plus className="h-4 w-4 mr-1" /> Task
          </Button>
        </div>
      </div>

      <TaskFilters filters={filters} onChange={setFilters} />

      {/* Create Task Form */}
      {showCreate && (
        <Card className="border-primary/30 animate-fade-in">
          <CardContent>
            <form onSubmit={handleCreate} className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-text">New Task</p>
                <button type="button" onClick={() => setShowCreate(false)} className="text-white hover:text-text"><X className="h-4 w-4" /></button>
              </div>
              <Input placeholder="Task title" value={form.title} onChange={upd('title')} required autoFocus />
              <textarea placeholder="Description (optional)" value={form.description} onChange={upd('description')}
                className="flex w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-text placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[60px] resize-none transition-colors" />
              <div className="flex gap-3">
                <select value={form.priority} onChange={upd('priority')}
                  className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-text focus:border-primary focus:outline-none flex-1">
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
                <Input type="date" value={form.dueDate} onChange={upd('dueDate')} className="flex-1" />
              </div>
              <Button type="submit" size="sm" disabled={createTask.isPending}>
                {createTask.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create Task'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Tasks */}
      {isLoading ? <ListSkeleton rows={6} /> : !(tasks || []).length ? (
        <EmptyState icon={ListTodo} title="No tasks yet" description="Create your first task to get started" actionLabel="Create Task" onAction={() => setShowCreate(true)} />
      ) : view === 'board' ? (
        <div className="flex gap-4 overflow-x-auto pb-4">
          <KanbanColumn title="To Do" tasks={todo} projectId={projectId} orgId={orgId} color="bg-text-secondary" />
          <KanbanColumn title="In Progress" tasks={inProgress} projectId={projectId} orgId={orgId} color="bg-warning" />
          <KanbanColumn title="Completed" tasks={completed} projectId={projectId} orgId={orgId} color="bg-success" />
        </div>
      ) : (
        <div className="space-y-2">
          {tasks.map((task) => (
            <Link key={task.id} to={`/task/${task.id}?projectId=${projectId}&orgId=${orgId}`}
              className="glass flex items-center justify-between p-3 transition-colors group">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text truncate group-hover:text-primary transition-colors">{task.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={task.status === 'completed' ? 'success' : task.status === 'in_progress' ? 'warning' : 'outline'} className="text-[10px]">
                    {getStatusLabel(task.status)}
                  </Badge>
                  <Badge className={cn('text-[10px]', getPriorityColor(task.priority))}>{task.priority}</Badge>
                  {task.due_date && (
                    <span className={cn('text-[10px]', isOverdue(task.due_date) && task.status !== 'completed' ? 'text-destructive' : 'text-white')}>
                      {formatDate(task.due_date)}
                    </span>
                  )}
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
