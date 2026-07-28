'use client';

import React from 'react';
import { DynamicLogo } from '@/components/DynamicLogo';

export const Logo = ({ className = "h-12 w-auto" }: { className?: string }) => {
    return (
        <div className={`relative flex items-center justify-center ${className}`} aria-label="Fonzkart">
            <DynamicLogo size="small" />
        </div>
    );
};

export default Logo;


