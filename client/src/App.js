import React from "react";
import FileUpload from "./FileUpload";
import "./styles/App.css";

/**
 * App component is the main entry point of the application.
 * It displays the header and the FileUpload component.
 */
const App = () => {
  return (
    <div>
      <h1>Typing Training</h1>
      <FileUpload />
    </div>
  );
};

export default App;
