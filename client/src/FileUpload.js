import React, { useState } from "react";
import TypingArea from "./TypingArea";
import "./styles/TypingArea.css";

const FileUpload = () => {
  const [fileContent, setFileContent] = useState("");
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const [start, setStart] = useState(false);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    if (!file) {
      setError("No file selected. Please select a file to upload.");
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      setFileContent(event.target.result);
      setFileName(file.name);
      setError("");
      setStart(true); // Start the timer when file is uploaded
    };

    reader.onerror = () => {
      setError("An error occurred while reading the file.");
    };

    reader.readAsText(file);
  };

  return (
    <div>
      <div className="file-upload-wrapper">
        <label className="custom-file-upload">
          <input type="file" onChange={handleFileUpload} />
          Choose File
        </label>
        {fileName && <span className="file-name">{fileName}</span>}
      </div>
      {error && <p className="error">{error}</p>}
      {fileContent && start && (
        <TypingArea originalText={fileContent} onStart={() => setStart(true)} />
      )}
    </div>
  );
};

export default FileUpload;
