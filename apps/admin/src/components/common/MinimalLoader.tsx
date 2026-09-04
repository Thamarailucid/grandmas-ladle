import React from 'react';
import logoImg from '@/assets/logo.jpg';

interface MinimalLoaderProps {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
}

export function MinimalLoader({
  text = "Loading...",
  size = 'md',
  fullScreen = false
}: MinimalLoaderProps) {
  const sizeMap = {
    sm: { box: 'w-10 h-10', img: 'w-8 h-8', text: 'text-xs' },
    md: { box: 'w-16 h-16', img: 'w-12 h-12', text: 'text-sm' },
    lg: { box: 'w-24 h-24', img: 'w-20 h-20', text: 'text-base' }
  };

  const current = sizeMap[size];

  const content = (
    <div className="flex flex-col items-center justify-center gap-3 select-none py-8">
      <div className={`relative ${current.box} flex items-center justify-center`}>
        <div className="absolute inset-0 rounded-full border-2 border-[#B8925A]/30 border-t-[#2C4A3B] animate-spin" />
        <img 
          src={logoImg} 
          alt="Grandma's Ladle" 
          className={`${current.img} rounded-full object-cover shadow-sm animate-pulse`} 
        />
      </div>
      {text && (
        <span className={`tracking-wider uppercase text-[#2C4A3B] font-semibold opacity-85 ${current.text}`}>
          {text}
        </span>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return content;
}
