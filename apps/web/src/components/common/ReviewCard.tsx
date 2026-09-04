import React from 'react';
import { StarFilled } from '@ant-design/icons';

interface ReviewCardProps {
  customerName: string;
  location?: string;
  rating: number;
  content: string;
}

export function ReviewCard({ customerName, location, rating, content }: ReviewCardProps) {
  return (
    <div className="bg-white p-8 rounded-lg shadow-sm border border-antique-brass/10 h-full flex flex-col">
      <div className="flex mb-4 text-antique-brass">
        {[...Array(5)].map((_, i) => (
          <StarFilled key={i} className={i < rating ? 'text-antique-brass' : 'text-gray-200'} />
        ))}
      </div>
      <blockquote className="text-dark-brown/80 mb-6 flex-grow italic">
        "{content}"
      </blockquote>
      <div>
        <div className="font-medium text-brand-green uppercase tracking-wider text-sm">
          {customerName}
        </div>
        {location && (
          <div className="text-xs text-dark-brown/60 mt-1 uppercase tracking-wider">
            {location}
          </div>
        )}
      </div>
    </div>
  );
}
