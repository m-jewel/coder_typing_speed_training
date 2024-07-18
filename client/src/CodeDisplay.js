import React from "react";
import Prism from "prismjs";
import "prismjs/themes/prism.css";

const CodeDisplay = ({ code }) => {
  React.useEffect(() => {
    Prism.highlightAll();
  }, [code]);

  return (
    <pre>
      <code className="language-javascript">{code}</code>
    </pre>
  );
};

export default CodeDisplay;
