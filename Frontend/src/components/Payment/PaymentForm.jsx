import { 
  FaLock, 
  FaCheck, 
  FaCreditCard, 
  FaPaypal, 
  FaCircleInfo, 
  FaTriangleExclamation, 
  FaCircleCheck, 
  FaUser, 
  FaShield 
} from "react-icons/fa6";
import { getCardType } from "../../utils/paymentUtils";

const PaymentForm = ({
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
  handlePurchase,
  isFormValid = () => true 
}) => {
  return (
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
                              Available: {ticket.availableQuantity || ticket.quantity - (ticket.soldQuantity || ticket.sold || 0)} / {ticket.totalQuantity || ticket.quantity}
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
                              disabled={(ticketSelections[index] || 0) >= (ticket.availableQuantity || ticket.quantity - (ticket.soldQuantity || ticket.sold || 0))}
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
                  
                  {getTicketSummary().map((item, index) => (
                    <div key={index} className="flex justify-between">
                      <span>{item.type} ({item.quantity}x @ ${item.price})</span>
                      <span>${item.price * item.quantity}</span>
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
  );
};

export default PaymentForm;