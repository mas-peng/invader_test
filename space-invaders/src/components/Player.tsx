import React from 'react';

interface PlayerProps {
  x: number;
  y: number;
}

const Player: React.FC<PlayerProps> = ({ x, y }) => {
  return (
    <div
      className="player"
      style={{ left: `${x}px`, top: `${y}px` }}
    ></div>
  );
};

export default Player;
