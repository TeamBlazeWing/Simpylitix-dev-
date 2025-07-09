import { useState } from "react";
import { FaLocationDot, FaPhone, FaEnvelope, FaClock, FaLinkedin, FaTwitter, FaInstagram } from "react-icons/fa6";
import "./styles.css";

const ContactInfo = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [clickedCard, setClickedCard] = useState(null);
  
  const contactMethods = [
    {
      icon: <FaLocationDot className="text-4xl text-blue-400" />,
      title: "Visit Our Office",
      details: ["123 Event Street", "City, State 12345", "United States"],
      description: "Come visit us during business hours",
      gradient: "from-blue-500/20 to-cyan-500/20",
      hoverColor: "blue",
      bgIcon: "bg-blue-500/20",
      accentColor: "blue-400",
      buttonText: "Get Directions",
      buttonIcon: <FaLocationDot />
    },
    {
      icon: <FaPhone className="text-4xl text-green-400" />,
      title: "Call Us",
      details: ["Main: (555) 123-4567", "Events: (555) 123-4568", "Support: (555) 123-4569"],
      description: "Available Monday to Friday, 9 AM - 6 PM",
      gradient: "from-green-500/20 to-emerald-500/20",
      hoverColor: "green",
      bgIcon: "bg-green-500/20",
      accentColor: "green-400",
      buttonText: "Call Now",
      buttonIcon: <FaPhone />
    },
    {
      icon: <FaEnvelope className="text-4xl text-purple-400" />,
      title: "Email Us",
      details: ["info@simplytix.com", "events@simplytix.com", "support@simplytix.com"],
      description: "We respond within 24 hours",
      gradient: "from-purple-500/20 to-violet-500/20",
      hoverColor: "purple",
      bgIcon: "bg-purple-500/20",
      accentColor: "purple-400",
      buttonText: "Send Email",
      buttonIcon: <FaEnvelope />
    },
    {
      icon: <FaClock className="text-4xl text-orange-400" />,
      title: "Business Hours",
      details: ["Monday - Friday: 9:00 AM - 6:00 PM", "Saturday: 10:00 AM - 4:00 PM", "Sunday: Closed"],
      description: "Emergency support available 24/7",
      gradient: "from-orange-500/20 to-red-500/20",
      hoverColor: "orange",
      bgIcon: "bg-orange-500/20",
      accentColor: "orange-400",
      buttonText: "View Schedule",
      buttonIcon: <FaClock />
    }
  ];

  const handleCardClick = (index) => {
    setClickedCard(index);
    setTimeout(() => setClickedCard(null), 300);
  };

  return (
    <div className="w-full max-w-6xl mx-auto mb-16 px-4">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-blue-300 to-purple-300 bg-clip-text text-transparent mb-4 animate-fade-in-up">
          Get In Touch
        </h2>
        <div className="w-32 h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mx-auto rounded-full mb-6 animate-shimmer"></div>
        <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
          Choose your preferred way to connect with our team. We're here to make your experience exceptional.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {contactMethods.map((method, index) => (
          <div 
            key={index} 
            className={`group glass-effect-strong rounded-2xl p-8 text-center card-hover-effect transition-all duration-500 relative overflow-hidden cursor-pointer interactive-card ${
              hoveredCard === index ? 'shadow-2xl scale-105' : ''
            } ${
              clickedCard === index ? 'animate-wiggle' : ''
            }`}
            onMouseEnter={() => setHoveredCard(index)}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => handleCardClick(index)}
            style={{animationDelay: `${index * 0.15}s`}}
          >
            {/* Dynamic gradient background on hover */}
            <div className={`absolute inset-0 bg-gradient-to-br ${method.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
            
            {/* Floating background elements */}
            <div className="absolute top-4 right-4 w-16 h-16 bg-gradient-to-br from-white/5 to-white/10 rounded-full animate-float-slow opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute bottom-4 left-4 w-12 h-12 bg-gradient-to-br from-white/5 to-white/10 rounded-full animate-float opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            
            <div className="relative z-10">
              {/* Enhanced Icon with animated background */}
              <div className={`${method.bgIcon} backdrop-blur-lg rounded-2xl p-6 w-fit mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 shimmer-effect animate-glow`}>
                <div className="group-hover:animate-bounce-custom">
                  {method.icon}
                </div>
              </div>
              
              <h3 className={`text-xl font-bold text-white mb-4 group-hover:text-${method.accentColor} transition-all duration-300 text-gradient`}>
                {method.title}
              </h3>
              
              <div className="space-y-3 mb-6">
                {method.details.map((detail, idx) => (
                  <div key={idx} className="transform group-hover:translate-x-1 transition-transform duration-300" style={{transitionDelay: `${idx * 100}ms`}}>
                    <p className="text-gray-300 text-sm hover:text-white transition-colors duration-200 group-hover:font-medium">
                      {detail}
                    </p>
                  </div>
                ))}
              </div>
              
              <p className="text-gray-400 text-xs leading-relaxed mb-6 group-hover:text-gray-300 transition-colors duration-300">
                {method.description}
              </p>
              
              {/* Interactive action button */}
              <button className={`w-full py-2 px-4 rounded-lg bg-gradient-to-r from-${method.accentColor}/20 to-${method.accentColor}/10 border border-${method.accentColor}/30 hover:border-${method.accentColor}/60 text-${method.accentColor} hover:text-white transition-all duration-300 hover:bg-gradient-to-r hover:from-${method.accentColor}/40 hover:to-${method.accentColor}/20 group-hover:animate-pulse-custom flex items-center justify-center gap-2 text-sm font-semibold`}>
                {method.buttonIcon}
                {method.buttonText}
              </button>
            </div>
            
            {/* Enhanced decorative elements with animations */}
            <div className={`absolute top-4 right-4 w-3 h-3 bg-${method.accentColor}/30 rounded-full group-hover:scale-150 group-hover:animate-bounce-custom transition-transform duration-300`}></div>
            <div className={`absolute bottom-4 left-4 w-2 h-2 bg-${method.accentColor}/40 rounded-full group-hover:scale-200 group-hover:animate-pulse-custom transition-transform duration-500`}></div>
            <div className={`absolute top-1/2 left-0 w-1 h-8 bg-gradient-to-b from-${method.accentColor}/50 to-transparent group-hover:h-12 transition-all duration-300`}></div>
            
            {/* Success ripple effect on click */}
            {clickedCard === index && (
              <div className="absolute inset-0 rounded-2xl border-2 border-white/50 animate-ping"></div>
            )}
          </div>
        ))}
      </div>
      
      {/* Additional contact methods section */}
      <div className="mt-12 text-center">
        <h3 className="text-2xl font-bold text-white mb-6 animate-fade-in-up">
          Connect With Us Online
        </h3>
        <div className="flex justify-center gap-6 flex-wrap">
          {[
            { icon: <FaLinkedin />, name: "LinkedIn", color: "blue", link: "#" },
            { icon: <FaTwitter />, name: "Twitter", color: "sky", link: "#" },
            { icon: <FaInstagram />, name: "Instagram", color: "pink", link: "#" }
          ].map((social, index) => (
            <a
              key={index}
              href={social.link}
              className={`group bg-gradient-to-r from-${social.color}-600/20 to-${social.color}-800/20 backdrop-blur-lg p-4 rounded-full border border-${social.color}-400/30 hover:border-${social.color}-400/60 hover-lift transition-all duration-300 interactive-card`}
              style={{animationDelay: `${index * 0.1}s`}}
            >
              <div className={`text-${social.color}-400 text-2xl group-hover:animate-bounce-custom group-hover:scale-110 transition-transform duration-300`}>
                {social.icon}
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;