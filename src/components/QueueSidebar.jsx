const QueueSidebar = () => {
  // TODO: Integrate API to fetch current queue
  const queue = [
    "Song 1",
    "Song 2", 
    "Song 3",
    "Song 4",
    "Song 5",
  ];

  return (
    <div className="bg-white border-l border-gray-200 p-4 overflow-y-auto h-screen">
      <h3 className="text-sm font-semibold text-black mb-4 uppercase tracking-wide">Queue</h3>
      <div className="flex flex-col gap-2">
        {queue.map((song, idx) => (
          <div
            key={idx}
            className="px-3 py-2 text-xs text-gray-700 bg-gray-50 border border-gray-200 hover:bg-red-50 hover:border-red-300 transition-colors truncate"
          >
            {song}
          </div>
        ))}
      </div>
    </div>
  );
};

export default QueueSidebar;
