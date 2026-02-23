
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Play, MoreVertical, Music } from "lucide-react";
import { useDispatch } from "react-redux";
import { setTrack } from "../store/trackSlice";
import { addTrack, addTrackToFront } from "../store/queuedTracksSlice";

const baseUrl = "http://localhost:8080";

const AlbumDisplay = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [album, setAlbum] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tracksLoading, setTracksLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertIndex, setAlertIndex] = useState(null);

  useEffect(() => {
    const fetchAlbumData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${baseUrl}/albums/get/album/${id}`, {
          withCredentials: true,
        });
        setAlbum(res.data);
      } catch (err) {
        setError(err.message || "Failed to fetch album");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const fetchTracks = async () => {
      try {
        setTracksLoading(true);
        const res = await axios.get(`${baseUrl}/tracks/get/album/${id}`, {
          withCredentials: true,
        });
        setTracks(res.data);
      } catch (err) {
        console.error("Failed to fetch tracks:", err);
      } finally {
        setTracksLoading(false);
      }
    };

    fetchAlbumData();
    fetchTracks();
  }, [id]);

  useEffect(() => {
    if (!alert) return;

    const timer = setTimeout(() => {
      setAlert(false);
      setAlertMessage("");
      setAlertIndex(null);
    }, 1000);

    setOpenMenuIndex(null);

    return () => clearTimeout(timer);
  }, [alert]);

  const handleTrackQueueing = (track, indexNum) => {
    dispatch(addTrack({
      id: track.id,
      name: track.name,
      artists: track.artists,
      time: Date.now()
    }));
    setAlertMessage("Track added to queue");
    setAlertIndex(indexNum);
    setAlert(true);
  };

  const handlePlayNext = (track, indexNum) => {
    dispatch(addTrackToFront({
      id: track.id,
      name: track.name,
      artists: track.artists,
      time: Date.now()
    }));
    setAlertMessage("Track added to queue");
    setAlertIndex(indexNum);
    setAlert(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (!album) {
    return (
      <div className="flex items-center justify-center ">
        <div className="text-gray-500">Album not found</div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 flex-1 flex flex-col h-full w-full">
      {/* Back Button */}
      <div className="px-6 pt-6 pb-2">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>
      </div>

      {/* Album Header - Fixed */}
      <div className="px-6 py-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex gap-6 items-start">
          {/* Album Art */}
          <div className="flex-shrink-0">
            <div className="w-48 h-48 bg-gradient-to-br from-gray-300 to-gray-400 rounded-lg flex items-center justify-center">
              <div className="text-gray-600 border border-gray-200 text-center rounded-lg shadow-gray-400 shadow-md overflow-hidden">
               {
                album.albumArtUrl ? (
                  <img  className="" src={`http://localhost:8080/album_art/${album.albumArtUrl}`}/> 
                ) :  <Music/>
               }
              </div>
            </div>
          </div>

          {/* Album Info */}
          <div className="flex-1 flex flex-col justify-start pt-2 relative  top-0">
            <div className="text-xs text-gray-500 uppercase tracking-wide mb-2">Album</div>
            <h1 className="text-4xl font-bold text-black mb-4">{album.name}</h1>
            
            <div className="flex flex-col gap-3">
              <div>
                <div className="text-sm text-gray-600 mb-1">Artist</div>
                <button
                  onClick={() => navigate(`/artist/${album.primaryArtistId}`)}
                  className="text-lg text-red-600 hover:text-red-700 transition-colors font-medium"
                >
                  {album.primaryArtistName}
                </button>
              </div>
              
            </div>
          </div>
        </div>
      </div>

      {/* Tracks Section - Scrollable */}
      <div className="flex-1 overflow-y-auto px-6 py-4 track-scroll">
          <h2 className="text-2xl font-bold mb-4">Tracks</h2>
          
          {tracksLoading ? (
            <div className="text-gray-500">Loading tracks...</div>
          ) : tracks.length === 0 ? (
            <div className="text-gray-500">No tracks available</div>
          ) : (
            <div className="space-y-0">
              {tracks.map((track, index) => (
                <div
                  key={track.id}
                  onClick={() => {
                    dispatch(setTrack({
                      id: track.id,
                      name: track.name,
                      durationSeconds: track.durationSeconds,
                      albumName: track.albumName,
                      artists: track.artists
                    }));
                  }}
                  className="flex p-3 flex-row w-full justify-between items-center px-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors duration-150 group"
                >
                  <div className="flex flex-row items-center gap-3 flex-1 min-w-0">
                    <Play
                      strokeWidth={1.5}
                      className="text-gray-700 group-hover:text-red-600 transition-colors flex-shrink-0"
                      size={28}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-black truncate text-sm group-hover:text-red-600 transition-colors">
                        {track.name}
                      </div>
                      <div className="text-xs text-gray-600 truncate group-hover:text-gray-700 transition-colors">
                        {Array.from(track.artists).map(a => a.name).join(", ")}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                    <div className="text-xs font-medium text-gray-600 group-hover:text-red-600 transition-colors">
                      {Math.floor(track.durationSeconds / 60)}:{String(track.durationSeconds % 60).padStart(2, '0')}
                    </div>
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuIndex(openMenuIndex === index ? null : index);
                        }}
                        className="p-1.5 hover:bg-gray-200 rounded transition-colors text-gray-600 hover:text-red-600"
                        title="More options"
                      >
                        <MoreVertical size={18} />
                      </button>

                      {openMenuIndex === index && (
                        <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePlayNext(track, index);
                              setOpenMenuIndex(null);
                            }}
                            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 hover:text-red-600 transition-colors"
                          >
                            Play Next
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTrackQueueing(track, index);
                              setOpenMenuIndex(null);
                            }}
                            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 hover:text-red-600 transition-colors border-t border-gray-200"
                          >
                            Add to Queue
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenMenuIndex(null);
                            }}
                            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 hover:text-red-600 transition-colors border-t border-gray-200"
                          >
                            Add to Playlist
                          </button>
                        </div>
                      )}

                      {alertIndex === index && alert && (
                        <div className="absolute right-0 mt-1 shadow-lg text-red-500 p-4 z-50 w-[200px] text-sm bg-red-50 border-red-500 border">
                          {alertMessage}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
      </div>
    </div>
  );
};

export default AlbumDisplay;