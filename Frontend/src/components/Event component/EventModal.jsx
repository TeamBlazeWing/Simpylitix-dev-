
import { useNavigate } from "react-router-dom";
import { FaTimes, FaMapMarkerAlt, FaCalendarAlt, FaDollarSign, FaUsers, FaTicketAlt, FaClock, FaUserCheck } from "react-icons/fa";

// Event Details Modal
const EventModal = ({ event, onClose, onEnroll, enrolling, currentUserId }) => {
  const navigate = useNavigate();
  
  if (!event) return null;
  
  // Check if current user is already enrolled
  const isEnrolled = event.attendees && currentUserId && event.attendees.some(attendeeId => 
    typeof attendeeId === 'string' ? attendeeId === currentUserId : attendeeId._id === currentUserId
  );
  const isEventFull = event.attendees && event.attendees.length >= (event.maxAttendees || 100);
  const enrollmentPercentage = event.attendees ? (event.attendees.length / (event.maxAttendees || 100)) * 100 : 0;

  const handleBuyTicket = () => {
    // Store the selected event in localStorage for the buy ticket page
    localStorage.setItem('selectedEvent', JSON.stringify(event));
    navigate('/payment');
  };

  const handleEnroll = () => {
    // Allow both enrollment and unenrollment
    onEnroll(event.id, isEnrolled);
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
              ${event.price}
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

              {/* Event Type */}
              <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 backdrop-blur-sm rounded-xl p-4 border border-green-500/30">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-green-600/30 rounded-lg">
                    <FaTicketAlt className="text-green-400" />
                  </div>
                  <h3 className="text-white font-semibold">Event Type</h3>
                </div>
                <p className="text-gray-300 text-sm">{event.type}</p>
                {event.volunteer && (
                  <p className="text-gray-400 text-xs mt-1">
                    👥 Volunteer: {event.volunteer}
                  </p>
                )}
              </div>

              {/* Ticket Sales */}
              <div className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 backdrop-blur-sm rounded-xl p-4 border border-yellow-500/30">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-yellow-600/30 rounded-lg">
                    <FaTicketAlt className="text-yellow-400" />
                  </div>
                  <h3 className="text-white font-semibold">Ticket Sales</h3>
                </div>
                <div className="space-y-2">
                  {(() => {
                    const totalTicketsSold = event.tickets ? event.tickets.reduce((total, ticket) => total + (ticket.sold || 0), 0) : 0;
                    const totalRevenue = event.tickets ? event.tickets.reduce((total, ticket) => total + ((ticket.sold || 0) * ticket.price), 0) : 0;
                    const totalTicketsAvailable = event.tickets ? event.tickets.reduce((total, ticket) => total + (ticket.quantity || 0), 0) : 0;
                    const salesPercentage = totalTicketsAvailable > 0 ? (totalTicketsSold / totalTicketsAvailable) * 100 : 0;
                    
                    return (
                      <>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-300 text-sm">
                            {totalTicketsSold} / {totalTicketsAvailable} sold
                          </span>
                          <span className="text-yellow-400 text-xs font-semibold">
                            ${totalRevenue.toLocaleString()}
                          </span>
                        </div>
                        
                        {/* Progress bar */}
                        <div className="w-full bg-gray-700/50 rounded-full h-2 overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${salesPercentage}%` }}
                          />
                        </div>
                        
                        <div className="text-right">
                          <span className="text-xs text-gray-400">{salesPercentage.toFixed(0)}% sold</span>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>

            {/* Detailed Ticket Information */}
            {event.tickets && event.tickets.length > 0 && (
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-600/30">
                <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-3">
                  <div className="p-2 bg-purple-600/30 rounded-lg">
                    <FaTicketAlt className="text-purple-400" />
                  </div>
                  Available Tickets
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {event.tickets.map((ticket, index) => {
                    const soldPercentage = ticket.quantity > 0 ? ((ticket.sold || 0) / ticket.quantity) * 100 : 0;
                    const remaining = ticket.quantity - (ticket.sold || 0);
                    
                    return (
                      <div key={index} className="bg-gradient-to-r from-gray-700/30 to-gray-800/30 rounded-lg p-4 border border-gray-600/20">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="text-white font-semibold text-lg">{ticket.name}</h4>
                            <p className="text-gray-400 text-sm">{ticket.description || 'Standard ticket'}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-green-400 font-bold text-lg">${ticket.price}</div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-300">Sold: {ticket.sold || 0}</span>
                            <span className="text-gray-300">Available: {remaining}</span>
                          </div>
                          
                          <div className="w-full bg-gray-700/50 rounded-full h-2">
                            <div 
                              className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-1000"
                              style={{ width: `${soldPercentage}%` }}
                            />
                          </div>
                          
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-gray-400">{soldPercentage.toFixed(0)}% sold</span>
                            <span className="text-green-400 font-semibold">
                              Revenue: ${((ticket.sold || 0) * ticket.price).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={handleEnroll}
                disabled={enrolling || (isEventFull && !isEnrolled)}
                className={`flex-1 font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center shadow-lg backdrop-blur-sm border ${
                  isEnrolled 
                    ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white border-red-500/30 shadow-red-500/25' 
                    : isEventFull 
                      ? 'bg-gray-600/50 text-gray-400 cursor-not-allowed border-gray-600/30'
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-blue-500/30 shadow-blue-500/25'
                } ${enrolling ? 'opacity-70 cursor-not-allowed' : (!isEventFull || isEnrolled) ? 'hover:shadow-xl' : ''}`}
              >
                {enrolling ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    {isEnrolled ? 'Unenrolling...' : 'Enrolling...'}
                  </>
                ) : (
                  <>
                    <FaUserCheck className="mr-3" />
                    {isEnrolled ? 'Unenroll' : isEventFull ? 'Event Full' : 'Enroll Now'}
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

export default EventModal;