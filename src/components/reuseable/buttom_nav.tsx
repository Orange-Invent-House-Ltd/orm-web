import { Home, LogOut, User } from "lucide-react";
import { useTheme } from "../../custom-hooks/useTheme"; // Adjust path as needed
import { useState } from "react";
import { toast } from "react-toastify";
import LoadingOverlay from "./loading-overlay";
import { useNavigate } from "react-router-dom";

interface NavigationBarProps {
  onHomeClick?: () => void;
  onLogoutClick?: () => void;
  userName?: string;
  className?: string;
}

export const NavigationBar = ({ 
  onHomeClick, 
  onLogoutClick, 
  userName = "User",
  className = "" 
}: NavigationBarProps) => {
  const { isDarkMode } = useTheme();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate()

  const handleHomeClick = () => {
    if (onHomeClick) {
      onHomeClick();
    } else {
      // Default behavior - navigate to home
      navigate('/');
    }
  };

  const handleLogoutClick = () => {
    if (onLogoutClick) {
      onLogoutClick();
    } else {
      setIsLoggingOut(true);
      // Default behavior - navigate to login
      sessionStorage.clear();
      localStorage.clear()
      toast.info("Logging out user");
      setTimeout(() => {
        navigate('/login');
      }, 1000);
    }
  };

  return (
    <>
      {isLoggingOut && <LoadingOverlay />}
      <nav className={`
        fixed bottom-0 left-0 right-0 z-50 
        px-4 py-3 sm:px-6 sm:py-4
        border-t backdrop-blur-lg
        transition-all duration-300
      ${isDarkMode 
        ? 'bg-gray-800/95 border-gray-700 shadow-2xl shadow-black/20' 
        : 'bg-white/95 border-gray-200 shadow-2xl shadow-gray-900/10'
      }
      ${className}
    `}>
      {/* Navigation Content */}
      <div className={`
        flex items-center
        justify-between sm:justify-between lg:justify-evenly
        max-w-4xl mx-auto
      `}>
        {/* Home Button */}
        <button
          onClick={handleHomeClick}
          className={`
            flex items-center space-x-2 sm:space-x-3
            px-4 py-2 sm:px-6 sm:py-3
            rounded-xl sm:rounded-2xl
            transition-all duration-300
            transform hover:scale-105 active:scale-95
            ${isDarkMode
              ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/25'
              : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/25'
            }
          `}
        >
          <Home className="w-5 h-5 sm:w-6 sm:h-6" />
          <span className="font-semibold text-sm sm:text-base">Home</span>
        </button>

        {/* User Info - Hidden on small screens, shown on larger screens */}
        <div className={`
          hidden sm:flex items-center space-x-3
          px-4 py-2 rounded-xl
          ${isDarkMode
            ? 'bg-gray-700/50 text-gray-300'
            : 'bg-gray-100/80 text-gray-700'
          }
        `}>
          <div className={`
            w-8 h-8 rounded-full flex items-center justify-center
            ${isDarkMode
              ? 'bg-emerald-600'
              : 'bg-emerald-500'
            }
          `}>
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="text-sm">
            <p className="font-medium truncate max-w-24 lg:max-w-32">
              {userName}
            </p>
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Welcome back
            </p>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogoutClick}
          className={`
            flex items-center space-x-2 sm:space-x-3
            px-4 py-2 sm:px-6 sm:py-3
            rounded-xl sm:rounded-2xl
            border transition-all duration-300
            transform hover:scale-105 active:scale-95
            ${isDarkMode
              ? 'border-red-500/50 bg-red-900/20 hover:bg-red-900/40 text-red-400 hover:text-red-300 shadow-lg shadow-red-900/20'
              : 'border-red-300 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 shadow-lg shadow-red-200/50'
            }
          `}
        >
          <LogOut className="w-5 h-5 sm:w-6 sm:h-6" />
          <span className="font-semibold text-sm sm:text-base">Log Out</span>
        </button>
      </div>

      {/* Mobile User Info Bar - Only shown on small screens */}
      <div className={`
        sm:hidden mt-3 pt-3 border-t
        flex items-center justify-center space-x-2
        ${isDarkMode
          ? 'border-gray-700'
          : 'border-gray-200'
        }
      `}>
          {/* <div className={`
          w-6 h-6 rounded-full flex items-center justify-center
          ${isDarkMode
            ? 'bg-emerald-600'
            : 'bg-emerald-500'
          }
        `}>
          <User className="w-3 h-3 text-white" />
        </div>
        <span className={`text-sm font-medium truncate max-w-32 ${
          isDarkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>
          {userName}
        </span> */}
      </div>

      {/* Bottom Safe Area for Mobile Devices */}
      <div className="h-safe-bottom"></div>
    </nav>
    </>
  );
};


