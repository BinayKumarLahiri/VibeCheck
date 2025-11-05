// src/components/Overlay.tsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { sentimentToEmotion, defaultEmotion } from "../utils/postprocessor";
import type { EmotionData } from "../utils/postprocessor";
// import warning from "/warning.png";

interface OverlayProps {
  probs: number[]; // [pos, neg]
}

const Overlay: React.FC<OverlayProps> = ({ probs }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [showWarning, setShowWarning] = useState(false);
  const [emotion, setEmotion] = useState<EmotionData>(defaultEmotion);
  const warning = chrome.runtime.getURL("warning.png");

  const [childProtection, setChildProtection] = useState<boolean>(false);
  const [colorType, setColorType] = useState<string>("gradient");
  const [colorMap, setColorMap] = useState<Record<string, string>>({
    "Happy 😀": "#6afcbb",
    "Excited 😃": "#68fd8b",
    "Alert ⚠️": "#a1fd68",
    "Tense 😬": "#ddfd68",
    "Angry 😡": "#fafd68",
    "Distressed 😩": "#fdae68",
    "Sad 😟": "#fd8b68",
    "Depressed 😔": "#fd6872",
    "Bored 🥱": "#e168fd",
    "Calm 😊": "#68dffd",
    "Relaxed ☺️": "#688dfd",
    "Content 😆": "#68fdfd",
  });

  useEffect(() => {
    chrome.storage.sync.get(
      {
        childProtection: false,
        colorType: "gradient",
        colorMap: {
          "Happy 😀": "#6afcbb",
          "Excited 😃": "#68fd8b",
          "Alert ⚠️": "#a1fd68",
          "Tense 😬": "#ddfd68",
          "Angry 😡": "#fafd68",
          "Distressed 😩": "#fdae68",
          "Sad 😟": "#fd8b68",
          "Depressed 😔": "#fd6872",
          "Bored 🥱": "#e168fd",
          "Calm 😊": "#68dffd",
          "Relaxed ☺️": "#688dfd",
          "Content 😆": "#68fdfd",
        },
      },
      (result) => {
        if (chrome.runtime.lastError) {
          console.error(
            "Error getting sync storage:",
            chrome.runtime.lastError
          );
          return;
        }
        console.log(result["childProtection"]);
        setChildProtection(result["childProtection"]);
        setColorType(result["colorType"]);
        setColorMap(result["colorMap"]);
      }
    );
  }, []); // Only runs once on mount

  useEffect(() => {
    // When probs change we want to (re)show the overlay and start a single timeout
    setIsVisible(true);
    const emotionData: EmotionData = sentimentToEmotion(probs[0], probs[1]);
    // deterministically set/clear the warning flag based on valence
    console.log(childProtection);
    if (childProtection) setShowWarning(emotionData.valence < -0.5);
    setEmotion({ ...emotionData });

    // Remove overlay after 4s
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 4000);
    return () => clearTimeout(timer);
  }, [probs, childProtection]);

  if (!isVisible && !showWarning) return null;

  if (showWarning)
    return (
      <div className="w-screen h-screen bg-[#121212d4] fixed top-0 left-0 z-[2147483647] pointer-events-none flex items-center justify-center">
        {/* Put here the Warning Pop Up UI */}
        <div className="w-2/3 max-w-2xl aspect-[4/3] bg-yellow-500 rounded-sm pointer-events-auto">
          <div className="w-full h-3/5 rounded-t-sm p-2 flex flex-col items-center justify-center gap-2">
            <img src={warning} alt="Warning" className="h-1/2" />
            <h1 className="text-6xl font-bold text-neutral-900">Warning!</h1>
            <p className="text-sm font-semibold">
              This site contains a very strong negative Emotion
            </p>
          </div>
          <div className="w-full h-2/5 rounded-b-sm flex flex-col items-center justify-center gap-2">
            <h2 className="text-xl font-bold text-neutral-900">
              Emotion Detected: {emotion.emotion}
            </h2>
            <p className="text-xs text-center m-2">
              Child Protection is currently active. Our analysis has detected a
              very strong negative emotional rating on this site, indicating
              content that may be highly distressing or inappropriate for this
              user.
            </p>
            <div
              className="w-full p-2 flex items-center justify-between gap-2"
              style={{
                width: "100%",
                padding: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "8px",
              }}>
              <button
                className=" w-1/2 px-3 py-2 bg-neutral-800 rounded-sm text-neutral-100 cursor-pointer"
                style={{
                  width: "50%",
                  padding: "12px 8px",
                  backgroundColor: "#262626",
                  color: "#f5f5f5",
                  cursor: "pointer",
                  textAlign: "center",
                }}
                onClick={() => {
                  console.log("Going Back");
                  history.back();
                }}>
                Leave Page
              </button>
              <button
                className=" w-1/2 px-3 py-2 bg-neutral-800 rounded-sm text-neutral-100 cursor-pointer"
                style={{
                  width: "50%",
                  padding: "12px 8px",
                  backgroundColor: "#262626",
                  color: "#f5f5f5",
                  cursor: "pointer",
                  textAlign: "center",
                }}
                onClick={() => {
                  console.log("Hello");
                  setIsVisible(false);
                  setShowWarning(false);
                }}>
                Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    );

  if (isVisible)
    return (
      <motion.div
        initial={{ boxShadow: `0px 0px 0px ${emotion.color} inset` }}
        animate={{
          boxShadow: [
            `0px 0px 0px ${
              colorType === "gradient"
                ? emotion.color
                : colorMap[emotion.emotion]
            } inset`,
            `0px 0px 50px ${
              colorType === "gradient"
                ? emotion.color
                : colorMap[emotion.emotion]
            } inset`,
            `0px 0px 0px ${
              colorType === "gradient"
                ? emotion.color
                : colorMap[emotion.emotion]
            } inset`,
          ],
        }}
        transition={{ duration: 2, ease: "easeInOut", repeat: 1 }}
        style={{
          width: "100vw",
          height: "100vh",
          background: "none",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 1000000,
          pointerEvents: "none",
        }}
      />
    );
};

export default Overlay;
