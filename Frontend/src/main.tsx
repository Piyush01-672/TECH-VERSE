import { createRoot } from "react-dom/client";
import React, { useState, useEffect } from "react";
import App from "./App.tsx";
import "./index.css";
import Loading from "./components/Loading";

// Create a wrapper component to handle initial loading


const Root: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // simulate initial app load (or fetch any initialization data here)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // 1 second, adjust as needed

    return () => clearTimeout(timer);
  }, []);

  return loading ? <Loading show={true} /> : <App />;
};

createRoot(document.getElementById("root")!).render(<Root />);
