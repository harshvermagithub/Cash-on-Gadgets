
import React from 'react';

export const Logo = ({ className = "h-8" }: { className?: string }) => {
    return (
        <svg
            viewBox="0 0 250 50"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            aria-label="Fonzkart"
        >
            <defs>
                <linearGradient id="phoneGradient" x1="0" y1="0" x2="0" y2="100%">
                    <stop offset="0%" stopColor="currentColor" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="currentColor" />
                </linearGradient>
            </defs>

            {/* Smartphone Icon Container */}
            <g transform="translate(0, 2)">
                {/* Phone Body with Gradient/Effect from previous iterations */}
                <rect
                    x="2"
                    y="2"
                    width="30"
                    height="45"
                    rx="6"
                    stroke="url(#phoneGradient)"
                    strokeWidth="3"
                    fill="none"
                />

                {/* Top Notch/Speaker Detail */}
                <path d="M11 7 H 23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.8" />

                {/* Home Button Detail */}
                <circle cx="17" cy="40" r="1.5" fill="currentColor" opacity="0.8" />

                {/* The letter 'F' inside the phone - replacing the screen area */}
                {/* We position it centrally in the "screen" area */}
                <text
                    x="17"
                    y="32"
                    fontFamily="system-ui, -apple-system, sans-serif"
                    fontWeight="900"
                    fontSize="26"
                    fill="currentColor"
                    textAnchor="middle"
                >
                    F
                </text>
            </g>

            {/* onzka */}
            <text x="40" y="38" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="800" fontSize="36" fill="currentColor" letterSpacing="-1">
                onzka
            </text>

            {/* r - Stylized as Rupee Symbol */}
            <text x="144" y="38" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="800" fontSize="36" fill="currentColor" letterSpacing="-1">
                ₹
            </text>

            {/* t */}
            <text x="170" y="38" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="800" fontSize="36" fill="currentColor" letterSpacing="-1">
                t
            </text>
        </svg>
    );
};

export default Logo;
