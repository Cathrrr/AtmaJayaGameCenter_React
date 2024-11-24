import React, { useState, useEffect } from "react";
import { Joystick, RotateCcw, LandPlot, Play } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Confetti from 'react-confetti';
import "./TicTacToe.css";

const TicTacToe = () => {
    const [board, setBoard] = useState(Array(9).fill(null));
    const [isXNext, setIsXNext] = useState(true);
    const [winner, setWinner] = useState(null);
    const [winningCombination, setWinningCombination] = useState([]);
    const [timeLeft, setTimeLeft] = useState(10);
    const [scores, setScores] = useState({ X: 0, O: 0 });
    const [gameOver, setGameOver] = useState(false);
    const [finalWinner, setFinalWinner] = useState(null);

    const calculateWinner = (board) => {
        const winningCombinations = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];

        for (const [a, b, c] of winningCombinations) {
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return { player: board[a], combination: [a, b, c] };
            }
        }
        return null;
    };

    const playSound = (soundFile) => {
        const audio = new Audio(soundFile);
        audio.play();
    };

    const handleClick = (index) => {
        if (board[index] || winner || gameOver) return;

        const newBoard = [...board];
        newBoard[index] = isXNext ? "X" : "O";
        setBoard(newBoard);
        setIsXNext(!isXNext);

        const result = calculateWinner(newBoard);
        if (result) {
            setWinner(result.player);
            setWinningCombination(result.combination);
            playSound("src/assets/sounds/win.mp3");
            setScores((prevScores) => ({
                ...prevScores,
                [result.player]: prevScores[result.player] + 1,
            }));

            toast.dark(`🎉 Pemain ${result.player} menang!`, {
                position: "top-right",
                theme: 'dark',
            });
        }
    };

    useEffect(() => {
        if (!winner && !gameOver) {
            const timer = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        setIsXNext(!isXNext);
                        return 10;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [isXNext, winner, gameOver]);

    useEffect(() => {
        setTimeLeft(10);
    }, [isXNext]);

    const resetGame = () => {
        setBoard(Array(9).fill(null));
        setIsXNext(true);
        setWinner(null);
        setWinningCombination([]);
        setTimeLeft(10);
    };

    const endGame = () => {
        setGameOver(true);
        if (scores.X > scores.O) {
            setFinalWinner("X");
        } else if (scores.O > scores.X) {
            setFinalWinner("O");
        } else {
            setFinalWinner("Draw");
        }
    };

    const restartGame = () => {
        setBoard(Array(9).fill(null));
        setIsXNext(true);
        setWinner(null);
        setWinningCombination([]);
        setTimeLeft(10);
        setScores({ X: 0, O: 0 });
        setGameOver(false);
        setFinalWinner(null);
    };

    return (
        <div className="game1-container">
            {gameOver && finalWinner && (
                <Confetti />
            )}
            <div className="tic-tac-toe-container">
                <h1 className="game-title">
                    <Joystick className='inline-icon' />Tic Tac Toe
                </h1>
                <p className="score-message">Score</p>
                <p className="score">X: {scores.X} | O: {scores.O}</p>
                {finalWinner && (
                    <p className="final-winner-message">
                        Pemenang akhir:{" "}
                        {finalWinner === "Draw"
                            ? "Permainan berakhir seri 🤝"
                            : `Pemain ${finalWinner} menang! 🎉`}
                    </p>
                )}
                {!gameOver && winner && (
                    <p className="winner-message">Pemain <strong>{winner}</strong> menang!</p>
                )}

                {!gameOver && !winner && (
                    <>
                        <p className="turn-message">Giliran: {isXNext ? "X" : "O"}</p>
                        <p className="timer-message">Waktu tersisa: {timeLeft} detik</p>
                    </>
                )}

                <div className="game-box">
                    <div className="board">
                        {board.map((cell, index) => (
                            <div
                                key={index}
                                className={`cell ${cell ? "filled" : ""} ${winningCombination.includes(index) ? "winner-cell" : ""
                                    }`}
                                onClick={() => handleClick(index)}
                            >
                                {cell}
                            </div>
                        ))}
                    </div>
                </div>
                {gameOver ? (
                    <button
                        className="reset-button"
                        onClick={restartGame}
                    >
                        <Play className='icon-play' />
                    </button>
                ) : (
                    <button className="reset-button" onClick={resetGame}>
                        <RotateCcw className='icon' />
                        Reset Game
                    </button>
                )}
                {!gameOver && (
                    <button
                        className="end-button"
                        onClick={endGame}
                        style={{
                            marginTop: "1rem",
                            backgroundColor: "red",
                            color: "white",
                        }}
                    >
                        <LandPlot className='icon' />
                        Akhiri Permainan
                    </button>
                )}
            </div>
        </div>
    );
};

export default TicTacToe;
