import { useSelector, useDispatch } from "react-redux";
import {
  setCurrentTime,
  setVolume,
  setDuration
} from "../store/trackSlice";
import { useRef, useEffect, useState } from "react";
import { fetchTrack } from "../services/api";
import { Play, SkipBack, SkipForward, Pause } from "lucide-react";

const Controls = ({ className }) => {
  const dispatch = useDispatch();
  const audioRef = useRef(null);

  const { id, currentTime, volume } = useSelector(state => state.track);

  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);


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
    audio.play().catch(() => { });
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
    const audio = audioRef.current;
    if (!audio) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);

    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === "Space") {
        e.preventDefault();        // prevents page scroll
        handlePlayPause();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);



  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  return (
    <div className={`w-full flex justify-between items-center bg-white border-t border-gray-200 p-4 gap-6 ${className}`}>
      <audio ref={audioRef} preload="metadata" crossOrigin="use-credentials" />

      {currentTrack && (
        <div className="trackInfo w-[25%] flex flex-col gap-1 pr-4 border-r border-gray-200">
          <p className="font-semibold text-black text-sm truncate">{currentTrack.name}</p>
          <p className="text-gray-600 text-xs truncate">{currentTrack.albumName}</p>
          <div className="flex flex-wrap gap-1">
            {currentTrack.artists.map(a => (
              <span key={a.id} className="text-gray-700 text-xs bg-gray-100 px-2 py-0.5">{a.name}</span>
            ))}
          </div>
        </div>
      )}

      <div className="controls flex flex-col items-center flex-1 gap-3">
        <div className="flex items-center justify-center gap-6">
          <button className="p-1.5 hover:bg-gray-100 transition-colors text-gray-700 hover:text-red-600">
            <SkipBack size={24} />
          </button>
          
          {isPlaying ? (
            <button
              onClick={handlePlayPause}
              className="bg-black hover:bg-red-700 p-2.5 transition-colors text-white"
              title="Pause"
            >
              <Pause size={32} fill="currentColor" />
            </button>
          ) : (
            <button
              onClick={handlePlayPause}
              className="bg-black hover:bg-red-700 p-2.5 transition-colors text-white"
              title="Play"
            >
              <Play size={32} fill="currentColor" />
            </button>
          )}

          <button className="p-1.5 hover:bg-gray-100 transition-colors text-gray-700 hover:text-red-600">
            <SkipForward size={24} />
          </button>
        </div>

        <div className="w-full flex flex-col gap-2">
          <input
            type="range"
            min="0"
            max="100"
            step="0.1"
            value={progress}
            onChange={handleSeek}
            className="w-full h-1 bg-gray-300 appearance-none cursor-pointer accent-red-600"
            style={{
              background: `linear-gradient(to right, #991b1b 0%, #991b1b ${progress}%, #d1d5db ${progress}%, #d1d5db 100%)`
            }}
          />
          <div className="flex justify-between text-xs text-gray-600 font-medium px-1">
            <span>{Math.floor(currentTime / 60)}:{String(Math.floor(currentTime % 60)).padStart(2, '0')}</span>
            <span>{Math.floor(duration / 60)}:{String(Math.floor(duration % 60)).padStart(2, '0')}</span>
          </div>
        </div>
      </div>

      <div className="volume-control flex-1 flex flex-col items-end gap-2 pl-4 border-l border-gray-200">
        <label className="text-xs font-semibold text-gray-700 uppercase">Volume</label>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min="0"
            max="100"
            value={volume * 100}
            onChange={handleVolumeChange}
            className="w-24 h-1 bg-gray-300 appearance-none cursor-pointer accent-red-600"
            style={{
              background: `linear-gradient(to right, #991b1b 0%, #991b1b ${volume * 100}%, #d1d5db ${volume * 100}%, #d1d5db 100%)`
            }}
          />
          <span className="text-xs text-gray-600 font-medium w-8 text-right">{Math.round(volume * 100)}%</span>
        </div>
      </div>
    </div>
  );
};

export default Controls;
