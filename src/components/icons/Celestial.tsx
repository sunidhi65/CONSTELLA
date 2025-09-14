import React from 'react';

interface IconProps {
    className?: string;
    color?: string;
    style?: React.CSSProperties;
}

export const StarIcon: React.FC<IconProps> = ({ className, color, style }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill={color}
        className={className}
        style={style}
    >
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
);

export const PlanetIcon: React.FC<IconProps> = ({ className, color = '#FFFFFF', style }) => (
     <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 100 100" 
        className={className}
        style={style}
    >
        <defs>
            <radialGradient id={`grad-${color.replace('#','')}`} cx="30%" cy="30%" r="70%">
                <stop offset="0%" style={{stopColor: '#ffffff', stopOpacity: 0.7}} />
                <stop offset="100%" style={{stopColor: color, stopOpacity:1}} />
            </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="40" fill={`url(#grad-${color.replace('#','')})`} />
        <path d="M10,50 C25,30 75,30 90,50 C75,70 25,70 10,50" stroke="rgba(255,255,255,0.2)" strokeWidth="3" fill="none" transform="rotate(-20 50 50)"/>
    </svg>
);

export const CreatorHeaderLogo: React.FC<IconProps> = ({ className, style }) => (
    <div className={`w-10 h-10 ${className}`} style={style}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            <circle cx="12" cy="12" r="2" />
            <path d="M8.5 8.5l-1-1" />
            <path d="M15.5 8.5l1-1" />
            <path d="M12 7V5" />
            <path d="M12 17v2" />
            <path d="M8.5 15.5l-1 1" />
            <path d="M15.5 15.5l1 1" />
        </svg>
    </div>
);


export const OutlineStarIcon: React.FC<IconProps> = ({ className, color = 'currentColor', style }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        style={style}
    >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
);

export const WorldIcon: React.FC<IconProps> = ({ className, color = 'currentColor', style }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        style={style}
    >
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 18 15.3 15.3 0 0 1-8 0 15.3 15.3 0 0 1 4-18z" />
    </svg>
);


export const OutlineHeartIcon: React.FC<IconProps> = ({ className, style }) => (
     <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg" className={`w-5 h-5 ${className}`} style={style}>
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
);

export const FourPointStarIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="currentColor" viewBox="0 0 16 16">
        <path d="M8 0L9.34 6.66L16 8L9.34 9.34L8 16L6.66 9.34L0 8L6.66 6.66L8 0Z" />
    </svg>
);