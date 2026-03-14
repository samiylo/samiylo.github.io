import { useEffect } from 'react';

/**
 * Custom hook for managing the custom cursor (desktop only)
 */
export function useCustomCursor(isMobile) {
    useEffect(() => {
        if (isMobile) return;

        const cursor = document.getElementById('skateboard-cursor');
        if (!cursor) return;

        const handleMouseMove = (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        };

        document.addEventListener('mousemove', handleMouseMove);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
        };
    }, [isMobile]);
}
