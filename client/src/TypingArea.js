import React, { useState, useEffect, useRef, useCallback } from "react";
import "./styles/TypingArea.css";

const TypingArea = ({ originalText = "", onStart }) => {
  const [typedText, setTypedText] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [mistakes, setMistakes] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const typingContainerRef = useRef(null);
  const intervalRef = useRef(null);
  const totalPauseTimeRef = useRef(0);
  const pauseStartRef = useRef(null);

  useEffect(() => {
    if (startTime && !intervalRef.current) {
      intervalRef.current = setInterval(() => {
        if (!isPaused) {
          setElapsedTime(
            (Date.now() - startTime - totalPauseTimeRef.current) / 1000
          );
        }
      }, 100);
    }

    return () => clearInterval(intervalRef.current);
  }, [startTime, isPaused]);

  useEffect(() => {
    if (typingContainerRef.current) {
      typingContainerRef.current.focus();
    }

    if (!isPaused && startTime) {
      const interval = setInterval(() => {
        setElapsedTime(
          (Date.now() - startTime - totalPauseTimeRef.current) / 1000
        );
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isPaused, startTime]);

  const handleKeyPress = useCallback(
    (e) => {
      if (!startTime) {
        const now = Date.now();
        setStartTime(now);
        onStart();
      }

      if (isPaused) return; // Do nothing if paused

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
    },
    [typedText, originalText, isPaused, startTime, onStart, mistakes]
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
      </div>
    </div>
  );
};

export default TypingArea;
