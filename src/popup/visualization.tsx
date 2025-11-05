// src/components/EmotionCircumplex.jsx
import { motion } from "framer-motion";
import { sentimentToEmotion } from "../utils/postprocessor";

export default function EmotionCircumplex({
  neg,
  pos,
}: {
  neg: number;
  pos: number;
}) {
  const { valence, arousal, angle, magnitude, emotion, color } =
    sentimentToEmotion(neg, pos);

  // Convert valence/arousal into canvas coordinates
  const radius = 150;
  const x = valence * radius;
  const y = -arousal * radius; // invert y-axis for display

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl font-semibold mb-2">Circumplex Emotion Model</h2>
      <div className="relative w-[320px] h-[320px] border-2 border-gray-400 rounded-full flex items-center justify-center">
        {/* Axis Lines */}
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gray-400" />
        <div className="absolute left-1/2 top-0 h-full w-[1px] bg-gray-400" />

        {/* Emotion Dot */}
        <motion.div
          className="absolute w-4 h-4 rounded-full shadow-lg"
          style={{
            backgroundColor: color,
            left: `calc(50% + ${x}px - 8px)`,
            top: `calc(50% + ${y}px - 8px)`,
          }}
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
        />

        {/* Center Neutral */}
        <div className="absolute w-2 h-2 bg-gray-600 rounded-full" />
      </div>

      {/* Info Section */}
      <div className="mt-4 text-center space-y-1">
        <p>
          <span className="font-semibold">Emotion:</span>  {emotion}
        </p>
        <p>
          <span className="font-semibold">Valence:</span> {valence.toFixed(2)} |{" "}
          <span className="font-semibold">Arousal:</span> {arousal.toFixed(2)}
        </p>
        <p>
          <span className="font-semibold">Angle:</span>{" "}
          {((angle * 180) / Math.PI).toFixed(1)}° |{" "}
          <span className="font-semibold">Magnitude:</span>{" "}
          {magnitude.toFixed(2)}
        </p>
        <p>
          <span className="font-semibold">Color:</span>{" "}
          <span
            className="px-2 py-1 rounded text-white"
            style={{ backgroundColor: color }}>
            {color}
          </span>
        </p>
      </div>
    </div>
  );
}
