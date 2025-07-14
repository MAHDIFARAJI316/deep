import React from 'react';
import { motion } from 'framer-motion';

interface MarioProgressBarProps {
  value: number;
  max: number;
  label?: string;
  showPercentage?: boolean;
  variant?: 'health' | 'xp' | 'level';
  className?: string;
}

export const MarioProgressBar: React.FC<MarioProgressBarProps> = ({
  value,
  max,
  label,
  showPercentage = true,
  variant = 'health',
  className = ''
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  
  const variantStyles = {
    health: {
      bg: 'bg-red-200',
      fill: 'bg-red-500',
      icon: '❤️'
    },
    xp: {
      bg: 'bg-blue-200',
      fill: 'bg-blue-500',
      icon: '⭐'
    },
    level: {
      bg: 'bg-yellow-200',
      fill: 'bg-yellow-500',
      icon: '🍄'
    }
  };

  const style = variantStyles[variant];

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium flex items-center gap-1">
            <span>{style.icon}</span>
            {label}
          </span>
          {showPercentage && (
            <span className="text-sm text-gray-600">
              {value}/{max} ({Math.round(percentage)}%)
            </span>
          )}
        </div>
      )}
      
      <div className={`w-full h-4 ${style.bg} rounded-full overflow-hidden border-2 border-gray-800 relative`}>
        <motion.div
          className={`h-full ${style.fill} relative`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Mario-style shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
        </motion.div>
        
        {/* Mario coins animation when progress increases */}
        {percentage > 80 && (
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
            <motion.span
              className="text-xs"
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 360, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              🪙
            </motion.span>
          </div>
        )}
      </div>
    </div>
  );
};