import React from 'react';

interface InvaderProps {
  x: number;
  y: number;
}

const Invader: React.FC<InvaderProps> = ({ x, y }) => {
  return (
    <div
      className="invader"
      style={{ left: `${x}px`, top: `${y}px` }}
    ></div>
  );
};

export default Invader;
