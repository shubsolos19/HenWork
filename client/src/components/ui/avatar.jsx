import { cn, getInitials } from '@/lib/utils';

export function Avatar({ firstName, lastName, avatarUrl, src, profilePictureUrl, size = 'md', className }) {
  const sizes = { sm: 'h-7 w-7 text-xs', md: 'h-9 w-9 text-sm', lg: 'h-11 w-11 text-base', xl: 'h-16 w-16 text-2xl', '2xl': 'h-24 w-24 text-3xl' };
  const finalSrc = src || profilePictureUrl || avatarUrl;

  if (finalSrc) {
    return <img src={finalSrc} alt="" className={cn('rounded-full object-cover', sizes[size], className)} />;
  }

  return (
    <div className={cn(
      'rounded-full bg-primary/20 text-primary flex items-center justify-center font-medium',
      sizes[size], className
    )}>
      {getInitials(firstName, lastName)}
    </div>
  );
}
