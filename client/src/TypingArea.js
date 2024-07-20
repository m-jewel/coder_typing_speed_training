import React, { useState, useEffect, useRef, useCallback } from "react";
import "./styles/TypingArea.css";

const TypingArea = ({ originalText = "", onStart }) => {
  const [typedText, setTypedText] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [mistakes, setMistakes] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const typingContainerRef = useRef(null);
  const intervalRef = useRef(null);
  const totalPauseTimeRef = useRef(0);
  const pauseStartRef = useRef(null);

  useEffect(() => {
    if (startTime && !intervalRef.current) {
      intervalRef.current = setInterval(() => {
        if (!isPaused && !isCompleted) {
          setElapsedTime(
            (Date.now() - startTime - totalPauseTimeRef.current) / 1000
          );
        }
      }, 100);
    }

    return () => clearInterval(intervalRef.current);
  }, [startTime, isPaused, isCompleted]);

  useEffect(() => {
    if (typingContainerRef.current) {
      typingContainerRef.current.focus();
    }

    if (!isPaused && startTime && !isCompleted) {
      const interval = setInterval(() => {
        setElapsedTime(
          (Date.now() - startTime - totalPauseTimeRef.current) / 1000
        );
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isPaused, startTime, isCompleted]);

  const handleKeyPress = useCallback(
    (e) => {
      if (!startTime) {
        const now = Date.now();
        setStartTime(now);
        onStart();
      }

      if (isPaused || isCompleted) return; // Do nothing if paused or completed

      let newTypedText = typedText;
      if (e.key.length === 1 || e.key === "Enter" || e.key === "Tab") {
        e.preventDefault();
        if (e.key === "Enter") {
          newTypedText += "\n";
        } else if (e.key === "Tab") {
          newTypedText += "\t";
        } else {
          newTypedText += e.key;
        }
      } else if (e.key === "Backspace") {
        newTypedText = newTypedText.slice(0, -1);
      }

      setTypedText(newTypedText);

      if (e.key !== "Backspace") {
        // Count mistakes only when typing new characters
        if (newTypedText[typedText.length] !== originalText[typedText.length]) {
          setMistakes(mistakes + 1);
        }
      }

      // Check if the typing is complete
      if (newTypedText === originalText) {
        setIsCompleted(true);
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    },
    [
      typedText,
      originalText,
      isPaused,
      startTime,
      onStart,
      mistakes,
      isCompleted,
    ]
  );

  useEffect(() => {
    const handleKeyPressWrapper = (e) => {
      handleKeyPress(e);
    };
    window.addEventListener("keydown", handleKeyPressWrapper);
    return () => {
      window.removeEventListener("keydown", handleKeyPressWrapper);
    };
  }, [handleKeyPress]);

  const calculateAccuracy = () => {
    return ((typedText.length - mistakes) / originalText.length) * 100;
  };

  const calculateWPM = () => {
    const wordsTyped = typedText
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length; // Correctly count words
    const minutesElapsed = elapsedTime / 60;
    return minutesElapsed > 0 ? wordsTyped / minutesElapsed : 0;
  };

  const calculateCPM = () => {
    const minutesElapsed = elapsedTime / 60;
    return minutesElapsed > 0 ? typedText.length / minutesElapsed : 0;
  };

  const renderText = () => {
    return originalText.split("").map((char, index) => {
      let className = "";
      let color = "";

      if (index < typedText.length) {
        if (typedText[index] === char) {
          color = "green";
        } else {
          color = "red";
        }
      }

      if (char === " ") {
        className = "space";
      } else if (char === "\n") {
        className = "newline";
      } else if (char === "\t") {
        className = "tab";
      }

      return (
        <span
          key={index}
          className={className}
          style={{ backgroundColor: color }}
        >
          {char}
        </span>
      );
    });
  };

  const handleRestart = () => {
    setTypedText("");
    setMistakes(0);
    setStartTime(null);
    setElapsedTime(0);
    setIsCompleted(false);
    totalPauseTimeRef.current = 0;
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    if (typingContainerRef.current) {
      typingContainerRef.current.focus();
    }
  };

  const handlePause = () => {
    if (!isPaused) {
      pauseStartRef.current = Date.now();
      clearInterval(intervalRef.current);
    } else {
      const pauseDuration = Date.now() - pauseStartRef.current;
      totalPauseTimeRef.current += pauseDuration;
      intervalRef.current = setInterval(() => {
        setElapsedTime(
          (Date.now() - startTime - totalPauseTimeRef.current) / 1000
        );
      }, 100);
    }
    setIsPaused(!isPaused);
  };

  const handleStop = () => {
    setIsCompleted(true);
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  };

  return (
    <div
      className="typing-container"
      id="typing-area"
      tabIndex={0}
      ref={typingContainerRef}
    >
      <div className="results">
        <p>Accuracy: {originalText ? calculateAccuracy().toFixed(2) : 0}%</p>
        <p>Mistakes: {mistakes}</p>
        <p>Time Elapsed: {originalText ? elapsedTime.toFixed(2) : 0} seconds</p>
        <p>WPM: {originalText ? calculateWPM().toFixed(2) : 0}</p>
        <p>CPM: {originalText ? calculateCPM().toFixed(2) : 0}</p>
      </div>
      <div className="type-test">
        <pre className="original-text">{renderText()}</pre>
      </div>
      <div className="controls">
        <button onClick={handleRestart}>Restart</button>
        <button onClick={handlePause}>{isPaused ? "Resume" : "Pause"}</button>
        <button onClick={handleStop}>Stop</button>
      </div>
      {isCompleted && (
        <div className="result-popup">
          <h2>Results</h2>
          <p>Accuracy: {calculateAccuracy().toFixed(2)}%</p>
          <p>Mistakes: {mistakes}</p>
          <p>Time Elapsed: {elapsedTime.toFixed(2)} seconds</p>
          <p>WPM: {calculateWPM().toFixed(2)}</p>
          <p>CPM: {calculateCPM().toFixed(2)}</p>
          <button onClick={handleRestart}>Restart</button>
        </div>
      )}
    </div>
  );
};

export default TypingArea;
