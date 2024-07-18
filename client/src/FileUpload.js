import React, { useState } from "react";
import TypingArea from "./TypingArea";

const FileUpload = () => {
  const [fileContent, setFileContent] = useState("");

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      setFileContent(event.target.result);
    };

    reader.readAsText(file);
  };

  return (
    <div>
      <input type="file" onChange={handleFileUpload} />
      {fileContent && <TypingArea originalCode={fileContent} />}
    </div>
  );
};

export default FileUpload;
