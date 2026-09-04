import React from 'react';
import { Link } from 'react-router-dom';

interface BrandButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  href?: string;
  to?: string;
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

  if (to) {
    return <Link to={to} className={combinedClasses}>{children}</Link>;
  }

  if (href) {
    return <a href={href} className={combinedClasses} target="_blank" rel="noopener noreferrer">{children}</a>;
  }

  return (
    <button onClick={onClick} className={combinedClasses}>
      {children}
    </button>
  );
}
