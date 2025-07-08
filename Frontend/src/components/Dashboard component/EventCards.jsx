
const EventCards = ({ events, onEventClick, currentUserId }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8 px-4">
    {events.map((event, idx) => {
      // Check if current user is enrolled (handle both string IDs and object IDs)
      const isEnrolled = event.attendees && currentUserId && event.attendees.some(attendeeId => 
        typeof attendeeId === 'string' ? attendeeId === currentUserId : attendeeId._id === currentUserId
      );
      
      // Format creation date
      const creationDate = event.createdAt ? new Date(event.createdAt).toLocaleDateString() : 'N/A';
      
      // Get ticket information with prices
      const ticketInfo = event.tickets && event.tickets.length > 0 
        ? event.tickets.map(ticket => `${ticket.name}: ${ticket.price}`).join(', ')
        : 'No tickets available';
      
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
            
            {/* Event Creation Date */}
            <div className="flex items-center gap-2 text-gray-300">
              <div className="w-2 h-2 bg-green-400 rounded-full" />
              <span className="text-sm font-medium">Created: {creationDate}</span>
            </div>
            
            {/* Event Code */}
            {event.eventCode && (
              <div className="flex items-center gap-2 text-gray-400">
                <div className="w-2 h-2 bg-yellow-400 rounded-full" />
                <span className="text-sm">Code: {event.eventCode}</span>
              </div>
            )}
            
            {/* Created By info */}
            {event.createdBy && (
              <div className="flex items-center gap-2 text-green-400">
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                <span className="text-sm">Created by: {typeof event.createdBy === 'object' ? event.createdBy.name : event.createdBy}</span>
              </div>
            )}
            
            {/* Ticket Information with Prices */}
            <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full" />
                <span className="text-sm text-gray-300 font-medium">Ticket Types & Prices</span>
              </div>
              <p className="text-sm text-white break-words" title={ticketInfo}>
                {ticketInfo}
              </p>
            </div>
            
            {/* Action button */}
            <div className="pt-2">
              <button 
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-2 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                onClick={(e) => {
                  e.stopPropagation();
                  onEventClick(event);
                }}
              >
                {isEnrolled ? 'View Details' : 'View Tickets'}
              </button>
            </div>
          </div>
          
        </div>
      );
    })}
  </div>
);

export default EventCards;