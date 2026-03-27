import React from 'react';
import { FCartLogo } from '@/components/FCartLogo';

export default function ExportPage() {
    return (
        <div style={{ width: 800, height: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent' }}>
            <div id="capture-logo" style={{ padding: 40 }}>
                <FCartLogo size={500} animate={false} />
            </div>
        </div>
    );
}
