import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaEye,
  FaDollarSign,
  FaCalendarAlt,
  FaCalendarPlus,
  FaPlus,
  FaTimes,
  FaTrash,
  FaEdit,
  FaMapMarkerAlt,
  FaClock,
  FaTicketAlt,
  FaInfoCircle,
  FaCheck,
  FaUserPlus,
  FaBell,
  FaUsers,
  FaUserCheck
} from 'react-icons/fa';
import Navbar from '../components/Event component/Navbar';
import Footer from "../components/Event component/Footer";

const isTokenValid = (token) => {
  if (!token) return false;
  
  try {
    // JWT tokens are made up of three parts: header.payload.signature
    const base64Url = token.split('.')[1]; // Get the payload part
    if (!base64Url) return false;
    
    // Convert base64 to JSON
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(window.atob(base64));
    
    // Check if token has expired
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    return payload.exp > currentTime;
  } catch (error) {
    console.error("Error validating token:", error);
    return false;
  }
};

// Helper function to clear authentication data
const clearAuthData = () => {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("loggedInUser");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("userId");
};

// Event Details Modal Component - EXACT COPY FROM DASHBOARD
const EventModal = ({ event, onClose, onEnroll, enrolling, currentUserId }) => {
  const navigate = useNavigate();
  const [enrollmentCount, setEnrollmentCount] = useState(0);
  const [loadingEnrollments, setLoadingEnrollments] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  
  // Update local enrollment state when event changes
  useEffect(() => {
    setIsEnrolled(event?.isEnrolled || false);
  }, [event?.isEnrolled]);
  
  // Fetch enrollment count for this event
  useEffect(() => {
    const fetchEnrollmentCount = async () => {
      if (!event?.id && !event?._id) return;
      
      try {
        setLoadingEnrollments(true);
        
        const token = localStorage.getItem("accessToken");
        const headers = {
          'Content-Type': 'application/json',
        };
        
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        
        const eventId = event._id || event.id;
        const response = await fetch(`/api/enrollments/event/${eventId}`, {
          method: 'GET',
          headers
        });
        
        if (response.ok) {
          const data = await response.json();
          const enrollments = data.data || data || [];
          setEnrollmentCount(enrollments.length);
        } else {
          if (response.status === 401) {
            console.log('Unauthorized - enrollment count may require authentication');
          } else {
            console.log('Failed to fetch enrollment count');
          }
          setEnrollmentCount(0);
        }
      } catch (error) {
        console.error('Error fetching enrollment count:', error);
        setEnrollmentCount(0);
      } finally {
        setLoadingEnrollments(false);
      }
    };
    
    fetchEnrollmentCount();
  }, [event?.id, event?._id]);
  
  if (!event) return null;

  const handleBuyTicket = () => {
    // Store the selected event in localStorage for the buy ticket page
    localStorage.setItem('selectedEvent', JSON.stringify(event));
    navigate('/payment');
  };

  const handleEnroll = () => {
    // Pass the current enrollment status to the parent component
    const eventId = event._id || event.id;
    onEnroll(eventId, isEnrolled);
    
    // Update local enrollment status and count immediately for better UX
    setIsEnrolled(!isEnrolled);
    
    if (isEnrolled) {
      setEnrollmentCount(prev => Math.max(0, prev - 1));
    } else {
      setEnrollmentCount(prev => prev + 1);
    }
  };
  
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-fadeIn">
      {/* Enhanced blurred background with gradient */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-black/80 via-gray-900/90 to-black/80 backdrop-blur-xl"
        onClick={onClose}
      />
      
      {/* Modal container with enhanced styling */}
      <div className="relative bg-gradient-to-br from-black/90 via-gray-900/95 to-black/90 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-slideUp">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-[10000] p-2 bg-black/50 hover:bg-red-600/80 rounded-full transition-all duration-300 transform hover:scale-110 active:scale-95 backdrop-blur-sm border border-white/20"
        >
          <FaTimes className="text-white text-lg" />
        </button>

        {/* Scrollable content */}
        <div className="overflow-y-auto max-h-[90vh] custom-scrollbar">
          
          {/* Image section with overlay */}
          <div className="relative h-64 overflow-hidden">
            <img
              src={event.imageUrl}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            
            {/* Price badge */}
            <div className="absolute top-4 left-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold px-4 py-2 rounded-full shadow-lg backdrop-blur-sm border border-white/20">
              <FaDollarSign className="inline mr-1" />
              {event.price}
            </div>
            
            {/* Enrollment status badge */}
            {isEnrolled && (
              <div className="absolute top-4 right-16 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold px-4 py-2 rounded-full shadow-lg animate-pulse backdrop-blur-sm border border-white/20">
                <FaUserCheck className="inline mr-1" />
                Enrolled
              </div>
            )}
            
            {/* Title overlay */}
            <div className="absolute bottom-4 left-4 right-4">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 drop-shadow-lg">
                {event.title}
              </h2>
              <p className="text-gray-200 text-sm md:text-base drop-shadow-md line-clamp-2">
                {event.description}
              </p>
            </div>
          </div>

          {/* Content section */}
          <div className="p-6 space-y-6">
            
            {/* Event details grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Date & Time */}
              <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-sm rounded-xl p-4 border border-purple-500/30">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-purple-600/30 rounded-lg">
                    <FaCalendarAlt className="text-purple-400" />
                  </div>
                  <h3 className="text-white font-semibold">Date & Time</h3>
                </div>
                <p className="text-gray-300 text-sm">
                  {new Date(event.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  <FaClock className="inline mr-1" />
                  {new Date(event.date).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>

              {/* Location */}
              <div className="bg-gradient-to-r from-blue-600/20 to-indigo-600/20 backdrop-blur-sm rounded-xl p-4 border border-blue-500/30">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-600/30 rounded-lg">
                    <FaMapMarkerAlt className="text-blue-400" />
                  </div>
                  <h3 className="text-white font-semibold">Location</h3>
                </div>
                <p className="text-gray-300 text-sm">{event.location}</p>
                <p className="text-gray-400 text-xs mt-1">
                  📍 {event.district}
                </p>
              </div>

              {/* Event Type & Creator */}
              <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 backdrop-blur-sm rounded-xl p-4 border border-green-500/30">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-green-600/30 rounded-lg">
                    <FaTicketAlt className="text-green-400" />
                  </div>
                  <h3 className="text-white font-semibold">Event Details</h3>
                </div>
                <p className="text-gray-300 text-sm">{event.type}</p>
                {event.createdByName && (
                  <p className="text-gray-400 text-xs mt-1">
                    👤 Created by: {event.createdByName}
                  </p>
                )}
                {event.eventCode && (
                  <p className="text-gray-400 text-xs mt-1">
                    🏷️ Code: {event.eventCode}
                  </p>
                )}
              </div>

              {/* Enrollment Count */}
              <div className="bg-gradient-to-r from-emerald-600/20 to-green-600/20 backdrop-blur-sm rounded-xl p-4 border border-emerald-500/30">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-emerald-600/30 rounded-lg">
                    <FaUsers className="text-emerald-400" />
                  </div>
                  <h3 className="text-white font-semibold">Enrollments</h3>
                </div>
                <div className="space-y-2">
                  {loadingEnrollments ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-emerald-400"></div>
                      <span className="text-gray-300 text-sm">Loading...</span>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300 text-sm">Total Enrolled:</span>
                      <span className="text-emerald-400 text-lg font-bold">{enrollmentCount}</span>
                    </div>
                  )}
                  
                  {isEnrolled && (
                    <div className="text-emerald-400 text-xs font-semibold bg-emerald-600/20 rounded px-2 py-1 text-center">
                      ✓ YOU ARE ENROLLED
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Ticket Types & Availability */}
            {event.tickets && event.tickets.length > 0 && (
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-600/30">
                <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-3">
                  <div className="p-2 bg-purple-600/30 rounded-lg">
                    <FaTicketAlt className="text-purple-400" />
                  </div>
                  Ticket Types & Availability
                </h3>
                
                {/* Overall ticket stats */}
                {event.totalSoldTickets > 0 && (
                  <div className="mb-4 p-3 bg-orange-600/20 rounded-lg border border-orange-500/30">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-300">Total Sold:</span>
                      <span className="text-orange-400 font-semibold">{event.totalSoldTickets} tickets</span>
                    </div>
                    {event.totalAvailableTickets > 0 && (
                      <div className="flex justify-between items-center text-sm mt-1">
                        <span className="text-gray-300">Remaining:</span>
                        <span className="text-green-400 font-semibold">{event.totalAvailableTickets} tickets</span>
                      </div>
                    )}
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {event.tickets.map((ticket, index) => (
                    <div key={index} className="bg-gradient-to-r from-gray-700/30 to-gray-800/30 rounded-lg p-4 border border-gray-600/20">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="text-white font-semibold text-lg">{ticket.name}</h4>
                          <p className="text-gray-400 text-sm">Event ticket</p>
                        </div>
                        <div className="text-right">
                          <div className="text-green-400 font-bold text-lg">${ticket.price}</div>
                        </div>
                      </div>
                      
                      {/* Availability Info */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-400">Available:</span>
                          <span className="text-blue-400 font-medium">{ticket.availableQuantity}</span>
                        </div>
                        
                        {ticket.soldQuantity > 0 && (
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-400">Sold:</span>
                            <span className="text-orange-400 font-medium">{ticket.soldQuantity}</span>
                          </div>
                        )}
                        
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-400">Total:</span>
                          <span className="text-gray-300 font-medium">{ticket.totalQuantity}</span>
                        </div>
                        
                        {/* Progress bar for this ticket type */}
                        {ticket.totalQuantity > 0 && (
                          <div className="mt-2">
                            <div className="w-full bg-gray-700/50 rounded-full h-1.5 overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all duration-1000 ease-out"
                                style={{ width: `${(ticket.soldQuantity / ticket.totalQuantity) * 100}%` }}
                              />
                            </div>
                            <div className="text-right mt-1">
                              <span className="text-xs text-gray-400">
                                {((ticket.soldQuantity / ticket.totalQuantity) * 100).toFixed(0)}% sold
                              </span>
                            </div>
                          </div>
                        )}
                        
                        {/* Availability status */}
                        {ticket.availableQuantity === 0 ? (
                          <div className="text-red-400 text-xs font-semibold bg-red-600/20 rounded px-2 py-1 text-center">
                            SOLD OUT
                          </div>
                        ) : ticket.availableQuantity < 10 ? (
                          <div className="text-orange-400 text-xs font-semibold bg-orange-600/20 rounded px-2 py-1 text-center">
                            LIMITED AVAILABILITY
                          </div>
                        ) : (
                          <div className="text-green-400 text-xs font-semibold bg-green-600/20 rounded px-2 py-1 text-center">
                            AVAILABLE
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={handleEnroll}
                disabled={enrolling}
                className={`flex-1 font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center shadow-lg backdrop-blur-sm border ${
                  isEnrolled 
                    ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white border-red-500/30 shadow-red-500/25' 
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-blue-500/30 shadow-blue-500/25'
                } ${enrolling ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-xl'}`}
              >
                {enrolling ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    {isEnrolled ? 'Unenrolling...' : 'Enrolling...'}
                  </>
                ) : (
                  <>
                    <FaUserCheck className="mr-3" />
                    {isEnrolled ? 'Unenroll' : 'Enroll Now'}
                  </>
                )}
              </button>
              
              <button
                onClick={handleBuyTicket}
                disabled={enrolling}
                className={`flex-1 font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center shadow-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white backdrop-blur-sm border border-purple-500/30 shadow-purple-500/25 ${
                  enrolling ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-xl'
                }`}
              >
                <FaTicketAlt className="mr-3" />
                Buy Ticket
              </button>
            </div>

          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
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
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(147, 51, 234, 0.6);
          border-radius: 3px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(147, 51, 234, 0.8);
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

const EventCardsforCreated = ({
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





const EventCardsforEnroll = ({ events, onEventClick, currentUserId, onEditEvent, onDeleteEvent, onNotifyAttendees }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8 px-4">
    {events.map((event, idx) => {
      // Use the isEnrolled property from the event data
      const isEnrolled = event.isEnrolled || false;
      
      // Format creation date
      const creationDate = event.createdAt ? new Date(event.createdAt).toLocaleDateString() : 'N/A';
      
      // Check if this user created the event
      const isCreator = event.creator?._id === currentUserId || event.creator === currentUserId || 
                       event.createdBy?._id === currentUserId || event.createdBy === currentUserId;
      
      // Get enrollment count for this event (for created events management)
      const enrollmentCount = event.attendees?.length || event.enrollmentCount || 0;
      
      // Get ticket information with prices and availability
      const ticketInfo = event.tickets && event.tickets.length > 0 
        ? event.tickets.map(ticket => {
            const soldInfo = ticket.soldQuantity > 0 ? ` (${ticket.soldQuantity} sold)` : '';
            const availableInfo = ticket.availableQuantity < ticket.totalQuantity ? ` - ${ticket.availableQuantity} left` : '';
            return `${ticket.name}: $${ticket.price}${soldInfo}${availableInfo}`;
          }).join(', ')
        : 'No tickets available';
      
      return (
        <div
          key={idx}
          className="group relative bg-gradient-to-br from-black/40 via-gray-900/30 to-black/50 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden transform transition-all duration-500 hover:scale-105 hover:rotate-1 hover:shadow-2xl hover:shadow-gray-500/25"
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
            
            {/* Sold tickets badge */}
            {event.totalSoldTickets > 0 && (
              <div className="absolute top-3 left-20 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-lg transform transition-transform duration-300 group-hover:scale-110">
                {event.totalSoldTickets} sold
              </div>
            )}
            
            {/* Sold out badge */}
            {event.isSoldOut && (
              <div className="absolute top-3 left-3 bg-gradient-to-r from-red-600 to-red-700 text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg transform transition-transform duration-300 group-hover:scale-110 animate-pulse">
                SOLD OUT
              </div>
            )}
            
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
            
            {/* Event Creation Date */}
            <div className="flex items-center gap-2 text-gray-300">
              <div className="w-2 h-2 bg-green-400 rounded-full" />
              <span className="text-sm font-medium">Created: {creationDate}</span>
            </div>
            

            
            {/* Created By info */}
            {event.createdBy && (
              <div className="flex items-center gap-2 text-green-400">
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                <span className="text-sm">Created by: {typeof event.createdBy === 'object' ? event.createdBy.name : event.createdBy}</span>
              </div>
            )}
            
            {/* Ticket Information with Prices and Availability */}
            <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full" />
                <span className="text-sm text-gray-300 font-medium">Ticket Availability</span>
              </div>
              
              {/* Overall ticket stats summary */}
              {event.tickets && event.tickets.length > 0 ? (
                <div className="mb-2 space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400">Total Tickets:</span>
                    <span className="text-white font-medium">{event.totalTickets || 0}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400">Sold:</span>
                    <span className="text-orange-400 font-medium">{event.totalSoldTickets || 0}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400">Available:</span>
                    <span className="text-green-400 font-medium">{event.totalAvailableTickets || 0}</span>
                  </div>
                  
                  {/* Progress bar */}
                  {event.totalTickets > 0 && (
                    <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                      <div 
                        className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${((event.totalSoldTickets || 0) / event.totalTickets) * 100}%` }}
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-sm text-gray-400">No tickets available</div>
              )}
              
              {/* Individual ticket types */}
              <div className="space-y-1 mt-2 pt-2 border-t border-gray-700/50">
                {event.tickets && event.tickets.length > 0 ? (
                  event.tickets.map((ticket, index) => (
                    <div key={index} className="text-xs text-white flex justify-between items-center">
                      <div>
                        <span className="font-medium">{ticket.name}</span>
                        <span className="text-gray-400 ml-1">${ticket.price}</span>
                      </div>
                      <div className="text-right">
                        {ticket.soldQuantity > 0 && (
                          <span className="text-orange-400">{ticket.soldQuantity} sold</span>
                        )}
                        {ticket.availableQuantity >= 0 && (
                          <span className="text-green-400 ml-1">• {ticket.availableQuantity} left</span>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-400">No ticket types defined</p>
                )}
              </div>
            </div>
            
            {/* Action button */}
            <div className="pt-2 space-y-2">
              {isCreator && onNotifyAttendees ? (
                <>
                  <div className="flex gap-x-2">
                    <button
                      type="button"
                      className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-2 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (typeof onEventClick === 'function') {
                          onEventClick(event);
                        }
                      }}
                    >
                      {isEnrolled ? 'View Details' : 'View Tickets'}
                    </button>
                    <button
                      type="button"
                      className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-medium py-2 px-4 rounded-xl transition-all duration-300 text-sm flex items-center justify-center gap-2 ring-2 ring-yellow-300 shadow-lg"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (typeof onNotifyAttendees === 'function') {
                          onNotifyAttendees(event);
                        }
                      }}
                    >
                      <FaBell className="text-xs" />
                      Notify All ({enrollmentCount})
                    </button>
                  </div>
                  {/* Edit and Delete buttons - Only available when no enrollments */}
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {onEditEvent && (
                      <button
                        type="button"
                        className={`w-full font-medium py-1.5 px-3 rounded-lg transition-all duration-300 text-sm flex items-center justify-center gap-1 ${
                          enrollmentCount > 0 
                            ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                            : 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white'
                        }`}
                        disabled={enrollmentCount > 0}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (enrollmentCount > 0) {
                            alert(`Cannot edit event with ${enrollmentCount} enrolled attendee${enrollmentCount > 1 ? 's' : ''}. Please contact attendees first.`);
                            return;
                          }
                          if (typeof onEditEvent === 'function') {
                            onEditEvent(event);
                          }
                        }}
                      >
                        <FaEdit className="text-xs" />
                        Edit
                      </button>
                    )}
                    {onDeleteEvent && (
                      <button
                        type="button"
                        className={`w-full font-medium py-1.5 px-3 rounded-lg transition-all duration-300 text-sm flex items-center justify-center gap-1 ${
                          enrollmentCount > 0 
                            ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                            : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white'
                        }`}
                        disabled={enrollmentCount > 0}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (enrollmentCount > 0) {
                            alert(`Cannot delete event with ${enrollmentCount} enrolled attendee${enrollmentCount > 1 ? 's' : ''}. Please unenroll all attendees first.`);
                            return;
                          }
                          if (typeof onDeleteEvent === 'function') {
                            onDeleteEvent(event);
                          }
                        }}
                      >
                        <FaTrash className="text-xs" />
                        Delete
                      </button>
                    )}
                  </div>
                </>
              ) : (
                <button
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-2 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEventClick(event);
                  }}
                >
                  {isEnrolled ? 'View Details' : 'View Tickets'}
                </button>
              )}
            </div>
          </div>
          
        </div>
      );
    })}
  </div>
);

// Event Cards Component for Enrolled Events - No Enrolled Events Message
const NoEnrolledEventsMessage = () => {
  return (
    <div className="w-full max-w-6xl mx-auto mb-8">
      <div className="flex justify-center items-center py-12">
        <div className="text-center text-white">
          <div className="mb-4">
            <FaEye className="text-6xl text-gray-400 mx-auto mb-4" />
          </div>
          <h4 className="text-2xl font-bold mb-2">
            No Enrolled Events
          </h4>
          <p className="text-gray-300 text-lg">
            You haven't enrolled in any events yet.
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Visit the Dashboard to browse and enroll in events!
          </p>
        </div>
      </div>
    </div>
  );
};

// Stats Component
const EnrollmentStats = ({ enrolledEventsCount, totalPrice }) => {
  return (
    <div className="w-full max-w-6xl mx-auto mb-8 p-6 bg-white/10 dark:bg-black/30 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center">
          <div className="bg-green-500/20 rounded-full p-4 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
            <FaEye className="text-2xl text-green-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">{enrolledEventsCount}</h3>
          <p className="text-gray-300 text-sm">Enrolled Events</p>
        </div>
        
        <div className="text-center">
          <div className="bg-yellow-500/20 rounded-full p-4 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
            <FaDollarSign className="text-2xl text-yellow-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">${totalPrice.toFixed(2)}</h3>
          <p className="text-gray-300 text-sm">Total Value</p>
        </div>
        
        <div className="text-center">
          <div className="bg-blue-500/20 rounded-full p-4 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
            <FaCalendarAlt className="text-2xl text-blue-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">
            {enrolledEventsCount > 0 ? 'Active' : 'None'}
          </h3>
          <p className="text-gray-300 text-sm">Status</p>
        </div>
      </div>
    </div>
  );
};

const Myevents = () => {
  const [username, setUsername] = useState("");
  const [events, setEvents] = useState([]);
  const [rawEvents, setRawEvents] = useState([]); // Raw events from API
  const [userEnrollments, setUserEnrollments] = useState([]); // User enrollments state
  const [enrolledEventsData, setEnrolledEventsData] = useState([]); // Add state for enrolled events from API
  const [transformedEnrolledEvents, setTransformedEnrolledEvents] = useState([]); // Transformed enrolled events
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [enrolling, setEnrolling] = useState(false);
  const [creatingEvent, setCreatingEvent] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [notificationEvent, setNotificationEvent] = useState(null);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [sendingNotification, setSendingNotification] = useState(false);
  const navigate = useNavigate();

  // Transform event data to include enrollment status (same as Dashboard)
  const transformEventData = (backendEvent) => {
    // Check if current user is enrolled in this event
    // The userEnrollments array contains objects with 'event' property (populated event object)
    const isEnrolled = userEnrollments.some(enrollment => {
      // Handle both structures: from API (enrollment.event._id) and from local state (enrollment.eventId)
      const enrollmentEventId = enrollment.event?._id || enrollment.event?.id || enrollment.eventId;
      return enrollmentEventId === backendEvent._id;
    });
    
    return {
      id: backendEvent._id,
      title: backendEvent.title,
      description: backendEvent.description,
      eventCode: backendEvent.eventCode,
      type: backendEvent.type,
      date: backendEvent.date,
      time: backendEvent.time || 'Time TBA', 
      location: backendEvent.location || 'Location TBA', 
      imageUrl: backendEvent.imageUrl || '/simplytix.svg', 
      district: backendEvent.district || 'General',
      createdBy: backendEvent.createdBy,
      createdByName: typeof backendEvent.createdBy === 'object' && backendEvent.createdBy?.name 
        ? backendEvent.createdBy.name 
        : backendEvent.createdBy || 'Unknown',
      maxAttendees: backendEvent.maxAttendees || 100,
      attendees: backendEvent.attendees || [],
      enrollmentCount: Array.isArray(backendEvent.attendees) ? backendEvent.attendees.length : 0,
      tags: backendEvent.tags || [],
      isEnrolled: isEnrolled,
      // Handle new ticket structure with totalQuantity, availableQuantity, soldQuantity
      tickets: backendEvent.tickets && backendEvent.tickets.length > 0 
        ? backendEvent.tickets.map(ticket => ({
            id: ticket._id || ticket.id,
            name: ticket.name,
            price: ticket.price,
            totalQuantity: ticket.totalQuantity || ticket.quantity || 100,
            availableQuantity: ticket.availableQuantity || ticket.quantity || 100,
            soldQuantity: ticket.soldQuantity || 0,
            // For backward compatibility
            quantity: ticket.totalQuantity || ticket.quantity || 100,
            isAvailable: (ticket.availableQuantity || ticket.quantity || 100) > 0,
            percentageSold: ticket.totalQuantity ? ((ticket.soldQuantity || 0) / ticket.totalQuantity * 100).toFixed(1) : 0
          }))
        : [{
            id: 'default',
            name: 'General Admission', 
            price: 0,
            totalQuantity: 100,
            availableQuantity: 100,
            soldQuantity: 0,
            quantity: 100,
            isAvailable: true,
            percentageSold: 0
          }],
      price: backendEvent.tickets && backendEvent.tickets.length > 0 ? backendEvent.tickets[0].price : 0,
      // Update ticketTypes to match new structure
      ticketTypes: backendEvent.tickets && backendEvent.tickets.length > 0 
        ? backendEvent.tickets.map(ticket => ({
            id: ticket._id || ticket.id,
            name: ticket.name,
            price: ticket.price,
            totalQuantity: ticket.totalQuantity || ticket.quantity || 100,
            availableQuantity: ticket.availableQuantity || ticket.quantity || 100,
            soldQuantity: ticket.soldQuantity || 0,
            quantity: ticket.totalQuantity || ticket.quantity || 100,
            isAvailable: (ticket.availableQuantity || ticket.quantity || 100) > 0,
            percentageSold: ticket.totalQuantity ? ((ticket.soldQuantity || 0) / ticket.totalQuantity * 100).toFixed(1) : 0
          }))
        : [{ 
            id: 'default',
            name: 'General Admission', 
            price: 0, 
            totalQuantity: 100,
            availableQuantity: 100,
            soldQuantity: 0,
            quantity: 100,
            isAvailable: true,
            percentageSold: 0
          }],
      formattedDate: backendEvent.date ? new Date(backendEvent.date).toLocaleDateString() : '',
      formattedTime: backendEvent.time || 'Time TBA',
      category: backendEvent.category || backendEvent.type,
      isFree: backendEvent.tickets ? backendEvent.tickets.every(ticket => ticket.price === 0) : true,
      // Add additional fields from backend
      totalSoldTickets: backendEvent.totalSoldTickets || 0,
      totalAvailableTickets: backendEvent.totalAvailableTickets || 0,
      totalTickets: backendEvent.totalTickets || (backendEvent.totalSoldTickets || 0) + (backendEvent.totalAvailableTickets || 0) || 
        (backendEvent.tickets && backendEvent.tickets.length > 0 
          ? backendEvent.tickets.reduce((sum, ticket) => sum + (ticket.totalQuantity || ticket.quantity || 0), 0)
          : 100),
      isSoldOut: backendEvent.totalAvailableTickets === 0,
      createdAt: backendEvent.createdAt,
      updatedAt: backendEvent.updatedAt
    };
  };

  // Fetch events from backend API
  const fetchEvents = async () => {
    try {
      setLoading(true);
      console.log('Fetching events from backend API...');
      
      const accessToken = localStorage.getItem("accessToken");
      
      // Check if user is authenticated and token is valid
      if (!accessToken || !isTokenValid(accessToken)) {
        console.error("No access token found or token is invalid. User needs to log in.");
        clearAuthData();
        navigate("/login", { state: { message: "Your session has expired. Please log in again." } });
        return;
      }
      
      // Fetch user enrollments first
      await fetchUserEnrollments();
      
      const response = await fetch('/api/events', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.status === 401) {
        console.error("Access token expired or invalid. Redirecting to login...");
        clearAuthData();
        navigate("/login", { state: { message: "Your session has expired. Please log in again." } });
        return;
      }
      
      if (!response.ok) {
        throw new Error(`Backend API error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Successfully fetched events from backend:', data);
      
      // Handle both direct array and wrapped response formats
      let eventsArray = [];
      if (Array.isArray(data)) {
        eventsArray = data;
      } else if (data && data.success && Array.isArray(data.data)) {
        eventsArray = data.data;
      } else if (data && Array.isArray(data.events)) {
        eventsArray = data.events;
      } else {
        console.warn('API response format not recognized:', data);
        eventsArray = [];
      }
      
      // Store raw events, transformation will happen in useEffect
      setRawEvents(eventsArray);
      console.log('Raw events set:', eventsArray.length, 'events');
      
      setError(null);
    } catch (error) {
      console.error("Backend API failed:", error);
      setRawEvents([]);
      setError("Failed to load events. Please check your connection and ensure the backend server is running.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch user enrollments
  const fetchUserEnrollments = async () => {
    try {
      console.log('Fetching user enrollments...');
      
      const token = localStorage.getItem("accessToken");
      const userId = localStorage.getItem("userId");
      
      if (!token || !userId || !isTokenValid(token)) {
        console.log("No access token found or token is invalid.");
        setUserEnrollments([]);
        setEnrolledEventsData([]);
        return [];
      }
      
      const response = await fetch('/api/enrollments/my', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.status === 401) {
        console.error("Access token expired or invalid. Redirecting to login...");
        clearAuthData();
        navigate("/login", { state: { message: "Your session has expired. Please log in again." } });
        return [];
      }
      
      if (!response.ok) {
        console.log('Failed to fetch user enrollments');
        setUserEnrollments([]);
        setEnrolledEventsData([]);
        return [];
      }
      
      const data = await response.json();
      console.log('Successfully fetched user enrollments:', data);
      
      // Process the enrolled events
      if (data && data.success && Array.isArray(data.data)) {
        // Set userEnrollments for isEnrolled checking
        setUserEnrollments(data.data.map(enrollment => ({
          event: enrollment.event, // Keep the populated event object
          eventId: enrollment.event._id || enrollment.event.id,
          userId: enrollment.userId || userId
        })));
        
        // Extract event details from enrollment data for enrolled events display
        const enrolledEvents = data.data.map(enrollment => {
          const event = enrollment.event;
          console.log('Processing enrolled event:', event.title, 'CreatedBy:', event.createdBy);
          return {
            ...event,
            enrollmentId: enrollment._id,
            enrolledAt: enrollment.enrolledAt,
            // Ensure _id field is present for transformation
            _id: event._id || event.id
          };
        });
        
        console.log('Enrolled events from API:', enrolledEvents.length);
        setEnrolledEventsData(enrolledEvents);
        return enrolledEvents;
      } else {
        setUserEnrollments([]);
        setEnrolledEventsData([]);
        return [];
      }
    } catch (error) {
      console.error('Error fetching user enrollments:', error);
      setUserEnrollments([]);
      setEnrolledEventsData([]);
      return [];
    }
  };

  // Fetch enrollment counts for events (for created events management)
  const fetchEnrollmentCounts = async (eventIds) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token || !isTokenValid(token)) {
        return {};
      }

      const enrollmentCounts = {};
      
      // Fetch enrollment count for each event
      for (const eventId of eventIds) {
        try {
          const response = await fetch(`/api/enrollments/event/${eventId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            const enrollments = data.data || data || [];
            enrollmentCounts[eventId] = enrollments.length;
          } else {
            enrollmentCounts[eventId] = 0;
          }
        } catch (error) {
          console.error(`Error fetching enrollment count for event ${eventId}:`, error);
          enrollmentCounts[eventId] = 0;
        }
      }
      
      return enrollmentCounts;
    } catch (error) {
      console.error('Error fetching enrollment counts:', error);
      return {};
    }
  };

  // Transform events when userEnrollments or rawEvents change (same as Dashboard)
  // Transform events when userEnrollments or rawEvents change (same as Dashboard)
  useEffect(() => {
    const transformAndFetchCounts = async () => {
      if (rawEvents.length > 0) {
        const transformedEvents = rawEvents.map(transformEventData);
        console.log('Transformed events with enrollment status:', transformedEvents);
        
        // Fetch enrollment counts for created events
        const currentUserId = localStorage.getItem("userId");
        const createdEventIds = transformedEvents
          .filter(event => {
            const eventCreatorId = event.creator?._id || event.creator || event.createdBy?._id || event.createdBy;
            return eventCreatorId === currentUserId;
          })
          .map(event => event.id);
        
        if (createdEventIds.length > 0) {
          const enrollmentCounts = await fetchEnrollmentCounts(createdEventIds);
          
          // Update events with enrollment counts
          const eventsWithCounts = transformedEvents.map(event => {
            if (createdEventIds.includes(event.id)) {
              return {
                ...event,
                enrollmentCount: enrollmentCounts[event.id] || 0
              };
            }
            return event;
          });
          
          setEvents(eventsWithCounts);
        } else {
          setEvents(transformedEvents);
        }
      }
    };
    
    transformAndFetchCounts();
  }, [userEnrollments, rawEvents]);

  // Transform enrolled events data for proper display
  useEffect(() => {
    if (enrolledEventsData.length > 0) {
      const transformedEnrolled = enrolledEventsData.map(event => {
        const transformed = transformEventData(event);
        // Ensure enrolled events are marked as enrolled
        return { ...transformed, isEnrolled: true };
      });
      console.log('Transformed enrolled events:', transformedEnrolled);
      setTransformedEnrolledEvents(transformedEnrolled);
    } else {
      setTransformedEnrolledEvents([]);
    }
  }, [enrolledEventsData, userEnrollments]);

  // Fetch events and enrollments from backend API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // First fetch all events (for created events)
        await fetchEvents();
        // Then fetch enrolled events specifically
        await fetchUserEnrollments();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    
    fetchData();
  }, [navigate]);

  useEffect(() => {
    const loggedInUser = localStorage.getItem("loggedInUser");
    const token = localStorage.getItem("accessToken");
    const userId = localStorage.getItem("userId");
    
    console.log('Auth check:', { loggedInUser, hasToken: !!token, userId });
    
    // Validate authentication
    if (!loggedInUser || !token) {
      console.log("No user logged in or token missing, redirecting to login");
      clearAuthData();
      navigate("/login");
      return;
    }
    
    // Check if token is valid
    if (!isTokenValid(token)) {
      console.log("Token expired or invalid, redirecting to login");
      clearAuthData();
      navigate("/login", { state: { message: "Your session has expired. Please log in again." } });
      return;
    }
    
    setUsername(loggedInUser);
  }, [navigate]);

  const handleLogout = () => {
    clearAuthData();
    navigate("/login");
  };

  // Handle enrollment/unenrollment - same as Dashboard
  const handleEnroll = async (eventId, isCurrentlyEnrolled = false) => {
    // Get current enrollment status from the event data (move outside try block)
    const event = events.find(e => e.id === eventId);
    const actuallyEnrolled = event ? event.isEnrolled : false;
    
    try {
      setEnrolling(true);
      
      const token = localStorage.getItem("accessToken");
      const userId = localStorage.getItem("userId");
      
      if (!token || !userId) {
        alert("Please log in to enroll in events");
        navigate("/login");
        return;
      }
      
      console.log(`${actuallyEnrolled ? 'Unenrolling from' : 'Enrolling in'} event ${eventId}...`);
      console.log('Current event enrollment status:', actuallyEnrolled);
      console.log('User enrollments:', userEnrollments);
      
      // Use enrollment API endpoints
      const endpoint = `/api/enrollments/event/${eventId}`;
      const method = actuallyEnrolled ? 'DELETE' : 'POST';
      
      console.log('API call:', method, endpoint);
      
      const response = await fetch(endpoint, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          alert("Session expired. Please log in again.");
          localStorage.clear();
          navigate("/login");
          return;
        }
        
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error:', errorData);
        throw new Error(errorData.message || `${actuallyEnrolled ? 'Unenrollment' : 'Enrollment'} failed`);
      }
      
      const data = await response.json();
      console.log(`${actuallyEnrolled ? 'Unenrollment' : 'Enrollment'} response:`, data);
      
      // Update userEnrollments state based on the action performed
      if (actuallyEnrolled) {
        // Remove enrollment from userEnrollments
        console.log('Removing enrollment from userEnrollments');
        setUserEnrollments(prev => {
          const updated = prev.filter(enrollment => {
            const enrollmentEventId = enrollment.event?._id || enrollment.event?.id || enrollment.eventId;
            return enrollmentEventId !== eventId;
          });
          console.log('Updated userEnrollments after removal:', updated);
          return updated;
        });
      } else {
        // Add enrollment to userEnrollments (use structure compatible with API response)
        console.log('Adding enrollment to userEnrollments');
        setUserEnrollments(prev => {
          const updated = [...prev, { 
            eventId: eventId,
            userId: userId,
            event: { _id: eventId, id: eventId } // Basic event structure for compatibility
          }];
          console.log('Updated userEnrollments after addition:', updated);
          return updated;
        });
      }

      // Update selected event if it's currently open
      if (selectedEvent && (selectedEvent.id === eventId || selectedEvent._id === eventId)) {
        setSelectedEvent({ ...selectedEvent, isEnrolled: !actuallyEnrolled });
      }
      
      // Refresh enrolled events data to reflect changes
      await fetchUserEnrollments();
      
      // Also refresh the events to update enrollment counts for created events
      await fetchEvents();
      
      const successMessage = actuallyEnrolled 
        ? '✅ Successfully unenrolled from the event!' 
        : '🎉 Successfully enrolled in the event!';
      alert(successMessage);
      
    } catch (error) {
      console.error(`${actuallyEnrolled ? 'Unenrollment' : 'Enrollment'} failed:`, error);
      alert(`❌ ${error.message}`);
    } finally {
      setEnrolling(false);
    }
  };

  // Create Event Form Component
  const CreateEventForm = ({ isOpen, onClose, onEventCreated, editingEvent = null }) => {
    const [formData, setFormData] = useState({
      title: '',
      description: '',
      type: 'conference',
      date: '',
      time: '',
      location: '',
      imageUrl: '',
      district: '',
      maxAttendees: 100,
      tags: '',
      tickets: [
        { name: 'General Admission', price: 0, quantity: 100 }
      ]
    });

    const [loading, setLoading] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const navigate = useNavigate();

    const eventTypes = ['workshop', 'seminar', 'conference', 'meetup', 'volunteer', 'music', 'art', 'sports', 'business', 'other'];

    // Initialize form data with editing event if provided
  useEffect(() => {
    if (editingEvent) {
      setFormData({
        title: editingEvent.title || '',
        description: editingEvent.description || '',
        type: editingEvent.type || 'conference',
        date: editingEvent.date ? new Date(editingEvent.date).toISOString().slice(0, 16) : '',
        time: editingEvent.time || '',
        location: editingEvent.location || '',
        imageUrl: editingEvent.imageUrl || '',
        district: editingEvent.district || '',
        maxAttendees: editingEvent.maxAttendees || 100,
        tags: Array.isArray(editingEvent.tags) ? editingEvent.tags.join(', ') : (editingEvent.tags || ''),
        tickets: Array.isArray(editingEvent.tickets) && editingEvent.tickets.length > 0
          ? editingEvent.tickets.map(ticket => ({
              name: ticket.name || '',
              price: ticket.price || 0,
              quantity: ticket.totalQuantity || ticket.quantity || 100
            }))
          : [{ name: 'General Admission', price: 0, quantity: 100 }]
      });
      setSelectedImage(null);
    } else {
      setFormData({
        title: '',
        description: '',
        type: 'conference',
        date: '',
        time: '',
        location: '',
        imageUrl: '',
        district: '',
        maxAttendees: 100,
        tags: '',
        tickets: [
          { name: 'General Admission', price: 0, quantity: 100 }
        ]
      });
      setSelectedImage(null);
    }
  }, [editingEvent]);

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    };

    const handleImageUpload = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please select a valid image file (JPG, PNG, GIF, or WebP)');
        return;
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        alert('Please select an image smaller than 5MB');
        return;
      }

      setUploadingImage(true);
      setSelectedImage(file);

      try {
        const token = localStorage.getItem("accessToken");
        if (!token || !isTokenValid(token)) {
          alert("Your session has expired. Please log in again.");
          clearAuthData();
          navigate("/login", { state: { message: "Your session has expired. Please log in again." } });
          return;
        }

        const formDataForUpload = new FormData();
        formDataForUpload.append('image', file);

        const response = await fetch('http://localhost:3000/api/upload/image', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formDataForUpload
        });

        if (!response.ok) {
          if (response.status === 401) {
            alert("Your session has expired. Please log in again.");
            clearAuthData();
            navigate("/login", { state: { message: "Your session has expired. Please log in again." } });
            return;
          }
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || 'Failed to upload image');
        }

        const data = await response.json();
        
        // Update form data with the uploaded image URL
        setFormData(prev => ({
          ...prev,
          imageUrl: data.imageUrl || data.url || data.filepath
        }));

        console.log('Image uploaded successfully:', data);
        
      } catch (error) {
        console.error('Image upload failed:', error);
        alert(`❌ Failed to upload image: ${error.message}`);
        setSelectedImage(null);
      } finally {
        setUploadingImage(false);
      }
    };

    const handleTicketChange = (index, field, value) => {
      const updatedTickets = formData.tickets.map((ticket, i) => 
        i === index ? { ...ticket, [field]: value } : ticket
      );
      setFormData(prev => ({ ...prev, tickets: updatedTickets }));
    };

    const addTicketType = () => {
      setFormData(prev => ({
        ...prev,
        tickets: [...prev.tickets, { name: '', price: 0, quantity: 0 }]
      }));
    };

    const removeTicketType = (index) => {
      if (formData.tickets.length > 1) {
        setFormData(prev => ({
          ...prev,
          tickets: prev.tickets.filter((_, i) => i !== index)
        }));
      }
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);

      try {
        const token = localStorage.getItem("accessToken");
        if (!token || !isTokenValid(token)) {
          alert("Your session has expired. Please log in again.");
          clearAuthData();
          navigate("/login", { state: { message: "Your session has expired. Please log in again." } });
          return;
        }

        // Get current user ID for volunteer field
        const userId = localStorage.getItem("userId");
        if (!userId) {
          alert("User ID not found. Please log in again.");
          clearAuthData();
          navigate("/login");
          return;
        }

        // Prepare the event data
        const eventData = {
          ...formData,
          maxAttendees: parseInt(formData.maxAttendees),
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
          tickets: formData.tickets.map(ticket => ({
            ...ticket,
            price: parseFloat(ticket.price),
            quantity: parseInt(ticket.quantity)
          }))
        };
        
        // Remove the standalone price field as it's handled in tickets
        delete eventData.price;

        // Validate required fields before sending
        const requiredFields = ['title', 'type', 'date', 'time', 'location', 'district', 'maxAttendees'];
        const missingFields = requiredFields.filter(field => !eventData[field] || eventData[field] === '');
        
        if (missingFields.length > 0) {
          alert(`❌ Please fill in all required fields: ${missingFields.join(', ')}`);
          return;
        }

        // Validate that at least one ticket type has a valid price
        const hasValidTicket = eventData.tickets.some(ticket => 
          ticket.name && !isNaN(ticket.price) && !isNaN(ticket.quantity) && 
          ticket.price >= 0 && ticket.quantity > 0
        );

        if (!hasValidTicket) {
          alert('❌ Please ensure at least one ticket type has a valid name, price, and quantity');
          return;
        }

        // Add debugging to see what data is being sent
        console.log(`${editingEvent ? 'Updating' : 'Creating'} event with data:`, eventData);
        console.log('Required fields check:');
        console.log('- title:', eventData.title);
        console.log('- type:', eventData.type);
        console.log('- date:', eventData.date);
        console.log('- time:', eventData.time);
        console.log('- location:', eventData.location);
        console.log('- price:', eventData.price);
        console.log('- district:', eventData.district);


        const url = editingEvent 
          ? `http://localhost:3000/api/events/${editingEvent._id || editingEvent.id}`
          : 'http://localhost:3000/api/events';
        
        const method = editingEvent ? 'PUT' : 'POST';

        const response = await fetch(url, {
          method: method,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(eventData)
        });

        if (!response.ok) {
          if (response.status === 401) {
            alert("Your session has expired. Please log in again.");
            clearAuthData();
            navigate("/login", { state: { message: "Your session has expired. Please log in again." } });
            return;
          }
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `Failed to ${editingEvent ? 'update' : 'create'} event`);
        }

        const data = await response.json();
        console.log(`Event ${editingEvent ? 'updated' : 'created'} successfully:`, data);
        
        alert(`🎉 Event ${editingEvent ? 'updated' : 'created'} successfully!`);
        onEventCreated();
        onClose();
        
        // Reset form
        setFormData({
          title: '',
          description: '',
          type: 'conference',
          date: '',
          time: '',
          location: '',
          imageUrl: '',
          district: '',
          maxAttendees: 100,
          tags: '',
          tickets: [
            { name: 'General Admission', price: 0, quantity: 100 }
          ]
        });
        setSelectedImage(null);

      } catch (error) {
        console.error('Failed to create event:', error);
        alert(`❌ Failed to create event: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <div className="bg-black/90 backdrop-blur-lg rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-white/20">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/20">
            <h2 className="text-2xl font-bold text-white">
              {editingEvent ? 'Edit Event' : 'Create New Event'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>

          {/* Form - Scrollable */}
          <div className="overflow-y-auto max-h-[calc(90vh-80px)] p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Event Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter event title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Event Type *</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {eventTypes.map(type => (
                      <option key={type} value={type} className="capitalize">
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe your event"
                />
              </div>

              {/* Date and Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Event Date *</label>
                  <input
                    type="datetime-local"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Event Time *</label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Location *</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Event location"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">District *</label>
                  <input
                    type="text"
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="District/Area"
                  />
                </div>
              </div>

              {/* Additional Information */}
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Max Attendees *</label>
                  <input
                    type="number"
                    name="maxAttendees"
                    value={formData.maxAttendees}
                    onChange={handleInputChange}
                    min="1"
                    required
                    className="w-full px-4 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Event Image</label>
                  <div className="space-y-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="w-full px-4 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer"
                    />
                    {uploadingImage && (
                      <div className="flex items-center text-blue-400 text-sm">
                        <div className="animate-spin w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full mr-2"></div>
                        Uploading image...
                      </div>
                    )}
                    {formData.imageUrl && (
                      <div className="mt-2">
                        <img 
                          src={formData.imageUrl} 
                          alt="Event preview" 
                          className="w-20 h-20 object-cover rounded-lg border border-gray-600"
                        />
                        <p className="text-xs text-gray-400 mt-1">Image uploaded successfully</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Tags (comma separated)</label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="technology, networking, conference"
                  />
                </div>
              </div>

              {/* Ticket Types */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium text-gray-300">Ticket Types</label>
                  <button
                    type="button"
                    onClick={addTicketType}
                    className="flex items-center gap-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    <FaPlus className="text-sm" />
                    Add Ticket Type
                  </button>
                </div>

                <div className="space-y-4">
                  {formData.tickets.map((ticket, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-800/30 rounded-lg border border-gray-600">
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Ticket Name</label>
                        <input
                          type="text"
                          value={ticket.name}
                          onChange={(e) => handleTicketChange(index, 'name', e.target.value)}
                          required
                          className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded text-white text-sm focus:ring-2 focus:ring-blue-500"
                          placeholder="General Admission"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Price</label>
                        <input
                          type="number"
                          value={ticket.price}
                          onChange={(e) => handleTicketChange(index, 'price', e.target.value)}
                          min="0"
                          step="0.01"
                          required
                          className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded text-white text-sm focus:ring-2 focus:ring-blue-500"
                          placeholder="0.00"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Quantity</label>
                        <input
                          type="number"
                          value={ticket.quantity}
                          onChange={(e) => handleTicketChange(index, 'quantity', e.target.value)}
                          min="0"
                          required
                          className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded text-white text-sm focus:ring-2 focus:ring-blue-500"
                          placeholder="100"
                        />
                      </div>
                      <div className="flex items-end">
                        {formData.tickets.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeTicketType(index)}
                            className="w-full px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors flex items-center justify-center"
                          >
                            <FaTrash className="text-sm" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-4 pt-6 border-t border-white/20">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2 ${
                    loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full"></div>
                      Creating...
                    </>
                  ) : (
                    'Create Event'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  // Get current user ID
  const currentUserId = localStorage.getItem("userId");
  
  // Ensure events is always an array before filtering and component is not loading
  const safeEvents = Array.isArray(events) ? events : [];
  
  // Filter created events (events where creator matches current user ID)
  const createdEvents = loading ? [] : safeEvents.filter(event => {
    // Check both 'creator' and 'createdBy' fields (backend uses 'createdBy')
    const eventCreatorId = event.creator?._id || event.creator || event.createdBy?._id || event.createdBy;
    const isMatch = eventCreatorId === currentUserId;
    
    // Debug logging
    console.log('Event creator check:', {
      eventTitle: event.title,
      eventCreatorId,
      currentUserId,
      isMatch,
      creatorObject: event.creator,
      createdByObject: event.createdBy
    });
    
    return isMatch;
  });
  
  console.log(`Found ${createdEvents.length} created events by user ${currentUserId} out of ${safeEvents.length} total events`);
  
  // Calculate total price of enrolled events
  const totalPrice = transformedEnrolledEvents.reduce((sum, event) => sum + (parseFloat(event.price) || 0), 0);

  // Enhanced delete function that checks for attendees
  const handleDeleteEvent = async (event) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token || !isTokenValid(token)) {
        alert("Your session has expired. Please log in again.");
        clearAuthData();
        navigate("/login", { state: { message: "Your session has expired. Please log in again." } });
        return;
      }

      // First, fetch the latest event data to check attendees
      console.log(`Checking attendees for event ${event._id || event.id}...`);
      
      const eventResponse = await fetch(`http://localhost:3000/api/events/${event._id || event.id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!eventResponse.ok) {
        if (eventResponse.status === 401) {
          alert("Session expired. Please log in again.");
          localStorage.clear();
          navigate("/login");
          return;
        } else if (eventResponse.status === 404) {
          alert("Event not found.");
          return;
        }
        
        const errorData = await eventResponse.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch event details');
      }

      const eventData = await eventResponse.json();
      const currentEvent = eventData.event || eventData;
      
      // Check if there are any attendees
      if (currentEvent.attendees && currentEvent.attendees.length > 0) {
        const attendeeCount = currentEvent.attendees.length;
        const confirmMessage = `⚠️ This event has ${attendeeCount} attendee${attendeeCount > 1 ? 's' : ''} enrolled. Deleting this event will affect all enrolled users. Are you sure you want to continue?`;
        
        if (!window.confirm(confirmMessage)) {
          return;
        }
      } else {
        // Standard confirmation for events with no attendees
        if (!window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
          return;
        }
      }

      // Proceed with deletion
      const response = await fetch(`http://localhost:3000/api/events/${event._id || event.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          alert("Your session has expired. Please log in again.");
          clearAuthData();
          navigate("/login", { state: { message: "Your session has expired. Please log in again." } });
          return;
        } else if (response.status === 403) {
          alert("You don't have permission to delete this event.");
          return;
        } else if (response.status === 404) {
          alert("Event not found.");
          return;
        }
        
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to delete event');
      }

      alert('✅ Event deleted successfully!');
      // Refresh events list
      fetchEvents();
      
      // Close modal if the deleted event was selected
      if (selectedEvent && (selectedEvent.id === (event._id || event.id) || selectedEvent._id === (event._id || event.id))) {
        setSelectedEvent(null);
      }
      
    } catch (error) {
      console.error('Failed to delete event:', error);
      alert(`❌ Failed to delete event: ${error.message}`);
    }
  };

  // Enhanced edit function that checks for attendees before allowing edit
  const handleEditEvent = async (event) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token || !isTokenValid(token)) {
        alert("Your session has expired. Please log in again.");
        clearAuthData();
        navigate("/login", { state: { message: "Your session has expired. Please log in again." } });
        return;
      }

      // First, fetch the latest event data to check attendees
      console.log(`Checking attendees for event ${event._id || event.id}...`);
      
      const eventResponse = await fetch(`http://localhost:3000/api/events/${event._id || event.id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!eventResponse.ok) {
        if (eventResponse.status === 401) {
          alert("Session expired. Please log in again.");
          localStorage.clear();
          navigate("/login");
          return;
        } else if (eventResponse.status === 404) {
          alert("Event not found.");
          return;
        }
        
        const errorData = await eventResponse.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch event details');
      }

      const eventData = await eventResponse.json();
      const currentEvent = eventData.event || eventData;
      
      // Check if there are any attendees
      if (currentEvent.attendees && currentEvent.attendees.length > 0) {
        const attendeeCount = currentEvent.attendees.length;
        const confirmMessage = `⚠️ This event has ${attendeeCount} attendee${attendeeCount > 1 ? 's' : ''} enrolled. Editing this event may affect all enrolled users. Are you sure you want to continue?`;
        
        if (!window.confirm(confirmMessage)) {
          return;
        }
      }

      // Proceed with editing - set the current event data for editing
      setEditingEvent(currentEvent);
      setShowCreateForm(true);
      
    } catch (error) {
      console.error('Failed to edit event:', error);
      alert(`❌ Failed to fetch event for editing: ${error.message}`);
    }
  };

  // Handle sending notifications to event attendees
  const handleNotifyAttendees = (event) => {
    console.log('handleNotifyAttendees called with event:', event);
    console.log('Event ID:', event._id || event.id);
    console.log('Event Title:', event.title);
    console.log('Enrollment count:', event.enrollmentCount || event.attendees?.length || 0);
    
    // Set the event data and open the modal
    setNotificationEvent(event);
    setShowNotificationModal(true);
    setNotificationMessage('');
  };

  const sendNotificationToAttendees = async () => {
    if (!notificationMessage.trim()) {
      alert('Please enter a message to send to attendees');
      return;
    }

    try {
      setSendingNotification(true);
      
      const token = localStorage.getItem("accessToken");
      if (!token) {
        alert("Please log in to send notifications");
        navigate("/login");
        return;
      }

      if (!notificationEvent) {
        console.error('Notification event is null or undefined');
        alert('Error: Event data is missing. Please try again.');
        return;
      }

      const eventId = notificationEvent._id || notificationEvent.id;
      if (!eventId) {
        console.error('Event ID is null or undefined:', notificationEvent);
        alert('Error: Event ID is missing. Please try again.');
        return;
      }

      console.log(`Sending notification to attendees of event ${eventId}...`);
      console.log('Message:', notificationMessage);
      console.log('Full API URL:', `/api/events/${eventId}/notifications`);
      
      // Create the request payload
      const notificationData = {
        title: `Event Update: ${notificationEvent.title}`,
        message: notificationMessage,
        type: 'info'
      };
      
      console.log('Notification data:', notificationData);
      
      const response = await fetch(`/api/events/${eventId}/notifications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(notificationData)
      });

      // Log the response status for debugging
      console.log('Notification API response status:', response.status);

      if (!response.ok) {
        if (response.status === 401) {
          alert("Session expired. Please log in again.");
          localStorage.clear();
          navigate("/login");
          return;
        } else if (response.status === 403) {
          alert("You don't have permission to send notifications for this event.");
          return;
        } else if (response.status === 404) {
          alert("Event not found.");
          return;
        }
        
        // Try to get more error details from the response
        const errorData = await response.json().catch(() => ({}));
        console.error('API error response:', errorData);
        throw new Error(errorData.message || `Failed to send notification (Status: ${response.status})`);
      }

      const data = await response.json();
      console.log('Notification sent successfully:', data);
      
      // Get enrollment count for success message
      const enrollmentCount = notificationEvent.enrollmentCount || notificationEvent.attendees?.length || 0;
      alert(`✅ Notification sent successfully to all ${enrollmentCount} enrolled attendee${enrollmentCount !== 1 ? 's' : ''}!`);
      
      // Close modal and reset state
      setShowNotificationModal(false);
      setNotificationEvent(null);
      setNotificationMessage('');
      
    } catch (error) {
      console.error('Failed to send notification:', error);
      alert(`❌ Failed to send notification: ${error.message}`);
    } finally {
      setSendingNotification(false);
    }
  };

  const saveEditedEvent = async (updatedEvent) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        alert("Please log in to save event changes");
        navigate("/login");
        return;
      }

      // Prepare the updated event data
      const eventData = {
        ...updatedEvent,
        price: parseFloat(updatedEvent.price),
        maxAttendees: parseInt(updatedEvent.maxAttendees),
        tags: updatedEvent.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        tickets: updatedEvent.tickets.map(ticket => ({
          ...ticket,
          price: parseFloat(ticket.price),
          quantity: parseInt(ticket.quantity)
        }))
      };

      const response = await fetch(`http://localhost:3000/api/events/${updatedEvent.id || updatedEvent._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(eventData)
      });

      if (!response.ok) {
        if (response.status === 401) {
          alert("Session expired. Please log in again.");
          localStorage.clear();
          navigate("/login");
          return;
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to update event');
      }

      const data = await response.json();
      console.log('Event updated successfully:', data);
      
      alert('✅ Event updated successfully!');
      fetchEvents();
      setShowCreateForm(false);
      setEditingEvent(null);
      
    } catch (error) {
      console.error('Failed to update event:', error);
      alert(`❌ Failed to update event: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black flex flex-col">
      <Navbar username={username} onLogout={handleLogout} />
      
      <main className="flex-1 py-8">
        {/* Page Header */}
        <div className="w-full max-w-6xl mx-auto mb-8 px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
              My Enrolled Events
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              View and manage all the events you've enrolled in. Keep track of your upcoming events and buy tickets when needed.
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-blue-500 mx-auto rounded-full mt-4"></div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
            <span className="ml-3 text-white text-lg">Loading your enrolled events...</span>
          </div>
        )}
        
        {/* Error State */}
        {error && (
          <div className="max-w-6xl mx-auto px-4 mb-8">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-red-600 dark:text-red-400 text-sm font-medium">{error}</p>
                </div>
                <div className="ml-auto">
                  <button 
                    onClick={() => window.location.reload()} 
                    className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                  >
                    Retry
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        {!loading && !error && (
          <div className="container mx-auto px-4 py-8">
            {/* Stats Section */}
            <EnrollmentStats
              enrolledEventsCount={transformedEnrolledEvents.length}
              totalPrice={totalPrice}
            />

            {/* Created Events Section */}
            <div className="mb-12">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Your Created Events</h2>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <FaPlus className="text-sm" />
                  Create Event
                </button>
              </div>

              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                </div>
              ) : createdEvents.length > 0 ? (
                <EventCardsforCreated 
                  events={createdEvents} 
                  onEventClick={setSelectedEvent}
                  currentUserId={currentUserId}
                  onEditEvent={handleEditEvent}
                  onDeleteEvent={handleDeleteEvent}
                  onNotifyAttendees={handleNotifyAttendees}
                />
              ) : (
                <div className="text-center py-12 bg-black/40 backdrop-blur-sm rounded-2xl border border-white/10">
                  <FaCalendarPlus className="text-6xl text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No Created Events</h3>
                  <p className="text-gray-400">
                    You haven't created any events yet. Click the Create Event button to get started!
                  </p>
                  <button
                    onClick={() => setShowCreateForm(true)}
                    className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    Create Your First Event
                  </button>
                </div>
              )}
            </div>

            {/* Enrolled Events Section */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6">Your Enrolled Events</h2>
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                </div>
              ) : transformedEnrolledEvents.length > 0 ? (
                <EventCardsforEnroll 
                  events={transformedEnrolledEvents} 
                  onEventClick={setSelectedEvent}
                  currentUserId={currentUserId}
                />
              ) : (
                <NoEnrolledEventsMessage />
              )}
            </div>

            {/* Create/Edit Event Modal */}
            {showCreateForm && (
              <CreateEventForm
                isOpen={showCreateForm}
                onClose={() => {
                  setShowCreateForm(false);
                  setEditingEvent(null);
                }}
                onEventCreated={() => {
                  fetchEvents();
                  fetchUserEnrollments();
                }}
                editingEvent={editingEvent}
              />
            )}

            {/* Event Details Modal */}
            {selectedEvent && (
              <EventModal 
                event={selectedEvent} 
                onClose={() => setSelectedEvent(null)}
                onEnroll={handleEnroll}
                enrolling={enrolling}
                currentUserId={currentUserId}
              />
            )}
          </div>
        )}
        
        {/* Notification Modal */}
        {showNotificationModal && notificationEvent && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-black/90 backdrop-blur-lg rounded-2xl shadow-2xl w-full max-w-md border border-white/20">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/20">
                <h2 className="text-xl font-bold text-white">
                  Notify Attendees
                </h2>
                <button
                  onClick={() => {
                    console.log('Closing notification modal');
                    setShowNotificationModal(false);
                    setNotificationEvent(null);
                    setNotificationMessage('');
                  }}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors"
                >
                  <FaTimes className="text-lg" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="mb-4">
                  <p className="text-gray-300 text-sm mb-2">Sending notification for:</p>
                  <p className="text-white font-semibold">{notificationEvent.title}</p>
                  <p className="text-gray-400 text-sm">
                    {notificationEvent.enrollmentCount || notificationEvent.attendees?.length || 0} enrolled attendee{(notificationEvent.enrollmentCount || notificationEvent.attendees?.length || 0) !== 1 ? 's' : ''}
                  </p>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Message to Attendees *
                  </label>
                  <textarea
                    value={notificationMessage}
                    onChange={(e) => setNotificationMessage(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Enter your message to all attendees..."
                    maxLength={500}
                  />
                  <div className="text-right text-xs text-gray-400 mt-1">
                    {notificationMessage.length}/500
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowNotificationModal(false);
                      setNotificationEvent(null);
                      setNotificationMessage('');
                    }}
                    className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={sendNotificationToAttendees}
                    disabled={sendingNotification || !notificationMessage.trim()}
                    className={`flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2 ${
                      (sendingNotification || !notificationMessage.trim()) ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {sendingNotification ? (
                      <>
                        <div className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <FaBell className="text-sm" />
                        Send Notification
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Event Details Modal */}
        {selectedEvent && (
          <EventModal 
            event={selectedEvent} 
            onClose={() => setSelectedEvent(null)}
            onEnroll={handleEnroll}
            enrolling={enrolling}
            currentUserId={currentUserId}
          />
        )}
        
        {/* Create Event Form Modal - Placed at the end to avoid z-index issues */}
        <CreateEventForm 
          isOpen={showCreateForm}
          editingEvent={editingEvent}
          onClose={() => {
            setShowCreateForm(false);
            setEditingEvent(null);
          }}
          onEventCreated={(newEvent) => {
            setShowCreateForm(false);
            setEditingEvent(null);
            // Refresh events list after creating/updating an event
            fetchEvents();
          }}
        />
      </main>
      
      <Footer />
    </div>
  );
};

export default Myevents;
