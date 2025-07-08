import { useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Dashboard component/Navbar";
import { ImageSlider } from "../components/Dashboard component/ImageSlider";
import SearchFilter from "../components/Dashboard component/SearchFilter";
import Footer from "../components/Dashboard component/Footer";
import EventCards from "../components/Dashboard component/EventCards";
import EventModal from "../components/Dashboard component/EventModal";

const Dashboard = () => {
  const [username, setUsername] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [filters, setFilters] = useState({ 
    district: "All", 
    type: "All", 
    createdBy: "All",
    dateRange: "All",
    priceRange: "All"
  });
  const [events, setEvents] = useState([]);
  const [rawEvents, setRawEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrolling, setEnrolling] = useState(false);
  const [userEnrollments, setUserEnrollments] = useState([]);
  const navigate = useNavigate();

  const transformEventData = (backendEvent) => {
    // Check if current user is enrolled in this event
    const isEnrolled = userEnrollments.some(enrollment => enrollment.eventId === backendEvent._id);
    
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
      attendees: backendEvent.attendees || 0,
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

  // Fetch user enrollments
  const fetchUserEnrollments = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const userId = localStorage.getItem("userId");
      
      if (!token || !userId) {
        setUserEnrollments([]);
        return;
      }
      
      const response = await fetch('/api/enrollments/my', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('User enrollments:', data);
        setUserEnrollments(data.data || data || []);
      } else {
        console.log('Failed to fetch user enrollments');
        setUserEnrollments([]);
      }
    } catch (error) {
      console.error('Error fetching user enrollments:', error);
      setUserEnrollments([]);
    }
  };

  // Fetch events from API 
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching events and enrollments from API...');
        
        // Fetch user enrollments first
        await fetchUserEnrollments();
        
        const token = localStorage.getItem("accessToken");
        
        const headers = {
          'Content-Type': 'application/json',
        };
        
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        
        const response = await fetch('/api/events',
          {
          method: 'GET',
          headers
        });
        
        if (!response.ok) {
          if (response.status === 401 && token) {
            console.log('Token invalid, trying without authentication...');
            const publicResponse = await fetch('/api/events', {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              }
            });
            
            if (!publicResponse.ok) {
              throw new Error(`Failed to fetch events: ${publicResponse.status} ${publicResponse.statusText}`);
            }
            
            const publicData = await publicResponse.json();
            console.log('Successfully loaded events (public):', publicData);
            
            // Handle different response formats for public API too
            let eventsArray;
            if (publicData.data && Array.isArray(publicData.data)) {
              eventsArray = publicData.data;
            } else if (publicData.events && Array.isArray(publicData.events)) {
              eventsArray = publicData.events;
            } else if (Array.isArray(publicData)) {
              eventsArray = publicData;
            } else {
              throw new Error('Invalid response format: events array not found');
            }
            
            // Transform events will be handled in a separate useEffect
            setRawEvents(eventsArray);
            return;
          }
          
          throw new Error(`Failed to fetch events: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Successfully loaded events:', data);
        
        // Handle different response formats - check for data.data or data.events or direct array
        let eventsArray;
        if (data.data && Array.isArray(data.data)) {
          eventsArray = data.data;
        } else if (data.events && Array.isArray(data.events)) {
          eventsArray = data.events;
        } else if (Array.isArray(data)) {
          eventsArray = data;
        } else {
          throw new Error('Invalid response format: events array not found');
        }
        
        // Transform events will be handled in a separate useEffect
        setRawEvents(eventsArray);
        
      } catch (error) {
        console.error("Failed to load events:", error);
        setError(`Failed to load events: ${error.message}`);
        setRawEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Transform events when userEnrollments or rawEvents change
  useEffect(() => {
    if (rawEvents.length > 0) {
      const transformedEvents = rawEvents.map(transformEventData);
      console.log('Transformed events:', transformedEvents);
      setEvents(transformedEvents);
    }
  }, [userEnrollments, rawEvents]);

  useEffect(() => {
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (!loggedInUser) {
      navigate("/dashboard");
    } else {
      setUsername(loggedInUser);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userId");
    navigate("/dashboard");
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleEnroll = async (eventId, isCurrentlyEnrolled = false) => {
    try {
      setEnrolling(true);
      
      const token = localStorage.getItem("accessToken");
      const userId = localStorage.getItem("userId");
      
      if (!token || !userId) {
        alert("Please log in to enroll in events");
        navigate("/login");
        return;
      }
      
      // Get current enrollment status from the event data
      const event = events.find(e => e.id === eventId);
      const actuallyEnrolled = event ? event.isEnrolled : false;
      
      console.log(`${actuallyEnrolled ? 'Unenrolling from' : 'Enrolling in'} event ${eventId}...`);
      
      // Use new enrollment API endpoints
      const endpoint = `/api/enrollments/event/${eventId}`;
      const method = actuallyEnrolled ? 'DELETE' : 'POST';
      
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
        throw new Error(errorData.message || `${actuallyEnrolled ? 'Unenrollment' : 'Enrollment'} failed`);
      }
      
      const data = await response.json();
      console.log(`${actuallyEnrolled ? 'Unenrollment' : 'Enrollment'} response:`, data);
      
      // Update userEnrollments state
      if (actuallyEnrolled) {
        // Remove enrollment from userEnrollments
        setUserEnrollments(prev => prev.filter(enrollment => enrollment.eventId !== eventId));
      } else {
        // Add enrollment to userEnrollments
        setUserEnrollments(prev => [...prev, { eventId, userId }]);
      }
      
      const successMessage = actuallyEnrolled 
        ? '✅ Successfully unenrolled from the event!' 
        : '🎉 Successfully enrolled in the event!';
      alert(successMessage);
      
    } catch (error) {
      console.error(`${isCurrentlyEnrolled ? 'Unenrollment' : 'Enrollment'} failed:`, error);
      alert(`❌ ${error.message}`);
    } finally {
      setEnrolling(false);
    }
  };

  // Filter events based on selected filters
  const filteredEvents = events.filter((event) => {
    const matchesDistrict = filters.district === "All" || event.district === filters.district;
    const matchesType = filters.type === "All" || event.type === filters.type;
    const matchesCreatedBy = filters.createdBy === "All" || event.createdByName === filters.createdBy;
    
    // Date range filtering
    let matchesDateRange = true;
    if (filters.dateRange !== "All") {
      const eventDate = new Date(event.date);
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      switch (filters.dateRange) {
        case "today":
          const todayEnd = new Date(today);
          todayEnd.setDate(todayEnd.getDate() + 1);
          matchesDateRange = eventDate >= today && eventDate < todayEnd;
          break;
        case "this-week":
          const weekEnd = new Date(today);
          weekEnd.setDate(weekEnd.getDate() + 7);
          matchesDateRange = eventDate >= today && eventDate < weekEnd;
          break;
        case "this-month":
          const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 1);
          matchesDateRange = eventDate >= today && eventDate < monthEnd;
          break;
        case "next-month":
          const nextMonthStart = new Date(today.getFullYear(), today.getMonth() + 1, 1);
          const nextMonthEnd = new Date(today.getFullYear(), today.getMonth() + 2, 1);
          matchesDateRange = eventDate >= nextMonthStart && eventDate < nextMonthEnd;
          break;
        default:
          matchesDateRange = true;
      }
    }
    
    // Price range filtering
    let matchesPriceRange = true;
    if (filters.priceRange !== "All") {
      const price = event.price;
      
      switch (filters.priceRange) {
        case "free":
          matchesPriceRange = price === 0;
          break;
        case "0-50":
          matchesPriceRange = price >= 0 && price <= 50;
          break;
        case "50-100":
          matchesPriceRange = price > 50 && price <= 100;
          break;
        case "100-200":
          matchesPriceRange = price > 100 && price <= 200;
          break;
        case "200+":
          matchesPriceRange = price > 200;
          break;
        default:
          matchesPriceRange = true;
      }
    }
    
    return matchesDistrict && matchesType && matchesCreatedBy && matchesDateRange && matchesPriceRange;
  });

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
                  onClick={() => {
                    setError(null);
                    setEvents([]);
                  }} 
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
