import { useSelector , useDispatch } from "react-redux";
import {removeTrackById, clearQueue} from '../store/queuedTracksSlice'
import { useState } from "react";
import { MoreVertical } from "lucide-react";
 
const QueueSidebar = () => {

  const dispatch = useDispatch();
  const queuedTracks = useSelector(state => state.queuedTracks.queue);
  const { name , artists } = useSelector(state => state.track);
  const [openMenuTime, setOpenMenuTime] = useState(null);
 

  const handleQueueClearing = (e)=>{
    e.preventDefault();
    dispatch(clearQueue());
  }

  return (
    <div className="bg-white border-l border-gray-200 h-screen flex flex-col">
      {/* Header */}
      <div className="p-4 flex flex-row justify-between items-center border-b border-gray-200">
        <h3 className="text-sm font-semibold text-black uppercase tracking-wide">Queue</h3>
        <button onClick={handleQueueClearing} className="text-xs font-semibold text-gray-700 hover:text-red-600 transition-colors">CLEAR</button>
      </div>

      {/* Currently Playing Section */}
      <div className="px-4 py-3">
        {name && (
          <div className="flex flex-col w-full gap-3">
            <p className="w-full text-center text-sm font-medium text-gray-700">CURRENTLY PLAYING</p>
            <div className="flex flex-col w-full p-3 border-2 border-red-500 bg-red-50 rounded">
              <div className="text-red-600 text-sm font-medium truncate">{name}</div>
              <div className="text-red-600 text-xs truncate">
                {artists?.map(artist => artist.name).join(", ")}
              </div>
            </div>
            <div className="w-full border border-red-300"></div>
          </div>
        )}
      </div>

      {/* Queue Items */}
      <div className="flex-1 overflow-y-auto px-4 py-2">
        <div className="flex flex-col gap-3">
          {queuedTracks.length === 0 ? (
            <p className="text-center text-gray-500 text-sm py-8">Queue is empty</p>
          ) : (
            queuedTracks.map(({id , name , artists , time}) => {
              const displayName = name.length > 30 ? name.substring(0, 29) + "..." : name;
              return (
                <div key={time} className="relative">
                  <div className="px-3 py-2 flex flex-row justify-between items-center text-black bg-gray-50 border border-gray-200 hover:bg-red-50 hover:border-red-300 transition-colors rounded">
                    <div className="flex flex-col items-start flex-1 min-w-0">
                      <div className="text-black text-sm font-medium truncate w-full">{displayName}</div>
                      <div className="text-gray-600 text-xs truncate w-full">
                        {artists.map(artist => artist.name).join(", ")}
                      </div>
                    </div>
                    <button 
                      onClick={() => setOpenMenuTime(openMenuTime === time ? null : time)}
                      className="p-1.5 hover:bg-gray-200 rounded ml-2 flex-shrink-0"
                    >
                      <MoreVertical size={16} className="text-gray-600"/>
                    </button>
                  </div>

                  {/* Dropdown Menu */}
                  {openMenuTime === time && (
                    <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-300 rounded-lg shadow-xl z-50">
                      <button
                        onClick={() => {
                          dispatch(removeTrackById(id));
                          setOpenMenuTime(null);
                        }}
                        className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors first:rounded-t-lg last:rounded-b-lg"
                      >
                        Remove from Queue
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default QueueSidebar;
