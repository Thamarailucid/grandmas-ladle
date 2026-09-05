import React from 'react';
import { StarFilled, CheckCircleFilled } from '@ant-design/icons';
import dayjs from 'dayjs';

export interface ReviewCardProps {
  customerName: string;
  customerLocation?: string | null;
  location?: string | null;
  rating: number;
  content: string;
  isVerified?: boolean;
  adminReply?: string | null;
  createdAt?: string | null;
}

export function ReviewCard({
  customerName,
  customerLocation,
  location,
  rating,
  content,
  isVerified = true,
  adminReply,
  createdAt
}: ReviewCardProps) {
  const displayLocation = customerLocation || location;
  const formattedDate = createdAt ? dayjs(createdAt).format('DD MMM YYYY') : null;

  return (
    <div className="w-[320px] sm:w-[380px] bg-white p-6 sm:p-7 rounded-2xl shadow-sm border border-brand-terracotta/10 flex flex-col justify-between flex-shrink-0 transition-all duration-300 hover:shadow-md hover:border-brand-terracotta/20 select-none text-left">
      <div>
        {/* Header: Stars + Date */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex text-[#f59e0b] gap-1">
            {[...Array(5)].map((_, i) => (
              <StarFilled
                key={i}
                className={`text-base ${i < rating ? 'text-[#f59e0b]' : 'text-gray-200'}`}
              />
            ))}
          </div>
          {formattedDate && (
            <span className="text-xs font-medium text-brand-dark-brown/40">
              {formattedDate}
            </span>
          )}
        </div>

        {/* Review Quote */}
        <blockquote className="font-outfit text-brand-dark-brown/85 text-base leading-relaxed italic mb-5 line-clamp-4">
          "{content}"
        </blockquote>
      </div>

      <div>
        {/* Admin Reply Block if present */}
        {adminReply && (
          <div className="mb-4 p-3 bg-[#FAF6EE] rounded-xl border-l-2 border-brand-green/60">
            <div className="text-[11px] font-bold text-brand-green uppercase tracking-wide">
              Grandma's Ladle Reply
            </div>
            <p className="text-xs text-brand-dark-brown/80 mt-1 italic leading-relaxed line-clamp-2">
              "{adminReply}"
            </p>
          </div>
        )}

        {/* Customer Information with Blue Verified Tick */}
        <div className="pt-3 border-t border-brand-cream/60 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-playfair font-bold text-brand-green text-sm sm:text-base tracking-wide">
                {customerName}
              </span>
              {isVerified && (
                <span className="inline-flex items-center text-[#1677ff]" title="Verified Customer">
                  <CheckCircleFilled style={{ fontSize: '14px' }} />
                </span>
              )}
            </div>
            {displayLocation && (
              <div className="text-xs text-brand-dark-brown/55 mt-0.5 flex items-center gap-1">
                <span>📍</span>
                <span>{displayLocation}</span>
              </div>
            )}
          </div>

          {isVerified && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#1677ff] bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
              Verified Buyer
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
