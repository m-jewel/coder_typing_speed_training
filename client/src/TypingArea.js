import React, { useState, useEffect, useRef, useCallback } from "react";
import "./styles/TypingArea.css";

const TypingArea = ({ originalText = "" }) => {
  const [typedText, setTypedText] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [mistakes, setMistakes] = useState(0);
  const typingContainerRef = useRef(null);

  useEffect(() => {
    if (typedText.length === 1) {
      setStartTime(Date.now());
    }

    const calculateMistakes = () => {
      let mistakeCount = 0;
      for (let i = 0; i < typedText.length; i++) {
        if (typedText[i] !== originalText[i]) {
          mistakeCount++;
        }
      }
      setMistakes(mistakeCount);
    };

    if (originalText) {
      calculateMistakes();
    }
  }, [typedText, originalText]);

  useEffect(() => {
    if (typingContainerRef.current) {
      typingContainerRef.current.focus();
    }
  }, []);

  const handleKeyPress = useCallback(
    (e) => {
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

      const isCorrect =
        originalText.slice(0, newTypedText.length) === newTypedText;
      if (!isCorrect) {
        setMistakes((prevMistakes) => prevMistakes + 1);
      }
    },
    [typedText, originalText]
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

  const calculateTimeElapsed = () => {
    return (Date.now() - startTime) / 1000;
  };

  const calculateWPM = () => {
    const wordsTyped = typedText.split(" ").length;
    const minutesElapsed = calculateTimeElapsed() / 60;
    return wordsTyped / minutesElapsed;
  };

  const calculateCPM = () => {
    const minutesElapsed = calculateTimeElapsed() / 60;
    return typedText.length / minutesElapsed;
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

  return (
    <div
      className="typing-container"
      id="typing-area"
      tabIndex={0}
      ref={typingContainerRef}
    >
      <div className="type-test">
        <pre className="original-text">{renderText()}</pre>
      </div>
      <div className="results">
        <p>Accuracy: {originalText ? calculateAccuracy().toFixed(2) : 0}%</p>
        <p>Mistakes: {mistakes}</p>
        <p>
          Time Elapsed: {originalText ? calculateTimeElapsed().toFixed(2) : 0}{" "}
          seconds
        </p>
        <p>WPM: {originalText ? calculateWPM().toFixed(2) : 0}</p>
        <p>CPM: {originalText ? calculateCPM().toFixed(2) : 0}</p>
      </div>
    </div>
  );
};

export default TypingArea;
