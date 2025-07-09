import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa6';
import FloatingBackground from '../components/FogetPassword/FloatingBackground';
import '../components/FogetPassword/styles.css';

export default function FogetPassword() {
  const navigate = useNavigate();

  const handleBackToLogin = () => {
    navigate("/login");
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center relative overflow-hidden">
      {/* Floating background elements */}
      <FloatingBackground />
      
      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center px-6 py-8 mx-auto w-full sm:max-w-lg">
        <div className="w-full glass-effect-strong rounded-2xl shadow-2xl p-8 sm:p-10 hover-lift transition-all duration-500 interactive-card animate-fade-in-up">
          <div className="space-y-6 md:space-y-8 text-center">
            {/* Title with gradient and animation */}
            <h1 className="text-3xl md:text-4xl font-bold text-gradient mb-4 animate-slide-in-left">
              Forgot Password
            </h1>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mb-6 animate-shimmer"></div>
            
            {/* Placeholder text with subtle animation */}
            <p className="text-gray-400 text-lg leading-relaxed animate-slide-in-right">
              Not implemented yet
            </p>
            
            {/* Back to Login button with gradient and interactive effects */}
            <button
              onClick={handleBackToLogin}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-5 rounded-lg text-sm transition-all duration-300 hover-lift animate-glow flex items-center justify-center gap-2 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10 flex items-center gap-2">
                <FaArrowLeft className="group-hover:animate-bounce-custom" />
                <span>Back to Login</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}