import { useState, useCallback, useEffect } from "react";
import { FixedSizeList as List } from "react-window";
import axios from "axios";
import { Music } from "lucide-react";
import { useNavigate } from "react-router-dom";
import '../index.css'

const baseUrl = "http://localhost:8080";
const PAGE_SIZE = 20;
const ROW_HEIGHT = 72;

export default function AlbumsVirtualized() {
  const [albums, setAlbums] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchPage = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);

    const res = await axios.get(`${baseUrl}/albums/get/albums`, {
      params: {
        pageNumber: page,
        pageSize: PAGE_SIZE,
        sortBy: "id",
        sortDirection: "asc",
      },
      withCredentials: true,
    });

    setAlbums(prev => [...prev, ...res.data.content]);
    setHasMore(!res.data.lastPage);
    setPage(p => p + 1);

    setLoading(false);
  }, [page, loading, hasMore]);

  useEffect(()=>{
    fetchPage();
  },[])

  const Row = ({ index, style }) => {
    const album = albums[index];

    if (!album) return <div style={style}></div>;

    return (
      <div  
        style={style}
        onClick={() => navigate(`/album/${album.id}`)}
        className="flex p-3 flex-row w-full justify-between items-center px-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors duration-150 group"
      >
        <div className="flex flex-row items-center gap-3 flex-1 min-w-0">
          {
            album.albumArtUrl ?  (
             <img className="h-[40px] w-[40px] rounded-[4px]" src={`${baseUrl}/album_art/${album.albumArtUrl}`} />
            ) : <Music 
            strokeWidth={1.5}  
            className="text-gray-700 group-hover:text-red-600 transition-colors flex-shrink-0" 
            size={28} 
          />
          }
          <div className="min-w-0 flex-1">
            <div className="font-medium text-black truncate text-sm group-hover:text-red-600 transition-colors">
              {album.name}
            </div>
            <div className="text-xs text-gray-600 truncate group-hover:text-gray-700 transition-colors">
              {album.primaryArtistName}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white border border-gray-200 overflow-hidden flex-1">
      <List
        className="track-scroll"
        height={600}
        width="100%"
        itemCount={albums.length}
        itemSize={ROW_HEIGHT}
        onItemsRendered={({ visibleStopIndex }) => {
          if (visibleStopIndex >= albums.length - 5 && hasMore && !loading) {
            fetchPage();
          }
        }}
      >
        {Row}
      </List>
    </div>
  );
}
