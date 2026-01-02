import React from 'react';

interface LogoProps {
    className?: string;
    variant?: 'light' | 'dark';
}

export const Logo: React.FC<LogoProps> = ({ className = "", variant = 'dark' }) => {
    const color = variant === 'dark' ? '#111827' : '#FFFFFF'; // gray-900 or white

    return (
        <svg
            width="220"
            height="32"
            viewBox="0 0 220 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            aria-label="The Gallery Of Us"
        >
            <text
                x="0"
                y="22"
                fill={color}
                style={{
                    fontFamily: 'var(--font-playfair), serif',
                    fontSize: '18px',
                    fontWeight: '700',
                    letterSpacing: '-0.01em'
                }}
            >
                The Gallery of Us
            </text>
        </svg>
    );
};
