// components/ui/Paragraph.tsx
import { ReactNode } from 'react';

type ParagraphProps = {
  children: ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  color?: 'primary' | 'secondary' | 'muted' | 'custom';
  customColor?: string;
};

export const P = ({
  children,
  className = '',
  size = 'md',
  weight = 'normal',
  color = 'primary',
  customColor = '',
}: ParagraphProps) => {
  // Size classes
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  // Weight classes
  const weightClasses = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  };

  // Color classes
  const colorClasses = {
    primary: 'text-gray-900 dark:text-white',
    secondary: 'text-gray-700 dark:text-gray-300',
    muted: 'text-gray-500 dark:text-gray-400',
    custom: customColor,
  };

  return (
    <p
      className={`
        ${sizeClasses[size]}
        ${weightClasses[weight]}
        ${color === 'custom' ? customColor : colorClasses[color]}
        leading-relaxed
        ${className}
      `}
    >
      {children}
    </p>
  );
};