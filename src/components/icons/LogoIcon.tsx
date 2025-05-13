import React from 'react';

interface LogoIconProps {
  className?: string;
  size?: number;
}

export const LogoIcon: React.FC<LogoIconProps> = ({ className = "", size = 24 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 64 64" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* The SVG content will use currentColor for stroke to match theme */}
      <circle cx="32" cy="32" r="32" className="fill-primary" />
      
      {/* Atomic Orbital (Simplified for small size) */}
      <ellipse cx="32" cy="32" rx="28" ry="10" fill="none" stroke="currentColor" strokeWidth="3" transform="rotate(30 32 32)" />
      <ellipse cx="32" cy="32" rx="28" ry="10" fill="none" stroke="currentColor" strokeWidth="3" transform="rotate(-30 32 32)" />
      <ellipse cx="32" cy="32" rx="28" ry="10" fill="none" stroke="currentColor" strokeWidth="3" transform="rotate(90 32 32)" />
      
      {/* Nucleus */}
      <circle cx="32" cy="32" r="10" className="fill-background" />
    </svg>
  );
};

export default LogoIcon;