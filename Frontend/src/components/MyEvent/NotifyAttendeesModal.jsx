import React from 'react';
import { FaTimes, FaPaperPlane } from 'react-icons/fa';

const NotifyAttendeesModal = ({
  event,
  notificationMessage,
  setNotificationMessage,
  sendingNotification,
  onClose,
  onSendNotification,
}) => {
  if (!event) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-3xl border border-white/10 shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-slideUp">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-red-600/80 hover:bg-red-700 rounded-full transition-all duration-300 transform hover:scale-110 active:scale-95"
        >
          <FaTimes className="text-white" />
        </button>

        <div className="p-6">
          <h2 className="text-2xl font-bold text-white mb-4">
            Notify Attendees
          </h2>
          <h3 className="text-lg font-semibold text-gray-200 mb-4">
            Event: {event.title}
          </h3>
          <p className="text-gray-400 text-sm mb-4">
            Send a notification to all{' '}
            {event.enrollmentCount || event.attendees?.length || 0} enrolled
            attendee{event.enrollmentCount !== 1 ? 's' : ''}.
          </p>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Message *
            </label>
            <textarea
              value={notificationMessage}
              onChange={(e) => setNotificationMessage(e.target.value)}
              className="block w-full rounded-lg border border-gray-600 bg-gray-800 text-white px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
              rows="4"
              placeholder="Enter your notification message"
            />
          </div>

          <div className="flex justify-end gap-4">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onSendNotification}
              disabled={sendingNotification || !notificationMessage.trim()}
              className={`px-6 py-2 bg-blue-600 text-white rounded-lg transition-colors flex items-center gap-2 ${
                sendingNotification || !notificationMessage.trim()
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-blue-700'
              }`}
            >
              {sendingNotification ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Sending...
                </>
              ) : (
                <>
                  <FaPaperPlane />
                  Send Notification
                </>
              )}
            </button>
          </div>
        </div>

        <style jsx>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(50px) scale(0.95);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          .animate-fadeIn {
            animation: fadeIn 0.3s ease-out;
          }

          .animate-slideUp {
            animation: slideUp 0.4s ease-out;
          }
        `}</style>
      </div>
    </div>
  );
};

export default NotifyAttendeesModal;