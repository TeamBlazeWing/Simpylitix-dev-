import { FaTicket, FaMagnifyingGlass, FaFilter } from "react-icons/fa6";
import Navbar from "../components/General/Navbar";
import Footer from "../components/General/Footer";
import { ImageSlider } from "../components/General/ImageSlider";
import useTicketData from "../hooks/useTicketData";
import useAuth from "../hooks/useAuth";
import TicketCard from "../components/MyTickets/TicketCard";

const MyTickets = () => {
  const {
    tickets,
    filteredTickets,
    loading,
    error,
    fetchTickets,
    selectedStatus,
    setSelectedStatus,
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    stats,
  } = useTicketData();

  const { username, handleLogout } = useAuth();

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
                <TicketCard key={ticket._id} ticket={ticket} />
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