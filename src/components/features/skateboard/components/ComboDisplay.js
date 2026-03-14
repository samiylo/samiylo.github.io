import React, { useEffect, useState } from 'react';

export function ComboDisplay({ comboText }) {
    const [displayText, setDisplayText] = useState('');

    useEffect(() => {
        if (comboText) {
            setDisplayText(comboText);
            const timer = setTimeout(() => {
                setDisplayText('');
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [comboText]);

    if (!displayText) return null;

    return (
        <div className="combo-display" style={{ animation: 'comboFade 1s ease-out' }}>
            {displayText}
        </div>
    );
}
