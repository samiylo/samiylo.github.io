import { useEffect, useState } from 'react';

/**
 * Custom hook for detecting mobile devices and managing UI visibility
 */
export function useMobileDetection() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        function checkMobile() {
            const mobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ||
                (window.matchMedia && window.matchMedia("(max-width: 768px)").matches);
            setIsMobile(mobile);

            // Update mobile controls visibility
            const mobileControls = document.getElementById('mobileControls');
            const cursor = document.getElementById('skateboard-cursor');
            
            if (mobileControls) {
                mobileControls.style.display = mobile ? 'flex' : 'none';
            }
            if (cursor) {
                cursor.style.display = mobile ? 'none' : 'block';
            }
        }

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => {
            window.removeEventListener('resize', checkMobile);
        };
    }, []);

    return isMobile;
}
