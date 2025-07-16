import neutralGif     from "./assets/mustache-neutral.gif";
import surprisedGif   from "./assets/mustache-surprised.gif";
import thoughtfulGif  from "./assets/mustache-thoughtful.gif";

const moodMap = {
  neutral:    neutralGif,
  surprised:  surprisedGif,
  thoughtful: thoughtfulGif,
};

export default function Mustache({ mood = "neutral" }) {
  return (
    <img
      src={moodMap[mood] ?? neutralGif}
      alt={`Poirot's ${mood} moustache`}
      className="w-32 mx-auto mb-4"
    />
  );
}
