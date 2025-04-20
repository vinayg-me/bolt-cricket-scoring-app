import React from 'react';
import { twMerge } from 'tailwind-merge';
import { motion } from 'framer-motion';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'glass';
  animate?: boolean;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  children,
  className,
  variant = 'default',
  animate = false,
  onClick,
  }) => {
  const baseStyles = 'rounded-2xl p-6 shadow-lg';
  
  const variantStyles = {
    default: 'bg-surface',
    glass: 'bg-surface/70 backdrop-blur-sm'
  };
  
  const WrapperComponent = animate ? motion.div : 'div';
  
  const animationProps = animate ? {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
    transition: { duration: 0.3 }
  } : {};
  
  return (
    <WrapperComponent
      className={twMerge(baseStyles, variantStyles[variant], className)}
      {...animationProps}
      onClick={onClick}
    >
      {children}
    </WrapperComponent>
  );
};

export default Card;