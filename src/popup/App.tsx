import { useEffect, useState } from "react";
// import image from "/image.png";
import image from "../../public/image.png";
import { sentimentToEmotion, type EmotionData } from "../utils/postprocessor";
import { RiResetLeftFill } from "react-icons/ri";

export default function App() {
  const [emotion, setEmotion] = useState<EmotionData>({
    valence: 0.5,
    arousal: 0.5,
    angle: 45,
    magnitude: 1,
    emotion: "Happy😆",
    color: "rgb(255,0,0)",
  });
  const [show, setShow] = useState<boolean>(false);
  const [childProtection, setChildProtection] = useState<boolean>(false);
  const [colorType, setColorType] = useState<string>("gradient");
  const [colorMap, setColorMap] = useState({
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
        setChildProtection(result["childProtection"]);
        setColorType(result["colorType"]);
        setShow(result["colorType"] !== "gradient");
        setColorMap(result["colorMap"]);
      }
    );

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      if (activeTab.id !== undefined) {
        chrome.tabs.sendMessage(
          activeTab.id,
          { type: "GET_TEXT" },
          (response) => {
            console.log("Response from content script:", response.text);
            const text = response.text;
            // Got the Text Now send it for analysis
            chrome.runtime.sendMessage({ type: "analyze", text }, (res) => {
              console.log("Response:", res);
              if (res?.status === "sucess") {
                console.log("Successfully analyzed page.", res.result);
                // setResult(res);
                // Got the Result now send it for post processing
                const emotionData: EmotionData = sentimentToEmotion(
                  res?.result[0],
                  res?.result[1]
                );
                console.log(emotionData);
                setEmotion({ ...emotionData });
              } else {
                console.log("Failed to analyze the page.", res.message);
              }
            });
          }
        );
      }
    });
  }, []);

  return (
    <div className="w-[300px] h-max-[600px] flex flex-col p-3 gap-2 border-2 bg-neutral-800 rounded-sm">
      <div className="w-full flex items-center justify-between">
        <h1 className="text-lg text-neutral-100 font-bold">Page Analysis</h1>
        <RiResetLeftFill
          className="text-lg text-neutral-100 cursor-pointer"
          onClick={() => {
            chrome.storage.sync.set(
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
              () => {
                if (chrome.runtime.lastError) {
                  console.error(
                    "Error setting sync storage:",
                    chrome.runtime.lastError
                  );
                } else {
                  console.log("User preferences saved to sync storage.");
                }
              }
            );

            setChildProtection(false);
            setColorType("gradient");
            setColorMap({
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
          }}
        />
      </div>
      <div className="w-full flex flex-col gap-3">
        <div className="w-full">
          <div
            className="w-[208px] left-12 top-12 aspect-square rounded-full absolute"
            style={{
              boxShadow: `0px 0px 40px 0px ${
                "rgba(" +
                emotion.color.substring(4, emotion.color.length - 1) +
                ",0.3)"
              }`,
            }}></div>
          <img src={image} alt="Visual Image" className="w-3/4 m-auto" />
          <div
            className={`w-1/3 h-[3px] bg-neutral-800 relative top-[-105px] left-[137px]`}
            style={{
              transform: `rotate(${-1 * emotion.angle}deg)`,
              transformOrigin: "left center",
            }}></div>
        </div>

        <div className="w-full flex flex-col  bg-neutral-900 p-2 rounded-sm gap-2">
          <p className="text-sm text-neutral-100 font-semibold">
            Emotion: {emotion.emotion}
          </p>
          <div className="flex items-center justify-between">
            <p className="text-sm text-neutral-100 font-semibold">
              Valence: {emotion.valence.toFixed(3)}
            </p>
            <p className="text-sm text-neutral-100 font-semibold">
              Arousal: {emotion.arousal.toFixed(3)}
            </p>
          </div>
        </div>

        <div className="w-full flex flex-col  bg-neutral-900 p-2 rounded-sm gap-2 max-h-[200px]">
          <p className="text-sm text-neutral-100 font-semibold">
            Animation Color:
          </p>
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center gap-1">
              <input
                type="radio"
                id="gradient"
                name="color"
                value={"gradient"}
                checked={!show}
                onChange={() => {
                  setShow(false);
                  chrome.storage.sync.set(
                    {
                      colorType: "gradient",
                    },
                    () => {
                      if (chrome.runtime.lastError) {
                        console.error(
                          "Error setting sync storage:",
                          chrome.runtime.lastError
                        );
                      } else {
                        console.log("User preferences saved to sync storage.");
                      }
                    }
                  );
                }}
                className="cursor-pointer"
              />
              <label
                htmlFor="gradient"
                className="text-sm text-neutral-100 font-semibold cursor-pointer">
                Gradient
              </label>
            </div>
            <div className="flex items-center gap-1">
              <input
                type="radio"
                id="discrete"
                name="color"
                value={"discrete"}
                checked={show}
                onChange={() => {
                  setShow(true);
                  chrome.storage.sync.set(
                    {
                      colorType: "discrete",
                    },
                    () => {
                      if (chrome.runtime.lastError) {
                        console.error(
                          "Error setting sync storage:",
                          chrome.runtime.lastError
                        );
                      } else {
                        console.log("User preferences saved to sync storage.");
                      }
                    }
                  );
                }}
                className="cursor-pointer"
              />
              <label
                htmlFor="discrete"
                className="text-sm text-neutral-100 font-semibold cursor-pointer">
                Discrete
              </label>
            </div>
          </div>

          {/* Collapsable Color Setter */}

          <div
            className={`w-full flex flex-col  bg-neutral-800 p-2 rounded-sm gap-2 max-h-2/3 overflow-y-scroll no-scrollbar h-max-2/3 ${
              show ? "flex" : "hidden"
            }`}>
            <p className="text-sm text-neutral-100 font-semibold">Colors:</p>
            <div className="w-full flex flex-col rounded-sm gap-2">
              {/* <div className="w-full flex items-center justify-between">
                <p className="text-sm text-neutral-100 font-semibold">
                  Happy:{" "}
                </p>
                <input type="color" id="happy" />
              </div>
              <div className="w-full flex items-center justify-between">
                <p className="text-sm text-neutral-100 font-semibold">
                  Content:{" "}
                </p>
                <input type="color" id="content" />
              </div>
              <div className="w-full flex items-center justify-between">
                <p className="text-sm text-neutral-100 font-semibold">
                  Relaxed:{" "}
                </p>
                <input type="color" id="relaxed" />
              </div>
              <div className="w-full flex items-center justify-between">
                <p className="text-sm text-neutral-100 font-semibold">Calm: </p>
                <input type="color" id="clam" />
              </div>
              <div className="w-full flex items-center justify-between">
                <p className="text-sm text-neutral-100 font-semibold">
                  Bored:{" "}
                </p>
                <input type="color" id="bored" />
              </div>
              <div className="w-full flex items-center justify-between">
                <p className="text-sm text-neutral-100 font-semibold">
                  Depressed:{" "}
                </p>
                <input type="color" id="depressed" />
              </div>
              <div className="w-full flex items-center justify-between">
                <p className="text-sm text-neutral-100 font-semibold">Sad: </p>
                <input type="color" id="sad" />
              </div>
              <div className="w-full flex items-center justify-between">
                <p className="text-sm text-neutral-100 font-semibold">
                  Distressed:{" "}
                </p>
                <input type="color" id="distressed" />
              </div>
              <div className="w-full flex items-center justify-between">
                <p className="text-sm text-neutral-100 font-semibold">
                  Angry:{" "}
                </p>
                <input type="color" id="angry" />
              </div>
              <div className="w-full flex items-center justify-between">
                <p className="text-sm text-neutral-100 font-semibold">
                  Tense:{" "}
                </p>
                <input type="color" id="tense" />
              </div>
              <div className="w-full flex items-center justify-between">
                <p className="text-sm text-neutral-100 font-semibold">
                  Alert:{" "}
                </p>
                <input type="color" id="alert" />
              </div>
              <div className="w-full flex items-center justify-between">
                <p className="text-sm text-neutral-100 font-semibold">
                  Excited:{" "}
                </p>
                <input type="color" id="excited" />
              </div> */}

              {Object.entries(colorMap).map(([id, value]) => {
                return (
                  <div className="w-full flex items-center justify-between">
                    <p className="text-sm text-neutral-100 font-semibold">
                      {id}
                    </p>
                    <input
                      type="color"
                      value={value}
                      id={id}
                      onChange={(e) => {
                        console.log(e.target.value);
                        const newColorMap = {
                          ...colorMap,
                          [id]: e.target.value,
                        };
                        setColorMap(newColorMap);
                        chrome.storage.sync.set(
                          {
                            colorMap: newColorMap,
                          },
                          () => {
                            if (chrome.runtime.lastError) {
                              console.error(
                                "Error setting sync storage:",
                                chrome.runtime.lastError
                              );
                            } else {
                              console.log(
                                "User preferences saved to sync storage."
                              );
                            }
                          }
                        );
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="w-full flex bg-neutral-900 p-2 rounded-sm items-center justify-between">
          <p className="text-sm text-neutral-100 font-semibold">
            Enable Child Protection:{" "}
          </p>
          <label className="switch">
            <input
              type="checkbox"
              checked={childProtection}
              onChange={(e) => {
                setChildProtection(e.target.checked);
                chrome.storage.sync.set(
                  {
                    childProtection: e.target.checked,
                  },
                  () => {
                    if (chrome.runtime.lastError) {
                      console.error(
                        "Error setting sync storage:",
                        chrome.runtime.lastError
                      );
                    } else {
                      console.log("User preferences saved to sync storage.");
                    }
                  }
                );
              }}
            />
            <span className="slider round"></span>
          </label>
        </div>
      </div>
    </div>
  );
}
