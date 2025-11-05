const emotion_vector = [
  "Happy 😀",
  "Excited 😃",
  "Alert ⚠️",
  "Tense 😬",
  "Angry 😡",
  "Distressed 😩",
  "Sad 😟",
  "Depressed 😔",
  "Bored 🥱",
  "Calm 😊",
  "Relaxed ☺️",
  "Content 😆",
];

export interface EmotionData {
  valence: number;
  arousal: number;
  angle: number;
  magnitude: number;
  emotion: string;
  color: string;
}

export const defaultEmotion: EmotionData = {
  valence: 0.5,
  arousal: 0.5,
  angle: 45,
  magnitude: 1,
  emotion: "Happy😆",
  color: "rgb(255,0,0)",
}

export function getCircumferenceColor(angleDegrees: number) {
  // Intensity is fixed at 1.0 (circumference)
  const intensity = 1.0;
  let hue;
  const angleNorm = angleDegrees % 360;

  // --- 1. Map Image Angle (0-360) to HSV Hue (0-360) ---
  // Mapping: 0=Happy/Green(120), 90=Alert/Yellow(60), 180=Angry/Red(0), 270=Calm/Blue(240)
  if (angleNorm >= 0 && angleNorm < 90) {
    // Happy (0) -> Alert (90): Hue 120 -> 60
    hue = 120 - (angleNorm / 90) * 60;
  } else if (angleNorm >= 90 && angleNorm < 180) {
    // Alert (90) -> Angry (180): Hue 60 -> 0
    hue = 60 - ((angleNorm - 90) / 90) * 60;
  } else if (angleNorm >= 180 && angleNorm < 270) {
    // Angry (180) -> Calm (270): Hue 0 -> 240 (traveling through magenta/purple range)
    hue = ((angleNorm - 180) / 90) * 240;
  } else { // 270 <= angleNorm < 360
    // Calm (270) -> Happy (360): Hue 240 -> 120
    hue = 240 - ((angleNorm - 270) / 90) * 120;
  }

  // Saturation and Value are fixed for the circumference
  const saturation = intensity; // 1.0 (Full Saturation)
  const value = 1.0;          // 1.0 (Full Brightness)

  // --- 2. HSV to RGB Conversion (standard algorithm) ---
  const h_i = Math.floor(hue / 60) % 6;
  const f = (hue / 60) - h_i;
  const p = value * (1 - saturation);
  const q = value * (1 - f * saturation);
  const t = value * (1 - (1 - f) * saturation);

  let r = 255, g = 255, b = 255;

  switch (h_i) {
    case 0: r = value; g = t; b = p; break;
    case 1: r = q; g = value; b = p; break;
    case 2: r = p; g = value; b = t; break;
    case 3: r = p; g = q; b = value; break;
    case 4: r = t; g = p; b = value; break;
    case 5: r = value; g = p; b = q; break;
  }

  const R = Math.floor(r * 255);
  const G = Math.floor(g * 255);
  const B = Math.floor(b * 255);

  return `rgb(${R}, ${G}, ${B})`;
}


export function sentimentToEmotion(_neg: number, pos: number): EmotionData {
  const d = 2 * pos - 1;
  // const theta = Math.atan((Math.sin(d * Math.PI) / d))
  const valence = d
  const arousal = Math.sin(Math.PI * d)

  // 2. Vector properties
  const angle = Math.atan2(arousal, valence);  // radians
  const magnitude = Math.sqrt(valence ** 2 + arousal ** 2);
  const normalizedMag = Math.min(1, magnitude);

  // 3. Emotion category
  let deg = (angle * 180) / Math.PI
  if (deg < 0) deg += 360; // wrap into [0, 360)
  const idx = Math.floor((deg / 360) * emotion_vector.length);
  const emotion = emotion_vector[idx];


  return {
    valence,
    arousal,
    angle: deg,
    magnitude: normalizedMag,
    emotion,
    color: getCircumferenceColor(angle)
  }
}
