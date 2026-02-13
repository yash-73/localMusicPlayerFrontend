import { useState, useCallback, useEffect, useRef } from "react";
import { FixedSizeList as List } from "react-window";
import axios from "axios";
import { Play, MoreVertical } from "lucide-react";
import { useDispatch } from "react-redux";
import { setTrack } from "../store/trackSlice";
import { addTrack, addTrackToFront } from "../store/queuedTracksSlice";
import '../index.css'

const baseUrl = "http://localhost:8080";
const PAGE_SIZE = 20;
const ROW_HEIGHT = 72;

export default function TracksVirtualized() {
  const dispatch = useDispatch();

  const menuRef = useRef(null);

  const [tracks, setTracks] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const [alert , setAlert] = useState(false)
  const [alertMessage , setAlertMessage] = useState('');
  const [alertIndex , setAlertIndex] = useState(null);


  const handleTrackQueueing = ( id, name, artists , indexNum ) => {
      dispatch(addTrack({id: id , name: name , artists: artists}));
      setAlertMessage('Track added to queue');
      setAlertIndex(indexNum)
      setAlert(true);
  }

  const fetchPage = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);

    const res = await axios.get(`${baseUrl}/tracks/get/tracks`, {
      params: {
        pageNumber: page,
        pageSize: PAGE_SIZE,
        sortBy: "id",
        sortDirection: "asc",
      },
      withCredentials: true,
    });

    setTracks(prev => [...prev, ...res.data.content]);
    setHasMore(!res.data.lastPage);
    setPage(p => p + 1);

    setLoading(false);
  }, [page, loading, hasMore]);

  useEffect(() => {
    fetchPage();
  }, [])

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


  const Row = ({ index, style }) => {
    const track = tracks[index];

    if (!track) return <div style={style}></div>;

    return (
      <div
        onClick={() => {
          dispatch(setTrack({
            id: track.id,
            name: track.name,
            durationSeconds: track.durationSeconds,
            albumName: track.albumName,
            artists: track.artists
          }))
        }}
        style={style}
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
              {track.artists.map(a => a.name).join(", ")}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 ml-4">
          <div className="text-xs font-medium text-gray-600 group-hover:text-red-600 transition-colors">
            {Math.floor(track.durationSeconds / 60)}:{String(track.durationSeconds % 60).padStart(2, '0')}
          </div>
          <div className="relative" ref={menuRef}>
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
                    // TODO: Implement play next
                    setOpenMenuIndex(null);
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 hover:text-red-600 transition-colors"
                >
                  Play Next
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTrackQueueing(track.id , track.name , track.artists , index);
                    setOpenMenuIndex(null);
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 hover:text-red-600 transition-colors border-t border-gray-200"
                >
                  Add to Queue
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // TODO: Implement add to playlist
                    setOpenMenuIndex(null);
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 hover:text-red-600 transition-colors border-t border-gray-200"
                >
                  Add to Playlist
                </button>
              </div>
            )}
            {(alertIndex && alertIndex == index) && (alert) && (
              <div className="absolute right-0 mt-1 shadow-lg text-red-500 p-4 z-50 w-[200px]  text-sm bg-red-50 border-red-500 border">
                  {alertMessage}
              </div>
            ) }
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white border items-center border-gray-200 overflow-hidden flex-1">
      <List
        className="track-scroll"
        height={600}
        width="100%"
        itemCount={tracks.length}
        itemSize={ROW_HEIGHT}
        onItemsRendered={({ visibleStopIndex }) => {
          if (visibleStopIndex >= tracks.length - 5 && hasMore && !loading) {
            fetchPage();
          }
        }}
      >
        {Row}
      </List>
      
    </div>
  );
}
