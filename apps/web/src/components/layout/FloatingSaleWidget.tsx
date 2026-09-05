import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { useBusinessSettingsContext } from '../../contexts/BusinessSettingsContext';

export function FloatingSaleWidget() {
  const { isSaleWidgetActive, saleStartDate, saleEndDate, offerPreVisibilityDays = 1 } = useBusinessSettingsContext();
  const navigate = useNavigate();
  
  const storageKey = `hideSaleWidget_${saleStartDate || 'default'}`;
  
  const [isDismissed, setIsDismissed] = useState(() => {
    try {
      return typeof window !== 'undefined' && sessionStorage.getItem(`hideSaleWidget_${saleStartDate || 'default'}`) === 'true';
    } catch {
      return false;
    }
  });
  
  const [isVisible, setIsVisible] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [timeLeft, setTimeLeft] = useState<{ d: number; h: number; m: number; s: number } | null>(null);
  const [status, setStatus] = useState<'FUTURE' | 'ACTIVE' | 'ENDED'>('ENDED');

  useEffect(() => {
    const key = `hideSaleWidget_${saleStartDate || 'default'}`;
    if (isDismissed || sessionStorage.getItem(key) === 'true') {
      setIsVisible(false);
      return;
    }
    
    if (!isSaleWidgetActive) {
      setIsVisible(false);
      return;
    }

    const calculateTime = () => {
      // If user closed it in this session, never show it again
      if (sessionStorage.getItem(key) === 'true') {
        setIsVisible(false);
        return;
      }

      const now = dayjs();
      const start = saleStartDate ? dayjs(saleStartDate) : null;
      const end = saleEndDate ? dayjs(saleEndDate) : null;

      if (end && now.isAfter(end)) {
        setStatus('ENDED');
        setIsVisible(false);
        return;
      }

      if (start && now.isBefore(start)) {
        setStatus('FUTURE');
        const diff = start.diff(now, 'second');
        
        // Only show if we are within the pre-visibility window (e.g., 1 day before)
        if (diff > offerPreVisibilityDays * 24 * 3600) {
          setIsVisible(false);
        } else {
          setIsVisible(true);
          setShowTimer(true);
        }
        
        setTimeLeft({
          d: Math.floor(diff / (24 * 3600)),
          h: Math.floor((diff % (24 * 3600)) / 3600),
          m: Math.floor((diff % 3600) / 60),
          s: diff % 60,
        });
      } else {
        setStatus('ACTIVE');
        setIsVisible(true);
        
        if (end) {
          const diff = end.diff(now, 'second');
          
          // Only show timer if there is 1 day (or less) remaining
          if (diff > 24 * 3600) {
            setShowTimer(false);
          } else {
            setShowTimer(true);
          }
          
          setTimeLeft({
            d: Math.floor(diff / (24 * 3600)),
            h: Math.floor((diff % (24 * 3600)) / 3600),
            m: Math.floor((diff % 3600) / 60),
            s: diff % 60,
          });
        } else {
          setShowTimer(false);
          setTimeLeft(null);
        }
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [isDismissed, isSaleWidgetActive, saleStartDate, saleEndDate, offerPreVisibilityDays]);

  if (!isVisible || isDismissed) return null;

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const key = `hideSaleWidget_${saleStartDate || 'default'}`;
    try {
      sessionStorage.setItem(key, 'true');
    } catch {}
    setIsDismissed(true);
    setIsVisible(false);
  };

  const pad = (num: number) => num.toString().padStart(2, '0');

  return (
    <div 
      onClick={() => navigate('/sale')}
      className="fixed bottom-24 right-6 z-40 cursor-pointer group hover:scale-105 transition-transform duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] flex flex-col items-end"
    >
      <button 
        type="button"
        onClick={handleClose}
        className="absolute -top-3 -right-3 bg-white text-gray-600 hover:text-black rounded-full w-7 h-7 flex items-center justify-center shadow-lg hover:bg-gray-100 z-50 border border-gray-300 text-sm font-bold cursor-pointer transition-all active:scale-90"
        aria-label="Close"
      >
        ✕
      </button>

      <div className="bg-red-600 text-white rounded-xl shadow-2xl p-4 border-2 border-white text-center w-40 relative overflow-hidden">
        {/* Shine effect */}
        <div className="absolute top-0 left-0 w-full h-full bg-white opacity-10 group-hover:opacity-20 transition-opacity" />
        
        <h3 className="font-black text-xl italic uppercase tracking-wider mb-1 leading-tight shadow-sm">
          {status === 'FUTURE' ? 'SALE COMING SOON' : 'SPECIAL SALE'}
        </h3>
        
        {showTimer && (
          <div className="bg-white text-red-600 font-bold text-xs py-1 px-2 rounded mt-2 uppercase tracking-widest shadow-inner">
            {status === 'FUTURE' ? 'STARTS IN' : 'ENDS IN'}
          </div>
        )}

        {showTimer && timeLeft ? (
          <div className="flex justify-center items-center mt-3 font-mono text-xl font-bold drop-shadow-md space-x-1">
            {timeLeft.d > 0 && (
              <>
                <div className="flex flex-col items-center">
                  <span>{pad(timeLeft.d)}</span>
                  <span className="text-[0.5rem] uppercase font-sans font-normal opacity-90">Days</span>
                </div>
                <span className="mb-3 px-1">:</span>
              </>
            )}
            <div className="flex flex-col items-center">
              <span>{pad(timeLeft.h)}</span>
              <span className="text-[0.5rem] uppercase font-sans font-normal opacity-90">Hrs</span>
            </div>
            <span className="mb-3 px-1">:</span>
            <div className="flex flex-col items-center">
              <span>{pad(timeLeft.m)}</span>
              <span className="text-[0.5rem] uppercase font-sans font-normal opacity-90">Min</span>
            </div>
            <span className="mb-3 px-1">:</span>
            <div className="flex flex-col items-center text-yellow-300">
              <span>{pad(timeLeft.s)}</span>
              <span className="text-[0.5rem] uppercase font-sans font-normal text-white opacity-90">Sec</span>
            </div>
          </div>
        ) : (
          <div className="mt-4 mb-2">
            <div className="font-black text-2xl text-yellow-300 drop-shadow-md leading-none animate-pulse">
              LIVE NOW
            </div>
            <div className="font-bold text-sm mt-1">BUY IT!</div>
          </div>
        )}

        <div className="text-[10px] uppercase tracking-widest opacity-80 mt-3 font-semibold underline underline-offset-2">
          Click to Shop
        </div>
      </div>
    </div>
  );
}
