import React, { useState, useEffect, useCallback, useRef } from 'react';
import Player from './Player';
import Invader from './Invader';
import Bullet from './Bullet';
import '../styles/Game.css';

// --- 定数 ---
const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
const PLAYER_WIDTH = 50;
const PLAYER_HEIGHT = 30;
const PLAYER_Y_POS = GAME_HEIGHT - PLAYER_HEIGHT - 10;
const PLAYER_SPEED = 5;
const BULLET_WIDTH = 5;
const BULLET_HEIGHT = 15;
const BULLET_SPEED = 7;
const FIRE_RATE = 200; // ms
const INVADER_WIDTH = 40;
const INVADER_HEIGHT = 30;
const INVADER_ROWS = 5;
const INVADER_COLS = 10;
const INITIAL_INVADER_SPEED = 1;

// --- 型定義 ---
interface GameObject {
  x: number;
  y: number;
}

interface BulletType extends GameObject {
  id: number;
}

// --- メインコンポーネント ---
const Game: React.FC = () => {
  // レンダリング用の状態
  const [playerState, setPlayerState] = useState<GameObject>({ x: GAME_WIDTH / 2 - PLAYER_WIDTH / 2, y: PLAYER_Y_POS });
  const [invadersState, setInvadersState] = useState<GameObject[]>([]);
  const [bulletsState, setBulletsState] = useState<BulletType[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);

  // ゲームループ内で使う可変参照
  const keysRef = useRef<Record<string, boolean>>({});
  const playerRef = useRef<GameObject>({ ...playerState });
  const invadersRef = useRef<GameObject[]>([]);
  const bulletsRef = useRef<BulletType[]>([]);
  const invaderDirectionRef = useRef<'left' | 'right'>('right');
  const invaderSpeedRef = useRef<number>(INITIAL_INVADER_SPEED);
  const lastShotTimeRef = useRef<number>(0);

  // --- 初期化 ---
  useEffect(() => {
    const initialInvaders: GameObject[] = [];
    for (let row = 0; row < INVADER_ROWS; row++) {
      for (let col = 0; col < INVADER_COLS; col++) {
        initialInvaders.push({
          x: col * (INVADER_WIDTH + 15) + 30,
          y: row * (INVADER_HEIGHT + 15) + 50,
        });
      }
    }
    invadersRef.current = initialInvaders;
    setInvadersState(initialInvaders);
  }, []);

  // --- キー入力ハンドラ ---
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    keysRef.current[e.key] = true;
  }, []);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    keysRef.current[e.key] = false;
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  // --- ゲームループ ---
  useEffect(() => {
    if (gameOver) return;

    const gameLoop = () => {
      // --- 状態更新ロジック ---
      const { current: keys } = keysRef;
      const { current: player } = playerRef;
      const { current: invaders } = invadersRef;
      const { current: bullets } = bulletsRef;

      // プレイヤーの移動
      if (keys['ArrowLeft'] && player.x > 0) {
        player.x -= PLAYER_SPEED;
      }
      if (keys['ArrowRight'] && player.x < GAME_WIDTH - PLAYER_WIDTH) {
        player.x += PLAYER_SPEED;
      }

      // 弾の発射
      const now = Date.now();
      if ((keys[' '] || keys['Spacebar']) && now - lastShotTimeRef.current > FIRE_RATE) {
        lastShotTimeRef.current = now;
        bullets.push({
          id: now,
          x: player.x + PLAYER_WIDTH / 2 - BULLET_WIDTH / 2,
          y: player.y,
        });
      }

      // 弾の移動
      bulletsRef.current = bullets.filter(b => {
        b.y -= BULLET_SPEED;
        return b.y > 0;
      });

      // 侵略者の移動
      let wallHit = false;
      invaders.forEach(invader => {
        invader.x += invaderDirectionRef.current === 'right' ? invaderSpeedRef.current : -invaderSpeedRef.current;
        if (invader.x <= 0 || invader.x >= GAME_WIDTH - INVADER_WIDTH) {
          wallHit = true;
        }
        // ゲームオーバー判定 (侵略者が最下部に到達)
        if (invader.y > PLAYER_Y_POS - INVADER_HEIGHT) {
            setGameOver(true);
        }
      });

      if (wallHit) {
        invaderDirectionRef.current = invaderDirectionRef.current === 'right' ? 'left' : 'right';
        invaders.forEach(invader => invader.y += INVADER_HEIGHT / 2);
      }

      // 衝突判定: 弾と侵略者
      for (let i = bullets.length - 1; i >= 0; i--) {
        for (let j = invaders.length - 1; j >= 0; j--) {
          const bullet = bullets[i];
          const invader = invaders[j];
          if (
            bullet.x < invader.x + INVADER_WIDTH &&
            bullet.x + BULLET_WIDTH > invader.x &&
            bullet.y < invader.y + INVADER_HEIGHT &&
            bullet.y + BULLET_HEIGHT > invader.y
          ) {
            bullets.splice(i, 1);
            invaders.splice(j, 1);
            setScore(s => s + 10);
            break; // 次の弾へ
          }
        }
      }

      // 勝利判定
      if (invaders.length === 0 && !win) {
          setWin(true);
          setGameOver(true);
      }

      // --- レンダリング用の状態を更新 ---
      setPlayerState({ ...player });
      setInvadersState([...invaders]);
      setBulletsState([...bullets]);

      requestAnimationFrame(gameLoop);
    };

    const animationFrameId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [gameOver, win]);

  return (
    <div className="game-board" style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}>
      {gameOver ? (
        <div className="game-over">
          <h1>{win ? "YOU WIN!" : "GAME OVER"}</h1>
          <h2>SCORE: {score}</h2>
          <button onClick={() => window.location.reload()}>RESTART</button>
        </div>
      ) : (
        <>
          <Player x={playerState.x} y={playerState.y} />
          {invadersState.map((invader, index) => (
            <Invader key={index} x={invader.x} y={invader.y} />
          ))}
          {bulletsState.map(bullet => (
            <Bullet key={bullet.id} x={bullet.x} y={bullet.y} />
          ))}
          <div className="score">SCORE: {score}</div>
        </>
      )}
    </div>
  );
};

export default Game;
