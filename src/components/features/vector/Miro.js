import React, { useState, useRef } from 'react';

export const Miro = ({ src = "/digital-architecture.svg", alt = "Digital Architecture Diagram" }) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const containerRef = useRef(null);

  // Handle Zooming via Mouse Wheel (Zooms toward mouse cursor)
//   const handleWheel = (e) => {
//     e.preventDefault();
//     const zoomIntensity = 0.1;
//     const direction = e.deltaY < 0 ? 1 : -1;
//     const newScale = Math.min(Math.max(scale + direction * zoomIntensity, 0.5), 8); // Scale between 0.5x and 8x

//     setScale(newScale);
//   };

  // Handle Dragging / Panning Start
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  // Handle Dragging / Panning Move
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  // Handle Dragging / Panning End
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div 
      ref={containerRef}
      className="miro-container"
      
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{
       
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
          draggable={false} // Prevents default browser image-dragging behavior
          style={{ maxWidth: '80%', height: 'auto' }} 
        />
      </div>
    </div>
  );
};