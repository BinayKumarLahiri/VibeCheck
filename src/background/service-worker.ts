import * as ort from 'onnxruntime-web';
import preprocessText from '../utils/preprocessor';
interface Model {
  session: ort.InferenceSession | null,
  status: string // ("pending","ready","error")
  message: string | null // Error Message
}

const initialModelState: Model = { session: null, status: "pending", message: null }
let model = initialModelState

async function loadModel(): Promise<Model> {
  try {
    const modelPath = chrome.runtime.getURL('model/model.onnx');
    const session = await ort.InferenceSession.create(modelPath);
    // console.log('✅ ONNX model loaded successfully:', session.inputNames);
    return { session, status: "ready", message: null }
  } catch (err: any) {
    console.error('❌ Failed to load ONNX model:', err);
    return { session: null, status: "error", message: err.message }
  }
}

chrome.runtime.onInstalled.addListener(async () => {
  if (!model.session) {
    console.log('⏳ Loading ONNX model...');
    model = await loadModel();
    if (model.session) {
      console.log('✅ ONNX model loaded successfully:', model.session?.inputNames);
      console.log('inputNames:', model.session.inputNames);
      console.log('inputMetadata:', (model.session as any).inputMetadata); // may include dims info

      chrome.storage.sync.set({
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
        }
      }, () => {
        if (chrome.runtime.lastError) {
          console.error("Error setting sync storage:", chrome.runtime.lastError);
        } else {
          console.log('User preferences saved to sync storage.');
        }
      });
    }
    else console.log("Failed to load the ONNX Model", model.message)
  }
});


chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.type === 'analyze') {
    (async () => {
      try {
        if (!model.session) model = await loadModel();
        const text = preprocessText(msg.text);
        // const sess = await loadModel();

        // // The model expects a single text string input
        console.log("Creating the Input Tensor")
        // const inputTensor = new ort.Tensor('string', [text]);
        const inputTensor = new ort.Tensor('string', [text], [1, 1])
        console.log("Input Tensor Created", inputTensor)
        console.log("Waiting for results")
        const results = await model.session?.run({ input: inputTensor });
        console.log("Results:", results)
        // const [neg, pos] = results.output.data as Float32Array;
        if (!results || !results["probabilities"]) {
          sendResponse({ status: "error", result: [0.5, 0.5], message: "No results or probability output from model" });
          return;
        }
        const probabilities = results["probabilities"];
        const probArray = Array.isArray(probabilities.data)
          ? probabilities.data
          : Array.from(probabilities.data as Float32Array);
        sendResponse({ status: "sucess", result: probArray, message: "Analysis Done" })
        // sendResponse({ sentiment: pos, neg });
      } catch (err: any) {
        console.error(err);
        sendResponse({ status: "error", result: [0.5, 0.5], message: `Failed to Analyze: ${err.message}` })
      }
    })()
  }
  return true;
})
