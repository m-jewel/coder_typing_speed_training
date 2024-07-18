import React, { useState } from "react";

const TypingArea = ({ originalCode }) => {
  const [typedCode, setTypedCode] = useState("");
  const [startTime, setStartTime] = useState(null);

  const handleInputChange = (e) => {
    const value = e.target.value;

    if (!startTime) {
      setStartTime(Date.now());
    }

    setTypedCode(value);
  };

  const calculateAccuracy = () => {
    let correctChars = 0;

    for (let i = 0; i < typedCode.length; i++) {
      if (typedCode[i] === originalCode[i]) {
        correctChars++;
      }
    }

    return (correctChars / originalCode.length) * 100;
  };

  const calculateTimeElapsed = () => {
    return (Date.now() - startTime) / 1000; // seconds
  };

  return (
    <div>
      <textarea
        value={typedCode}
        onChange={handleInputChange}
        style={{ width: "100%", height: "300px" }}
      ></textarea>
      <div>
        <p>Accuracy: {calculateAccuracy().toFixed(2)}%</p>
        <p>Time Elapsed: {calculateTimeElapsed().toFixed(2)} seconds</p>
      </div>
      <pre>
        <code>{originalCode}</code>
      </pre>
    </div>
  );
};

export default TypingArea;
