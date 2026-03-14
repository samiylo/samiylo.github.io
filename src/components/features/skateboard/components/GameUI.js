import React from 'react';

export function GameUI({ score, speed, tricks }) {
    return (
        <div id="ui" className="skateboard-ui">
            <div className="stat">
                Score<br />
                <span className="stat-value">{score}</span>
            </div>
            <div className="stat">
                Speed<br />
                <span className="stat-value">{speed}</span>
            </div>
            <div className="stat">
                Tricks<br />
                <span className="stat-value">{tricks}</span>
            </div>
        </div>
    );
}
