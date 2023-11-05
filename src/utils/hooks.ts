import { useMemo, useEffect, useState } from "react";
import { useIsClient } from "usehooks-ts";

export const useAudio = (url: string, play: boolean) => {
  const isWindow = useIsClient();
  const audio = useMemo(() => {
    if (!isWindow) return;
    const track = new Audio(url);
    track.loop = true;
    return track;
  }, [url, isWindow]);
  const [playing, setPlaying] = useState(false);
  const [mute, setMute] = useState(false);

  const toggle = () => setPlaying(!playing);

  useEffect(() => {
    setPlaying(play);
  }, [play]);

  useEffect(() => {
    if (!audio) return;
    playing && !mute ? void audio.play() : audio.pause();
  }, [audio, mute, playing]);

  useEffect(() => {
    if (!audio) return;
    audio.addEventListener("ended", () => setPlaying(false));
    return () => {
      audio.removeEventListener("ended", () => setPlaying(false));
    };
  }, [audio]);

  return { playing, mute, setMute, toggle };
};

export default useAudio;
