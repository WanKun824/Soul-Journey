import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  fullWidth = false,
  className = '',
  ...props
}) => {
  const variants: Record<string, string> = {
    primary: 'liquid-glass-primary font-semibold',
    secondary: 'liquid-glass-btn text-white/70 font-medium',
    outline: 'liquid-glass-btn border-indigo-400/40 text-indigo-300 font-medium',
  };

  return (
    <button
      className={`px-6 py-3 rounded-2xl transition-all duration-200 active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};