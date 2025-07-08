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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrolling, setEnrolling] = useState(false);
  const navigate = useNavigate();

  const transformEventData = (backendEvent) => {
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
      tickets: backendEvent.tickets && backendEvent.tickets.length > 0 
        ? backendEvent.tickets.map(ticket => ({
            name: ticket.name,
            price: ticket.price,
            quantity: ticket.quantity
          }))
        : [{
            name: 'General Admission', 
            price: 0,
            quantity: 100
          }],
      price: backendEvent.tickets && backendEvent.tickets.length > 0 ? backendEvent.tickets[0].price : 0,
      ticketTypes: backendEvent.tickets && backendEvent.tickets.length > 0 
        ? backendEvent.tickets.map(ticket => ({
            name: ticket.name,
            price: ticket.price,
            quantity: ticket.quantity
          }))
        : [{ name: 'General Admission', price: 0, quantity: 100 }],
      formattedDate: backendEvent.date ? new Date(backendEvent.date).toLocaleDateString() : '',
      formattedTime: backendEvent.time || 'Time TBA',
      category: backendEvent.category || backendEvent.type,
      isFree: backendEvent.tickets ? backendEvent.tickets.every(ticket => ticket.price === 0) : true,
      createdAt: backendEvent.createdAt,
      updatedAt: backendEvent.updatedAt
    };
  };

  // Fetch events from API 
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching events from API...');
        
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
            
            const transformedEvents = eventsArray.map(transformEventData);
            setEvents(transformedEvents);
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
        
        const transformedEvents = eventsArray.map(transformEventData);
        console.log('Transformed events:', transformedEvents);
        console.log('Sample event attendees:', transformedEvents[0]?.attendees);
        setEvents(transformedEvents);
        
      } catch (error) {
        console.error("Failed to load events:", error);
        setError(`Failed to load events: ${error.message}`);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (!loggedInUser) {
      navigate("/dashboard"); // this should redirect to the login page
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
      
      console.log(`${isCurrentlyEnrolled ? 'Unenrolling from' : 'Enrolling in'} event ${eventId}...`);
      console.log('Current user ID:', userId);
      console.log('Is currently enrolled:', isCurrentlyEnrolled);
      
      // Use different endpoints for enroll/unenroll
      const endpoint = isCurrentlyEnrolled 
        ? `/api/events/${eventId}/unregister`
        : `/api/events/${eventId}/register`;
      
      const method = isCurrentlyEnrolled ? 'DELETE' : 'POST';
      
      console.log('API endpoint:', endpoint);
      console.log('HTTP method:', method);
      
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
        } else if (response.status === 403) {
          alert("You don't have permission to perform this action.");
          return;
        } else if (response.status === 404) {
          alert("Event not found.");
          return;
        } else if (response.status === 400) {
          const errorData = await response.json().catch(() => ({}));
          if (errorData.message && errorData.message.includes('already registered')) {
            alert("You are already enrolled in this event!");
            return;
          } else if (errorData.message && errorData.message.includes('not registered')) {
            alert("You are not enrolled in this event!");
            return;
          }
        }
        
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `${isCurrentlyEnrolled ? 'Unenrollment' : 'Enrollment'} failed`);
      }
      
      const data = await response.json();
      console.log(`${isCurrentlyEnrolled ? 'Unenrollment' : 'Enrollment'} response:`, data);
      
      // Update local events state to reflect the attendance count change
      setEvents(events.map(event => {
        if (event.id === eventId) {
          let updatedAttendeeCount;
          if (isCurrentlyEnrolled) {
            // For unenrollment, decrease count
            updatedAttendeeCount = Math.max(0, event.attendees - 1);
          } else {
            // For enrollment, increase count
            updatedAttendeeCount = event.attendees + 1;
          }
          
          return { 
            ...event, 
            attendees: updatedAttendeeCount,
            availableSpots: event.maxAttendees - updatedAttendeeCount,
            status: updatedAttendeeCount >= event.maxAttendees ? 'Full' : 'Available'
          };
        }
        return event;
      }));
      
      // Update selected event if it's currently open
      if (selectedEvent && selectedEvent.id === eventId) {
        let updatedAttendeeCount;
        if (isCurrentlyEnrolled) {
          // For unenrollment, decrease count
          updatedAttendeeCount = Math.max(0, selectedEvent.attendees - 1);
        } else {
          // For enrollment, increase count
          updatedAttendeeCount = selectedEvent.attendees + 1;
        }
        
        setSelectedEvent({ 
          ...selectedEvent, 
          attendees: updatedAttendeeCount,
          availableSpots: selectedEvent.maxAttendees - updatedAttendeeCount,
          status: updatedAttendeeCount >= selectedEvent.maxAttendees ? 'Full' : 'Available'
        });
      }
      
      const successMessage = isCurrentlyEnrolled 
        ? '✅ Successfully unenrolled from the event!' 
        : '🎉 Successfully enrolled in the event!';
      alert(successMessage);
      
    } catch (error) {
      console.error(`${isCurrentlyEnrolled ? 'Unenrollment' : 'Enrollment'} failed:`, error);
      
      // Provide user-friendly error messages
      let errorMessage;
      if (error.message.includes('network') || error.message.includes('fetch')) {
        errorMessage = "Network error. Please check your connection and try again.";
      } else {
        errorMessage = error.message || `Failed to ${isCurrentlyEnrolled ? 'unenroll from' : 'enroll in'} event`;
      }
      
      alert(`❌ ${errorMessage}`);
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
    
    // Price range filtering (based on first ticket price or 0 if no tickets)
    let matchesPriceRange = true;
    if (filters.priceRange !== "All") {
      const price = event.price; // Already calculated from first ticket in transformEventData
      
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
