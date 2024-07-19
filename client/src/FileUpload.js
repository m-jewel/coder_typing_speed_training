import React, { useState } from "react";
import TypingArea from "./TypingArea";

const FileUpload = () => {
  const [fileContent, setFileContent] = useState("");
  const [error, setError] = useState("");

  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    if (!file) {
      setError("No file selected. Please select a file to upload.");
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      setFileContent(event.target.result);
      setError("");
    };

    reader.onerror = () => {
      setError("An error occurred while reading the file.");
    };

    reader.readAsText(file);
  };

  return (
    <div>
      <input type="file" onChange={handleFileUpload} />
      {error && <p className="error">{error}</p>}
      {fileContent && <TypingArea originalText={fileContent} />}
    </div>
  );
};

export default FileUpload;
