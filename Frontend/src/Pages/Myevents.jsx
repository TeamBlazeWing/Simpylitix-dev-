import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaDollarSign, FaPlus, FaTrash, FaBell } from "react-icons/fa6";
import { FaCalendarAlt, FaTimes, FaEdit } from "react-icons/fa";
import Navbar from '../components/Event component/Navbar';
import Footer from "../components/Event component/Footer";
import EventCards from '../components/Event component/EventCards';
import EventModal from '../components/Event component/EventModal';

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

  // Fetch events from backend API
  const fetchEvents = async () => {
    try {
      setLoading(true);
      console.log('Fetching events from backend API...');
      
      const accessToken = localStorage.getItem("accessToken");
      
      // Check if user is authenticated
      if (!accessToken) {
        console.error("No access token found. User needs to log in.");
        navigate("/login");
        return;
      }
      
      const response = await fetch('http://localhost:3000/api/events', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.status === 401) {
        console.error("Access token expired or invalid. Redirecting to login...");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("loggedInUser");
        localStorage.removeItem("userId");
        navigate("/login");
        return;
      }
      
      if (!response.ok) {
        throw new Error(`Backend API error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Successfully fetched events from backend:', data);
      
      // Ensure we always set an array for events
      if (Array.isArray(data)) {
        // Transform events to ensure consistent ID field
        const transformedEvents = data.map(event => ({
          ...event,
          id: event._id || event.id // Ensure both id and _id are available
        }));
        setEvents(transformedEvents);
        console.log('Events set as array:', transformedEvents.length, 'events');
      } else if (data && Array.isArray(data.events)) {
        // Transform events to ensure consistent ID field
        const transformedEvents = data.events.map(event => ({
          ...event,
          id: event._id || event.id // Ensure both id and _id are available
        }));
        setEvents(transformedEvents);
        console.log('Events set from data.events:', transformedEvents.length, 'events');
      } else {
        console.warn('API response is not an array:', data);
        setEvents([]);
      }
      
      setError(null);
    } catch (error) {
      console.error("Backend API failed:", error);
      setEvents([]);
      setError("Failed to load events. Please check your connection and ensure the backend server is running.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch events from backend API
  useEffect(() => {
    fetchEvents();
  }, [navigate]);

  useEffect(() => {
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (!loggedInUser) {
      navigate("/login");
    } else {
      setUsername(loggedInUser);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  // Handle enrollment/unenrollment - same as Dashboard
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
        ? `http://localhost:3000/api/events/${eventId}/unregister`
        : `http://localhost:3000/api/events/${eventId}/register`;
      
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
      
      // Update local events state to reflect the change
      setEvents(events.map(event => {
        if (event.id === eventId || event._id === eventId) {
          let updatedAttendees;
          if (isCurrentlyEnrolled) {
            // For unenrollment, filter out the current user
            updatedAttendees = event.attendees.filter(attendeeId => {
              const attendeeIdStr = typeof attendeeId === 'string' ? attendeeId : attendeeId._id || attendeeId.toString();
              return attendeeIdStr !== userId;
            });
          } else {
            // For enrollment, add the current user
            updatedAttendees = [...event.attendees, userId];
          }
          
          return { ...event, attendees: updatedAttendees };
        }
        return event;
      }));
      
      // Update selected event if it's currently open
      if (selectedEvent && (selectedEvent.id === eventId || selectedEvent._id === eventId)) {
        let updatedAttendees;
        if (isCurrentlyEnrolled) {
          // For unenrollment, filter out the current user
          updatedAttendees = selectedEvent.attendees.filter(attendeeId => {
            const attendeeIdStr = typeof attendeeId === 'string' ? attendeeId : attendeeId._id || attendeeId.toString();
            return attendeeIdStr !== userId;
          });
        } else {
          // For enrollment, add the current user
          updatedAttendees = [...selectedEvent.attendees, userId];
        }
        
        setSelectedEvent({ ...selectedEvent, attendees: updatedAttendees });
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

  // Create Event Form Component
  const CreateEventForm = ({ isOpen, onClose, onEventCreated, editingEvent = null }) => {
    const [formData, setFormData] = useState({
      title: '',
      description: '',
      type: 'conference',
      date: '',
      location: '',
      imageUrl: '',
      price: 0,
      district: '',
      expirationDate: '',
      maxAttendees: 100,
      registrationLink: '',
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
          location: editingEvent.location || '',
          imageUrl: editingEvent.imageUrl || '',
          price: editingEvent.price || 0,
          district: editingEvent.district || '',
          expirationDate: editingEvent.expirationDate ? new Date(editingEvent.expirationDate).toISOString().slice(0, 16) : '',
          maxAttendees: editingEvent.maxAttendees || 100,
          registrationLink: editingEvent.registrationLink || '',
          tags: editingEvent.tags ? editingEvent.tags.join(', ') : '',
          tickets: editingEvent.tickets && editingEvent.tickets.length > 0 ? editingEvent.tickets : [
            { name: 'General Admission', price: 0, quantity: 100 }
          ]
        });
      } else {
        setFormData({
          title: '',
          description: '',
          type: 'conference',
          date: '',
          location: '',
          imageUrl: '',
          price: 0,
          district: '',
          expirationDate: '',
          maxAttendees: 100,
          registrationLink: '',
          tags: '',
          tickets: [
            { name: 'General Admission', price: 0, quantity: 100 }
          ]
        });
      }
      setSelectedImage(null);
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
        if (!token) {
          alert("Please log in to upload images");
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
            alert("Session expired. Please log in again.");
            localStorage.clear();
            navigate("/login");
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
        if (!token) {
          alert("Please log in to create events");
          navigate("/login");
          return;
        }

        // Get current user ID for volunteer field
        const userId = localStorage.getItem("userId");
        if (!userId) {
          alert("User ID not found. Please log in again.");
          navigate("/login");
          return;
        }

        // Prepare the event data
        const eventData = {
          ...formData,
          price: parseFloat(formData.price),
          maxAttendees: parseInt(formData.maxAttendees),
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
          tickets: formData.tickets.map(ticket => ({
            ...ticket,
            price: parseFloat(ticket.price),
            quantity: parseInt(ticket.quantity)
          }))
        };

        // Set volunteer field for both create and update operations
        eventData.volunteer = userId;

        // Validate required fields before sending
        const requiredFields = ['title', 'type', 'date', 'location', 'district', 'expirationDate'];
        const missingFields = requiredFields.filter(field => !eventData[field] || eventData[field] === '');
        
        if (missingFields.length > 0) {
          alert(`❌ Please fill in all required fields: ${missingFields.join(', ')}`);
          return;
        }

        if (eventData.price === undefined || eventData.price === null || eventData.price === '') {
          alert('❌ Please enter a valid price');
          return;
        }

        // Add debugging to see what data is being sent
        console.log(`${editingEvent ? 'Updating' : 'Creating'} event with data:`, eventData);
        console.log('Required fields check:');
        console.log('- title:', eventData.title);
        console.log('- type:', eventData.type);
        console.log('- date:', eventData.date);
        console.log('- location:', eventData.location);
        console.log('- price:', eventData.price);
        console.log('- district:', eventData.district);
        console.log('- volunteer:', eventData.volunteer);
        console.log('- expirationDate:', eventData.expirationDate);

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
            alert("Session expired. Please log in again.");
            localStorage.clear();
            navigate("/login");
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
          location: '',
          imageUrl: '',
          price: 0,
          district: '',
          expirationDate: '',
          maxAttendees: 100,
          registrationLink: '',
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
                  <label className="block text-sm font-medium text-gray-300 mb-2">Expiration Date *</label>
                  <input
                    type="datetime-local"
                    name="expirationDate"
                    value={formData.expirationDate}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Base Price *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    required
                    className="w-full px-4 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>

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
                  <label className="block text-sm font-medium text-gray-300 mb-2">Registration Link</label>
                  <input
                    type="url"
                    name="registrationLink"
                    value={formData.registrationLink}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://register.example.com"
                  />
                </div>

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

  // Filter events to show only enrolled events (with loading guard)
  const currentUserId = localStorage.getItem("userId");
  
  // Ensure events is always an array before filtering and component is not loading
  const safeEvents = Array.isArray(events) ? events : [];
  
  // Filter enrolled events
  const enrolledEvents = loading ? [] : safeEvents.filter(event => {
    if (!event.attendees || !Array.isArray(event.attendees)) {
      return false;
    }
    
    // Handle both ObjectId objects and string comparisons
    const isEnrolled = event.attendees.some(attendeeId => {
      // Convert ObjectId to string if necessary
      const attendeeIdStr = typeof attendeeId === 'object' && attendeeId._id 
        ? attendeeId._id.toString() 
        : attendeeId.toString();
      
      return attendeeIdStr === currentUserId;
    });
    
    // Debug logging
    if (isEnrolled) {
      console.log(`User ${currentUserId} is enrolled in event: ${event.title}`);
    }
    
    return isEnrolled;
  });

  // Filter created events (where current user is the creator/organizer)
  const createdEvents = loading ? [] : safeEvents.filter(event => {
    if (!event.createdBy) {
      return false;
    }
    
    // Handle both ObjectId objects and string comparisons
    const createdByIdStr = typeof event.createdBy === 'object' && event.createdBy._id 
      ? event.createdBy._id.toString() 
      : event.createdBy.toString();
    
    const isCreator = createdByIdStr === currentUserId;
    
    // Debug logging
    if (isCreator) {
      console.log(`User ${currentUserId} created event: ${event.title}`);
    }
    
    return isCreator;
  });

  // Debug logging for enrolled and created events
  console.log(`Found ${enrolledEvents.length} enrolled events for user ${currentUserId}`);
  console.log(`Found ${createdEvents.length} created events for user ${currentUserId}`);

  // Calculate total price of enrolled events
  const totalPrice = enrolledEvents.reduce((sum, event) => sum + (event.price || 0), 0);

  // Enhanced delete function that checks for attendees
  const handleDeleteEvent = async (event) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        alert("Please log in to delete events");
        navigate("/login");
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
          alert("Session expired. Please log in again.");
          localStorage.clear();
          navigate("/login");
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
      if (!token) {
        alert("Please log in to edit events");
        navigate("/login");
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

      console.log(`Sending notification to attendees of event ${notificationEvent._id || notificationEvent.id}...`);
      console.log('Message:', notificationMessage);
      
      const response = await fetch(`http://localhost:3000/api/notifications/send/${notificationEvent._id || notificationEvent.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: notificationMessage
        })
      });

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
        
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to send notification');
      }

      const data = await response.json();
      console.log('Notification sent successfully:', data);
      
      alert(`✅ Notification sent successfully to ${data.notification.attendeesCount} attendee${data.notification.attendeesCount !== 1 ? 's' : ''}!`);
      
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
            <div className="mt-6">
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 inline-flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <FaPlus className="text-sm" />
                Create New Event
              </button>
            </div>
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
          <>
            {/* Stats Section */}
            <EnrollmentStats 
              enrolledEventsCount={enrolledEvents.length}
              totalPrice={totalPrice}
            />

            {/* Created Events Section */}
            <div className="w-full max-w-6xl mx-auto mb-8 px-4">
              <div className="flex items-center mb-6">
                <div className="flex items-center">
                  <div className="bg-purple-500/20 rounded-full p-3 mr-4">
                    <FaPlus className="text-2xl text-purple-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Your Created Events</h2>
                    <p className="text-gray-400 text-sm">
                      {createdEvents.length} event{createdEvents.length !== 1 ? 's' : ''} created by you
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Use existing EventCards component or show no events message */}
              {createdEvents.length > 0 ? (
                <EventCards 
                  events={createdEvents} 
                  onEventClick={setSelectedEvent}
                  currentUserId={currentUserId}
                  showCreatorActions={true}
                  onDeleteEvent={handleDeleteEvent}
                  onEditEvent={handleEditEvent}
                  onNotifyAttendees={handleNotifyAttendees}
                />
              ) : (
                <div className="w-full max-w-6xl mx-auto mb-8">
                  <div className="flex justify-center items-center py-12">
                    <div className="text-center text-white">
                      <div className="mb-4">
                        <FaPlus className="text-6xl text-gray-400 mx-auto mb-4" />
                      </div>
                      <h4 className="text-2xl font-bold mb-2">
                        No Created Events
                      </h4>
                      <p className="text-gray-300 text-lg">
                        You haven't created any events yet.
                      </p>
                      <p className="text-gray-400 text-sm mt-2">
                        Click "Create New Event" to get started!
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Enrolled Events Section */}
            <div className="w-full max-w-6xl mx-auto mb-8 px-4">
              <div className="flex items-center mb-6">
                <div className="flex items-center">
                  <div className="bg-green-500/20 rounded-full p-3 mr-4">
                    <FaEye className="text-2xl text-green-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Your Enrolled Events</h2>
                    <p className="text-gray-400 text-sm">
                      {enrolledEvents.length} event{enrolledEvents.length !== 1 ? 's' : ''} found
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Use existing EventCards component or show no events message */}
              {enrolledEvents.length > 0 ? (
                <EventCards 
                  events={enrolledEvents} 
                  onEventClick={setSelectedEvent}
                  currentUserId={currentUserId}
                />
              ) : (
                <NoEnrolledEventsMessage />
              )}
            </div>
          </>
        )}
        
        {/* Notification Modal */}
        {showNotificationModal && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-black/90 backdrop-blur-lg rounded-2xl shadow-2xl w-full max-w-md border border-white/20">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/20">
                <h2 className="text-xl font-bold text-white">
                  Notify Attendees
                </h2>
                <button
                  onClick={() => {
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
                {notificationEvent && (
                  <div className="mb-4">
                    <p className="text-gray-300 text-sm mb-2">Sending notification for:</p>
                    <p className="text-white font-semibold">{notificationEvent.title}</p>
                    <p className="text-gray-400 text-sm">
                      {notificationEvent.attendees?.length || 0} attendee{(notificationEvent.attendees?.length || 0) !== 1 ? 's' : ''}
                    </p>
                  </div>
                )}

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
        <EventModal 
          event={selectedEvent} 
          onClose={() => setSelectedEvent(null)}
          onEnroll={handleEnroll}
          enrolling={enrolling}
          currentUserId={currentUserId}
        />
        
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
