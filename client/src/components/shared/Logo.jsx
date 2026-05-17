export function Logo({ className = "h-8 w-8", ...props }) {
  return (
    <img 
      src="/easter-eggs.png" 
      alt="HenWork Logo" 
      className={className} 
      {...props} 
    />
  );
}
