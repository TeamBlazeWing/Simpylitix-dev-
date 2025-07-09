import { 
  FaTicket, 
  FaCalendarDays, 
  FaLocationDot, 
  FaClock, 
  FaQrcode, 
  FaDownload, 
  FaShareNodes, 
  FaCircleXmark 
} from "react-icons/fa6";
import { getStatusColor, getStatusIcon, generateQRData } from "../../utils/ticketUtils";
import useTicketData from "../../hooks/useTicketData";

const TicketCard = ({ ticket }) => {
  const { qrCodes, handleCancelTicket } = useTicketData();

  const downloadQRCode = () => {
    const qrCodeDataURL = qrCodes[ticket._id];
    if (!qrCodeDataURL) return;

    const link = document.createElement('a');
    const ticketId = ticket.ticketCode || ticket._id?.slice(-8) || 'ticket';
    link.download = `ticket-${ticketId}-qr.png`;
    link.href = qrCodeDataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const shareTicket = async () => {
    const ticketInfo = `🎫 My Ticket for ${ticket.eventId?.title || 'Event'}\n📅 ${ticket.eventId?.date ? new Date(ticket.eventId.date).toLocaleDateString() : 'Date not available'}\n📍 ${ticket.eventId?.location || 'Location not available'}\n🎟️ ${ticket.ticketType || 'General'}\n\nTicket Code: ${ticket.ticketCode || ticket._id || 'Unknown'}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `SimplyTix - ${ticket.eventId?.title || 'Event Ticket'}`,
          text: ticketInfo,
          url: window.location.origin
        });
      } catch (error) {
        console.log('Error sharing:', error);
        fallbackShare(ticketInfo);
      }
    } else {
      fallbackShare(ticketInfo);
    }
  };

  const fallbackShare = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Ticket information copied to clipboard!');
    }).catch(() => {
      alert('Unable to share ticket information');
    });
  };

  return (
    <div className="group bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-500 relative">
      {/* Ticket Header */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={ticket.eventId?.imageUrl || "https://via.placeholder.com/400x200?text=Event+Image"}
          alt={ticket.eventId?.title || "Event"}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        
        {/* Status Badge */}
        <div className={`absolute top-4 right-4 px-3 py-1 rounded-full border text-xs font-semibold flex items-center gap-2 ${getStatusColor(ticket.status)}`}>
          {getStatusIcon(ticket.status)}
          {ticket.status?.toUpperCase() || "PENDING"}
        </div>

        {/* Ticket Type Badge */}
        <div className="absolute top-4 left-4 px-3 py-1 bg-purple-500/90 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
          {ticket.ticketType || "General"}
        </div>
      </div>

      {/* Ticket Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
          {ticket.eventId?.title || "Untitled Event"}
        </h3>

        {/* Event Details */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3 text-gray-300">
            <FaCalendarDays className="text-blue-400 flex-shrink-0" />
            <span className="text-sm">
              {ticket.eventId?.date ? new Date(ticket.eventId.date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }) : 'Date not available'}
            </span>
          </div>
          
          <div className="flex items-center gap-3 text-gray-300">
            <FaLocationDot className="text-green-400 flex-shrink-0" />
            <span className="text-sm truncate">{ticket.eventId?.location || 'Location not available'}</span>
          </div>

          <div className="flex items-center gap-3 text-gray-300">
            <FaClock className="text-yellow-400 flex-shrink-0" />
            <span className="text-sm">
              Purchased: {ticket.purchaseDate ? new Date(ticket.purchaseDate).toLocaleDateString() : 'Date not available'}
            </span>
          </div>
        </div>

        {/* QR Code Section */}
        <div className="bg-gray-800/50 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <FaQrcode className="text-purple-400" />
              <span className="text-sm font-medium text-white">QR Code</span>
            </div>
            <div className="text-xs text-gray-400">ID: {ticket.ticketCode || ticket._id?.slice(-8) || 'Unknown'}</div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="bg-white rounded-lg p-3 flex-shrink-0">
              {qrCodes[ticket._id] ? (
                <img 
                  src={qrCodes[ticket._id]} 
                  alt={`QR Code for ticket ${ticket.ticketCode || ticket._id?.slice(-8) || 'Unknown'}`}
                  className="w-20 h-20"
                />
              ) : (
                <div className="w-20 h-20 bg-gray-200 flex items-center justify-center">
                  <FaQrcode className="text-gray-400 text-2xl" />
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <p className="text-xs text-gray-400 mb-2">Scan to verify ticket</p>
              <div className="flex gap-2">
                <button
                  onClick={() => downloadQRCode(ticket)}
                  className="flex items-center gap-1 px-3 py-1 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded text-xs transition-colors"
                  disabled={!qrCodes[ticket._id]}
                >
                  <FaDownload className="text-xs" />
                  Download
                </button>
                <button
                  onClick={() => shareTicket(ticket)}
                  className="flex items-center gap-1 px-3 py-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded text-xs transition-colors"
                >
                  <FaShareNodes className="text-xs" />
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hover Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 to-pink-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
    </div>
  );
};

export default TicketCard;