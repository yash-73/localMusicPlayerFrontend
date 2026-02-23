import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { searchTracks, searchAlbums, searchArtists } from "../services/api";
import { Loader, Play } from "lucide-react";
import { useDispatch } from "react-redux";
import { setTrack } from "../store/trackSlice";
import { addTrack, addTrackToFront } from "../store/queuedTracksSlice";
import TrackMenu from "./TrackMenu";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");
  const dispatch = useDispatch();
  const menuRef = useRef(null);

  const baseUrl = 'http://localhost:8080'
  
  const [tracks, setTracks] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertIndex, setAlertIndex] = useState(null);

  useEffect(() => {
    const performSearch = async () => {
      if (!query) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const [tracksData, albumsData, artistsData] = await Promise.all([
          searchTracks(query),
          searchAlbums(query),
          searchArtists(query),
        ]);

        setTracks(Array.isArray(tracksData) ? tracksData : []);
        setAlbums(Array.isArray(albumsData) ? albumsData : []);
        setArtists(Array.isArray(artistsData) ? artistsData : []);
      } catch (err) {
        setError(err.message || "Failed to fetch search results");
        setTracks([]);
        setAlbums([]);
        setArtists([]);
      } finally {
        setLoading(false);
      }
    };

    performSearch();
  }, [query]);

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
    if (!alert) return;

    const timer = setTimeout(() => {
      setAlert(false);
      setAlertMessage("");
      setAlertIndex(null);
    }, 1000);

    setOpenMenuIndex(null);

    return () => clearTimeout(timer);
  }, [alert]);

  if (!query) {
    return (
      <div className="bg-white border border-gray-200 flex items-center justify-center p-8 flex-1">
        <p className="text-gray-500">Enter a search query</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 flex items-center justify-center p-8 flex-1">
        <Loader className="animate-spin text-red-600" size={32} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white border border-gray-200 flex items-center justify-center p-8 flex-1">
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  const hasResults = tracks.length > 0 || albums.length > 0 || artists.length > 0;

  if (!hasResults) {
    return (
      <div className="bg-white border border-gray-200 flex items-center justify-center p-8 flex-1">
        <p className="text-gray-500">No results found for "{query}"</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 flex-1 flex flex-col h-full w-full overflow-hidden">
      {/* Header - Fixed */}
      <div className="px-6 py-4 border-b border-gray-200 flex-shrink-0">
        <h1 className="text-3xl font-bold text-black">
          Results for "<span className="text-red-600">{query}</span>"
        </h1>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto track-scroll px-6 py-4">
        <div className="space-y-8">
          {/* Tracks Section */}
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
                              {" • "}
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

          {/* Albums Section */}
          {albums.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-black mb-4">Albums</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {albums.map((album) => (
                  <div
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
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Artists Section */}
          {artists.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-black mb-4">Artists</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {artists.map((artist) => (
                  <div
                    key={artist.id}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:shadow-md transition-all cursor-pointer text-center group"
                  >
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-400 to-red-600 mx-auto mb-3 flex items-center justify-center group-hover:shadow-lg group-hover:scale-105 transition-all">
                      <span className="text-white font-bold text-lg">
                        {artist.name}
                      </span>
                    </div>
                    <p className="font-semibold text-black text-sm group-hover:text-red-600 transition-colors truncate">
                      {artist.name}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
