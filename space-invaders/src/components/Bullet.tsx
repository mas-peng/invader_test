import React from 'react';

interface BulletProps {
  x: number;
  y: number;
}

const Bullet: React.FC<BulletProps> = ({ x, y }) => {
  return (
    <div
      className="bullet"
      style={{ left: `${x}px`, top: `${y}px` }}
    ></div>
  );
};

export default Bullet;
