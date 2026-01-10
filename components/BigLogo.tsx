'use client';

import React from 'react';
import { HeroLogo } from './HeroLogo';

export const BigLogo = () => {
    return (
        <div className="w-full h-[250px] flex items-center justify-start select-none opacity-90 hover:opacity-100 transition-opacity duration-500 overflow-visible -ml-32 mt-24">
            <div className="relative scale-[2.5] md:scale-[3.0] lg:scale-[3.8] origin-left transform">
                <HeroLogo />
            </div>
        </div>
    );
};
