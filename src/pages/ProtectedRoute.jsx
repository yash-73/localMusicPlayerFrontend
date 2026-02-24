import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import Controls from "../components/Controls";
import SearchBox from "../components/SearchBox";
import PlaylistsSidebar from "../components/PlaylistsSidebar";
import QueueSidebar from "../components/QueueSidebar";
import ViewToggle from "../components/ViewToggle";
import ThemeToggle from "../components/ThemeToggle";

const ProtectedRoute = () => {
  
  const { isAuthenticated, bootStrapped } = useSelector(
    state => state.user
  );

  if (!bootStrapped) {
    return <div className="flex items-center justify-center min-h-screen bg-white text-black">Loading....</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex flex-col w-full h-screen bg-white">
      {/* Top: Search Bar */}
      <div className="flex flex-row w-full">
      <SearchBox />
      <ThemeToggle/>
      </div>
      {/* Middle: 3-Column Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Playlists */}
        <div className="w-[20%] overflow-hidden">
          <PlaylistsSidebar />
        </div>

        {/* Center: Main Content (Outlet) */}
        <div className="flex-1 bg-white overflow-hidden border-x border-gray-200 flex flex-col">
          <ViewToggle />
          <div className="flex-1 overflow-hidden flex items-center justify-center p-4">
            <Outlet />
          </div>
        </div>

        {/* Right: Queue */}
        <div className="w-[20%] overflow-hidden">
          <QueueSidebar />
        </div>
      </div>

      {/* Bottom: Controls */}
      <Controls />
    </div>
  );
};

export default ProtectedRoute;
