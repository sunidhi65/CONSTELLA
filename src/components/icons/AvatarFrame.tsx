import React from 'react';

// FIX: Add 'style' to IconProps to allow passing style objects to SVG components.
interface IconProps {
    className?: string;
    style?: React.CSSProperties;
}

const iconProps = {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '1.5',
    viewBox: '0 0 24 24',
    strokeLinecap: 'round' as 'round',
    strokeLinejoin: 'round' as 'round',
};

// Stellar Forms
export const RadiantStar: React.FC<IconProps> = ({ className, style }) => (
    <svg {...iconProps} className={className} style={style}><path d="M12 2 L14.5 9.5 L22 12 L14.5 14.5 L12 22 L9.5 14.5 L2 12 L9.5 9.5 Z" /></svg>
);
export const CosmicStar: React.FC<IconProps> = ({ className, style }) => (
    <svg {...iconProps} className={className} style={style}><path d="M12 2L13.6 8.4L20 10L13.6 11.6L12 18L10.4 11.6L4 10L10.4 8.4L12 2Z" /><path d="M12 6L12.8 9.2L16 10L12.8 10.8L12 14L11.2 10.8L8 10L11.2 9.2L12 6Z" /></svg>
);
export const ShimmerStar: React.FC<IconProps> = ({ className, style }) => (
    <svg {...iconProps} className={className} style={style}><path d="M12 2 L13 7 L18 8 L13 9 L12 14 L11 9 L6 8 L11 7 Z" /><path d="M12 10 L11.5 12.5 L9 13 L11.5 13.5 L12 16 L12.5 13.5 L15 13 L12.5 12.5 Z" /></svg>
);
export const NovaStar: React.FC<IconProps> = ({ className, style }) => (
    <svg {...iconProps} className={className} style={style}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
);
export const AncientStar: React.FC<IconProps> = ({ className, style }) => (
    <svg {...iconProps} className={className} style={style}><path d="M12 2l2.35 7.16h7.5l-6.07 4.42 2.3 7.2L12 16.5l-6.08 4.28 2.3-7.2-6.07-4.42h7.5L12 2z" /></svg>
);
export const DreamStar: React.FC<IconProps> = ({ className, style }) => (
    <svg {...iconProps} className={className} style={style}>
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        <circle cx="12" cy="12" r="11" strokeDasharray="2 2" />
    </svg>
);

// Planetary Forms
export const MysticOrb: React.FC<IconProps> = ({ className, style }) => (
    <svg {...iconProps} className={className} style={style}><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="3" /></svg>
);
export const CoreWorld: React.FC<IconProps> = ({ className, style }) => (
    <svg {...iconProps} className={className} style={style}><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="5" strokeDasharray="2 2" /></svg>
);
export const LunaSphere: React.FC<IconProps> = ({ className, style }) => (
    <svg {...iconProps} className={className} style={style}><circle cx="12" cy="12" r="10" /><path d="M12 2 A 10 10 0 0 0 12 22" /></svg>
);
export const ShadowPlanet: React.FC<IconProps> = ({ className, style }) => (
    <svg viewBox="0 0 24 24" className={className} style={style}>
        <defs>
            <radialGradient id="shadow-grad" cx="40%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#888" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#222" stopOpacity="1" />
            </radialGradient>
            <filter id="shadow-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="0.7" result="coloredBlur"/>
                <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
        </defs>
        <g filter="url(#shadow-glow)">
             <circle cx="12" cy="12" r="10" stroke="#a1a1aa" strokeOpacity="0.3" strokeWidth="0.5" fill="url(#shadow-grad)" />
        </g>
    </svg>
);
export const RingWorld: React.FC<IconProps> = ({ className, style }) => (
    <svg {...iconProps} className={className} style={style}><circle cx="12" cy="12" r="6" /><ellipse cx="12" cy="12" rx="10" ry="4" /></svg>
);
export const DualSphere: React.FC<IconProps> = ({ className, style }) => (
    <svg {...iconProps} className={className} style={style}><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /></svg>
);