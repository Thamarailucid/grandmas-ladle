import React from 'react';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  light?: boolean;
}

export function SectionHeading({
  title,
  subtitle,
  centered = true,
  light = false,
}: SectionHeadingProps) {
  return (
    <div className={`mb-12 ${centered ? 'text-center flex flex-col items-center' : 'text-left'}`}>
      <h2 className={`font-serif text-3xl md:text-4xl uppercase tracking-wider mb-4 ${light ? 'text-warm-cream' : 'text-brand-green'}`}>
        {title}
      </h2>
      <div className={`w-16 h-0.5 bg-antique-brass mb-6 ${centered ? 'mx-auto' : ''}`}></div>
      {subtitle && (
        <p className={`max-w-2xl text-lg ${light ? 'text-warm-cream/80' : 'text-dark-brown/80'} ${centered ? 'mx-auto' : ''}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
