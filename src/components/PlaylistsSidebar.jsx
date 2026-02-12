const PlaylistsSidebar = () => {
  // TODO: Integrate API to fetch user playlists
  const playlists = [
    "My Favorites",
    "Workout Mix",
    "Chill Vibes",
    "Road Trip",
    "Study Focus",
  ];

  return (
    <div className="bg-white border-r border-gray-200 p-4 overflow-y-auto h-screen">
      <h3 className="text-sm font-semibold text-black mb-4 uppercase tracking-wide">Playlists</h3>
      <div className="flex flex-col gap-2">
        {playlists.map((playlist, idx) => (
          <button
            key={idx}
            className="text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-red-600 transition-colors"
          >
            {playlist}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PlaylistsSidebar;
