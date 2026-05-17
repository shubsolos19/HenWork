import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Calendar } from 'lucide-react';
import { formatDate, isOverdue, getPriorityColor, cn } from '@/lib/utils';

export function TaskCard({ task, projectId, orgId }) {
  return (
    <Link to={`/task/${task.id}?projectId=${projectId}&orgId=${orgId}`}>
      <Card className="glass bg-[#000000]/55 hover:bg-[#000000]/65 hover:border-border-bright transition-all duration-200 cursor-pointer group">
        <CardContent className="p-4">
          <p className="text-sm font-medium text-text group-hover:text-primary transition-colors line-clamp-2">
            {task.title}
          </p>
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-2">
              <Badge className={cn('text-[10px] capitalize', getPriorityColor(task.priority))}>
                {task.priority}
              </Badge>
              {task.due_date && (
                <span className={cn(
                  'text-[10px] flex items-center gap-1',
                  isOverdue(task.due_date) && task.status !== 'completed' ? 'text-destructive' : 'text-white'
                )}>
                  <Calendar className="h-3 w-3 text-white" /> {formatDate(task.due_date)}
                </span>
              )}
            </div>

            {/* Assignees */}
            {task.assignees?.length > 0 && (
              <div className="flex -space-x-2 overflow-hidden">
                {task.assignees.slice(0, 3).map((asgn) => (
                  <Avatar
                    key={asgn.id}
                    src={asgn.avatar_url}
                    firstName={asgn.first_name}
                    lastName={asgn.last_name}
                    size="sm"
                    className="h-6 w-6 border-2 border-surface shrink-0"
                  />
                ))}
                {task.assignees.length > 3 && (
                  <div className="h-6 w-6 rounded-full bg-surface-hover border-2 border-surface flex items-center justify-center text-[8px] font-bold text-white shrink-0">
                    +{task.assignees.length - 3}
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
