import React from 'react';

interface CaretIcon2Props {
  className?: string;
  size?: number;
}

export const CaretIcon2: React.FC<CaretIcon2Props> = ({ className = "", size = 16 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
    >
      <path
        d="M12 4L6 20l6-4 6 4L12 4z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  );
};
