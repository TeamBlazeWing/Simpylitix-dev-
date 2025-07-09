import { FaRss, FaCheck } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import "./styles.css";

const SubscriptionDropdown = ({
  subscriptionRef,
  isSubscriptionOpen,
  setIsSubscriptionOpen,
  subscriptionStatus,
  subscriptionLoading,
  otpModalOpen,
  setOtpModalOpen,
  otpData,
  setOtpData,
  otpInput,
  setOtpInput,
  otpLoading,
  setOtpLoading,
  otpError,
  setOtpError,
  userPhoneNumber,
  setUserPhoneNumber,
  getSubscriptionStatus,
  handleSubscriptionToggle,
  closeOTPModal,
  verifyOTP,
}) => {
  return (
    <div className="relative" ref={subscriptionRef}>
      <button
        onClick={() => {
          setIsSubscriptionOpen(!isSubscriptionOpen);
          if (!isSubscriptionOpen) {
            getSubscriptionStatus();
          }
        }}
        className={`text-white text-xl hover:text-purple-300 p-3 rounded-full hover:bg-white/10 transition-all duration-300 transform hover:scale-110 active:scale-95 relative ${
          subscriptionStatus && !subscriptionStatus.isActive
            ? "animate-pulse shadow-lg shadow-orange-500/50 ring-2 ring-orange-400/30 bg-orange-500/10"
            : ""
        }`}
      >
        <FaRss className={`transition-transform duration-300 ${subscriptionStatus && !subscriptionStatus.isActive ? "animate-bounce text-orange-400" : ""}`} />
        {subscriptionStatus?.isActive ? (
          <span className="absolute -top-1 -right-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold animate-pulse shadow-lg">
            ✓
          </span>
        ) : subscriptionStatus && !subscriptionStatus.isActive ? (
          <span className="absolute -top-1 -right-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold animate-ping shadow-lg">
            !
          </span>
        ) : null}
        {subscriptionStatus && !subscriptionStatus.isActive && (
          <div className="absolute inset-0 rounded-full border-2 border-orange-400/50 animate-ping"></div>
        )}
      </button>
      {isSubscriptionOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-black/95 backdrop-blur-xl rounded-xl shadow-2xl border border-purple-500/30 z-[9999] animate-in slide-in-from-top-2 duration-300">
          <div className="p-4 border-b border-gray-600/50">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-semibold">Subscription Service</h3>
              {subscriptionLoading && (
                <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
              )}
            </div>
            {subscriptionStatus && !subscriptionStatus.isActive && (
              <div className="mt-2 text-orange-400 text-xs font-medium animate-pulse">Get Subcription to continue your service</div>
            )}
          </div>
          <div className="p-6">
            {subscriptionLoading ? (
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-gray-400 text-sm">Checking subscription status...</p>
              </div>
            ) : subscriptionStatus ? (
              <div className="space-y-4">
                <div className={`p-4 rounded-lg border ${subscriptionStatus.isActive ? "bg-green-500/20 border-green-500/30" : "bg-red-500/20 border-red-500/30"}`}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-3 h-3 rounded-full ${subscriptionStatus.isActive ? "bg-green-500 animate-pulse" : "bg-red-500"}`}></div>
                    <h4 className="text-white font-medium">Status: {subscriptionStatus.isActive ? "Active" : "Inactive"}</h4>
                  </div>
                  <p className="text-gray-300 text-sm">{subscriptionStatus.message || "Subscription service status"}</p>
                </div>
                <div className="space-y-2">
                  <button
                    onClick={handleSubscriptionToggle}
                    disabled={subscriptionLoading || otpLoading}
                    className={`w-full py-2 px-4 rounded-lg font-medium transition-all duration-300 ${
                      subscriptionLoading || otpLoading
                        ? "bg-gray-600/20 text-gray-400 cursor-not-allowed"
                        : subscriptionStatus.isActive
                        ? "bg-red-600/20 text-red-400 hover:bg-red-600/30 border border-red-500/30"
                        : "bg-gradient-to-r from-green-600/30 to-emerald-600/30 text-green-400 hover:from-green-600/40 hover:to-emerald-600/40 border border-green-500/30 transform hover:scale-105 animate-pulse shadow-lg shadow-green-500/25"
                    }`}
                  >
                    {subscriptionLoading || otpLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                        {otpLoading ? "Sending OTP..." : "Updating..."}
                      </div>
                    ) : subscriptionStatus.isActive ? (
                      "Unsubscribe"
                    ) : (
                      "Subscribe Now"
                    )}
                  </button>
                  <button
                    onClick={() => getSubscriptionStatus()}
                    className="w-full py-2 px-4 rounded-lg font-medium bg-purple-600/20 text-purple-400 hover:bg-purple-600/30 border border-purple-500/30 transition-all duration-300"
                  >
                    Refresh Status
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <FaRss className="text-4xl text-gray-500 mx-auto mb-3" />
                <p className="text-gray-400 text-sm mb-4">Unable to load subscription status</p>
                <button
                  onClick={() => getSubscriptionStatus()}
                  className="py-2 px-4 rounded-lg font-medium bg-purple-600/20 text-purple-400 hover:bg-purple-600/30 border border-purple-500/30 transition-all duration-300"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      {otpModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Verify Your Phone Number</h3>
              <button onClick={closeOTPModal} className="text-gray-500 hover:text-gray-700">
                <IoClose size={24} />
              </button>
            </div>
            <div className="mb-4">
              <p className="text-gray-600 mb-2">We've sent a verification code to your phone number ending in {userPhoneNumber.slice(-4)}</p>
              <p className="text-sm text-gray-500">Please enter the 6-digit code to confirm your subscription to event notifications.</p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Verification Code</label>
              <input
                type="text"
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value)}
                placeholder="Enter 6-digit code"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                maxLength="6"
                disabled={otpLoading}
              />
            </div>
            {otpError && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{otpError}</div>
            )}
            <div className="flex gap-3">
              <button
                onClick={verifyOTP}
                disabled={otpLoading || !otpInput.trim()}
                className={`flex-1 py-2 px-4 rounded-md font-medium transition-all duration-300 ${
                  otpLoading || !otpInput.trim() ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {otpLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                    Verifying...
                  </div>
                ) : (
                  "Verify & Subscribe"
                )}
              </button>
              <button
                onClick={closeOTPModal}
                className="flex-1 py-2 px-4 rounded-md font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all duration-300"
                disabled={otpLoading}
              >
                Cancel
              </button>
            </div>
            <div className="mt-4 text-center">
              <button
                onClick={requestOTP}
                disabled={otpLoading}
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                Didn't receive the code? Resend
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionDropdown;