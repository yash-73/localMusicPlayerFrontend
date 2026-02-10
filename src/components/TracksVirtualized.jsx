import { useState, useCallback, useEffect } from "react";
import { FixedSizeList as List } from "react-window";
import axios from "axios";
import { Play } from "lucide-react";
import { useDispatch } from "react-redux";
import { setTrack } from "../store/trackSlice";
import '../index.css'

const baseUrl = "http://localhost:8080";
const PAGE_SIZE = 20;
const ROW_HEIGHT = 72;

export default function TracksVirtualized() {
  const dispatch = useDispatch();

  const [tracks, setTracks] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

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

  useEffect(()=>{
    fetchPage();
  },[])

  const Row = ({ index, style }) => {
    const track = tracks[index];

    if (!track) return <div style={style}></div>;

    return (
      <div  onClick={()=>{dispatch(setTrack({
        id: track.id ,
        name: track.name,
        durationSeconds: track.durationSeconds}))
      }}
      style={style} 
      className="flex  p-4 flex-row w-full justify-between   items-center px-4 border-b hover:bg-black/10 cursor-pointer">
        <div className="flex flex-row items-center">
        <Play strokeWidth={1} fill="true" className="mr-3 rounded-full  hover:bg-white/20 p-1" size={25} />
          <div >
            <div className="font-medium">{track.name}</div>
            <div className="text-sm text-black">
            {track.artists.map(a => a.name).join(", ")}
          </div>
        </div>
          
        </div>
        <div >{Math.floor(track.durationSeconds / 60)}m {track.durationSeconds%60}s</div>
      </div>
    );
  };

  return (
   <div className="border-2 border-white/30 rounded-[28px] overflow-hidden w-[80%]">
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
