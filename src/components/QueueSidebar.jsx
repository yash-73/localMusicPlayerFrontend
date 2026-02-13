import { useSelector , useDispatch } from "react-redux";
import {addTrack, addTrackToFront, 
  removeFirstTrack, removeTrackById, clearQueue} from '../store/queuedTracksSlice'
import { useEffect } from "react";
 
const QueueSidebar = () => {

  const dispatch = useDispatch();
  const queuedTracks = useSelector(state => state.queuedTracks.queue);
  const {name , artists} = useSelector(state => state.track);
 


  return (
    <div className="bg-white border-l border-gray-200 p-4 overflow-y-auto h-screen">
      <h3 className="text-sm font-semibold text-black mb-4 uppercase tracking-wide">Queue</h3>

      <div className="flex flex-col w-full ">
        <p className="w-full text-center"> Currently Playing</p>
        <div className="flex flex-col w-full p-2 border-red-500 border bg-red-50">
          <div className="text-red-500 text-sm">{name}</div>
          <div className="text-red-500 text-xs">
            {artists?.map(artist => artist.name).join(", ")}
          </div>
        </div>
        <div className="w-full border border-red-500 my-2"></div>
      </div>

      <div className="flex flex-col gap-2">
        {queuedTracks.map(({id , name , artists}) => {
          const displayName = name.length > 30 ? name.substring(0, 29) + "..." : name;
          return (
          <div
            key={id}
            className="px-3 py-2 flex flex-col items-start justify-evenly cursor-default text-black bg-gray-50 border border-gray-200 hover:bg-red-50 hover:border-red-300 transition-colors truncate"
          >
            <div className="text-black text-sm">{displayName}</div>
            <div className="text-gray-700 text-xs">
            {artists.map(artist => artist.name).join(", ")}
            </div>
          </div>
        )
        })}
      </div>
    </div>
  );
};

export default QueueSidebar;
