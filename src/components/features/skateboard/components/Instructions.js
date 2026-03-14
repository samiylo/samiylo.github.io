import React from 'react';

export function Instructions({ show }) {
    return (
        <div 
            id="instructions" 
            className="instructions"
            style={{ display: show ? 'block' : 'none' }}
        >
            <span className="key">←</span>
            <span className="key">→</span>
            STEER
            <span className="key">SPACE</span>
            JUMP & TRICK
        </div>
    );
}
