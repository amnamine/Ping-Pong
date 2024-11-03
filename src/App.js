import React, { useState, useEffect, useRef } from "react";
import "./App.css";

const PADDLE_HEIGHT = 100;
const PADDLE_WIDTH = 10;
const BALL_RADIUS = 10;
const PADDLE_SPEED = 5;
const BALL_SPEED = 3;

const App = () => {
  const canvasRef = useRef(null);
  const [player1Pos, setPlayer1Pos] = useState(150); // P1 paddle position
  const [player2Pos, setPlayer2Pos] = useState(150); // P2 paddle position
  const [ball, setBall] = useState({ x: 350, y: 200, dx: BALL_SPEED, dy: BALL_SPEED }); // Adjusted initial ball position
  const [keysPressed, setKeysPressed] = useState({});

  useEffect(() => {
    const handleKeyDown = (e) => {
      setKeysPressed((prev) => ({ ...prev, [e.key]: true }));
    };
    const handleKeyUp = (e) => {
      setKeysPressed((prev) => ({ ...prev, [e.key]: false }));
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // Game loop to update ball position and check for collisions
  useEffect(() => {
    const updateGame = () => {
      // Ball Movement
      setBall((prevBall) => {
        let newX = prevBall.x + prevBall.dx;
        let newY = prevBall.y + prevBall.dy;

        // Wall Collision
        if (newY <= BALL_RADIUS || newY >= 400 - BALL_RADIUS) {
          prevBall.dy *= -1; // Reverse Y direction on wall hit
        }

        // Paddle Collision for Player 1
        if (
          newX <= PADDLE_WIDTH &&
          newY >= player1Pos &&
          newY <= player1Pos + PADDLE_HEIGHT
        ) {
          prevBall.dx *= -1; // Reverse X direction on paddle hit
          newX = PADDLE_WIDTH + BALL_RADIUS; // Prevent getting stuck
        }

        // Paddle Collision for Player 2
        if (
          newX >= 700 - PADDLE_WIDTH - BALL_RADIUS && // Adjusted width for player 2
          newY >= player2Pos &&
          newY <= player2Pos + PADDLE_HEIGHT
        ) {
          prevBall.dx *= -1; // Reverse X direction on paddle hit
          newX = 700 - PADDLE_WIDTH - BALL_RADIUS; // Prevent getting stuck
        }

        // Scoring: Reset Ball
        if (newX <= 0 || newX >= 700) { // Adjusted scoring boundaries
          return { x: 350, y: 200, dx: BALL_SPEED, dy: BALL_SPEED }; // Reset ball to center
        }

        return { ...prevBall, x: newX, y: newY };
      });

      // Player 1 (Arrow UP/DOWN)
      if (keysPressed["ArrowUp"] && player1Pos > 0) {
        setPlayer1Pos((prev) => prev - PADDLE_SPEED);
      }
      if (keysPressed["ArrowDown"] && player1Pos < 400 - PADDLE_HEIGHT) {
        setPlayer1Pos((prev) => prev + PADDLE_SPEED);
      }

      // Player 2 (Z/S)
      if (keysPressed["z"] && player2Pos > 0) {
        setPlayer2Pos((prev) => prev - PADDLE_SPEED);
      }
      if (keysPressed["s"] && player2Pos < 400 - PADDLE_HEIGHT) {
        setPlayer2Pos((prev) => prev + PADDLE_SPEED);
      }
    };

    const interval = setInterval(updateGame, 1000 / 60); // 60 FPS

    return () => clearInterval(interval);
  }, [keysPressed, player1Pos, player2Pos]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const draw = () => {
      // Clear the canvas
      ctx.clearRect(0, 0, 700, 400); // Adjusted clear rect for new width

      // Draw player 1 paddle
      ctx.fillStyle = "#007BFF"; // Blue color for Player 1
      ctx.fillRect(0, player1Pos, PADDLE_WIDTH, PADDLE_HEIGHT);

      // Draw player 2 paddle
      ctx.fillStyle = "#FF4136"; // Red color for Player 2
      ctx.fillRect(700 - PADDLE_WIDTH, player2Pos, PADDLE_WIDTH, PADDLE_HEIGHT); // Adjusted for new width

      // Draw the ball
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, BALL_RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = "#28A745"; // Green color for the ball
      ctx.fill();
      ctx.closePath();
    };

    draw();
  }, [player1Pos, player2Pos, ball]);

  return (
    <div className="App">
      <h1 className="title">Ping Pong Game</h1>
      <canvas ref={canvasRef} width={700} height={400} /> {/* Adjusted canvas width */}
    </div>
  );
};

export default App;
