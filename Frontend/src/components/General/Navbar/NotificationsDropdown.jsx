import { FaBell, FaCheck, FaClock } from "react-icons/fa6";
import "./styles.css";

const NotificationsDropdown = ({ notificationRef, isNotificationOpen, setIsNotificationOpen, notifications, loading, markAsRead, navigate }) => {
  const unreadCount = notifications.filter((n) => !n.read).length;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 1) return "Today";
    if (diffDays === 2) return "Yesterday";
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="relative" ref={notificationRef}>
      <button
        onClick={() => setIsNotificationOpen(!isNotificationOpen)}
        className="text-white text-xl hover:text-purple-300 p-3 rounded-full hover:bg-white/10 transition-all duration-300 transform hover:scale-110 active:scale-95"
      >
        <FaBell className="transition-transform duration-300" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold animate-pulse shadow-lg">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>
      {isNotificationOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-black/95 backdrop-blur-xl rounded-xl shadow-2xl border border-purple-500/30 z-[9999] animate-in slide-in-from-top-2 duration-300">
          <div className="p-4 border-b border-gray-600/50">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-semibold">Notifications</h3>
              <div className="flex items-center gap-2">
                {loading && (
                  <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
                )}
                <span className="text-xs text-gray-400">{unreadCount} unread</span>
              </div>
            </div>
          </div>
          <div
            className="max-h-80 overflow-y-auto scrollbar-thin"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#8b5cf6 #1f2937",
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
                    !notification.read ? "bg-purple-500/10 border-l-4 border-l-purple-500" : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="text-white text-sm font-medium truncate">{notification.event?.title || "Event Notification"}</h4>
                        {!notification.read && <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse flex-shrink-0"></div>}
                      </div>
                      <p className="text-gray-300 text-xs mb-2 break-words">{notification.message}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <FaClock className="text-xs" />
                          <span>{formatDate(notification.createdAt)}</span>
                        </div>
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification._id)}
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
                  navigate("/notification");
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
  );
};

export default NotificationsDropdown;