import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaUser, FaBell, FaCheck, FaClock } from "react-icons/fa6";
import { TiThMenu } from "react-icons/ti";
import { IoClose } from "react-icons/io5";


const MenuItems = [
  { id: 1, title: 'Home', path: '/dashboard' },
  { id: 2, title: 'MyEvents', path: '/myevents' },
  { id: 3, title: 'MyTicket', path: '/mytickets' },
  { id: 4, title: 'About', path: '/about' },
  { id: 5, title: 'Contact', path: '/contact' }
];

const Navbar = ({ username, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const profileRef = useRef(null);
  const notificationRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Get current path for active menu highlighting
  const isActivePath = (path) => location.pathname === path;

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      
      if (!token) {
        console.log("No access token found");
        return;
      }

      const response = await fetch('http://localhost:3000/api/notifications', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications || []);
      } else if (response.status === 401) {
        console.log("Unauthorized - token may be expired");
        // Don't redirect here, just clear notifications
        setNotifications([]);
      } else {
        console.error("Failed to fetch notifications:", response.status);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem("accessToken");
      
      if (!token) {
        console.log("No access token found");
        return;
      }

      const response = await fetch(`http://localhost:3000/api/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        // Update local state to mark notification as read
        setNotifications(prev => 
          prev.map(notification => 
            notification.id === notificationId 
              ? { ...notification, read: true }
              : notification
          )
        );
      } else {
        console.error("Failed to mark notification as read:", response.status);
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // Get unread notification count
  const unreadCount = notifications.filter(n => !n.read).length;

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return date.toLocaleDateString();
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fetch notifications on component mount
  useEffect(() => {
    fetchNotifications();
    // Refresh notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <nav className="w-full min-w-[400px] bg-gradient-to-r from-black/20 via-purple-900/20 to-black/20 backdrop-blur-xl shadow-2xl relative z-[1000] border-b border-white/10">
      <div className="flex items-center justify-between px-4 py-4 md:px-6">
        {/* Logo + Text with Animation */}
        <div className="flex items-center space-x-3 mr-10 group cursor-pointer" onClick={() => navigate('/dashboard')}>
          <div className="relative">
            <img 
              src="/simplytix.svg" 
              alt="SimplyTix Logo" 
              className="w-12 h-12 rounded-full bg-gradient-to-br from-black to-white-600 p-2 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 shadow-lg" 
            />
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-black to-white-400 opacity-0 group-hover:opacity-30 transition-opacity duration-300 animate-pulse"></div>
          </div>
          <h1 className="text-white text-xl sm:text-2xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent group-hover:from-purple-300 group-hover:to-blue-300 transition-all duration-300">
            SimplyTix
          </h1>
        </div>

        {/* Desktop Menu with Enhanced Active Tab Styling */}
        <div className="hidden lg:flex space-x-2">
          {MenuItems.map((item) => (
            <a
              key={item.id}
              href={item.path}
              className={`relative px-6 py-3 text-base font-bold transition-all duration-300 rounded-lg group overflow-hidden ${
                isActivePath(item.path)
                  ? 'text-white bg-gradient-to-r from-purple-600/40 to-blue-600/40 shadow-xl border border-purple-400/30'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              {/* Enhanced Active Background */}
              {isActivePath(item.path) && (
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg animate-pulse"></div>
              )}
              
              {/* Background hover effect for non-active items */}
              {!isActivePath(item.path) && (
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/30 to-blue-600/30 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-lg"></div>
              )}
              
              {/* Enhanced Bottom border animation */}
              <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r from-purple-400 to-blue-400 transition-all duration-300 rounded-full ${
                isActivePath(item.path) 
                  ? 'w-full shadow-lg shadow-purple-400/50' 
                  : 'w-0 group-hover:w-full'
              }`}></div>
              
              {/* Active indicator dot */}
              {isActivePath(item.path) && (
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full animate-pulse shadow-lg"></div>
              )}
              
              <span className="relative z-10 font-semibold">{item.title}</span>
            </a>
          ))}
        </div>

        {/* Enhanced Icons Section */}
        <div className="flex items-center gap-2">
          {/* Notifications with Badge */}
          <div className="relative" ref={notificationRef}>
            <button 
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="text-white text-xl hover:text-purple-300 p-3 rounded-full hover:bg-white/10 transition-all duration-300 transform hover:scale-110 active:scale-95"
            >
              <FaBell className="transition-transform duration-300" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold animate-pulse shadow-lg">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {isNotificationOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-black/95 backdrop-blur-xl rounded-xl shadow-2xl border border-purple-500/30 z-[9999] animate-in slide-in-from-top-2 duration-300">
                <div className="p-4 border-b border-gray-600/50">
                  <div className="flex items-center justify-between">
                    <h3 className="text-white font-semibold">Notifications</h3>
                    <div className="flex items-center gap-2">
                      {loading && (
                        <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
                      )}
                      <span className="text-xs text-gray-400">
                        {unreadCount} unread
                      </span>
                    </div>
                  </div>
                </div>
                
                <div 
                  className="max-h-80 overflow-y-auto scrollbar-thin"
                  style={{
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#8b5cf6 #1f2937'
                  }}
                >
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center">
                      <FaBell className="text-4xl text-gray-500 mx-auto mb-3" />
                      <p className="text-gray-400 text-sm">No notifications yet</p>
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border-b border-gray-700/30 hover:bg-white/5 transition-all duration-200 ${
                          !notification.read ? 'bg-purple-500/10 border-l-4 border-l-purple-500' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="text-white text-sm font-medium truncate">
                                {notification.event?.title || 'Event Notification'}
                              </h4>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse flex-shrink-0"></div>
                              )}
                            </div>
                            <p className="text-gray-300 text-xs mb-2 break-words">
                              {notification.message}
                            </p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 text-xs text-gray-400">
                                <FaClock className="text-xs" />
                                <span>{formatDate(notification.createdAt)}</span>
                              </div>
                              {!notification.read && (
                                <button
                                  onClick={() => markAsRead(notification.id)}
                                  className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 transition-colors duration-200 flex-shrink-0"
                                >
                                  <FaCheck className="text-xs" />
                                  Mark as read
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                
                {notifications.length > 0 && (
                  <div className="p-3 border-t border-gray-700/30 bg-gradient-to-r from-purple-600/10 to-blue-600/10">
                    <button
                      onClick={() => {
                        setIsNotificationOpen(false);
                        navigate('/notification');
                      }}
                      className="w-full text-center text-xs text-purple-400 hover:text-purple-300 transition-colors duration-200 font-medium"
                    >
                      View All Notifications
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Enhanced Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="relative text-white text-xl hover:text-purple-300 p-3 rounded-full hover:bg-white/10 transition-all duration-300 transform hover:scale-110 active:scale-95 group"
            >
              <FaUser className="transition-transform duration-300" />
              <div className="absolute inset-0 rounded-full border-2 border-transparent group-hover:border-purple-400/50 transition-all duration-300"></div>
            </button>
            
            {/* Enhanced Profile Dropdown */}
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
                      navigate('/profile');
                    }}
                    className="w-full text-left px-4 py-3 text-sm text-white hover:bg-gradient-to-r hover:from-purple-600/20 hover:to-blue-600/20 transition-all duration-300 flex items-center gap-3"
                  >
                    <FaUser className="text-purple-400" />
                    Profile Settings
                  </button>
                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      onLogout();
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
          
          {/* Enhanced Mobile Hamburger */}
          <div className="lg:hidden">
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="text-white text-2xl hover:text-purple-300 p-3 rounded-full hover:bg-white/10 transition-all duration-300 transform hover:scale-110 active:scale-95"
            >
              {isOpen ? (
                <IoClose className="transition-transform duration-300 rotate-180" />
              ) : (
                <TiThMenu className="transition-transform duration-300" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-gradient-to-b from-black/95 via-purple-900/30 to-black/95 backdrop-blur-xl shadow-2xl transition-all duration-500 ease-in-out border-t border-white/10 animate-in slide-in-from-top duration-300">
          <ul className="flex flex-col gap-2 py-6 px-4">
            {MenuItems.map((item, index) => (
              <li key={item.id} className="transform transition-all duration-300" style={{ animationDelay: `${index * 100}ms` }}>
                <a
                  href={item.path}
                  className={`block px-4 py-3 text-base font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 relative ${
                    isActivePath(item.path)
                      ? 'text-white bg-gradient-to-r from-purple-600/50 to-blue-600/50 shadow-xl border border-purple-400/30'
                      : 'text-white hover:text-purple-200 hover:bg-white/10'
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
                  {/* Enhanced active border for mobile */}
                  {isActivePath(item.path) && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full shadow-lg"></div>
                  )}
                </a>
              </li>
            ))}
            
            {/* Mobile User Info Section */}
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
                    onLogout();
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
    </nav>
  );
};

export default Navbar;