'use client';

import { useState, useEffect } from 'react';

interface CountdownTimerProps {
  initialSeconds?: number;
  onExpire?: () => void;
  onResend?: () => void;
}

export default function CountdownTimer({ 
  initialSeconds = 300, 
  onExpire, 
  onResend 
}: CountdownTimerProps) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (seconds <= 0) {
      setIsExpired(true);
      onExpire?.();
      return;
    }

    const timer = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds, onExpire]);

  const formatTime = (secs: number) => {
    const minutes = Math.floor(secs / 60);
    const remainingSeconds = secs % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleResend = () => {
    setSeconds(initialSeconds);
    setIsExpired(false);
    onResend?.();
  };

  return (
    <div className="text-center py-2">
      {!isExpired ? (
        <p className="text-sm text-muted-foreground">
          Code expires in: <span className="font-semibold text-[#0B3B2D]">{formatTime(seconds)}</span>
        </p>
      ) : (
        <div className="space-y-2">
          <p className="text-sm text-red-600 font-medium">Code expired!</p>
          <button
            onClick={handleResend}
            className="text-sm font-medium text-[#0B3B2D] hover:underline"
          >
            Resend OTP
          </button>
        </div>
      )}
    </div>
  );
}
