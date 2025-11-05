import { useCallback, useEffect, useState } from "react";
import "./styles.css";
import Overlay from "./Overlay";

const App: React.FC = () => {
  const [result, setResult] = useState({
    status: "pending",
    result: [0.5, 0.5],
    message: "",
  });

  const Analyze = useCallback(async () => {
    // console.log(chrome.tabs);
    console.log("Execution Starts");
    console.log("Scrapping the Text");

    // Getting the page text for analysis
    const text = document.body.innerText;

    console.log("Scrapping the Text: Completed");

    chrome.runtime.sendMessage({ type: "analyze", text }, (res) => {
      console.log("Response:", res);
      if (res?.status === "sucess") {
        console.log("Successfully analyzed page.", res.result);
        setResult(res);
      } else {
        console.log("Failed to analyze the page.", res.message);
      }
    });
  }, []);

  useEffect(() => {
    Analyze();
  }, [Analyze]);

  if (result.status == "pending") return null;

  return (
    <>
      <Overlay probs={result.result} />
    </>
  );
};

export default App;
