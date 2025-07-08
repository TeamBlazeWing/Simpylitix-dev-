import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaLock, FaCheck, FaCreditCard, FaPaypal, FaCircleInfo, FaTriangleExclamation, FaCircleCheck, FaUser, FaShield, FaStar, FaHeart, FaLocationDot, FaCalendarDays, FaUsers, FaTicket, FaClock, FaGift, FaPlay } from "react-icons/fa6";



const Payment = () => {
  const [username, setUsername] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [ticketSelections, setTicketSelections] = useState({});
  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    fullName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    billingAddress: '',
    cardholderName: '',
    saveCard: false,
    acceptTerms: false,
    agreeRefund: false
  });
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (!loggedInUser) {
      navigate("/buyticket");
    } else {
      setUsername(loggedInUser);
    }

    // Get selected event from localStorage
    const eventData = localStorage.getItem('selectedEvent');
    if (eventData) {
      const event = JSON.parse(eventData);
      setSelectedEvent(event);
      
      // Initialize ticket selections
      if (event.tickets && event.tickets.length > 0) {
        const initialSelections = {};
        event.tickets.forEach((ticket, index) => {
          initialSelections[index] = 0;
        });
        setTicketSelections(initialSelections);
      } else {
        // Fallback for events without tickets array
        setTicketSelections({ 0: 1 });
      }
    } else {
      // If no event selected, redirect to dashboard
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("selectedEvent");
    navigate("/buyticket");
  };

  const handleTicketQuantityChange = (ticketIndex, quantity) => {
    setTicketSelections(prev => ({
      ...prev,
      [ticketIndex]: Math.max(0, parseInt(quantity) || 0)
    }));
  };

  const getTotalTickets = () => {
    return Object.values(ticketSelections).reduce((sum, qty) => sum + qty, 0);
  };

  const getTotalPrice = () => {
    if (!selectedEvent) return 0;
    
    let total = 0;
    Object.entries(ticketSelections).forEach(([index, quantity]) => {
      if (selectedEvent.tickets && selectedEvent.tickets[index]) {
        total += selectedEvent.tickets[index].price * quantity;
      } else {
        // Fallback for events without tickets array
        total += selectedEvent.price * quantity;
      }
    });
    return total;
  };

  const getTicketSummary = () => {
    const summary = [];
    Object.entries(ticketSelections).forEach(([index, quantity]) => {
      if (quantity > 0) {
        if (selectedEvent.tickets && selectedEvent.tickets[index]) {
          const ticket = selectedEvent.tickets[index];
          summary.push({
            name: ticket.name,
            quantity,
            price: ticket.price,
            total: ticket.price * quantity
          });
        } else {
          // Fallback for events without tickets array
          summary.push({
            name: 'General Admission',
            quantity,
            price: selectedEvent.price,
            total: selectedEvent.price * quantity
          });
        }
      }
    });
    return summary;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    // Real-time validation
    validateField(name, newValue);
    
    // Format card number
    if (name === 'cardNumber') {
      const formatted = formatCardNumber(value);
      setFormData(prev => ({
        ...prev,
        [name]: formatted
      }));
    }
    
    // Format expiry date
    if (name === 'expiryDate') {
      const formatted = formatExpiryDate(value);
      setFormData(prev => ({
        ...prev,
        [name]: formatted
      }));
    }
    
    // Format phone number
    if (name === 'phone') {
      const formatted = formatPhoneNumber(value);
      setFormData(prev => ({
        ...prev,
        [name]: formatted
      }));
    }
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const formatPhoneNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (matches) {
      return `(${matches[1]}) ${matches[2]}-${matches[3]}`;
    }
    return v;
  };

  const validateField = (name, value) => {
    const errors = { ...formErrors };
    
    switch (name) {
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          errors.email = 'Please enter a valid email address';
        } else {
          delete errors.email;
        }
        break;
      case 'cardNumber':
        const cardRegex = /^[0-9\s]{13,19}$/;
        if (!cardRegex.test(value.replace(/\s/g, ''))) {
          errors.cardNumber = 'Please enter a valid card number';
        } else {
          delete errors.cardNumber;
        }
        break;
      case 'cvv':
        const cvvRegex = /^[0-9]{3,4}$/;
        if (!cvvRegex.test(value)) {
          errors.cvv = 'CVV must be 3-4 digits';
        } else {
          delete errors.cvv;
        }
        break;
      case 'expiryDate':
        const expiryRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
        if (!expiryRegex.test(value)) {
          errors.expiryDate = 'Please enter MM/YY format';
        } else {
          // Check if date is not in the past
          const [month, year] = value.split('/');
          const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1);
          const now = new Date();
          if (expiry < now) {
            errors.expiryDate = 'Card has expired';
          } else {
            delete errors.expiryDate;
          }
        }
        break;
      case 'phone':
        const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;
        if (!phoneRegex.test(value) && value.length > 0) {
          errors.phone = 'Please enter a valid phone number';
        } else {
          delete errors.phone;
        }
        break;
      default:
        break;
    }
    
    setFormErrors(errors);
  };

  const getCardType = (number) => {
    const cleanNumber = number.replace(/\s/g, '');
    if (/^4/.test(cleanNumber)) return 'Visa';
    if (/^5[1-5]/.test(cleanNumber)) return 'Mastercard';
    if (/^3[47]/.test(cleanNumber)) return 'American Express';
    if (/^6/.test(cleanNumber)) return 'Discover';
    return 'Unknown';
  };

  const isFormValid = () => {
    const requiredFields = ['fullName', 'email', 'phone'];
    if (paymentMethod === 'credit') {
      requiredFields.push('cardNumber', 'expiryDate', 'cvv', 'cardholderName', 'billingAddress');
    }
    
    return requiredFields.every(field => formData[field] && formData[field].trim() !== '') &&
           Object.keys(formErrors).length === 0 &&
           formData.acceptTerms &&
           formData.agreeRefund;
  };

  const handlePurchase = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const totalTickets = getTotalTickets();
      const ticketSummary = getTicketSummary();
      
      if (totalTickets === 0) {
        alert("Please select at least one ticket before proceeding.");
        setLoading(false);
        return;
      }

      const token = localStorage.getItem("accessToken");
      if (!token) {
        alert("Please log in to purchase tickets.");
        navigate("/login");
        return;
      }

      // Process payment method
      if (paymentMethod === 'paypal') {
        // Simulate PayPal redirect
        await new Promise(resolve => setTimeout(resolve, 1000));
        alert('Redirecting to PayPal...');
        await new Promise(resolve => setTimeout(resolve, 2000));
      } else {
        // Simulate credit card processing
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Make API calls for each ticket type selected
      const purchasePromises = [];
      ticketSummary.forEach(item => {
        const purchasePromise = fetch(`/api/buyticket/${selectedEvent.id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            ticketType: item.name,
            quantity: item.quantity
          })
        });
        purchasePromises.push(purchasePromise);
      });

      // Wait for all purchases to complete
      const responses = await Promise.all(purchasePromises);
      
      // Check if all purchases were successful
      const results = await Promise.all(
        responses.map(async (response, index) => {
          const data = await response.json();
          if (!response.ok) {
            throw new Error(`Failed to purchase ${ticketSummary[index].name}: ${data.message}`);
          }
          return data;
        })
      );

      console.log('All tickets purchased successfully:', results);
      
      // Clear selected event from localStorage
      localStorage.removeItem('selectedEvent');
      
      // Create success message with ticket breakdown
      const ticketText = totalTickets === 1 ? 'ticket' : 'tickets';
      let ticketBreakdown = '';
      ticketSummary.forEach(item => {
        ticketBreakdown += `\n• ${item.quantity}x ${item.name} @ $${item.price} = $${item.total}`;
      });
      
      const successMessage = `🎉 Purchase Successful!\n\n` +
        `${totalTickets} ${ticketText} for "${selectedEvent.title}" have been purchased successfully!\n` +
        `\nTicket Details:${ticketBreakdown}\n\n` +
        `📧 Confirmation email sent to: ${formData.email}\n` +
        `📱 SMS confirmation sent to: ${formData.phone}\n\n` +
        `Your tickets will be available in your account and sent via email shortly.\n\n` +
        `Total paid: $${getTotalPrice() + 2.99}`;
      
      alert(successMessage);
      navigate("/mytickets");
    } catch (error) {
      console.error("Error purchasing ticket:", error);
      alert(`❌ Payment Failed\n\n${error.message}\n\nPlease check your information and try again.\n\nIf the problem persists, please contact our support team.`);
    } finally {
      setLoading(false);
    }
  };

  if (!selectedEvent) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-2xl font-bold mb-4">No Event Selected</h2>
          <p className="mb-4">Please select an event to purchase tickets.</p>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-blue-900 flex flex-col relative overflow-hidden">
      {/* Enhanced Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        
        {/* Floating Orbs */}
        <div className="absolute top-1/4 left-1/3 w-4 h-4 bg-purple-400 rounded-full opacity-60 animate-float"></div>
        <div className="absolute top-2/3 right-1/4 w-3 h-3 bg-blue-400 rounded-full opacity-50 animate-float animation-delay-1000"></div>
        <div className="absolute bottom-1/3 left-1/5 w-2 h-2 bg-pink-400 rounded-full opacity-40 animate-float animation-delay-2000"></div>
        
        {/* Gradient Mesh */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-purple-900/5 to-transparent animate-pulse"></div>
      </div>

      {/* Navigation with enhanced styling */}
      <div className="relative z-20">

      </div>
      
      <main className="flex-1 py-8 relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Ultra Enhanced Back Button */}
          <button
            onClick={() => navigate("/dashboard")}
            className="mb-8 group flex items-center text-white hover:text-purple-300 transition-all duration-500 transform hover:scale-110 hover:-translate-x-3 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
            <div className="relative p-3 rounded-full bg-white/10 backdrop-blur-sm group-hover:bg-gradient-to-r group-hover:from-purple-500/30 group-hover:to-blue-500/30 transition-all duration-500 mr-4 group-hover:rotate-12">
              <FaArrowLeft className="text-lg transform group-hover:-translate-x-1 transition-transform duration-300" />
            </div>
            <span className="font-medium text-lg group-hover:font-semibold transition-all duration-300">Back to Dashboard</span>
            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-blue-400 group-hover:w-full transition-all duration-500"></div>
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Ultra Enhanced Event Details */}
            <div className="group perspective-1000">
              <div className="bg-white/10 dark:bg-gray-800/30 backdrop-blur-xl rounded-2xl p-8 text-white border border-white/20 shadow-2xl transform transition-all duration-700 hover:scale-105 hover:shadow-purple-500/30 hover:shadow-2xl hover:rotate-1 hover:border-purple-400/40 relative overflow-hidden">
                {/* Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
                
                {/* Event Badge with Enhanced Animation */}
                <div className="flex items-center justify-between mb-6 relative z-10">
                  <div className="flex items-center space-x-3">
                    <div className="relative p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-lg group-hover:shadow-purple-500/50 transition-all duration-500 hover:scale-110 hover:rotate-12">
                      <FaTicket className="text-white text-sm" />
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 group-hover:opacity-30 animate-ping"></div>
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-purple-300 block">Premium Event</span>
                      <span className="text-xs text-gray-400">Limited Seats Available</span>
                    </div>
                  </div>
                  <button className="p-3 rounded-full bg-white/10 hover:bg-red-500/20 transition-all duration-500 group/heart hover:scale-125">
                    <FaHeart className="text-gray-300 group-hover/heart:text-red-400 transition-all duration-300 group-hover/heart:animate-pulse" />
                  </button>
                </div>

                <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-white via-purple-300 to-pink-300 bg-clip-text text-transparent transform group-hover:scale-105 transition-transform duration-500">
                  Event Details
                </h2>
                
                {/* Ultra Enhanced Image with Multiple Effects */}
                <div className="relative mb-6 group/image overflow-hidden rounded-xl">
                  <img
                    src={selectedEvent.imageUrl}
                    alt={selectedEvent.title}
                    className="w-full h-64 object-cover transition-all duration-700 group-hover/image:scale-110 group-hover/image:brightness-110 filter group-hover/image:contrast-125"
                  />
                  {/* Multiple Overlay Effects */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-transparent to-blue-600/20 opacity-0 group-hover/image:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Animated Rating Badge */}
                  <div className="absolute top-4 right-4 transform transition-all duration-500 group-hover/image:scale-110 group-hover/image:-rotate-6">
                    <div className="flex items-center space-x-1 bg-yellow-500/90 backdrop-blur-sm px-3 py-2 rounded-full shadow-lg">
                      <FaStar className="text-yellow-100 text-sm animate-pulse" />
                      <span className="text-sm font-bold text-yellow-100">4.9</span>
                    </div>
                  </div>
                  
                  {/* Hover Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/image:opacity-100 transition-all duration-500">
                    <div className="p-4 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 hover:scale-125 transition-transform duration-300 cursor-pointer">
                      <FaPlay className="text-white text-xl ml-1" />
                    </div>
                  </div>
                </div>

                {/* Enhanced Event Info */}
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-purple-300 transition-colors duration-300">
                    {selectedEvent.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed mb-6">{selectedEvent.description}</p>
                  
                  {/* Event Details Grid */}
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-center space-x-3 p-3 rounded-lg bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
                      <div className="p-2 bg-blue-500/20 rounded-lg">
                        <FaCalendarDays className="text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Date & Time</p>
                        <p className="font-semibold text-white">{new Date(selectedEvent.date).toLocaleString()}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-3 rounded-lg bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
                      <div className="p-2 bg-green-500/20 rounded-lg">
                        <FaLocationDot className="text-green-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Location</p>
                        <p className="font-semibold text-white">{selectedEvent.location}</p>
                        <p className="text-sm text-gray-300">{selectedEvent.district}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-3 rounded-lg bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
                      <div className="p-2 bg-purple-500/20 rounded-lg">
                        <FaUsers className="text-purple-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Event Type</p>
                        <p className="font-semibold text-white capitalize">{selectedEvent.type}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-4 rounded-xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30">
                      <div className="p-2 bg-green-500/30 rounded-lg">
                        <FaGift className="text-green-300" />
                      </div>
                      <div>
                        <p className="text-sm text-green-300">Starting Price</p>
                        <p className="text-2xl font-bold text-green-400">${selectedEvent.price}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Purchase Form */}
            <div className="group">
              <div className="bg-white/10 dark:bg-gray-800/30 backdrop-blur-xl rounded-2xl p-8 text-white border border-white/20 shadow-2xl transform transition-all duration-500 hover:shadow-purple-500/25">
                {/* Enhanced Progress Steps */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent">
                      Secure Checkout
                    </h2>
                    <div className="flex items-center space-x-2 text-sm bg-green-500/20 px-4 py-2 rounded-full border border-green-500/30">
                      <FaLock className="text-green-400 animate-pulse" />
                      <span className="text-green-300 font-medium">SSL Protected</span>
                    </div>
                  </div>
                  
                  {/* Enhanced Step Progress */}
                  <div className="relative">
                    <div className="flex items-center justify-between mb-8">
                      {/* Step 1 */}
                      <div className={`relative flex flex-col items-center transition-all duration-500 ${currentStep >= 1 ? 'scale-110' : 'scale-100'}`}>
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
                          currentStep >= 1 
                            ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-black shadow-lg shadow-green-500/50' 
                            : 'bg-gray-600'
                        }`}>
                          {currentStep > 1 ? <FaCheck className="text-lg" /> : '1'}
                        </div>
                        <span className={`text-xs mt-2 font-medium transition-colors duration-300 ${
                          currentStep >= 1 ? 'text-green-400' : 'text-gray-400'
                        }`}>
                          Contact Info
                        </span>
                        {currentStep === 1 && (
                          <div className="absolute -bottom-8 w-20 h-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse"></div>
                        )}
                      </div>

                      {/* Connection Line */}
                      <div className={`flex-1 h-1 mx-4 rounded-full transition-all duration-500 ${
                        currentStep >= 2 ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-gray-600'
                      }`}></div>

                      {/* Step 2 */}
                      <div className={`relative flex flex-col items-center transition-all duration-500 ${currentStep >= 2 ? 'scale-110' : 'scale-100'}`}>
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
                          currentStep >= 2 
                            ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-black shadow-lg shadow-green-500/50' 
                            : 'bg-gray-600'
                        }`}>
                          {currentStep > 2 ? <FaCheck className="text-lg" /> : '2'}
                        </div>
                        <span className={`text-xs mt-2 font-medium transition-colors duration-300 ${
                          currentStep >= 2 ? 'text-green-400' : 'text-gray-400'
                        }`}>
                          Payment
                        </span>
                        {currentStep === 2 && (
                          <div className="absolute -bottom-8 w-20 h-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse"></div>
                        )}
                      </div>

                      {/* Connection Line */}
                      <div className={`flex-1 h-1 mx-4 rounded-full transition-all duration-500 ${
                        currentStep >= 3 ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-gray-600'
                      }`}></div>

                      {/* Step 3 */}
                      <div className={`relative flex flex-col items-center transition-all duration-500 ${currentStep >= 3 ? 'scale-110' : 'scale-100'}`}>
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
                          currentStep >= 3 
                            ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-black shadow-lg shadow-green-500/50' 
                            : 'bg-gray-600'
                        }`}>
                          {currentStep > 3 ? <FaCheck className="text-lg" /> : '3'}
                        </div>
                        <span className={`text-xs mt-2 font-medium transition-colors duration-300 ${
                          currentStep >= 3 ? 'text-green-400' : 'text-gray-400'
                        }`}>
                          Review
                        </span>
                        {currentStep === 3 && (
                          <div className="absolute -bottom-8 w-20 h-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse"></div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              
              <form onSubmit={handlePurchase} className="space-y-6">
                {/* Step 1: Contact Information */}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                    
                    {/* Ticket Selection */}
                    <div>
                      <label className="block text-sm font-medium mb-3">Select Tickets</label>
                      {selectedEvent.tickets && selectedEvent.tickets.length > 0 ? (
                        <div className="space-y-4">
                          {selectedEvent.tickets.map((ticket, index) => (
                            <div key={index} className="bg-gray-800/50 p-4 rounded-lg border border-gray-600">
                              <div className="flex items-center justify-between mb-2">
                                <div>
                                  <h4 className="font-semibold text-lg">{ticket.name}</h4>
                                  <p className="text-green-400 font-bold">${ticket.price}</p>
                                  <p className="text-sm text-gray-400">
                                    Available: {ticket.quantity - ticket.sold} / {ticket.quantity}
                                  </p>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <button
                                    type="button"
                                    onClick={() => handleTicketQuantityChange(index, (ticketSelections[index] || 0) - 1)}
                                    disabled={(ticketSelections[index] || 0) <= 0}
                                    className="w-8 h-8 rounded-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold flex items-center justify-center transition-colors"
                                  >
                                    -
                                  </button>
                                  <span className="w-12 text-center font-semibold">
                                    {ticketSelections[index] || 0}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleTicketQuantityChange(index, (ticketSelections[index] || 0) + 1)}
                                    disabled={(ticketSelections[index] || 0) >= (ticket.quantity - ticket.sold)}
                                    className="w-8 h-8 rounded-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold flex items-center justify-center transition-colors"
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                              {(ticketSelections[index] || 0) > 0 && (
                                <div className="text-right text-sm">
                                  <span className="text-gray-400">Subtotal: </span>
                                  <span className="text-green-400 font-semibold">
                                    ${ticket.price * (ticketSelections[index] || 0)}
                                  </span>
                                </div>
                              )}
                            </div>
                          ))}
                          
                          {/* Total Summary */}
                          {getTotalTickets() > 0 && (
                            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                              <div className="flex justify-between items-center">
                                <span className="font-semibold">Total Tickets: {getTotalTickets()}</span>
                                <span className="text-xl font-bold text-green-400">${getTotalPrice()}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        // Fallback for events without tickets array
                        <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-600">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h4 className="font-semibold text-lg">General Admission</h4>
                              <p className="text-green-400 font-bold">${selectedEvent.price}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button
                                type="button"
                                onClick={() => handleTicketQuantityChange(0, (ticketSelections[0] || 0) - 1)}
                                disabled={(ticketSelections[0] || 0) <= 0}
                                className="w-8 h-8 rounded-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold flex items-center justify-center transition-colors"
                              >
                                -
                              </button>
                              <span className="w-12 text-center font-semibold">
                                {ticketSelections[0] || 0}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleTicketQuantityChange(0, (ticketSelections[0] || 0) + 1)}
                                disabled={(ticketSelections[0] || 0) >= 10}
                                className="w-8 h-8 rounded-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold flex items-center justify-center transition-colors"
                              >
                                +
                              </button>
                            </div>
                          </div>
                          {(ticketSelections[0] || 0) > 0 && (
                            <div className="text-right text-sm">
                              <span className="text-gray-400">Subtotal: </span>
                              <span className="text-green-400 font-semibold">
                                ${selectedEvent.price * (ticketSelections[0] || 0)}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Full Name *</label>
                        <input
                          type="text"
                          name="fullName"
                          required
                          value={formData.fullName}
                          onChange={handleInputChange}
                          className="w-full p-3 rounded-lg bg-gray-800 border border-gray-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Email Address *</label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`w-full p-3 rounded-lg bg-gray-800 border text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${
                            formErrors.email ? 'border-red-500' : 'border-gray-600'
                          }`}
                          placeholder="Enter your email"
                        />
                        {formErrors.email && (
                          <p className="text-red-400 text-xs mt-1 flex items-center">
                            <FaTriangleExclamation className="mr-1" />
                            {formErrors.email}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Phone Number *</label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        maxLength="14"
                        className={`w-full p-3 rounded-lg bg-gray-800 border text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${
                          formErrors.phone ? 'border-red-500' : 'border-gray-600'
                        }`}
                        placeholder="(123) 456-7890"
                      />
                      {formErrors.phone && (
                        <p className="text-red-400 text-xs mt-1 flex items-center">
                          <FaTriangleExclamation className="mr-1" />
                          {formErrors.phone}
                        </p>
                      )}
                      {formData.phone && !formErrors.phone && formData.phone.length === 14 && (
                        <p className="text-green-400 text-xs mt-1 flex items-center">
                          <FaCircleCheck className="mr-1" />
                          Valid phone number
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      disabled={!formData.fullName || !formData.email || !formData.phone || formErrors.email || formErrors.phone || getTotalTickets() === 0}
                      className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
                    >
                      Continue to Payment {getTotalTickets() > 0 && `(${getTotalTickets()} tickets)`}
                    </button>
                  </div>
                )}

                {/* Step 2: Payment Information */}
                {currentStep === 2 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Payment Information</h3>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        className="text-blue-400 hover:text-blue-300 text-sm"
                      >
                        ← Back to Contact Info
                      </button>
                    </div>

                    {/* Payment Method Selection */}
                    <div>
                      <label className="block text-sm font-medium mb-3">Payment Method</label>
                      <div className="grid grid-cols-2 gap-4">
                        <label className={`flex items-center p-4 rounded-lg border cursor-pointer transition-colors ${
                          paymentMethod === 'credit' ? 'border-blue-500 bg-blue-900/20' : 'border-gray-600 hover:border-gray-500'
                        }`}>
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="credit"
                            checked={paymentMethod === 'credit'}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="mr-3"
                          />
                          <FaCreditCard className="mr-2 text-xl" />
                          <span>Credit/Debit Card</span>
                        </label>
                        <label className={`flex items-center p-4 rounded-lg border cursor-pointer transition-colors ${
                          paymentMethod === 'paypal' ? 'border-blue-500 bg-blue-900/20' : 'border-gray-600 hover:border-gray-500'
                        }`}>
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="paypal"
                            checked={paymentMethod === 'paypal'}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="mr-3"
                          />
                          <FaPaypal className="mr-2 text-xl text-blue-400" />
                          <span>PayPal</span>
                        </label>
                      </div>
                    </div>

                    {/* Credit Card Form */}
                    {paymentMethod === 'credit' && (
                      <div className="space-y-4">
                        <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                          <div className="flex items-center mb-2">
                            <FaCircleInfo className="text-blue-400 mr-2" />
                            <span className="text-sm font-medium">Card Information</span>
                          </div>
                          <p className="text-xs text-gray-300">
                            Your payment information is encrypted and secure. We never store your card details.
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Cardholder Name *</label>
                          <input
                            type="text"
                            name="cardholderName"
                            required
                            value={formData.cardholderName}
                            onChange={handleInputChange}
                            className="w-full p-3 rounded-lg bg-gray-800 border border-gray-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            placeholder="Name on card"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Card Number *</label>
                          <div className="relative">
                            <input
                              type="text"
                              name="cardNumber"
                              required
                              value={formData.cardNumber}
                              onChange={handleInputChange}
                              maxLength="19"
                              className={`w-full p-3 pl-12 rounded-lg bg-gray-800 border text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${
                                formErrors.cardNumber ? 'border-red-500' : 'border-gray-600'
                              }`}
                              placeholder="1234 5678 9012 3456"
                            />
                            <FaCreditCard className="absolute left-3 top-3 text-gray-400" />
                            {formData.cardNumber && getCardType(formData.cardNumber) !== 'Unknown' && (
                              <div className="absolute right-3 top-3 text-sm text-green-400 flex items-center">
                                <FaCircleCheck className="mr-1" />
                                {getCardType(formData.cardNumber)}
                              </div>
                            )}
                          </div>
                          {formErrors.cardNumber && (
                            <p className="text-red-400 text-xs mt-1 flex items-center">
                              <FaTriangleExclamation className="mr-1" />
                              {formErrors.cardNumber}
                            </p>
                          )}
                          {formData.cardNumber && !formErrors.cardNumber && formData.cardNumber.length >= 13 && (
                            <p className="text-green-400 text-xs mt-1 flex items-center">
                              <FaCircleCheck className="mr-1" />
                              Valid card number
                            </p>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">Expiry Date *</label>
                            <input
                              type="text"
                              name="expiryDate"
                              required
                              value={formData.expiryDate}
                              onChange={handleInputChange}
                              maxLength="5"
                              className={`w-full p-3 rounded-lg bg-gray-800 border text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${
                                formErrors.expiryDate ? 'border-red-500' : 'border-gray-600'
                              }`}
                              placeholder="MM/YY"
                            />
                            {formErrors.expiryDate && (
                              <p className="text-red-400 text-xs mt-1 flex items-center">
                                <FaTriangleExclamation className="mr-1" />
                                {formErrors.expiryDate}
                              </p>
                            )}
                            {formData.expiryDate && !formErrors.expiryDate && formData.expiryDate.length === 5 && (
                              <p className="text-green-400 text-xs mt-1 flex items-center">
                                <FaCircleCheck className="mr-1" />
                                Valid expiry date
                              </p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">CVV *</label>
                            <div className="relative">
                              <input
                                type="text"
                                name="cvv"
                                required
                                value={formData.cvv}
                                onChange={handleInputChange}
                                maxLength="4"
                                className={`w-full p-3 rounded-lg bg-gray-800 border text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${
                                  formErrors.cvv ? 'border-red-500' : 'border-gray-600'
                                }`}
                                placeholder="123"
                              />
                              <div className="absolute right-3 top-3">
                                <FaCircleInfo className="text-gray-400 text-sm" title="3-digit code on back of card (4 digits for Amex)" />
                              </div>
                            </div>
                            {formErrors.cvv && (
                              <p className="text-red-400 text-xs mt-1 flex items-center">
                                <FaTriangleExclamation className="mr-1" />
                                {formErrors.cvv}
                              </p>
                            )}
                            {formData.cvv && !formErrors.cvv && (formData.cvv.length === 3 || formData.cvv.length === 4) && (
                              <p className="text-green-400 text-xs mt-1 flex items-center">
                                <FaCircleCheck className="mr-1" />
                                Valid CVV
                              </p>
                            )}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Billing Address *</label>
                          <textarea
                            name="billingAddress"
                            required
                            value={formData.billingAddress}
                            onChange={handleInputChange}
                            rows="3"
                            className="w-full p-3 rounded-lg bg-gray-800 border border-gray-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            placeholder="Enter your billing address"
                          />
                        </div>

                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            name="saveCard"
                            checked={formData.saveCard}
                            onChange={handleInputChange}
                            className="rounded border-gray-600 bg-gray-800 text-blue-600 focus:ring-blue-500"
                          />
                          <label className="text-sm text-gray-300">
                            Save card for future purchases (optional)
                          </label>
                        </div>
                      </div>
                    )}

                    {/* PayPal Form */}
                    {paymentMethod === 'paypal' && (
                      <div className="space-y-4">
                        <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-6 text-center">
                          <FaPaypal className="text-4xl text-blue-400 mx-auto mb-4" />
                          <h4 className="text-lg font-semibold mb-2">PayPal Checkout</h4>
                          <p className="text-sm text-gray-300 mb-4">
                            You will be redirected to PayPal to complete your payment securely.
                          </p>
                          <div className="text-xs text-gray-400 space-y-1">
                            <p>• Pay with your PayPal balance, bank account, or linked cards</p>
                            <p>• No need to enter card details here</p>
                            <p>• Your payment is protected by PayPal's Buyer Protection</p>
                          </div>
                        </div>
                        
                        <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
                          <div className="flex items-center mb-2">
                            <FaCircleInfo className="text-yellow-400 mr-2" />
                            <span className="text-sm font-medium">Important Notice</span>
                          </div>
                          <p className="text-xs text-gray-300">
                            After clicking "Continue to Review", you'll proceed to PayPal's secure checkout where you can log in and confirm your payment.
                          </p>
                        </div>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => setCurrentStep(3)}
                      disabled={paymentMethod === 'credit' && (!formData.cardNumber || !formData.expiryDate || !formData.cvv || !formData.cardholderName || !formData.billingAddress || Object.keys(formErrors).length > 0)}
                      className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
                    >
                      Continue to Review
                    </button>
                  </div>
                )}

                {/* Step 3: Review and Terms */}
                {currentStep === 3 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Review Your Order</h3>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(2)}
                        className="text-blue-400 hover:text-blue-300 text-sm"
                      >
                        ← Back to Payment
                      </button>
                    </div>

                    {/* Contact Information Summary */}
                    <div className="bg-gray-800/50 p-4 rounded-lg mb-4">
                      <h4 className="font-semibold mb-2 flex items-center">
                        <FaUser className="mr-2 text-blue-400" />
                        Contact Information
                      </h4>
                      <div className="text-sm space-y-1">
                        <p><strong>Name:</strong> {formData.fullName}</p>
                        <p><strong>Email:</strong> {formData.email}</p>
                        <p><strong>Phone:</strong> {formData.phone}</p>
                      </div>
                    </div>

                    {/* Payment Information Summary */}
                    <div className="bg-gray-800/50 p-4 rounded-lg mb-4">
                      <h4 className="font-semibold mb-2 flex items-center">
                        <FaCreditCard className="mr-2 text-green-400" />
                        Payment Method
                      </h4>
                      <div className="text-sm">
                        {paymentMethod === 'credit' ? (
                          <div className="space-y-1">
                            <p><strong>Method:</strong> Credit/Debit Card</p>
                            <p><strong>Card:</strong> **** **** **** {formData.cardNumber.slice(-4)}</p>
                            <p><strong>Card Type:</strong> {getCardType(formData.cardNumber)}</p>
                          </div>
                        ) : (
                          <p><strong>Method:</strong> PayPal</p>
                        )}
                      </div>
                    </div>

                    {/* Order Summary */}
                    <div className="bg-gray-800/50 p-4 rounded-lg mb-4">
                      <h4 className="font-semibold mb-2 flex items-center">
                        <FaCircleCheck className="mr-2 text-green-400" />
                        Order Summary
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Event: {selectedEvent.title}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Date: {new Date(selectedEvent.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Location: {selectedEvent.location}</span>
                        </div>
                        
                        {/* Ticket breakdown */}
                        {getTicketSummary().map((item, index) => (
                          <div key={index} className="flex justify-between">
                            <span>{item.name} ({item.quantity}x @ ${item.price})</span>
                            <span>${item.total}</span>
                          </div>
                        ))}
                        
                        <div className="flex justify-between">
                          <span>Service Fee</span>
                          <span>$2.99</span>
                        </div>
                        <div className="border-t border-gray-600 pt-2 mt-2">
                          <div className="flex justify-between font-bold">
                            <span>Total Amount</span>
                            <span className="text-green-400">${getTotalPrice() + 2.99}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Security Notice */}
                    <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4 mb-4">
                      <div className="flex items-center mb-2">
                        <FaShield className="text-green-400 mr-2" />
                        <span className="text-sm font-medium">Secure Transaction</span>
                      </div>
                      <p className="text-xs text-gray-300">
                        Your payment is protected by 256-bit SSL encryption and our secure payment partners.
                      </p>
                    </div>

                    {/* Terms and Conditions */}
                    <div className="space-y-3">
                      <div className="flex items-start space-x-2">
                        <input
                          type="checkbox"
                          name="acceptTerms"
                          checked={formData.acceptTerms}
                          onChange={handleInputChange}
                          className="mt-1 rounded border-gray-600 bg-gray-800 text-blue-600 focus:ring-blue-500"
                          required
                        />
                        <label className="text-sm text-gray-300">
                          I agree to the{' '}
                          <a href="/terms" className="text-blue-400 hover:text-blue-300 underline" target="_blank">
                            Terms and Conditions
                          </a>{' '}
                          and{' '}
                          <a href="/privacy" className="text-blue-400 hover:text-blue-300 underline" target="_blank">
                            Privacy Policy
                          </a>
                        </label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <input
                          type="checkbox"
                          name="agreeRefund"
                          checked={formData.agreeRefund}
                          onChange={handleInputChange}
                          className="mt-1 rounded border-gray-600 bg-gray-800 text-blue-600 focus:ring-blue-500"
                          required
                        />
                        <label className="text-sm text-gray-300">
                          I understand the{' '}
                          <a href="/refund-policy" className="text-blue-400 hover:text-blue-300 underline" target="_blank">
                            Refund Policy
                          </a>{' '}
                          and cancellation terms for this event
                        </label>
                      </div>
                    </div>

                    {/* Purchase Button */}
                    <button
                      type="submit"
                      disabled={loading || !formData.acceptTerms || !formData.agreeRefund || !isFormValid() || getTotalTickets() === 0}
                      className="w-full py-3 px-6 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center justify-center"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Processing Payment...
                        </>
                      ) : (
                        <>
                          <FaLock className="mr-2" />
                          Complete Purchase - ${getTotalPrice() + 2.99}
                        </>
                      )}
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Payment;
