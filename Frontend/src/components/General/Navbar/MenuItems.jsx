
import { FaUser } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { MenuItems } from "./constants";
import "./styles.css";

const MenuItemsComponent = ({ isOpen, setIsOpen, location, username, handleLogout }) => {
  const isActivePath = (path) => location.pathname === path;

  return (
    <>
      <div className="hidden lg:flex space-x-2">
        {MenuItems.map((item) => (
          <a
            key={item.id}
            href={item.path}
            className={`relative px-6 py-3 text-base font-bold transition-all duration-300 rounded-lg group overflow-hidden ${
              isActivePath(item.path)
                ? "text-white bg-gradient-to-r from-purple-600/40 to-blue-600/40 shadow-xl border border-purple-400/30"
                : "text-white/80 hover:text-white hover:bg-white/10"
            }`}
          >
            {isActivePath(item.path) && (
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg animate-pulse"></div>
            )}
            {!isActivePath(item.path) && (
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/30 to-blue-600/30 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-lg"></div>
            )}
            <div
              className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r from-purple-400 to-blue-400 transition-all duration-300 rounded-full ${
                isActivePath(item.path) ? "w-full shadow-lg shadow-purple-400/50" : "w-0 group-hover:w-full"
              }`}
            ></div>
            {isActivePath(item.path) && (
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full animate-pulse shadow-lg"></div>
            )}
            <span className="relative z-10 font-semibold">{item.title}</span>
          </a>
        ))}
      </div>
      {isOpen && (
        <div className="fixed top-0 left-0 right-0 w-full z-50 md:hidden bg-gradient-to-b from-black via-purple-900 to-black backdrop-blur-3xl shadow-2xl transition-all duration-500 ease-in-out border-t border-white/10 animate-in slide-in-from-top duration-300">
          <ul className="flex flex-col gap-2 py-6 px-4">
            {MenuItems.map((item, index) => (
              <li key={item.id} className="transform transition-all duration-300" style={{ animationDelay: `${index * 100}ms` }}>
                <a
                  href={item.path}
                  className={`block px-4 py-3 text-base font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 relative ${
                    isActivePath(item.path)
                      ? "text-white bg-gradient-to-r from-purple-600/50 to-blue-600/50 shadow-xl border border-purple-400/30"
                      : "text-white hover:text-purple-200 hover:bg-white/10"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold">{item.title}</span>
                    {isActivePath(item.path) && (
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full animate-pulse"></div>
                        <span className="text-xs bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent font-bold">ACTIVE</span>
                      </div>
                    )}
                  </div>
                  {isActivePath(item.path) && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full shadow-lg"></div>
                  )}
                </a>
              </li>
            ))}
            <li className="mt-4 pt-4 border-t border-white/20">
              <div className="px-4 py-3 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-lg backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                    <FaUser className="text-white text-sm" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">Hello, {username}</p>
                    <p className="text-gray-400 text-xs">Welcome back!</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-left text-red-400 text-sm font-semibold hover:text-red-300 transition-colors duration-300 flex items-center gap-2 px-2 py-2 rounded hover:bg-red-900/20"
                >
                  <IoClose className="text-red-400" />
                  Sign Out
                </button>
              </div>
            </li>
          </ul>
        </div>
      )}
    </>
  );
};

export default MenuItemsComponent;