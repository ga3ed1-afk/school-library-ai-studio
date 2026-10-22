import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'light' | 'dark' | 'header';
  showSubtitle?: boolean;
}

export default function BenAmmarLogo({
  className,
  iconOnly = false,
  size = 'md',
  variant = 'header',
  showSubtitle = true
}: LogoProps) {
  const sizeClasses = {
    sm: { icon: 'w-8 h-8', title: 'text-sm font-black', sub: 'text-[9px]' },
    md: { icon: 'w-10 h-10 lg:w-12 lg:h-12', title: 'text-base lg:text-lg font-black', sub: 'text-[10px] lg:text-xs' },
    lg: { icon: 'w-14 h-14 lg:w-16 lg:h-16', title: 'text-xl lg:text-2xl font-black', sub: 'text-xs lg:text-sm' },
    xl: { icon: 'w-20 h-20 lg:w-24 lg:h-24', title: 'text-2xl lg:text-3xl font-black', sub: 'text-sm lg:text-base' },
  }[size];

  const textColor = variant === 'light' 
    ? 'text-white' 
    : variant === 'dark' 
      ? 'text-stone-900' 
      : 'text-white';

  const subColor = variant === 'light' 
    ? 'text-stone-200' 
    : variant === 'dark' 
      ? 'text-[oklch(54.1%_0.281_293.009)]' 
      : 'text-stone-200';

  return (
    <div className={cn("flex items-center gap-3 select-none", className)}>
      {/* Visual Emblem - User's Original Uploaded Logo */}
      <div className={cn(
        "relative shrink-0 rounded-xs overflow-hidden flex items-center justify-center transition-transform group-hover:scale-105 border bg-[#F8F6F0]",
        sizeClasses.icon,
        variant === 'dark' 
          ? "border-stone-300 shadow-xs" 
          : "border-white/40 shadow-sm"
      )}>
        <img 
          src="/logo.jpg" 
          alt="بن عمار للمكتبية و الإعلامية" 
          className="w-full h-full object-contain p-0.5"
        />
      </div>

      {!iconOnly && (
        <div className="flex flex-col text-right">
          <div className={cn("leading-tight tracking-tight flex items-baseline gap-1.5", textColor, sizeClasses.title)}>
            <span>بن عمار</span>
            <span className={cn("text-xs lg:text-sm font-extrabold opacity-95", variant === 'dark' ? "text-[oklch(54.1%_0.281_293.009)]" : "text-amber-300")}>
              للمكتبية و الإعلامية
            </span>
          </div>
          {showSubtitle && (
            <span className={cn("font-medium tracking-wide leading-none mt-1 font-serif italic text-[11px] lg:text-xs", subColor)}>
              Librairie et Service Ben Ammar
            </span>
          )}
        </div>
      )}
    </div>
  );
}
