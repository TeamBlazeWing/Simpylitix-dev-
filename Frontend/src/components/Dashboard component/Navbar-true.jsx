import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaUser, FaBell, FaCheck, FaClock, FaRss } from "react-icons/fa6";
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
  const [isSubscriptionOpen, setIsSubscriptionOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [subscriptionLoading, setSubscriptionLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const profileRef = useRef(null);
  const notificationRef = useRef(null);
  const subscriptionRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Get current path for active menu highlighting
  const isActivePath = (path) => location.pathname === path;

  // Fetch notifications - TEMPORARILY DISABLED
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      // Temporarily disabled to avoid errors
      console.log("Notifications temporarily disabled");
      setNotifications([]);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  // Mark notification as read - TEMPORARILY DISABLED
  const markAsRead = async (notificationId) => {
    try {
      // Temporarily disabled to avoid errors
      console.log("Mark as read temporarily disabled");
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // Get subscription status from user profile
  const getSubscriptionStatus = async () => {
    try {
      setSubscriptionLoading(true);
      
      const token = localStorage.getItem("accessToken");
      if (!token) {
        console.log("No access token found");
        setSubscriptionStatus({
          status: 'inactive',
          message: 'Please log in to check subscription status',
          isActive: false
        });
        return;
      }

      const response = await fetch('/api/users/profile', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const userData = await response.json();
      console.log('User profile data:', userData);
      
      // Extract subscription status from user profile
      const isActive = userData.subscriptionStatus === 'active';
      setSubscriptionStatus({
        status: userData.subscriptionStatus || 'inactive',
        message: isActive 
          ? 'You are subscribed to event notifications' 
          : 'Subscribe to get notifications about new events',
        isActive: isActive,
        userProfile: userData
      });
      
    } catch (error) {
      console.error("Error fetching user profile:", error);
      // Set a fallback status when API fails
      setSubscriptionStatus({
        status: 'inactive',
        message: 'Unable to check subscription status. Please try again.',
        isActive: false
      });
    } finally {
      setSubscriptionLoading(false);
    }
  };

  // Toggle subscription status
  const toggleSubscription = async () => {
    try {
      setSubscriptionLoading(true);
      
      const token = localStorage.getItem("accessToken");
      if (!token) {
        alert("Please log in to manage your subscription");
        return;
      }

      const newStatus = subscriptionStatus?.isActive ? 'inactive' : 'active';
      
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          subscriptionStatus: newStatus
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedUserData = await response.json();
      console.log('Updated user profile:', updatedUserData);
      
      // Update the subscription status state
      const isActive = updatedUserData.subscriptionStatus === 'active';
      setSubscriptionStatus({
        status: updatedUserData.subscriptionStatus,
        message: isActive 
          ? '✅ Successfully subscribed to event notifications!' 
          : '❌ Successfully unsubscribed from notifications',
        isActive: isActive,
        userProfile: updatedUserData
      });

      // Show success message
      const successMessage = isActive 
        ? '🎉 You are now subscribed to event notifications!' 
        : '✅ You have been unsubscribed from notifications';
      alert(successMessage);
      
    } catch (error) {
      console.error("Error updating subscription:", error);
      alert('❌ Failed to update subscription. Please try again.');
    } finally {
      setSubscriptionLoading(false);
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
      if (subscriptionRef.current && !subscriptionRef.current.contains(event.target)) {
        setIsSubscriptionOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fetch notifications on component mount - TEMPORARILY DISABLED
  useEffect(() => {
    // Temporarily disabled to avoid errors
    console.log("Notification fetching temporarily disabled");
    setNotifications([]);
    
    // Auto-fetch subscription status when component mounts
    const token = localStorage.getItem("accessToken");
    if (token) {
      getSubscriptionStatus();
    }
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
          {/* Subscription Service Button */}
          <div className="relative" ref={subscriptionRef}>
            <button 
              onClick={() => {
                setIsSubscriptionOpen(!isSubscriptionOpen);
                if (!isSubscriptionOpen) {
                  getSubscriptionStatus();
                }
              }}
              className={`text-white text-xl hover:text-purple-300 p-3 rounded-full hover:bg-white/10 transition-all duration-300 transform hover:scale-110 active:scale-95 relative ${
                subscriptionStatus && !subscriptionStatus.isActive 
                  ? 'animate-pulse shadow-lg shadow-orange-500/50 ring-2 ring-orange-400/30 bg-orange-500/10' 
                  : ''
              }`}
            >
              <FaRss className={`transition-transform duration-300 ${
                subscriptionStatus && !subscriptionStatus.isActive 
                  ? 'animate-bounce text-orange-400' 
                  : ''
              }`} />
              {subscriptionStatus?.isActive ? (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold animate-pulse shadow-lg">
                  ✓
                </span>
              ) : subscriptionStatus && !subscriptionStatus.isActive ? (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold animate-ping shadow-lg">
                  !
                </span>
              ) : null}
              
              {/* Animated ring for unsubscribed users */}
              {subscriptionStatus && !subscriptionStatus.isActive && (
                <div className="absolute inset-0 rounded-full border-2 border-orange-400/50 animate-ping"></div>
              )}
            </button>

            {/* Subscription Dropdown */}
            {isSubscriptionOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-black/95 backdrop-blur-xl rounded-xl shadow-2xl border border-purple-500/30 z-[9999] animate-in slide-in-from-top-2 duration-300">
                <div className="p-4 border-b border-gray-600/50">
                  <div className="flex items-center justify-between">
                    <h3 className="text-white font-semibold">Subscription Service</h3>
                    {subscriptionLoading && (
                      <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
                    )}
                  </div>
                  {/* Unsubscribed notification */}
                  {subscriptionStatus && !subscriptionStatus.isActive && (
                    <div className="mt-2 text-orange-400 text-xs font-medium animate-pulse">
                      💡 Get notified about new events!
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  {subscriptionLoading ? (
                    <div className="text-center">
                      <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                      <p className="text-gray-400 text-sm">Checking subscription status...</p>
                    </div>
                  ) : subscriptionStatus ? (
                    <div className="space-y-4">
                      <div className={`p-4 rounded-lg border ${
                        subscriptionStatus.isActive 
                          ? 'bg-green-500/20 border-green-500/30' 
                          : 'bg-red-500/20 border-red-500/30'
                      }`}>
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`w-3 h-3 rounded-full ${
                            subscriptionStatus.isActive 
                              ? 'bg-green-500 animate-pulse' 
                              : 'bg-red-500'
                          }`}></div>
                          <h4 className="text-white font-medium">
                            Status: {subscriptionStatus.isActive ? 'Active' : 'Inactive'}
                          </h4>
                        </div>
                        <p className="text-gray-300 text-sm">
                          {subscriptionStatus.message || 'Subscription service status'}
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <button
                          onClick={toggleSubscription}
                          disabled={subscriptionLoading}
                          className={`w-full py-2 px-4 rounded-lg font-medium transition-all duration-300 ${
                            subscriptionLoading 
                              ? 'bg-gray-600/20 text-gray-400 cursor-not-allowed'
                              : subscriptionStatus.isActive
                                ? 'bg-red-600/20 text-red-400 hover:bg-red-600/30 border border-red-500/30'
                                : 'bg-gradient-to-r from-green-600/30 to-emerald-600/30 text-green-400 hover:from-green-600/40 hover:to-emerald-600/40 border border-green-500/30 transform hover:scale-105 animate-pulse shadow-lg shadow-green-500/25'
                          }`}
                        >
                          {subscriptionLoading ? (
                            <div className="flex items-center justify-center gap-2">
                              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                              Updating...
                            </div>
                          ) : (
                            subscriptionStatus.isActive ? 'Unsubscribe' : '🚀 Subscribe Now'
                          )}
                        </button>
                        
                        <button
                          onClick={() => getSubscriptionStatus()}
                          className="w-full py-2 px-4 rounded-lg font-medium bg-purple-600/20 text-purple-400 hover:bg-purple-600/30 border border-purple-500/30 transition-all duration-300"
                        >
                          Refresh Status
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <FaRss className="text-4xl text-gray-500 mx-auto mb-3" />
                      <p className="text-gray-400 text-sm mb-4">Unable to load subscription status</p>
                      <button
                        onClick={() => getSubscriptionStatus()}
                        className="py-2 px-4 rounded-lg font-medium bg-purple-600/20 text-purple-400 hover:bg-purple-600/30 border border-purple-500/30 transition-all duration-300"
                      >
                        Try Again
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

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