import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Anti-DevTools measures
if (import.meta.env.PROD) {
  // Block keyboard shortcuts
  document.addEventListener("keydown", (e) => {
    if (
      e.key === "F12" ||
      (e.ctrlKey && e.shiftKey && ["I", "J", "C"].includes(e.key)) ||
      (e.ctrlKey && e.key === "U") ||
      (e.metaKey && e.altKey && ["I", "J", "C"].includes(e.key)) ||
      (e.metaKey && e.key === "U")
    ) {
      e.preventDefault();
      e.stopPropagation();
    }
  });

  // Disable right-click
  document.addEventListener("contextmenu", (e) => e.preventDefault());
}

createRoot(document.getElementById("root")!).render(<App />);
