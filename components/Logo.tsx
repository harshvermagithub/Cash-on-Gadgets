'use client';

import React from 'react';
import { FCartLogo } from '@/components/FCartLogo';

export const Logo = ({ className = "h-11 sm:h-12 w-auto" }: { className?: string }) => {
    return (
        <div className={`relative flex items-center justify-center ${className}`} aria-label="Fonzkart">
            <FCartLogo size={68} animate={false} />
        </div>
    );
};

export default Logo;



