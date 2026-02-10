import { useSelector, useDispatch } from "react-redux";
import {
  setCurrentTime,
  setVolume,
  setDuration
} from "../store/trackSlice";
import { useRef, useEffect, useState } from "react";
import { fetchTrack } from "../services/api";
import { Play, SkipBack, SkipForward } from "lucide-react";

const Controls = ({ className }) => {
  const dispatch = useDispatch();
  const audioRef = useRef(null);

  const { id, currentTime, volume } = useSelector(state => state.track);

  const [currentTrack, setCurrentTrack] = useState(null);

  const duration =
    audioRef.current?.duration ?? currentTrack?.durationSeconds ?? 0;

  const progress = duration ? (currentTime / duration) * 100 : 0;

  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.paused ? audio.play() : audio.pause();
  };

  const handleSeek = (e) => {
    const time = (Number(e.target.value) / 100) * duration;
    audioRef.current.currentTime = time;
    dispatch(setCurrentTime(time));
  };

  const handleVolumeChange = (e) => {
    dispatch(setVolume(Number(e.target.value) / 100));
  };

  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    (async () => {
      try {
        const track = await fetchTrack(id);
        if (!cancelled) setCurrentTrack(track);
      } catch (e) {
        console.dir(e);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
  const audio = audioRef.current;
  if (!audio || !currentTrack) return;

  audio.currentTime = currentTime;
}, [currentTrack?.id]);

  useEffect(() => {
    if (!currentTrack?.id || !audioRef.current) return;

    const audio = audioRef.current;
    audio.src = `http://localhost:8080/tracks/stream/${currentTrack.id}`;
    audio.load();
    audio.play().catch(() => {});
  }, [currentTrack?.id]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () =>
      dispatch(setCurrentTime(audio.currentTime));

    const onLoadedMetadata = () =>
      dispatch(setDuration(audio.duration));

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  return (
    <div className={`w-[80%] rounded-2xl flex justify-between border-2 border-white/20 p-2 ${className}`}>
      <audio ref={audioRef} preload="metadata" crossOrigin="use-credentials" />

      {currentTrack && (
        <div className="trackInfo w-[20%]">
          <p>{currentTrack.name}</p>
          <p>{currentTrack.albumName}</p>
          <div>
            {currentTrack.artists.map(a => (
              <p key={a.id}>{a.name}</p>
            ))}
          </div>
        </div>
      )}

      <div className="controls flex flex-col items-center w-[50%]">
        <div className="flex items-center justify-evenly w-[60%]">
          <SkipBack />
          <Play onClick={handlePlayPause} size={60} />
          <SkipForward />
        </div>

        <input
          type="range"
          min="0"
          max="100"
          step="0.1"
          value={progress}
          onChange={handleSeek}
          className="w-full"
        />
      </div>

      <div className="volume-control w-[20%]">
        <input
          type="range"
          min="0"
          max="100"
          value={volume * 100}
          onChange={handleVolumeChange}
          className="w-30"
        />
      </div>
    </div>
  );
};

export default Controls;
