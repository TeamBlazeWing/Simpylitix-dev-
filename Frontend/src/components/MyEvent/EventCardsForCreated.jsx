import React from 'react';
import { FaBell, FaEdit, FaTrash } from 'react-icons/fa';

const EventCardsForCreated = ({
  events,
  onEventClick,
  currentUserId,
  onEditEvent,
  onDeleteEvent,
  onNotifyAttendees
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8 px-4">
      {events.map((event, idx) => {
        const isCreator = event.creator?._id === currentUserId || event.creator === currentUserId ||
                          event.createdBy?._id === currentUserId || event.createdBy === currentUserId;

        const enrollmentCount = event.attendees?.length || event.enrollmentCount || 0;

        return (
          <div
            key={idx}
            className="bg-gray-800 rounded-lg shadow-xl overflow-hidden"
          >
            <img src={event.imageUrl} alt={event.title} className="h-48 w-full object-cover" />
            <div className="p-4">
              <h2 className="text-white text-lg font-bold">{event.title}</h2>
              <p className="text-gray-400 text-sm">{event.location}</p>

              {isCreator && (
                <div className="mt-4 flex flex-col gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onNotifyAttendees && onNotifyAttendees(event);
                    }}
                    className="flex items-center justify-center bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded"
                  >
                    <FaBell className="mr-2" /> Notify All ({enrollmentCount})
                  </button>

                  <div className="flex gap-2">
                    <button
                      disabled={enrollmentCount > 0}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (enrollmentCount > 0) {
                          alert(`Cannot edit event with ${enrollmentCount} enrolled attendee${enrollmentCount > 1 ? 's' : ''}.`);
                          return;
                        }
                        onEditEvent && onEditEvent(event);
                      }}
                      className={`flex-1 flex items-center justify-center py-2 rounded ${
                        enrollmentCount > 0
                          ? 'bg-gray-500 cursor-not-allowed'
                          : 'bg-blue-500 hover:bg-blue-600 text-white'
                      }`}
                    >
                      <FaEdit className="mr-2" /> Edit
                    </button>

                    <button
                      disabled={enrollmentCount > 0}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (enrollmentCount > 0) {
                          alert(`Cannot delete event with ${enrollmentCount} enrolled attendee${enrollmentCount > 1 ? 's' : ''}.`);
                          return;
                        }
                        onDeleteEvent && onDeleteEvent(event);
                      }}
                      className={`flex-1 flex items-center justify-center py-2 rounded ${
                        enrollmentCount > 0
                          ? 'bg-gray-500 cursor-not-allowed'
                          : 'bg-red-500 hover:bg-red-600 text-white'
                      }`}
                    >
                      <FaTrash className="mr-2" /> Delete
                    </button>
                  </div>
                </div>
              )}

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEventClick && onEventClick(event);
                }}
                className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded"
              >
                View Details
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default EventCardsForCreated;