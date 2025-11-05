import image from "../../public/circle.png";
export default function Visual({ angle }: { angle: number }) {
  console.log(angle);
  return (
    <div className="w-full">
      <img src={image} alt="Emotion Circle" />
    </div>
  );
}
