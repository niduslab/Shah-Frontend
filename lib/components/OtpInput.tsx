'use client';

import { useState, useRef, useEffect } from 'react';

interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function OtpInput({ 
  length = 6, 
  value, 
  onChange, 
  disabled = false 
}: OtpInputProps) {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const newOtp = new Array(length).fill('');
    if (value) {
      const chars = value.split('');
      chars.forEach((char, i) => {
        if (i < length) newOtp[i] = char;
      });
    }
    setOtp(newOtp);
  }, [value, length]);

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Call parent onChange
    onChange(newOtp.join(''));

    // Focus next input
    if (element.value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const setInputRef = (index: number) => (ref: HTMLInputElement | null) => {
    inputRefs.current[index] = ref;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, length);
    const newOtp = pastedData.split('');
    setOtp(newOtp);
    onChange(newOtp.join(''));

    // Focus last filled input
    const lastIndex = Math.min(newOtp.length - 1, length - 1);
    inputRefs.current[lastIndex]?.focus();
  };

  return (
    <div className="flex gap-2 justify-center">
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={setInputRef(index)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(e.target, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          disabled={disabled}
          autoFocus={index === 0}
          className="w-12 h-14 text-center text-xl font-semibold rounded-xl border-2 border-border bg-gray-50/50 outline-none transition-all focus:border-[#0B3B2D] focus:ring-2 focus:ring-[#0B3B2D]/10 focus:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
        />
      ))}
    </div>
  );
}
