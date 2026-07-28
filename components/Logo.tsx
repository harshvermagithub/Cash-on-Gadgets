'use client';

import React from 'react';
import { FCartLogo } from '@/components/FCartLogo';

export const Logo = ({ className = "h-10 w-auto" }: { className?: string }) => {
    return (
        <div className={`relative flex items-center justify-center ${className}`} aria-label="Fonzkart">
            <FCartLogo size={55} animate={false} />
        </div>
    );
};

export default Logo;



