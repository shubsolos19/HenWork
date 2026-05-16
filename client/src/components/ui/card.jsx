import { cn } from '@/lib/utils';

export function Card({ className, ...props }) {
  return <div className={cn('glass p-6 transition-all duration-200', className)} {...props} />;
}

export function CardHeader({ className, ...props }) {
  return <div className={cn('mb-4', className)} {...props} />;
}

export function CardTitle({ className, ...props }) {
  return <h3 className={cn('text-lg font-semibold text-text', className)} {...props} />;
}

export function CardDescription({ className, ...props }) {
  return <p className={cn('text-sm text-text-secondary', className)} {...props} />;
}

export function CardContent({ className, ...props }) {
  return <div className={cn('', className)} {...props} />;
}
