import React from 'react';

interface SectionContainerProps {
  children: React.ReactNode;
  className?: string;
  bgColor?: 'cream' | 'green' | 'white';
  id?: string;
}

export function SectionContainer({
  children,
  className = '',
  bgColor = 'cream',
  id,
}: SectionContainerProps) {
  const bgColors = {
    cream: 'bg-warm-cream text-dark-brown',
    green: 'bg-brand-green text-warm-cream',
    white: 'bg-white text-dark-brown',
  };

  const hasCustomPy = className.includes('py-');
  const pyClass = hasCustomPy ? '' : 'py-16 md:py-24 ';

  return (
    <section id={id} className={`${pyClass}${bgColors[bgColor]} ${className}`.trim()}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </section>
  );
}
