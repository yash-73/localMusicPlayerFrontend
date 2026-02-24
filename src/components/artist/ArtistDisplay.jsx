import { useEffect, useState , useRef} from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft , Play } from "lucide-react";
import TrackMenu from "../track/TrackMenu";
import '../../index.css'
import { useDispatch } from "react-redux";
import { addTrackToFront , addTrack } from "../../store/queuedTracksSlice";
import { setTrack } from "../../store/trackSlice";
const ArtistDisplay = () => {
    const baseUrl = 'http://localhost:8080'
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [albums, setAlbums] = useState([]);
    const [tracks , setTracks] = useState([]);
    const [artist , setArtist] = useState(null);
    const [error, setError] = useState('')

  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertIndex, setAlertIndex] = useState(null);

  const dispatch = useDispatch();

   const menuRef = useRef(null);

    const navigate = useNavigate();

    const handleTrackQueueing = (id, name, artists, indexNum) => {
        dispatch(addTrack({ id: id, name: name, artists: artists, time: Date.now() }));
        setAlertMessage("Track added to queue");
        setAlertIndex(indexNum);
        setAlert(true);
      };

    const handlePlayNext = (id, name, artists, indexNum) => {
        dispatch(addTrackToFront({ id: id, name: name, artists: artists, time: Date.now() }));
        setAlertMessage("Track added to queue");
        setAlertIndex(indexNum);
        setAlert(true);
      };

    useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuIndex(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);


    useEffect(() => {
        const fetchAlbumsByArtistId = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`${baseUrl}/albums/get/artist/${id}`, {
                    withCredentials: true,
                });
                setAlbums(res.data);
            } catch (err) {
                setError(err.message || "Failed to fetch albums");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        
        const fetchSinglesByArtistId = async () =>{
             try{
                setLoading(true);
                const res = await axios.get(`${baseUrl}/tracks/get/singles/artist/${id}` , {
                    withCredentials: true
                });
                setTracks(res.data);
                }
                catch(err){
                    console.error(err);
                }
                finally{
                    setLoading(false);
                }
        } 

        const fetchArtistById = async () =>{
            try{
                setLoading(true);
                const res = await axios.get(`${baseUrl}/artists/get/artist/${id}` , {
                    withCredentials: true
                });
                setArtist(res.data);
                }
                catch(err){
                    console.error(err);
                }
                finally{
                    setLoading(false);
                }
        }

        fetchAlbumsByArtistId();
        fetchSinglesByArtistId();
        fetchArtistById();

    }, [id])

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

    if (albums.length == 0 && tracks.length == 0) {
        return (
            <div className="flex items-center justify-center ">
                <div className="px-6 py-4 sticky  flex flex-row items-center top-0">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex flex-row items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <ArrowLeft size={20} />
                        <span className="">Back</span>
                    </button>
                </div>
                <div className="text-gray-500">Album not found</div>
            </div>
        );
    }

    return (
        <div className="w-full h-full overflow-auto track-scroll border-gray-100 border">
            <div className="flex flex-col">
            <div className="px-6 pt-6 pb-2">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                    <ArrowLeft size={20} />
                    <span>Back</span>
                </button>
            </div>

            <div className="w-full flex flex-col items-start py-6 px-2
            ">
                <p className="text-black">Artist</p>
                <h3 className="text-6xl font-bold text-red-600">{artist.name}</h3>
            </div>
            </div>

            {albums.length > 0 && (
                <section className="">
                    <h2 className="text-2xl font-bold text-black mb-4">Albums</h2>
                    <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {albums.map((album) => (
                            <div
                                onClick={() => navigate(`/album/${album.id}`)}
                                key={album.id}
                                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:shadow-md transition-all cursor-pointer group flex flex-col"
                            >
                                {album.albumArtUrl && (
                                    <img
                                        src={`${baseUrl}/album_art/${album.albumArtUrl}`}
                                        alt={album.name}
                                        className="w-full aspect-square object-cover rounded-md mb-3 group-hover:opacity-90 transition-opacity"
                                    />
                                )}
                                <p className="font-semibold text-black truncate group-hover:text-red-600 transition-colors">
                                    {album.name}
                                </p>
                                <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors">
                                    {album.primaryArtistName}
                                </p>
                                <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors">
                                    {album.releaseYear}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
            )}
             {tracks.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-black mb-4">Tracks</h2>
              <div className="bg-white border border-gray-200">
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
                    className="flex p-3 flex-row w-full justify-between items-center px-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors duration-150 group last:border-b-0"
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
                          {track.albumName}
                          {track.artists && track.artists.length > 0 && (
                            <span>
                              {track.artists.map((a) => a.name).join(", ")}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                      <div className="text-xs font-medium text-gray-600 group-hover:text-red-600 transition-colors">
                        {Math.floor(track.durationSeconds / 60)}:
                        {String(track.durationSeconds % 60).padStart(2, "0")}
                      </div>
                      <TrackMenu
                        track={track}
                        index={index}
                        isOpen={openMenuIndex === index}
                        onToggle={(idx) => setOpenMenuIndex(openMenuIndex === idx ? null : idx)}
                        onPlayNext={(id, name, artists, idx) => {
                          handlePlayNext(id, name, artists, idx);
                          setOpenMenuIndex(null);
                        }}
                        onAddToQueue={(id, name, artists, idx) => {
                          handleTrackQueueing(id, name, artists, idx);
                          setOpenMenuIndex(null);
                        }}
                        onAddToPlaylist={() => setOpenMenuIndex(null)}
                        showAlert={alertIndex === index && alert}
                        alertMessage={alertMessage}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
    )

}

export default ArtistDisplay;