import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import QRCode from "qrcode";
import { 
  FaTicket, 
  FaCalendarDays, 
  FaLocationDot, 
  FaClock, 
  FaCircleCheck, 
  FaCircleXmark, 
  FaHourglass, 
  FaQrcode,
  FaDownload,
  FaEye,
  FaTrash,
  FaMagnifyingGlass,
  FaFilter,
  FaStar,
  FaHeart,
  FaShareNodes
} from "react-icons/fa6";
import Navbar from "../components/Dashboard component/Navbar";
import Footer from "../components/Dashboard component/Footer";
import { ImageSlider } from "../components/Dashboard component/ImageSlider";

// Function to check if a JWT token is valid (not expired)
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

const MyTickets = () => {
  const [username, setUsername] = useState("");
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [qrCodes, setQrCodes] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const loggedInUser = localStorage.getItem("loggedInUser");
    const token = localStorage.getItem("accessToken");
    
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
    fetchTickets();
  }, [navigate]);

  const clearAuthData = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userId");
  };

  const fetchTickets = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      
      // Double-check token before making request
      if (!token || !isTokenValid(token)) {
        console.log("Token missing or invalid during fetchTickets");
        clearAuthData();
        navigate("/login");
        return;
      }

      const response = await fetch("http://localhost:3000/api/tickets/my", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      console.log("Tickets data from API:", data);

      // Handle unauthorized response
      if (response.status === 401) {
        console.log("Unauthorized: Token rejected by server");
        setError("Your session has expired. Please log in again.");
        clearAuthData();
        navigate("/login", { state: { message: "Your session has expired. Please log in again." } });
        return;
      }

      if (response.ok) {
        // The response structure might be different than expected
        // Check if data is an array directly or if it's contained in a property
        let ticketsData = [];
        
        if (Array.isArray(data)) {
          ticketsData = data;
        } else if (data.tickets && Array.isArray(data.tickets)) {
          ticketsData = data.tickets;
        } else if (data.success && data.tickets && Array.isArray(data.tickets)) {
          ticketsData = data.tickets;
        } else {
          // If it's not in the expected format, try to find an array in the response
          for (const key in data) {
            if (Array.isArray(data[key])) {
              ticketsData = data[key];
              break;
            }
          }
        }
        
        console.log("Processed tickets data:", ticketsData);
        
        // Process tickets to add status (active/used/expired) based on dates and checkedIn
        const processedTickets = ticketsData.map(ticket => {
          console.log("Processing ticket:", ticket);
          // Determine ticket status based on event date and checked-in status
          let status = "active";
          if (ticket.checkedIn) {
            status = "used";
          } else if (ticket.eventId && ticket.eventId.date && new Date(ticket.eventId.date) < new Date()) {
            status = "expired";
          }
          
          return {
            ...ticket,
            status
          };
        });
        
        console.log("Final processed tickets:", processedTickets);
        setTickets(processedTickets);
        // Generate QR codes for all tickets
        generateQRCodes(processedTickets);
      } else {
        setError(data.message || "Failed to fetch tickets");
      }
    } catch (error) {
      console.error("Error fetching tickets:", error);
      setError("Network error occurred");
    } finally {
      setLoading(false);
    }
  };

  const generateQRCodes = async (ticketList) => {
    const qrCodeMap = {};
    for (const ticket of ticketList) {
      try {
        // Use ticketCode if available, otherwise fall back to _id
        const qrData = `SimplyTix-Ticket:${ticket.ticketCode || ticket._id}`;
        const qrCodeDataURL = await QRCode.toDataURL(qrData, {
          width: 200,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        });
        qrCodeMap[ticket._id] = qrCodeDataURL;
      } catch (error) {
        console.error(`Error generating QR code for ticket ${ticket._id}:`, error);
      }
    }
    setQrCodes(qrCodeMap);
  };

  const handleLogout = () => {
    clearAuthData();
    navigate("/login");
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "text-green-400 bg-green-400/20 border-green-400/40";
      case "cancelled":
        return "text-red-400 bg-red-400/20 border-red-400/40";
      case "expired":
        return "text-gray-400 bg-gray-400/20 border-gray-400/40";
      case "used":
        return "text-blue-400 bg-blue-400/20 border-blue-400/40";
      default:
        return "text-yellow-400 bg-yellow-400/20 border-yellow-400/40";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return <FaCircleCheck className="text-green-400" />;
      case "cancelled":
        return <FaCircleXmark className="text-red-400" />;
      case "expired":
        return <FaClock className="text-gray-400" />;
      case "used":
        return <FaTicket className="text-blue-400" />;
      default:
        return <FaHourglass className="text-yellow-400" />;
    }
  };

  const filterTickets = () => {
    let filtered = tickets;

    // Filter by status
    if (selectedStatus !== "all") {
      filtered = filtered.filter(ticket => 
        ticket.status?.toLowerCase() === selectedStatus.toLowerCase()
      );
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(ticket =>
        ticket.eventId?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.ticketType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.eventId?.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort tickets
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.purchaseDate) - new Date(a.purchaseDate);
        case "oldest":
          return new Date(a.purchaseDate) - new Date(b.purchaseDate);
        case "event-date":
          return new Date(a.eventId?.date) - new Date(b.eventId?.date);
        case "price-high":
          // If we don't have a specific price on the ticket, we can't sort by price
          return 0;
        case "price-low":
          // If we don't have a specific price on the ticket, we can't sort by price
          return 0;
        default:
          return 0;
      }
    });

    return filtered;
  };

  const getTicketStats = () => {
    const stats = {
      total: tickets.length,
      active: tickets.filter(t => t.status?.toLowerCase() === "active").length,
      cancelled: tickets.filter(t => t.status?.toLowerCase() === "cancelled").length,
      expired: tickets.filter(t => t.status?.toLowerCase() === "expired").length,
      used: tickets.filter(t => t.status?.toLowerCase() === "used" || t.checkedIn).length,
    };
    return stats;
  };

  const handleCancelTicket = async (ticketId) => {
    if (!window.confirm("Are you sure you want to cancel this ticket?")) {
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");
      
      // Validate token before making request
      if (!token || !isTokenValid(token)) {
        console.log("Token missing or invalid during cancelTicket");
        clearAuthData();
        navigate("/login");
        return;
      }
      
      const response = await fetch(`http://localhost:3000/api/tickets/${ticketId}/cancel`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // Handle unauthorized response
      if (response.status === 401) {
        console.log("Unauthorized: Token rejected by server during cancel ticket");
        clearAuthData();
        navigate("/login", { state: { message: "Your session has expired. Please log in again." } });
        return;
      }

      const data = await response.json();

      if (response.ok) {
        // Update the ticket status locally
        setTickets(prev => 
          prev.map(ticket => 
            ticket._id === ticketId 
              ? { ...ticket, status: 'cancelled' } 
              : ticket
          )
        );
        alert("Ticket cancelled successfully!");
      } else {
        alert(data.message || "Failed to cancel ticket");
      }
    } catch (error) {
      console.error("Error cancelling ticket:", error);
      alert("Network error occurred");
    }
  };

  const downloadQRCode = (ticket) => {
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

  const shareTicket = async (ticket) => {
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

  const generateQRData = (ticket) => {
    return `SimplyTix-Ticket:${ticket._id}`;
  };

  const stats = getTicketStats();
  const filteredTickets = filterTickets();

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg">Loading your tickets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Navbar */}
      <div className="relative z-20">
        <Navbar username={username} onLogout={handleLogout} />
      </div>

      {/* Image Slider */}
      <div className="relative z-10">
        <ImageSlider />
      </div>

      {/* Main Content */}
      <main className="relative z-10 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-purple-300 to-pink-300 bg-clip-text text-transparent mb-4">
              My Tickets
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Manage and view all your event tickets in one place
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 text-center border border-white/20 hover:scale-105 transition-all duration-300">
              <div className="text-3xl font-bold text-white mb-2">{stats.total}</div>
              <div className="text-gray-300 text-sm">Total Tickets</div>
            </div>
            <div className="bg-green-500/20 backdrop-blur-xl rounded-2xl p-6 text-center border border-green-500/30 hover:scale-105 transition-all duration-300">
              <div className="text-3xl font-bold text-green-400 mb-2">{stats.active}</div>
              <div className="text-gray-300 text-sm">Active</div>
            </div>
            <div className="bg-blue-500/20 backdrop-blur-xl rounded-2xl p-6 text-center border border-blue-500/30 hover:scale-105 transition-all duration-300">
              <div className="text-3xl font-bold text-blue-400 mb-2">{stats.used}</div>
              <div className="text-gray-300 text-sm">Used</div>
            </div>
            <div className="bg-red-500/20 backdrop-blur-xl rounded-2xl p-6 text-center border border-red-500/30 hover:scale-105 transition-all duration-300">
              <div className="text-3xl font-bold text-red-400 mb-2">{stats.cancelled}</div>
              <div className="text-gray-300 text-sm">Cancelled</div>
            </div>
            <div className="bg-gray-500/20 backdrop-blur-xl rounded-2xl p-6 text-center border border-gray-500/30 hover:scale-105 transition-all duration-300">
              <div className="text-3xl font-bold text-gray-400 mb-2">{stats.expired}</div>
              <div className="text-gray-300 text-sm">Expired</div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              {/* Search Bar */}
              <div className="relative flex-1">
                <FaMagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tickets by event, type, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800/50 rounded-lg text-white placeholder-gray-400 focus:ring-1 focus:ring-purple-500 border-0 outline-none"
                />
              </div>

              {/* Status Filter */}
              <div className="relative">
                <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="pl-10 pr-8 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 appearance-none cursor-pointer"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="used">Used</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="expired">Expired</option>
                </select>
              </div>

              {/* Sort Options */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 appearance-none cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="event-date">Event Date</option>
                <option value="price-high">Price: High to Low</option>
                <option value="price-low">Price: Low to High</option>
              </select>
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-2xl p-6 mb-8 text-center">
              <FaCircleXmark className="text-red-400 text-4xl mx-auto mb-4" />
              <p className="text-red-400 text-lg">{error}</p>
              <button
                onClick={fetchTickets}
                className="mt-4 px-6 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          {/* Tickets Grid */}
          {filteredTickets.length === 0 ? (
            <div className="text-center py-16">
              <FaTicket className="text-gray-400 text-6xl mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">No Tickets Found</h3>
              <p className="text-gray-400 mb-6">
                {tickets.length === 0 
                  ? "You haven't purchased any tickets yet." 
                  : "No tickets match your current filters."}
              </p>
              {tickets.length === 0 && (
                <button
                  onClick={() => navigate("/dashboard")}
                  className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105"
                >
                  Browse Events
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTickets.map((ticket) => (
                <div
                  key={ticket._id}
                  className="group bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-500 relative"
                >
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
              ))}
            </div>
          )}

          {/* Load More Button (if needed) */}
          {filteredTickets.length > 0 && (
            <div className="text-center mt-12">
              <div className="text-gray-400 text-sm">
                Showing {filteredTickets.length} of {tickets.length} tickets
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
};

export default MyTickets;
