import { Moon, Sun } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { toggleDarkMode } from "../store/userSlice";

const ThemeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(useSelector(state => state.user.darkMode));
  const dispatch = useDispatch();
    
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    dispatch(toggleDarkMode());
  };

  return (
    <div className="m-2 flex flex-row items-center">
    <button
      onClick={toggleTheme}
      className="p-4 rounded-lg transition-colors hover:bg-gray-200"
      title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      {isDarkMode ? (
        <Sun size={20} className="text-yellow-500" />
      ) : (
        <Moon size={20} className="text-gray-600" />
      )}
    </button>
    </div>
  );
};

export default ThemeToggle;
