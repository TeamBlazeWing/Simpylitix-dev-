import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa6";
import usePaymentData from "../hooks/usePaymentData";
import useAuth from "../hooks/useAuth";
import EventDetails from "../components/Payment/EventDetails";
import PaymentForm from "../components/Payment/PaymentForm";

const Payment = () => {
  const navigate = useNavigate();
  const { 
    selectedEvent, 
    ticketSelections, 
    handleTicketQuantityChange, 
    getTotalTickets, 
    getTotalPrice, 
    getTicketSummary,
    currentStep, 
    setCurrentStep, 
    formData, 
    handleInputChange, 
    formErrors, 
    paymentMethod, 
    setPaymentMethod, 
    loading, 
    handlePurchase 
  } = usePaymentData();
  
  const { username, handleLogout } = useAuth();

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
        <button
          onClick={() => navigate("/dashboard")}
          className="mb-8 group flex items-center text-white hover:text-purple-300 transition-all duration-500 transform hover:scale-110 hover:-translate-x-3 relative mx-4 sm:mx-6 lg:mx-8 mt-8"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
          <div className="relative p-3 rounded-full bg-white/10 backdrop-blur-sm group-hover:bg-gradient-to-r group-hover:from-purple-500/30 group-hover:to-blue-500/30 transition-all duration-500 mr-4 group-hover:rotate-12">
            <FaArrowLeft className="text-lg transform group-hover:-translate-x-1 transition-transform duration-300" />
          </div>
          <span className="font-medium text-lg group-hover:font-semibold transition-all duration-300">Back to Dashboard</span>
          <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-blue-400 group-hover:w-full transition-all duration-500"></div>
        </button>
      </div>
      
      <main className="flex-1 py-8 relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <EventDetails event={selectedEvent} />
            <PaymentForm 
              selectedEvent={selectedEvent}
              ticketSelections={ticketSelections}
              handleTicketQuantityChange={handleTicketQuantityChange}
              getTotalTickets={getTotalTickets}
              getTotalPrice={getTotalPrice}
              getTicketSummary={getTicketSummary}
              currentStep={currentStep}
              setCurrentStep={setCurrentStep}
              formData={formData}
              handleInputChange={handleInputChange}
              formErrors={formErrors}
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
              loading={loading}
              handlePurchase={handlePurchase}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Payment;