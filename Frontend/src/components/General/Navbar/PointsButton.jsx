import React from 'react';
import { FaPlusCircle, FaTimes, FaBolt } from 'react-icons/fa';

const PointsButton = ({ userPoints, setUserPoints, isPointsPopupOpen, setIsPointsPopupOpen }) => {
  const isZeroPoints = userPoints === 0;

  return (
    <div className="relative inline-block select-none">
      {/* Main Button */}
      <span
        className={`flex items-center gap-2 text-white font-bold px-5 py-2 rounded-full shadow-lg backdrop-blur-sm border border-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
          isZeroPoints
            ? 'bg-gradient-to-r from-red-600/90 via-red-500/90 to-red-600/90 hover:shadow-red-500/40 animate-pulse'
            : 'bg-gradient-to-r from-purple-600/90 via-blue-600/90 to-emerald-600/90 hover:shadow-purple-500/25'
        }`}
        onClick={() => setIsPointsPopupOpen((prev) => !prev)}
        title={isZeroPoints ? 'No points available! Add points now.' : `${userPoints} points available`}
      >
        {/* Coin Icon */}
        <span
          className={`flex items-center justify-center w-7 h-7 rounded-full shadow-md border ${
            isZeroPoints
              ? 'bg-gradient-to-br from-red-400/90 via-red-500/90 to-red-600/90 border-red-300/50'
              : 'bg-gradient-to-br from-yellow-400/90 via-yellow-500/90 to-yellow-600/90 border-yellow-300/50'
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 ${isZeroPoints ? 'text-red-900' : 'text-yellow-900'}`}
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <circle cx="12" cy="12" r="10" fill={isZeroPoints ? '#FCA5A5' : '#FDE047'} stroke={isZeroPoints ? '#EF4444' : '#FACC15'} strokeWidth="2" />
            <text x="12" y="16" textAnchor="middle" fontSize="10" fill="#92400E" fontWeight="bold">
              ₵
            </text>
          </svg>
        </span>
        {/* Points Display with Lightning Bolt for Zero Points */}
        <span className="flex items-center gap-1 tracking-wide text-lg drop-shadow-md">
          {isZeroPoints && <FaBolt className="h-4 w-4 text-red-400 animate-pulse" />}
          {userPoints}
        </span>
        {/* Plus Icon */}
        <span
          className={`flex items-center justify-center w-7 h-7 rounded-full text-purple-400 font-bold text-xl shadow-md border border-white/30 hover:bg-white/50 transition-all duration-200 ${
            isZeroPoints ? 'bg-gradient-to-br from-red-200/30 via-red-200/30 to-red-200/30' : 'bg-gradient-to-br from-white/30 via-purple-200/30 to-blue-200/30'
          }`}
        >
          <FaPlusCircle className="h-5 w-5" />
        </span>
      </span>

      {/* Points Popup */}
      {isPointsPopupOpen && (
        <div className="absolute top-14 right-0 z-50 bg-gradient-to-br from-gray-900/95 via-purple-900/95 to-blue-900/95 text-white p-5 rounded-2xl shadow-2xl border border-white/10 backdrop-blur-xl space-y-4 w-64 animate-slideUp">
          {/* Popup Header */}
          <div className="flex justify-between items-center">
            <h4 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-blue-200 to-emerald-200 drop-shadow-md">
              Add Points
            </h4>
            <button
              onClick={() => setIsPointsPopupOpen(false)}
              className="p-2 bg-black/50 hover:bg-red-600/80 rounded-full transition-all duration-300 transform hover:scale-110 active:scale-95 backdrop-blur-sm border border-white/20"
            >
              <FaTimes className="text-white text-sm" />
            </button>
          </div>
          {/* Point Options */}
          <div className="flex flex-wrap gap-3 justify-center">
            {[10, 20, 30, 150].map((amount) => (
              <button
                key={amount}
                onClick={() => {
                  setUserPoints((prev) => prev + amount);
                  setIsPointsPopupOpen(false);
                }}
                className="flex-1 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600/90 via-blue-600/90 to-emerald-600/90 text-white font-semibold text-sm shadow-lg border border-white/20 backdrop-blur-sm hover:scale-105 hover:from-purple-700/90 hover:via-blue-700/90 hover:to-emerald-700/90 hover:shadow-xl hover:shadow-purple-500/30 active:scale-95 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:ring-offset-2 focus:ring-offset-gray-900/50 disabled:opacity-70 disabled:cursor-not-allowed group"
              >
                <span className="flex items-center justify-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-yellow-400 group-hover:text-yellow-300 transition-colors duration-300"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <circle cx="12" cy="12" r="8" fill="#FDE047" stroke="#FACC15" strokeWidth="1.5" />
                    <text x="12" y="14.5" textAnchor="middle" fontSize="8" fill="#92400E" fontWeight="bold">
                      ₵
                    </text>
                  </svg>
                  <span className="tracking-wide drop-shadow-md">+{amount} Points</span>
                </span>
              </button>
            ))}
          </div>
          {/* Cancel Button */}
          <button
            onClick={() => setIsPointsPopupOpen(false)}
            className="block mx-auto text-sm text-white/70 hover:text-emerald-200 transition-all duration-200"
          >
            Cancel
          </button>
        </div>
      )}

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-slideUp {
          animation: slideUp 0.4s ease-out;
        }
      `}</style>
    </div>
  );
};

export default PointsButton;