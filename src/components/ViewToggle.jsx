import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const ViewToggle = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeView, setActiveView] = useState("tracks");

  const views = [
    { id: "tracks", label: "Tracks", path: "/tracks" },
    { id: "artists", label: "Artists", path: "/artists" },
    { id: "albums", label: "Albums", path: "/albums" }
  ];

  useEffect(() => {
    // Determine active view based on current path
    if (location.pathname === "/" || location.pathname === "/tracks") {
      setActiveView("tracks");
    } else if (location.pathname === "/artists") {
      setActiveView("artists");
    } else if (location.pathname === "/albums") {
      setActiveView("albums");
    }
  }, [location.pathname]);

  const handleViewChange = (view) => {
    setActiveView(view.id);
    navigate(view.path);
  };

  return (
    <div className="flex gap-0 border-b border-gray-200 bg-white">
      {views.map((view) => (
        <button
          key={view.id}
          onClick={() => handleViewChange(view)}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeView === view.id
              ? "text-red-600 border-b-2 border-red-600 bg-white"
              : "text-gray-700 hover:text-black border-b-2 border-transparent hover:bg-gray-50"
          }`}
        >
          {view.label}
        </button>
      ))}
    </div>
  );
};

export default ViewToggle;
