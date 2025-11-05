import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";

const container = document.createElement("div");
container.id = "vibeguard-root";
document.body.appendChild(container);
createRoot(container).render(<App />);

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "GET_TEXT") {
    const text = document.body.innerText;
    sendResponse({ text });
  }
  return true;
});
