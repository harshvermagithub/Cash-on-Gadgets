'use client';

import React from 'react';
import { FCartLogo } from '@/components/FCartLogo';

export const DynamicLogo = ({ className = "" }: { className?: string }) => {
    return (
        <div className={`flex items-center justify-center ${className}`} aria-label="Fonzkart">
            <FCartLogo size={90} animate={true} />
        </div>
    );
};

export default DynamicLogo;

