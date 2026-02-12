import { useState, useCallback, useEffect } from "react";
import { FixedSizeList as List } from "react-window";
import axios from "axios";
import { Mic2 } from "lucide-react";
import '../index.css'

const baseUrl = "http://localhost:8080";
const PAGE_SIZE = 20;
const ROW_HEIGHT = 72;

export default function ArtistsVirtualized() {
  const [artists, setArtists] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const fetchPage = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);

    const res = await axios.get(`${baseUrl}/artists/get/artists`, {
      params: {
        pageNumber: page,
        pageSize: PAGE_SIZE,
        sortBy: "id",
        sortDirection: "asc",
      },
      withCredentials: true,
    });

    setArtists(prev => [...prev, ...res.data.content]);
    setHasMore(!res.data.lastPage);
    setPage(p => p + 1);

    setLoading(false);
  }, [page, loading, hasMore]);

  useEffect(()=>{
    fetchPage();
  },[])

  const Row = ({ index, style }) => {
    const artist = artists[index];

    if (!artist) return <div style={style}></div>;

    return (
      <div  
        style={style} 
        className="flex p-3 flex-row w-full justify-between items-center px-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors duration-150 group"
      >
        <div className="flex flex-row items-center gap-3 flex-1 min-w-0">
          <Mic2 
            strokeWidth={1.5}  
            className="text-gray-700 group-hover:text-red-600 transition-colors flex-shrink-0" 
            size={28} 
          />
          <div className="min-w-0 flex-1">
            <div className="font-medium text-black truncate text-sm group-hover:text-red-600 transition-colors">
              {artist.name ??  `Artist ${artist.id ?? index}`}
            </div>
          </div>
        </div>
      </div>
    );
  };
  // show a friendly placeholder when there are no items yet
  if (artists.length === 0 && loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white border border-gray-200">
        <div className="text-sm text-gray-600">Loading artists...</div>
      </div>
    );
  }

  if (artists.length === 0 && !loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white border border-gray-200">
        <div className="text-sm text-gray-600">No artists found.</div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 overflow-hidden flex-1">
      <List
        className="track-scroll"
        height={600}
        width="100%"
        itemCount={artists.length}
        itemSize={ROW_HEIGHT}
        onItemsRendered={({ visibleStopIndex }) => {
          if (visibleStopIndex >= artists.length - 5 && hasMore && !loading) {
            fetchPage();
          }
        }}
      >
        {Row}
      </List>
    </div>
  );
}
