"use client";

import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
  disabled?: boolean;
  className?: string;
  [key: string]: unknown;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = 'button',
  disabled = false,
  className = '',
  ...props
}) => {
  const baseClasses = 'rounded font-medium transition-all focus:outline-none hover:cursor-pointer';
  
  const disabledClasses = 'opacity-50 cursor-not-allowed';

  // Default handler that does nothing when onClick is not provided
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled && onClick) {
      onClick(event);
    }
  };

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled}
      className={`
        ${baseClasses}
        ${disabled ? disabledClasses : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;