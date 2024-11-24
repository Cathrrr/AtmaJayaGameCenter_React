import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Dice6, Target, RotateCcw } from 'lucide-react';
import './Game1.css';

const Game1 = () => {
    const [randomNumber, setRandomNumber] = useState(generateRandomNumber());
    const [guess, setGuess] = useState("");
    const [attemptsLeft, setAttemptsLeft] = useState(4);
    const [feedback, setFeedback] = useState("");
    const [gameStatus, setGameStatus] = useState("playing");
    const [isResetting, setIsResetting] = useState(false);

    function generateRandomNumber() {
        return Math.floor(Math.random() * 10) + 1;
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isResetting) {
            setIsResetting(false);
            return;
        }

        if (gameStatus === "playing" && (!guess || isNaN(guess) || guess < 1 || guess > 10)) {
            toast.warning('🎯 Masukkan angka antara 1 dan 10', {
                position: "top-right",
                theme: 'dark',
            });
            return;
        }

        const numericGuess = parseInt(guess);

        if (gameStatus !== "playing") return;

        if (numericGuess === randomNumber) {
            setGameStatus("won");
            setFeedback("");
            toast.dark('🏆🎉 Berhasil menebak angka!', {
                position: "top-right",
                theme: 'dark',
            });

            setTimeout(() => {
                resetGame();
            }, 2000);
        } else {
            const newAttempts = attemptsLeft - 1;
            setAttemptsLeft(newAttempts);

            if (newAttempts <= 0) {
                setGameStatus("lost");
                toast.dark(`😢💔 Gagal menebak angka!`, {
                    position: "top-right",
                    theme: 'dark',
                });
            } else if (numericGuess < randomNumber) {
                setFeedback("↓ Terlalu rendah!");
            } else {
                setFeedback("↑ Terlalu tinggi!");
            }
        }
        setGuess("");
    };

    const resetGame = () => {
        setIsResetting(true);
        setRandomNumber(generateRandomNumber());
        setGuess("");
        setAttemptsLeft(4);
        setFeedback("");
        setGameStatus("playing");
    };

    return (
        <div className="game1-container">
            <div className="game-header">
                <h1 className="game1-title">
                    <Dice6 className="inline-icon" /> Tebak Angka
                </h1>
                <p className="game-subtitle">
                    Tebak angka dari 1 hingga 10 dalam 4 kesempatan
                </p>
            </div>

            <div className="game-box">
                <form onSubmit={handleSubmit}>
                    <label className="input-label">
                        <Target size={18} className="inline-icon" /> Masukkan Angka
                    </label>

                    <div className="attempt-indicator">
                        {Array.from({ length: 4 }, (_, i) => (
                            <span
                                key={i}
                                className={`attempt-dot ${i < 4 - attemptsLeft ? "inactive" : "active"}`}
                            ></span>
                        ))}
                    </div>


                    <div className="kiri col-md-4">
                        <input
                            type="number"
                            className="form-input"
                            value={guess}
                            onChange={(e) => setGuess(e.target.value)}
                            placeholder="1-10"
                        />
                    </div>

                    <div className="tengah">
                        {gameStatus !== "lost" ? (
                            <button type="submit" className="submit-btn">
                                <Target className="inline-icon" /> Tebak Angka
                            </button>
                        ) : (
                            <button
                                type="button"
                                className="reset-btn"
                                onClick={resetGame}
                            >
                                <RotateCcw className='inline-icon' />Coba Lagi
                            </button>
                        )}
                    </div>
                </form>

                <div className={`feedback-box ${gameStatus}`}>
                    {gameStatus === "playing" && (
                        <>
                            {feedback && <p className="hint">{feedback}</p>}
                            <p className="attempts-info">Kesempatan tersisa: {attemptsLeft}</p>
                        </>
                    )}
                    {gameStatus === "lost" && (
                        <>
                            <p className="hint">{feedback}</p>
                            <p className="attempts-info">Kesempatan tersisa: 0</p>
                        </>
                    )}
                    {gameStatus === "won" && (
                        <p className="attempts-info">Kesempatan tersisa: 4</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Game1;
