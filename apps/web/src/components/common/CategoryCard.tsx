import React from 'react';
import { Link } from 'react-router-dom';

interface CategoryCardProps {
  title: string;
  imageUrl?: string;
  linkTo: string;
}

export function CategoryCard({ title, imageUrl, linkTo }: CategoryCardProps) {
  return (
    <Link to={linkTo} className="group block relative rounded-lg overflow-hidden shadow-md aspect-[4/3]">
      {imageUrl ? (
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      ) : (
        <div className="w-full h-full bg-brand-green/10 flex items-center justify-center">
          <span className="text-brand-green opacity-50">No Image</span>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-dark-brown/90 via-dark-brown/30 to-transparent"></div>
      <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 md:p-6">
        <h3 className="text-sm sm:text-base md:text-xl lg:text-2xl font-serif text-warm-cream uppercase tracking-wider group-hover:text-antique-brass transition-colors leading-tight">
          {title}
        </h3>
      </div>
    </Link>
  );
}
