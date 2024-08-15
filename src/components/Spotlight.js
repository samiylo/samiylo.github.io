
import React, { useRef } from 'react';
import '../styles/Spotlight.css';

const Spotlight = ({ children }) => {
    const spotlightRef = useRef(null);

    const handleMouseMove = (e) => {
        const spotlight = spotlightRef.current;
        const rect = spotlight.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        spotlight.style.setProperty('--mouse-x', `${x}px`);
        spotlight.style.setProperty('--mouse-y', `${y}px`);
        
    };

    const handleMouseLeave = () => {
        const spotlight = spotlightRef.current;
        spotlight.style.setProperty('--mouse-x', `50%`);
        spotlight.style.setProperty('--mouse-y', `50%`);
        spotlight.style.background = 'transparent';
    };

    const handleMouseEnter = () => {
        const spotlight = spotlightRef.current;
        spotlight.style.background = 'radial-gradient(circle at var(--mouse-x) var(--mouse-y), rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0) 80%)';
    };

    return (
        <div
            className="spotlight-container"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onMouseEnter={handleMouseEnter}
            ref={spotlightRef}
        >
            {children}
        </div>
    );
};


export default Spotlight;