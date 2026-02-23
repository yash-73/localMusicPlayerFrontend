import { MoreVertical } from "lucide-react";

const TrackMenu = ({
  track,
  index,
  isOpen,
  onToggle,
  onPlayNext,
  onAddToQueue,
  onAddToPlaylist,
  showAlert,
  alertMessage,
}) => {
  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggle(index);
        }}
        className="p-1.5 hover:bg-gray-200 rounded transition-colors text-gray-600 hover:text-red-600"
        title="More options"
      >
        <MoreVertical size={18} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPlayNext(track.id, track.name, track.artists, index);
            }}
            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 hover:text-red-600 transition-colors"
          >
            Play Next
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToQueue(track.id, track.name, track.artists, index);
            }}
            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 hover:text-red-600 transition-colors border-t border-gray-200"
          >
            Add to Queue
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToPlaylist && onAddToPlaylist(track, index);
            }}
            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 hover:text-red-600 transition-colors border-t border-gray-200"
          >
            Add to Playlist
          </button>
        </div>
      )}

      {showAlert && (
        <div className="absolute right-0 mt-1 shadow-lg text-red-500 p-4 z-50 w-[200px] text-sm bg-red-50 border-red-500 border">
          {alertMessage}
        </div>
      )}
    </div>
  );
};

export default TrackMenu;
