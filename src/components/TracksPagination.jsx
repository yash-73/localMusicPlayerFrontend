import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Play } from "lucide-react";

const baseUrl = "http://localhost:8080";

export default function TracksInfiniteScroll() {
  const [tracks, setTracks] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [lastPage, setLastPage] = useState(false);
  const [loading, setLoading] = useState(false);

  const pageSize = 10;
  const loaderRef = useRef(null);

  useEffect(() => {
    if (loading || lastPage) return;

    setLoading(true);

    axios.get(`${baseUrl}/tracks/get/tracks`, {
      params: {
        pageNumber,
        pageSize,
        sortBy: "id",
        sortDirection: "asc",
      },
      withCredentials: true,
    })
    .then(res => {
      setTracks(prev => [...prev, ...res.data.content]);
      setLastPage(res.data.lastPage);
    })
    .finally(() => {
      setLoading(false);
    });
  }, [pageNumber]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !loading && !lastPage) {
          setPageNumber(p => p + 1);
        }
      },
      { threshold: 1 }
    );

    if (loaderRef.current) observer.observe(loaderRef.current);

    return () => observer.disconnect();
  }, [loading, lastPage]);

  return (
    <div className="w-full flex flex-col items-center p-4 bg-red-400">

      <ul className=" rounded-xl border-black border-2 flex flex-col md:w-[70%] p-4">
        {tracks.map(track => (
          <li
            key={track.id}
            className="flex justify-between p-2 my-3 py-4 rounded-xl border-2 border-black hover:bg-red cursor-pointer"
          >
            <div className="flex items-center">
              <Play
                width={40}
                height={40}
                className="mx-2 rounded-full p-2 border-2 border-black"
              />
              <div>
                <p className="text-xl font-medium">{track.name}</p>
                <div className="flex gap-4">
                  {track.artists.map(a => (
                    <p key={a.id}>{a.name}</p>
                  ))}
                </div>
              </div>
            </div>

            <p className="flex items-center font-medium">
              {Math.floor(track.durationSeconds / 60)}m{" "}
              {track.durationSeconds % 60}s
            </p>
          </li>
        ))}
      </ul>

      {/* sentinel */}
      <div ref={loaderRef} className="h-10" />

      {loading && <p>Loading…</p>}
      {lastPage && <p>No more tracks</p>}
    </div>
  );
}
