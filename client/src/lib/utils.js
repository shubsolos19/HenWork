import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistanceToNow, isPast } from 'date-fns';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatDate(date) {
  if (!date) return '—';
  
  // If it's a date string (like YYYY-MM-DD or ISO), extract parts directly to avoid timezone shifting
  if (typeof date === 'string') {
    const datePart = date.split('T')[0];
    if (/^\d{4}-\d{2}-\d{2}$/.test(datePart)) {
      const [y, m, d] = datePart.split('-');
      return `${d}-${m}-${y}`;
    }
  }
  
  return format(new Date(date), 'dd-MM-yyyy');
}

export function formatRelative(date) {
  if (!date) return '';
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function isOverdue(dueDate) {
  if (!dueDate) return false;
  return isPast(new Date(dueDate));
}

export function getInitials(firstName, lastName) {
  const f = firstName?.[0] || '';
  const l = lastName?.[0] || '';
  return (f + l).toUpperCase() || '?';
}

export function getStatusColor(status) {
  switch (status) {
    case 'todo': return 'bg-text-muted/20 text-text-secondary';
    case 'in_progress': return 'bg-warning-muted text-warning';
    case 'completed': return 'bg-success-muted text-success';
    default: return 'bg-text-muted/20 text-text-secondary';
  }
}

export function getPriorityColor(priority) {
  switch (priority) {
    case 'high': return 'bg-destructive-muted text-destructive';
    case 'medium': return 'bg-warning-muted text-warning';
    case 'low': return 'bg-primary-muted text-primary';
    default: return 'bg-text-muted/20 text-text-secondary';
  }
}

export function getStatusLabel(status) {
  switch (status) {
    case 'todo': return 'To Do';
    case 'in_progress': return 'In Progress';
    case 'completed': return 'Completed';
    default: return status;
  }
}
