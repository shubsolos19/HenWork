import { cn } from '@/lib/utils';

export function Skeleton({ className, ...props }) {
  return (
    <div className={cn('animate-pulse-subtle rounded-lg bg-surface-hover', className)} {...props} />
  );
}
