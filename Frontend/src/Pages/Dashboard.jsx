import Navbar from "../components/General/Navbar";
import { ImageSlider } from "../components/General/ImageSlider";
import SearchFilter from "../components/Dashboard/SearchFilter";
import Footer from "../components/General/Footer";
import EventCards from "../components/General/EventCards";
import EventModal from "../components/General/EventModal";
import useEventData from "../hooks/useEventData";
import useAuth from "../hooks/useAuth";

const Dashboard = () => {
  const {
    events,
    filteredEvents,
    selectedEvent,
    setSelectedEvent,
    filters,
    handleFilterChange,
    loading,
    error,
    setError,
    enrolling,
    handleEnroll,
  } = useEventData();

  const { username, handleLogout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black flex flex-col">
      <Navbar username={username} onLogout={handleLogout} />
      <main className="flex-1">
        <ImageSlider />
        
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <span className="ml-3 text-white text-lg">Loading events...</span>
          </div>
        )}
        
        {error && (
          <div className="max-w-6xl mx-auto px-4 mb-8">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-red-600 dark:text-red-400">{error}</p>
              <div className="flex space-x-2 mt-3">
                <button 
                  onClick={() => window.location.reload()} 
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Retry
                </button>
                <button 
                  onClick={() => setError(null)} 
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}
        
        {!loading && !error && (
          <>
            <SearchFilter onFilterChange={handleFilterChange} filters={filters} events={events} />
            <EventCards 
              events={filteredEvents} 
              onEventClick={setSelectedEvent} 
              currentUserId={localStorage.getItem("userId")}
            />
          </>
        )}
        
        <EventModal 
          event={selectedEvent} 
          onClose={() => setSelectedEvent(null)} 
          onEnroll={handleEnroll}
          enrolling={enrolling}
          currentUserId={localStorage.getItem("userId")}
        />
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;