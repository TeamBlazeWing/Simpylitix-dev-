import { useEffect, useState} from "react";
import { FaChevronLeft, FaChevronRight, FaPlay, FaPause, FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";

const sliderImages = [
  {
    src: "../public/Slider/Epic_music_festival.webp",
    title: "Epic Music Festival 2025",
    description: "Join thousands for the biggest music event of the year",
    date: "July 15-17, 2025",
    location: "Central Park, NYC"
  },
  {
    src: "../public/Slider/Tech_summit.webp",
    title: "Tech Conference Summit",
    description: "Discover the latest innovations in technology",
    date: "August 20, 2025",
    location: "Convention Center"
  },
  {
    src: "../public/Slider/food_and_wine.webp",
    title: "Food & Wine Festival",
    description: "Taste exquisite cuisines from world-class chefs",
    date: "September 10-12, 2025",
    location: "Downtown District"
  }
];

const ImageSlider = ({ images = sliderImages, interval = 5000 }) => {
  const [current, setCurrent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Auto-slide functionality
  useEffect(() => {
    if (!isPlaying || isHovered) return;
    
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, interval);
    
    return () => clearInterval(timer);
  }, [images.length, interval, isPlaying, isHovered]);

  // Navigation functions
  const goToSlide = (index) => {
    setCurrent(index);
    setImageLoaded(false);
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % images.length);
    setImageLoaded(false);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
    setImageLoaded(false);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const currentSlide = images[current];
  const imageSrc = typeof currentSlide === 'string' ? currentSlide : currentSlide?.src;

  return (
    <div className="w-full flex justify-center mb-8 relative px-4 md:px-8 lg:px-16">
      <div
        className="relative rounded-2xl shadow-2xl overflow-hidden w-full max-w-6xl group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          background: "linear-gradient(135deg, rgba(147, 51, 234, 0.1), rgba(59, 130, 246, 0.1))",
          border: "2px solid rgba(147, 51, 234, 0.2)",
        }}
      >
        {/* Main Image Container */}
        <div className="relative overflow-hidden h-50">
          {/* Loading Shimmer Effect */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 animate-pulse">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
            </div>
          )}
          
          <img
            src={imageSrc}
            alt={`slide-${current}`}
            className={`object-cover h-50 w-full transition-all duration-700 transform ${
              imageLoaded ? 'scale-100 opacity-100' : 'scale-105 opacity-0'
            } group-hover:scale-105`}
            onLoad={() => setImageLoaded(true)}
          />
          
          {/* Enhanced Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-transparent to-blue-900/20"></div>

          {/* Content Overlay */}
          <div className="absolute inset-0 flex items-center">
            <div className="text-white p-6 md:p-8 lg:p-10 max-w-lg ml-8 md:ml-12 lg:ml-16">
              {/* Title */}
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-3 leading-tight bg-gradient-to-r from-white via-purple-100 to-blue-100 bg-clip-text text-transparent opacity-0 animate-slideInLeft group-hover:opacity-100 transition-all duration-700 delay-100">
                {typeof currentSlide === 'object' ? currentSlide.title : 'Featured Event'}
              </h2>
              
              {/* Description */}
              <p className="text-sm md:text-base lg:text-lg text-gray-200 mb-3 md:mb-4 opacity-0 animate-slideInLeft group-hover:opacity-100 transition-all duration-700 delay-200">
                {typeof currentSlide === 'object' ? currentSlide.description : 'Discover amazing events happening near you'}
              </p>
              
              {/* Event Details */}
              {typeof currentSlide === 'object' && (
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-xs md:text-sm opacity-0 animate-slideInLeft group-hover:opacity-100 transition-all duration-700 delay-300">
                  <div className="flex items-center gap-2 text-purple-300">
                    <FaCalendarAlt className="text-purple-400" />
                    <span>{currentSlide.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-300">
                    <FaMapMarkerAlt className="text-blue-400" />
                    <span>{currentSlide.location}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-purple-600/70 text-white p-2 md:p-3 rounded-full transition-all duration-300 opacity-60 group-hover:opacity-100 hover:scale-110 active:scale-95 backdrop-blur-sm border border-white/20"
              aria-label="Previous image"
            >
              <FaChevronLeft className="text-sm md:text-lg" />
            </button>
            
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-blue-600/70 text-white p-2 md:p-3 rounded-full transition-all duration-300 opacity-60 group-hover:opacity-100 hover:scale-110 active:scale-95 backdrop-blur-sm border border-white/20"
              aria-label="Next image"
            >
              <FaChevronRight className="text-sm md:text-lg" />
            </button>
          </>
        )}

        {/* Play/Pause Button */}
        {images.length > 1 && (
          <button
            onClick={togglePlayPause}
            className="absolute top-4 right-4 bg-black/50 hover:bg-gradient-to-r hover:from-purple-600/70 hover:to-blue-600/70 text-white p-2 md:p-3 rounded-full transition-all duration-300 opacity-60 group-hover:opacity-100 hover:scale-110 active:scale-95 backdrop-blur-sm border border-white/20"
            aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
          >
            {isPlaying ? <FaPause className="text-xs md:text-sm" /> : <FaPlay className="text-xs md:text-sm ml-0.5" />}
          </button>
        )}

        {/* Slide Counter */}
        {images.length > 1 && (
          <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-xs md:text-sm font-medium opacity-60 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm border border-white/20">
            {current + 1} / {images.length}
          </div>
        )}

        {/* Dot Indicators */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 opacity-60 group-hover:opacity-100 transition-all duration-300">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 hover:scale-125 ${
                  index === current
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 shadow-lg'
                    : 'bg-white/50 hover:bg-white/70'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Interactive Hover Effect Border */}
        <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-gradient-to-r group-hover:from-purple-500/50 group-hover:to-blue-500/50 transition-all duration-300 pointer-events-none"></div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes slideInLeft {
          from { 
            opacity: 0; 
            transform: translateX(-30px); 
          }
          to { 
            opacity: 1; 
            transform: translateX(0); 
          }
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        
        .animate-slideInLeft {
          animation: slideInLeft 0.6s ease-out forwards;
        }
        
        .border-gradient-to-r {
          background: linear-gradient(to right, rgba(147, 51, 234, 0.5), rgba(59, 130, 246, 0.5));
        }
      `}</style>
    </div>
  );
};

export { sliderImages, ImageSlider };