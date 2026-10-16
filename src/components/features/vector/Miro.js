import React, { useState, useRef } from 'react';

export const Miro = ({ src = "/digital-architecture.svg", alt = "Digital Architecture Diagram" }) => {
  const [scale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const containerRef = useRef(null);

  const handlePointerDown = (e) => {
    if (e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    isDraggingRef.current = true;
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX - position.x, y: e.clientY - position.y };
  };

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current) return;
    setPosition({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y
    });
  };

  const handlePointerUp = (e) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    isDraggingRef.current = false;
    setIsDragging(false);
  };

  return (
    <div
      ref={containerRef}
      className="miro-container"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      style={{
        touchAction: 'none',
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none',
      }}
    >
      <div
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
          transformOrigin: '0 0',
          width: '500%',
          height: '500%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          transition: isDragging ? 'none' : 'transform 0.05s ease-out'
        }}
      >
        <img
          src={src}
          alt={alt}
          draggable={false}
          style={{ maxWidth: '80%', height: 'auto' }}
        />
      </div>
    </div>
  );
};
