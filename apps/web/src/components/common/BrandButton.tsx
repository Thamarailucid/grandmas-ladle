import React from 'react';
import { Link } from 'react-router-dom';

interface BrandButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  href?: string;
  to?: string;
  target?: string;
  onClick?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export function BrandButton({
  children,
  variant = 'primary',
  href,
  to,
  target,
  onClick,
  className = '',
  size = 'md',
  fullWidth = false,
}: BrandButtonProps) {
  const baseClasses = "inline-flex items-center justify-center font-medium uppercase tracking-wider rounded transition-colors duration-300";
  
  const sizeClasses = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base",
  };
  
  const variantClasses = {
    primary: "bg-antique-brass text-dark-brown hover:bg-opacity-90",
    secondary: "bg-brand-green text-warm-cream hover:bg-opacity-90",
    outline: "bg-transparent border border-antique-brass text-antique-brass hover:bg-antique-brass hover:text-dark-brown",
  };

  const widthClass = fullWidth ? "w-full" : "";
  const combinedClasses = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${widthClass} ${className}`;

  // If "to" prop is passed, use React Router Link
  if (to) {
    return <Link to={to} target={target} className={combinedClasses}>{children}</Link>;
  }

  // If "href" is provided, detect internal vs external
  if (href) {
    const cleanHref = href.trim();

    // Check if the URL is internal to the website domain
    if (typeof window !== 'undefined') {
      try {
        const urlObj = new URL(cleanHref, window.location.origin);
        if (urlObj.origin === window.location.origin) {
          return (
            <Link to={urlObj.pathname + urlObj.search + urlObj.hash} target={target} className={combinedClasses}>
              {children}
            </Link>
          );
        }
      } catch {
        // Not a full URL, handled by relative check below
      }
    }

    // Relative or internal root routes (/menu, /our-story, /festivals, #id)
    const isInternal = cleanHref.startsWith('/') || cleanHref.startsWith('#') || cleanHref.startsWith('./');
    if (isInternal) {
      return (
        <Link to={cleanHref} target={target} className={combinedClasses}>
          {children}
        </Link>
      );
    }

    // External URLs (WhatsApp, Google Maps, tel, etc.)
    const isExternalHttp = cleanHref.startsWith('http://') || cleanHref.startsWith('https://');
    const computedTarget = target ?? (isExternalHttp ? '_blank' : undefined);
    const rel = computedTarget === '_blank' ? 'noopener noreferrer' : undefined;

    return (
      <a href={cleanHref} className={combinedClasses} target={computedTarget} rel={rel}>
        {children}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={combinedClasses}>
      {children}
    </button>
  );
}
