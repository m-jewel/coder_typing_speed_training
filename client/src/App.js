import React, { useState } from "react";
import CodeDisplay from "./CodeDisplay";
import TypingArea from "./TypingArea";

function App() {
  const [code, setCode] = useState("");

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      setCode(event.target.result);
    };

    reader.readAsText(file);
  };

  return (
    <div>
      <input
        type="file"
        onChange={handleFileUpload}
        accept=".js,.txt,.py,.java,.cpp"
      />
      <CodeDisplay code={code} />
      <TypingArea originalCode={code} />
    </div>
  );
}

export default App;
