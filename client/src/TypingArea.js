import React, { useState, useEffect } from "react";

const TypingArea = ({ originalText = "" }) => {
  const [typedText, setTypedText] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [mistakes, setMistakes] = useState(0);

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

  const handleInputChange = (e) => {
    setTypedText(e.target.value);
  };

  const calculateAccuracy = () => {
    return ((typedText.length - mistakes) / originalText.length) * 100;
  };

  const calculateTimeElapsed = () => {
    return (Date.now() - startTime) / 1000; // seconds
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

  return (
    <div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <textarea
          id="typing-area"
          value={typedText}
          onChange={handleInputChange}
          style={{ width: "100%", height: "150px", marginBottom: "20px" }}
        ></textarea>
        <pre
          style={{
            background: "#f5f5f5",
            padding: "10px",
            borderRadius: "5px",
            overflow: "auto",
            whiteSpace: "pre-wrap",
            wordWrap: "break-word",
          }}
        >
          {originalText.split("").map((char, index) => {
            let color;
            if (index < typedText.length) {
              color = char === typedText[index] ? "green" : "red";
            }
            return (
              <span key={index} style={{ backgroundColor: color }}>
                {char}
              </span>
            );
          })}
        </pre>
      </div>
      <div>
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
