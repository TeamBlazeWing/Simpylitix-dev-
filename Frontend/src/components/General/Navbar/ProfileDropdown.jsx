import { FaUser } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import "./styles.css";

const ProfileDropdown = ({ profileRef, isProfileOpen, setIsProfileOpen, username, navigate, handleLogout }) => {
  return (
    <div className="relative" ref={profileRef}>
      <button
        onClick={() => setIsProfileOpen(!isProfileOpen)}
        className="relative text-white text-xl hover:text-purple-300 p-3 rounded-full hover:bg-white/10 transition-all duration-300 transform hover:scale-110 active:scale-95 group"
      >
        <FaUser className="transition-transform duration-300" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent group-hover:border-purple-400/50 transition-all duration-300"></div>
      </button>
      {isProfileOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-black/95 backdrop-blur-xl rounded-xl shadow-2xl border border-purple-500/30 z-[9999] animate-in slide-in-from-top-2 duration-300">
          <div className="py-2">
            <div className="px-4 py-3 border-b border-gray-600/50">
              <p className="text-sm font-medium text-gray-300">Signed in as</p>
              <p className="text-sm text-white font-semibold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">{username}</p>
            </div>
            <button
              onClick={() => {
                setIsProfileOpen(false);
                navigate("/profile");
              }}
              className="w-full text-left px-4 py-3 text-sm text-white hover:bg-gradient-to-r hover:from-purple-600/20 hover:to-blue-600/20 transition-all duration-300 flex items-center gap-3"
            >
              <FaUser className="text-purple-400" />
              Profile Settings
            </button>
            <button
              onClick={() => {
                setIsProfileOpen(false);
                handleLogout();
              }}
              className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-red-900/30 transition-all duration-300 flex items-center gap-3"
            >
              <IoClose className="text-red-400" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;