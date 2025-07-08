import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaLock } from "react-icons/fa6";
import Navbar from "../components/Payment components/Navbar";
import EventDetails from "../components/Payment components/EventDetails";
import StepProgress from "../components/Payment components/StepProgress";
import ContactInfoStep from "../components/Payment components/ContactInfoStep";
import PaymentInfoStep from "../components/Payment components/PaymentInfoStep";
import ReviewStep from "../components/Payment components/ReviewStep";
import { usePaymentForm } from "../hooks/usePaymentForm";

const Payment = () => {
  const [username, setUsername] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [ticketSelections, setTicketSelections] = useState({});
  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();

  const {
    formData,
    formErrors,
    handleInputChange,
    getCardType,
    isFormValid,
    handlePurchase
  } = usePaymentForm(selectedEvent);

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

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const success = await handlePurchase(
      paymentMethod, 
      getTicketSummary(), 
      getTotalTickets, 
      getTotalPrice
    );

    setLoading(false);
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
    <div className="min-h-screen bg-gray-50 dark:bg-black flex flex-col">
      <Navbar username={username} onLogout={handleLogout} />
      
      <main className="flex-1 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <button
            onClick={() => navigate("/dashboard")}
            className="mb-6 flex items-center text-white hover:text-gray-300 transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            Back to Dashboard
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Event Details */}
            <EventDetails selectedEvent={selectedEvent} />

            {/* Purchase Form */}
            <div className="bg-white/10 dark:bg-gray-800/30 backdrop-blur-lg rounded-lg p-6 text-white">
              {/* Progress Steps */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold">Purchase Tickets</h2>
                  <div className="flex items-center space-x-2 text-sm">
                    <FaLock className="text-green-400" />
                    <span>Secure Checkout</span>
                  </div>
                </div>
                
                <StepProgress currentStep={currentStep} />
              </div>
              
              <form onSubmit={onSubmit} className="space-y-6">
                {/* Step 1: Contact Information */}
                {currentStep === 1 && (
                  <ContactInfoStep
                    formData={formData}
                    formErrors={formErrors}
                    selectedEvent={selectedEvent}
                    ticketSelections={ticketSelections}
                    onInputChange={handleInputChange}
                    onTicketQuantityChange={handleTicketQuantityChange}
                    onNextStep={() => setCurrentStep(2)}
                    getTotalTickets={getTotalTickets}
                  />
                )}

                {/* Step 2: Payment Information */}
                {currentStep === 2 && (
                  <PaymentInfoStep
                    formData={formData}
                    formErrors={formErrors}
                    paymentMethod={paymentMethod}
                    onInputChange={handleInputChange}
                    onPaymentMethodChange={setPaymentMethod}
                    onNextStep={() => setCurrentStep(3)}
                    onPrevStep={() => setCurrentStep(1)}
                    getCardType={getCardType}
                  />
                )}

                {/* Step 3: Review and Terms */}
                {currentStep === 3 && (
                  <ReviewStep
                    formData={formData}
                    selectedEvent={selectedEvent}
                    paymentMethod={paymentMethod}
                    getCardType={getCardType}
                    getTicketSummary={getTicketSummary}
                    getTotalPrice={getTotalPrice}
                    loading={loading}
                    onInputChange={handleInputChange}
                    onPrevStep={() => setCurrentStep(2)}
                    isFormValid={() => isFormValid(paymentMethod)}
                    getTotalTickets={getTotalTickets}
                  />
                )}
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Payment;
