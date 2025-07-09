import { FaTicket, FaHeart, FaStar, FaPlay, FaCalendarDays, FaLocationDot, FaUsers, FaGift } from "react-icons/fa6";

const EventDetails = ({ event }) => {
  return (
    <div className="group perspective-1000">
      <div className="bg-white/10 dark:bg-gray-800/30 backdrop-blur-xl rounded-2xl p-8 text-white border border-white/20 shadow-2xl transform transition-all duration-700 hover:scale-105 hover:shadow-purple-500/30 hover:shadow-2xl hover:rotate-1 hover:border-purple-400/40 relative overflow-hidden">
        {/* Shine Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
        
        {/* Event Badge with Enhanced Animation */}
        <div className="flex items-center justify-between mb-6 relative z-10">
          <div className="flex items-center space-x-3">
            <div className="relative p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-lg group-hover:shadow-purple-500/50 transition-all duration-500 hover:scale-110 hover:rotate-12">
              <FaTicket className="text-white text-sm" />
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 group-hover:opacity-30 animate-ping"></div>
            </div>
            <div>
              <span className="text-sm font-semibold text-purple-300 block">Premium Event</span>
              <span className="text-xs text-gray-400">Limited Seats Available</span>
            </div>
          </div>
          <button className="p-3 rounded-full bg-white/10 hover:bg-red-500/20 transition-all duration-500 group/heart hover:scale-125">
            <FaHeart className="text-gray-300 group-hover/heart:text-red-400 transition-all duration-300 group-hover/heart:animate-pulse" />
          </button>
        </div>

        <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-white via-purple-300 to-pink-300 bg-clip-text text-transparent transform group-hover:scale-105 transition-transform duration-500">
          Event Details
        </h2>
        
        {/* Ultra Enhanced Image with Multiple Effects */}
        <div className="relative mb-6 group/image overflow-hidden rounded-xl">
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-64 object-cover transition-all duration-700 group-hover/image:scale-110 group-hover/image:brightness-110 filter group-hover/image:contrast-125"
          />
          {/* Multiple Overlay Effects */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-transparent to-blue-600/20 opacity-0 group-hover/image:opacity-100 transition-opacity duration-500"></div>
          
          {/* Animated Rating Badge */}
          <div className="absolute top-4 right-4 transform transition-all duration-500 group-hover/image:scale-110 group-hover/image:-rotate-6">
            <div className="flex items-center space-x-1 bg-yellow-500/90 backdrop-blur-sm px-3 py-2 rounded-full shadow-lg">
              <FaStar className="text-yellow-100 text-sm animate-pulse" />
              <span className="text-sm font-bold text-yellow-100">4.9</span>
            </div>
          </div>
          
          {/* Hover Play Button */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/image:opacity-100 transition-all duration-500">
            <div className="p-4 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 hover:scale-125 transition-transform duration-300 cursor-pointer">
              <FaPlay className="text-white text-xl ml-1" />
            </div>
          </div>
        </div>

        {/* Enhanced Event Info */}
        <div className="space-y-4">
          <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-purple-300 transition-colors duration-300">
            {event.title}
          </h3>
          <p className="text-gray-300 leading-relaxed mb-6">{event.description}</p>
          
          {/* Event Details Grid */}
          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <FaCalendarDays className="text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Date & Time</p>
                <p className="font-semibold text-white">{new Date(event.date).toLocaleString()}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <FaLocationDot className="text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Location</p>
                <p className="font-semibold text-white">{event.location}</p>
                <p className="text-sm text-gray-300">{event.district}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <FaUsers className="text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Event Type</p>
                <p className="font-semibold text-white capitalize">{event.type}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-4 rounded-xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30">
              <div className="p-2 bg-green-500/30 rounded-lg">
                <FaGift className="text-green-300" />
              </div>
              <div>
                <p className="text-sm text-green-300">Starting Price</p>
                <p className="text-2xl font-bold text-green-400">${event.price}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;