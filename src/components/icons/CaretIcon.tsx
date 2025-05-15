import React from 'react';

interface CaretIconProps {
  className?: string;
  size?: number;
}

export const CaretIcon: React.FC<CaretIconProps> = ({ className = "", size = 16 }) => {
  return (
    <svg 
      width={size} 
      height={size * 1.2} // Maintain aspect ratio
      viewBox="0 0 200 240" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
    >
      <defs>
        <linearGradient id="greenGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: '#348934', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#4a9d4a', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <g transform="translate(10, 10)">
        {/* Left stroke */}
        <path 
          d="M90,20 C88,25 85,35 80,60 C75,85 70,120 60,160 C50,200 40,220 30,220" 
          fill="none" 
          stroke="url(#greenGradient)" 
          strokeWidth="12" 
          strokeLinecap="round" 
        />
        {/* Right stroke going downward */}
        <path 
          d="M62,150 C68,160 75,170 85,180 C95,190 105,200 115,210" 
          fill="none" 
          stroke="url(#greenGradient)" 
          strokeWidth="12" 
          strokeLinecap="round" 
        />
      </g>
    </svg>
  );
};
