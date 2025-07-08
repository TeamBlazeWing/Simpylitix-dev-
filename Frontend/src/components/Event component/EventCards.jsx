import { useState } from "react";
import { FaEdit, FaTrash, FaBell, FaTimes } from "react-icons/fa";

const EventCards = ({ events, onEventClick, currentUserId, showCreatorActions = false, onEditEvent, onDeleteEvent, onNotifyAttendees }) => {
  const handleNotifyAll = (event) => {
    if (onNotifyAttendees) {
      onNotifyAttendees(event);
    }
  };

  return (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8 px-4">
    {events.map((event, idx) => {
      const isEnrolled = event.attendees && event.attendees.includes(currentUserId);
      const enrollmentPercentage = event.attendees ? (event.attendees.length / (event.maxAttendees || 100)) * 100 : 0;
      
      return (
        <div
          key={idx}
          className="group relative bg-gradient-to-br from-black/40 via-gray-900/30 to-black/50 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden cursor-pointer transform transition-all duration-500 hover:scale-105 hover:rotate-1 hover:shadow-2xl hover:shadow-gray-500/25"
          onClick={() => onEventClick(event)}
        >
          {/* Gradient overlay for better visual depth */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-600/5 via-transparent to-gray-500/5 transition-opacity duration-500" />
          
          {/* Image container with overlay effects */}
          <div className="relative overflow-hidden">
            <img
              src={event.imageUrl}
              alt={event.title}
              className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-110"
            />
            
            {/* Image overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent transition-opacity duration-500" />
            
            {/* Price badge */}
            <div className="absolute top-3 left-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg transform transition-transform duration-300 group-hover:scale-110">
              ${event.price}
            </div>
            
            {/* Enrollment status badge */}
            {isEnrolled && (
              <div className="absolute top-3 right-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white text-sm font-semibold px-3 py-1 rounded-full shadow-lg transform transition-all duration-300 group-hover:scale-110 animate-pulse">
                ✓ Enrolled
              </div>
            )}
            
            {/* Type badge */}
            <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-lg border border-white/20">
              {event.type}
            </div>
          </div>
          
          {/* Content section */}
          <div className="p-5 space-y-3">
            {/* Title */}
            <h2 className="text-lg font-bold text-white mb-2 line-clamp-2 transition-colors duration-300">
              {event.title}
            </h2>
            
            {/* Location with icon */}
            <div className="flex items-center gap-2 text-gray-300">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
              <span className="text-sm font-medium truncate">{event.location}</span>
            </div>
            
            {/* District */}
            <div className="flex items-center gap-2 text-gray-400">
              <div className="w-2 h-2 bg-blue-400 rounded-full" />
              <span className="text-sm">{event.district}</span>
            </div>
            
            {/* Volunteer info */}
            {event.volunteer && (
              <div className="flex items-center gap-2 text-green-400">
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                <span className="text-sm">Volunteer: {event.volunteer}</span>
              </div>
            )}
            
            {/* Enrollment progress */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Enrollment</span>
                <span className="text-white font-semibold">
                  {event.attendees ? event.attendees.length : 0}/{event.maxAttendees || 100}
                </span>
              </div>
              
              {/* Progress bar */}
              <div className="w-full bg-gray-700/50 rounded-full h-2 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${enrollmentPercentage}%` }}
                />
              </div>
              
              {/* Progress percentage */}
              <div className="text-right">
                <span className="text-xs text-gray-400">{enrollmentPercentage.toFixed(0)}% full</span>
              </div>
            </div>
            
            {/* Action buttons */}
            <div className="pt-2 space-y-2">
              {/* Main action button */}
              <button 
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-2 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                onClick={(e) => {
                  e.stopPropagation();
                  onEventClick(event);
                }}
              >
                {isEnrolled ? 'View Details' : 'Learn More'}
              </button>

              {/* Creator actions - Edit, Delete, and Notify All buttons */}
              {showCreatorActions && (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <button 
                      className="flex-1 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold py-2 px-3 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditEvent && onEditEvent(event);
                      }}
                    >
                      <FaEdit className="text-sm" />
                      Edit
                    </button>
                    <button 
                      className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-2 px-3 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteEvent && onDeleteEvent(event);
                      }}
                    >
                      <FaTrash className="text-sm" />
                      Delete
                    </button>
                  </div>
                  
                  {/* Notify All button */}
                  <button 
                    className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold py-2 px-3 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNotifyAll(event);
                    }}
                  >
                    <FaBell className="text-sm" />
                    Notify All Attendees
                  </button>
                </div>
              )}
            </div>
          </div>
          
        </div>
      );
    })}
  </div>
);
};

export default EventCards;