import React from 'react';
import { FaEye } from 'react-icons/fa';

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

export default NoEnrolledEventsMessage;