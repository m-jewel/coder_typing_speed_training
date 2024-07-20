import React, { useState } from "react";
import TypingArea from "./TypingArea";
import { TypingProvider } from "./context/TypingProvider";
import "./styles/TypingArea.css";

/**
 * FileUpload component handles the file selection and reading process.
 * It displays the selected file name and initiates the typing test.
 */
const FileUpload = () => {
  const [fileContent, setFileContent] = useState("");
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const [start, setStart] = useState(false);

  /**
   * Handle file upload and read its content.
   */
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
    <TypingProvider>
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
          <TypingArea
            originalText={fileContent}
            onStart={() => setStart(true)}
          />
        )}
      </div>
    </TypingProvider>
  );
};

export default FileUpload;
