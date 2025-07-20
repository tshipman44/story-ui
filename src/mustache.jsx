import neutralGif     from "./assets/mustache-neutral.gif";
import surprisedGif   from "./assets/mustache-surprised.gif";
import thoughtfulGif  from "./assets/mustache-thoughtful.gif";

const moodMap = {
  neutral:    neutralGif,
  surprised:  surprisedGif,
  thoughtful: thoughtfulGif,
};

export default function Mustache({ mood = "neutral", className = "" }) {
  return (
    <img
      src={moodMap[mood] ?? neutralGif}
      alt={`Poirot's ${mood} moustache`}
      /* fill the wrapper & crop to the rounded frame */
      className={`w-full h-full object-cover ${className}`}
    />
  );

}
