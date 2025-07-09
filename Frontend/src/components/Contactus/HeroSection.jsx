import { useState } from "react";
import { FaHeadset, FaRocket, FaUsers, FaPaperPlane, FaPhone } from "react-icons/fa6";
import "./styles.css";

const HeroSection = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100
    });
  };
  
  return (
    <div className="relative w-full max-w-6xl mx-auto mb-16 px-4 overflow-hidden">
      {/* Enhanced animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-br from-cyan-500/15 to-blue-500/15 rounded-full blur-2xl animate-pulse-custom"></div>
        
        {/* Floating particles */}
        <div className="absolute top-20 left-20 w-4 h-4 bg-blue-400/30 rounded-full animate-bounce-custom"></div>
        <div className="absolute top-32 right-32 w-3 h-3 bg-purple-400/30 rounded-full animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-40 left-1/3 w-5 h-5 bg-pink-400/30 rounded-full animate-float-slow" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 right-1/4 w-2 h-2 bg-cyan-400/40 rounded-full animate-bounce-custom" style={{animationDelay: '1.5s'}}></div>
      </div>
      
      <div 
        className="relative glass-effect-strong rounded-3xl shadow-2xl p-12 text-center overflow-hidden group hover-glow transition-all duration-500 interactive-card"
        onMouseMove={handleMouseMove}
      >
        {/* Dynamic background gradient based on mouse position */}
        <div 
          className="absolute inset-0 gradient-border animate-gradient opacity-10 group-hover:opacity-25 transition-opacity duration-500"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(59, 130, 246, 0.3), rgba(139, 92, 246, 0.2), rgba(236, 72, 153, 0.1))`
          }}
        ></div>
        
        {/* Shimmer effect overlay */}
        <div className="absolute inset-0 shimmer-effect opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        
        <div className="relative z-10">
          <div className="animate-fade-in-up">
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-white via-blue-300 to-purple-300 bg-clip-text text-transparent mb-6 hover:animate-wiggle transition-all duration-300">
              Contact Us
            </h1>
            <div className="w-32 h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mx-auto rounded-full mb-8 animate-shimmer"></div>
          </div>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-4xl mx-auto leading-relaxed animate-slide-in-left">
            Ready to transform your event experience? Have questions about our platform? 
            We're here to help you every step of the way with our expert team.
          </p>
          
          {/* Enhanced feature badges */}
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <div className="group bg-gradient-to-r from-blue-600/20 to-blue-800/20 backdrop-blur-lg px-8 py-4 rounded-full border border-blue-400/30 hover:border-blue-400/60 hover-lift transition-all duration-300 interactive-card animate-slide-in-left">
              <span className="text-white font-semibold text-lg flex items-center gap-3">
                <FaHeadset className="text-blue-400 group-hover:animate-bounce-custom text-2xl" />
                <div className="text-left">
                  <div>24/7 Support</div>
                  <div className="text-xs text-blue-300 opacity-70">Always available</div>
                </div>
              </span>
            </div>
            <div className="group bg-gradient-to-r from-green-600/20 to-green-800/20 backdrop-blur-lg px-8 py-4 rounded-full border border-green-400/30 hover:border-green-400/60 hover-lift transition-all duration-300 interactive-card animate-slide-in-right" style={{animationDelay: '0.2s'}}>
              <span className="text-white font-semibold text-lg flex items-center gap-3">
                <FaRocket className="text-green-400 group-hover:animate-bounce-custom text-2xl" />
                <div className="text-left">
                  <div>Quick Response</div>
                  <div className="text-xs text-green-300 opacity-70">Under 2 hours</div>
                </div>
              </span>
            </div>
            <div className="group bg-gradient-to-r from-purple-600/20 to-purple-800/20 backdrop-blur-lg px-8 py-4 rounded-full border border-purple-400/30 hover:border-purple-400/60 hover-lift transition-all duration-300 interactive-card animate-slide-in-left" style={{animationDelay: '0.4s'}}>
              <span className="text-white font-semibold text-lg flex items-center gap-3">
                <FaUsers className="text-purple-400 group-hover:animate-bounce-custom text-2xl" />
                <div className="text-left">
                  <div>Expert Team</div>
                  <div className="text-xs text-purple-300 opacity-70">Industry professionals</div>
                </div>
              </span>
            </div>
          </div>
          
          {/* Call-to-action section */}
          <div className="mt-8 animate-fade-in-up" style={{animationDelay: '0.6s'}}>
            <p className="text-lg text-gray-400 mb-4">Get started in seconds</p>
            <div className="flex justify-center gap-4 flex-wrap">
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 hover-lift animate-glow">
                <FaPaperPlane className="inline mr-2" />
                Quick Contact
              </button>
              <button className="border-2 border-white/20 hover:border-white/40 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 hover-lift backdrop-blur-lg">
                <FaPhone className="inline mr-2" />
                Call Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;