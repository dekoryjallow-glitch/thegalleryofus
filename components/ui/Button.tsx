import Link from 'next/link';
import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  href?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
}

export function Button({
  children,
  href,
  variant = 'primary',
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles = 'px-6 py-3 rounded-md font-medium transition-all duration-200';
  const variantStyles = {
    primary: 'bg-gold-600 text-white hover:bg-gold-700',
    secondary: 'bg-transparent border border-gold-600 text-gold-700 hover:bg-gold-50',
    ghost: 'bg-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100',
  };

  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={combinedClassName}>
        {children}
      </Link>
    );
  }

  return (
    <button className={combinedClassName} {...props}>
      {children}
    </button>
  );
}

