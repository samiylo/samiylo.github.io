import React from 'react';

export function GameOver({ finalScore, onRestart }) {
    return (
        <div id="gameOver" className="game-over" style={{ display: 'block' }}>
            <h1>WIPEOUT!</h1>
            <div id="finalScore">SCORE: {finalScore}</div>
            <button onClick={onRestart}>RETRY</button>
        </div>
    );
}
