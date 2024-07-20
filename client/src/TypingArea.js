import React, { useCallback, useEffect, useRef } from "react";
import { useTypingContext } from "./context/TypingProvider";
import "./styles/TypingArea.css";

/**
 * TypingArea component handles the typing test functionality.
 * It calculates the elapsed time, mistakes, WPM, and CPM.
 * It also handles the pause, resume, restart, and stop functionalities.
 *
 * @param {string} originalText - The original text to be typed.
 * @param {function} onStart - Callback function to be called when typing starts.
 */
const TypingArea = ({ originalText = "", onStart }) => {
  const {
    typedText,
    setTypedText,
    startTime,
    setStartTime,
    mistakes,
    setMistakes,
    isPaused,
    setIsPaused,
    isCompleted,
    setIsCompleted,
    elapsedTime,
    setElapsedTime,
    totalPauseTimeRef,
    pauseStartRef,
    startTimer,
    stopTimer,
  } = useTypingContext();

  const typingContainerRef = useRef(null);

  // Focus on the typing container when component mounts
  useEffect(() => {
    if (typingContainerRef.current) {
      typingContainerRef.current.focus();
    }
  }, []);

  // Handle key presses with debounce to minimize re-renders
  const handleKeyPress = useCallback(
    (e) => {
      let newTypedText = typedText;
      if (e.key.length === 1 || e.key === "Enter" || e.key === "Tab") {
        e.preventDefault();
        if (!startTime) {
          const now = Date.now();
          setStartTime(now);
          onStart();
        }

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
        if (newTypedText[typedText.length] !== originalText[typedText.length]) {
          setMistakes((prev) => prev + 1);
        }
      }

      if (newTypedText === originalText) {
        setIsCompleted(true);
        stopTimer();
      }
    },
    [typedText, originalText, startTime, onStart, isPaused, isCompleted]
  );

  // Add and remove keydown event listener
  useEffect(() => {
    const handleKeyPressWrapper = (e) => {
      handleKeyPress(e);
    };
    window.addEventListener("keydown", handleKeyPressWrapper);
    return () => {
      window.removeEventListener("keydown", handleKeyPressWrapper);
    };
  }, [handleKeyPress]);

  // Calculate typing accuracy
  const calculateAccuracy = () => {
    return ((typedText.length - mistakes) / originalText.length) * 100;
  };

  // Calculate words per minute
  const calculateWPM = () => {
    const wordsTyped = typedText
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
    const minutesElapsed = elapsedTime / 60;
    return minutesElapsed > 0 ? wordsTyped / minutesElapsed : 0;
  };

  // Calculate characters per minute
  const calculateCPM = () => {
    const minutesElapsed = elapsedTime / 60;
    return minutesElapsed > 0 ? typedText.length / minutesElapsed : 0;
  };

  // Render the original text with colors indicating correct and incorrect characters
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

  // Handle restart button click
  const handleRestart = () => {
    setTypedText("");
    setMistakes(0);
    setStartTime(null);
    setElapsedTime(0);
    setIsCompleted(false);
    totalPauseTimeRef.current = 0;
    stopTimer();
    if (typingContainerRef.current) {
      typingContainerRef.current.focus();
    }
  };

  // Handle pause button click
  const handlePause = () => {
    if (!isPaused) {
      pauseStartRef.current = Date.now();
      stopTimer();
    } else {
      const pauseDuration = Date.now() - pauseStartRef.current;
      totalPauseTimeRef.current += pauseDuration;
      if (!startTime) {
        setStartTime(Date.now() - totalPauseTimeRef.current);
      }
      startTimer();
    }
    setIsPaused(!isPaused);
  };

  // Handle stop button click
  const handleStop = () => {
    setIsCompleted(true);
    stopTimer();
  };

  return (
    <div className="typing-container">
      <div className="header">
        <div className="controls">
          <button onClick={handleRestart}>Restart</button>
          <button onClick={handlePause}>{isPaused ? "Resume" : "Pause"}</button>
          <button onClick={handleStop}>Stop</button>
        </div>
      </div>
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
