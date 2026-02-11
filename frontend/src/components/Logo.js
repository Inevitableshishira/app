import React from 'react';

const Logo = ({ className = "h-auto", color = "#000000", showText = true }) => {
  return (
    <div className={`flex flex-col items-center justify-center select-none ${className}`} style={{ color }}>
      <div className="flex flex-col items-center leading-none">
        <span className="text-2xl md:text-4xl font-normal tracking-tight">
          ApexForge
        </span>
        <span 
          className="text-[11px] md:text-[16px] font-normal tracking-[0.4em] mt-2 opacity-100"
          style={{ marginRight: '-0.4em' }}
        >
          Studio
        </span>
      </div>
    </div>
  );
};

export default Logo;