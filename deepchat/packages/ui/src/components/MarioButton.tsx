import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface MarioButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'power-up';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  icon?: React.ReactNode;
  sound?: boolean;
}

export const MarioButton: React.FC<MarioButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  className,
  icon,
  sound = true
}) => {
  const baseClasses = "font-bold rounded-lg transition-all duration-200 flex items-center gap-2 relative overflow-hidden";
  
  const variantClasses = {
    primary: "bg-red-500 hover:bg-red-600 text-white shadow-lg hover:shadow-xl",
    secondary: "bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl",
    'power-up': "bg-yellow-400 hover:bg-yellow-500 text-red-800 shadow-lg hover:shadow-xl animate-pulse"
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg"
  };

  const playSound = () => {
    if (sound && typeof window !== 'undefined') {
      // Mario jump sound effect
      const audio = new Audio('/sounds/mario-jump.wav');
      audio.volume = 0.3;
      audio.play().catch(() => {
        // Ignore audio play errors
      });
    }
  };

  const handleClick = () => {
    if (!disabled) {
      playSound();
      onClick?.();
    }
  };

  return (
    <motion.button
      className={clsx(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      onClick={handleClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Mario-style shine effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-700" />
      
      {icon && <span className="text-lg">{icon}</span>}
      <span className="relative z-10">{children}</span>
      
      {variant === 'power-up' && (
        <span className="text-lg animate-bounce">⭐</span>
      )}
    </motion.button>
  );
};