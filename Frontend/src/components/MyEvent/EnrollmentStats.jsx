import React from 'react';
import { FaEye, FaDollarSign, FaCalendarAlt } from 'react-icons/fa';

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

export default EnrollmentStats;