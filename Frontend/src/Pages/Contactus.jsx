import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaUser, 
  FaLocationDot, 
  FaPhone, 
  FaEnvelope, 
  FaClock, 
  FaPaperPlane,
  FaRocket,
  FaHeadset,
  FaUsers,
  FaLinkedin,
  FaTwitter,
  FaInstagram,
  FaStar,
  FaMessage
} from "react-icons/fa6";
import { FaCheckCircle } from "react-icons/fa";
import { MdEventAvailable, MdVolunteerActivism, MdSupportAgent } from "react-icons/md";
import { TiThMenu } from "react-icons/ti";
import Navbar from "../components/Contactus component/Navbar";
import Footer from "../components/Contactus component/Footer";

// Enhanced Custom CSS for animations and effects
const styles = `
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-15px) rotate(2deg); }
  }
  
  @keyframes floatSlow {
    0%, 100% { transform: translateY(0px) translateX(0px); }
    25% { transform: translateY(-8px) translateX(5px); }
    50% { transform: translateY(-15px) translateX(0px); }
    75% { transform: translateY(-8px) translateX(-5px); }
  }
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(40px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
  
  @keyframes slideInLeft {
    from {
      opacity: 0;
      transform: translateX(-50px) rotateY(-15deg);
    }
    to {
      opacity: 1;
      transform: translateX(0) rotateY(0deg);
    }
  }
  
  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(50px) rotateY(15deg);
    }
    to {
      opacity: 1;
      transform: translateX(0) rotateY(0deg);
    }
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.8; transform: scale(1.05); }
  }
  
  @keyframes gradient {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
  
  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
    40% { transform: translateY(-10px); }
    60% { transform: translateY(-5px); }
  }
  
  @keyframes wiggle {
    0%, 7% { transform: rotateZ(0); }
    15% { transform: rotateZ(-15deg); }
    20% { transform: rotateZ(10deg); }
    25% { transform: rotateZ(-10deg); }
    30% { transform: rotateZ(6deg); }
    35% { transform: rotateZ(-4deg); }
    40%, 100% { transform: rotateZ(0); }
  }
  
  @keyframes glow {
    0%, 100% { box-shadow: 0 0 5px rgba(59, 130, 246, 0.5), 0 0 10px rgba(59, 130, 246, 0.3); }
    50% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.8), 0 0 30px rgba(59, 130, 246, 0.6); }
  }
  
  .animate-float { animation: float 4s ease-in-out infinite; }
  .animate-float-slow { animation: floatSlow 6s ease-in-out infinite; }
  .animate-fade-in-up { animation: fadeInUp 0.8s ease-out; }
  .animate-slide-in-left { animation: slideInLeft 0.8s ease-out; }
  .animate-slide-in-right { animation: slideInRight 0.8s ease-out; }
  .animate-pulse-custom { animation: pulse 2s ease-in-out infinite; }
  .animate-gradient { animation: gradient 4s ease infinite; }
  .animate-shimmer { animation: shimmer 2s ease-in-out infinite; }
  .animate-bounce-custom { animation: bounce 2s infinite; }
  .animate-wiggle { animation: wiggle 2s ease-in-out; }
  .animate-glow { animation: glow 2s ease-in-out infinite; }
  
  .glass-effect {
    background: rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(25px);
    border: 1px solid rgba(255, 255, 255, 0.15);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  }
  
  .glass-effect-strong {
    background: rgba(255, 255, 255, 0.12);
    backdrop-filter: blur(30px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  }
  
  .hover-glow:hover {
    box-shadow: 0 0 40px rgba(59, 130, 246, 0.4), 0 0 80px rgba(59, 130, 246, 0.2);
    transform: translateY(-5px) scale(1.02);
    transition: all 0.3s ease;
  }
  
  .hover-lift:hover {
    transform: translateY(-10px) rotateX(5deg);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    transition: all 0.3s ease;
  }
  
  .gradient-border {
    background: linear-gradient(45deg, #3b82f6, #8b5cf6, #ec4899, #f59e0b, #10b981);
    background-size: 400% 400%;
  }
  
  .shimmer-effect {
    position: relative;
    overflow: hidden;
  }
  
  .shimmer-effect::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transform: translateX(-100%);
    animation: shimmer 3s ease-in-out infinite;
  }
  
  .card-hover-effect {
    transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }
  
  .card-hover-effect:hover {
    transform: translateY(-8px) scale(1.03) rotateX(5deg);
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
  }
  
  .text-gradient {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .interactive-card {
    position: relative;
    overflow: hidden;
    transform-style: preserve-3d;
    transition: all 0.3s ease;
  }
  
  .interactive-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    transform: translateX(-100%) translateY(-100%);
    transition: transform 0.6s ease;
  }
  
  .interactive-card:hover::before {
    transform: translateX(100%) translateY(100%);
  }
`;

// Enhanced Hero Section with more animations and interactive elements
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
      <style>{styles}</style>
      
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

// Enhanced Contact Information Cards with advanced animations and interactions
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

// Enhanced Contact Form with advanced interactions and animations
const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    inquiryType: 'general'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Invalid email format';
    if (!formData.subject.trim()) errors.subject = 'Subject is required';
    if (!formData.message.trim()) errors.message = 'Message is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        inquiryType: 'general'
      });
      
      // Reset success message after 5 seconds
      setTimeout(() => setSubmitted(false), 5000);
    }, 1500);
  };

  return (
    <div className="w-full max-w-6xl mx-auto mb-16 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Enhanced Contact Form */}
        <div className="glass-effect-strong rounded-2xl shadow-2xl p-8 hover-lift transition-all duration-500 interactive-card animate-slide-in-left">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gradient mb-4">Send Us a Message</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-shimmer"></div>
          </div>
          
          {submitted && (
            <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-400/50 rounded-2xl p-6 mb-8 animate-fade-in-up backdrop-blur-lg">
              <div className="flex items-center gap-3">
                <FaCheckCircle className="text-green-400 text-2xl animate-bounce-custom" />
                <div>
                  <p className="text-green-300 font-semibold">Message Sent Successfully!</p>
                  <p className="text-green-400 text-sm">We'll get back to you within 24 hours.</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-300 mb-3 transition-colors duration-300">
                  Full Name *
                </label>
                <div className="relative">
                  <FaUser className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${
                    focusedField === 'name' ? 'text-blue-400' : 'text-gray-500'
                  }`} />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField(null)}
                    required
                    className={`w-full pl-12 pr-4 py-4 glass-effect rounded-xl border-2 transition-all duration-300 text-white placeholder-gray-400 focus:outline-none ${
                      focusedField === 'name' 
                        ? 'border-blue-400 shadow-lg shadow-blue-400/25' 
                        : formErrors.name 
                          ? 'border-red-400' 
                          : 'border-gray-600 hover:border-gray-500'
                    }`}
                    placeholder="Your full name"
                  />
                </div>
                {formErrors.name && (
                  <p className="text-red-400 text-sm mt-2 animate-fade-in-up">{formErrors.name}</p>
                )}
              </div>
              
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-300 mb-3">
                  Email Address *
                </label>
                <div className="relative">
                  <FaEnvelope className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${
                    focusedField === 'email' ? 'text-purple-400' : 'text-gray-500'
                  }`} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    required
                    className={`w-full pl-12 pr-4 py-4 glass-effect rounded-xl border-2 transition-all duration-300 text-white placeholder-gray-400 focus:outline-none ${
                      focusedField === 'email' 
                        ? 'border-purple-400 shadow-lg shadow-purple-400/25' 
                        : formErrors.email 
                          ? 'border-red-400' 
                          : 'border-gray-600 hover:border-gray-500'
                    }`}
                    placeholder="your.email@example.com"
                  />
                </div>
                {formErrors.email && (
                  <p className="text-red-400 text-sm mt-2 animate-fade-in-up">{formErrors.email}</p>
                )}
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm font-semibold text-gray-300 mb-3">
                Inquiry Type
              </label>
              <select
                name="inquiryType"
                value={formData.inquiryType}
                onChange={handleInputChange}
                className="w-full px-4 py-4 glass-effect rounded-xl border-2 border-gray-600 hover:border-gray-500 focus:border-green-400 focus:shadow-lg focus:shadow-green-400/25 transition-all duration-300 text-white focus:outline-none"
              >
                <option value="general" className="bg-gray-800 text-white">General Inquiry</option>
                <option value="event" className="bg-gray-800 text-white">Event Organization</option>
                <option value="volunteer" className="bg-gray-800 text-white">Volunteer Opportunities</option>
                <option value="technical" className="bg-gray-800 text-white">Technical Support</option>
                <option value="partnership" className="bg-gray-800 text-white">Partnership</option>
              </select>
            </div>

            <div className="relative">
              <label className="block text-sm font-semibold text-gray-300 mb-3">
                Subject *
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                onFocus={() => setFocusedField('subject')}
                onBlur={() => setFocusedField(null)}
                required
                className={`w-full px-4 py-4 glass-effect rounded-xl border-2 transition-all duration-300 text-white placeholder-gray-400 focus:outline-none ${
                  focusedField === 'subject' 
                    ? 'border-yellow-400 shadow-lg shadow-yellow-400/25' 
                    : formErrors.subject 
                      ? 'border-red-400' 
                      : 'border-gray-600 hover:border-gray-500'
                }`}
                placeholder="Brief subject of your message"
              />
              {formErrors.subject && (
                <p className="text-red-400 text-sm mt-2 animate-fade-in-up">{formErrors.subject}</p>
              )}
            </div>

            <div className="relative">
              <label className="block text-sm font-semibold text-gray-300 mb-3">
                Message *
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                onFocus={() => setFocusedField('message')}
                onBlur={() => setFocusedField(null)}
                required
                rows={6}
                className={`w-full px-4 py-4 glass-effect rounded-xl border-2 transition-all duration-300 text-white placeholder-gray-400 resize-vertical focus:outline-none ${
                  focusedField === 'message' 
                    ? 'border-pink-400 shadow-lg shadow-pink-400/25' 
                    : formErrors.message 
                      ? 'border-red-400' 
                      : 'border-gray-600 hover:border-gray-500'
                }`}
                placeholder="Tell us more about your inquiry..."
              />
              {formErrors.message && (
                <p className="text-red-400 text-sm mt-2 animate-fade-in-up">{formErrors.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-4 px-8 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-3 relative overflow-hidden group ${
                isSubmitting 
                  ? 'bg-gray-600 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover-lift animate-glow'
              } text-white`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10 flex items-center space-x-3">
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <FaPaperPlane className="group-hover:animate-bounce-custom" />
                    <span>Send Message</span>
                  </>
                )}
              </div>
            </button>
          </form>
        </div>

        {/* Enhanced Additional Information */}
        <div className="space-y-8 animate-slide-in-right">
          {/* FAQ Section */}
          <div className="glass-effect-strong rounded-2xl shadow-2xl p-8 hover-lift transition-all duration-500 interactive-card">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 p-3 rounded-xl">
                <FaMessage className="text-yellow-400 text-2xl" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gradient">Frequently Asked Questions</h3>
                <div className="w-16 h-1 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full mt-1"></div>
              </div>
            </div>
            
            <div className="space-y-6">
              {[
                {
                  question: "How do I organize an event?",
                  answer: "Contact our events team at events@simplytix.com or call (555) 123-4568. We'll guide you through the process.",
                  icon: <MdEventAvailable className="text-blue-400" />
                },
                {
                  question: "Can I become a volunteer?",
                  answer: "Absolutely! We're always looking for passionate volunteers. Fill out the contact form or visit our office.",
                  icon: <MdVolunteerActivism className="text-green-400" />
                },
                {
                  question: "How do I cancel my event subscription?",
                  answer: "You can manage your subscriptions in your profile or contact our support team for assistance.",
                  icon: <MdSupportAgent className="text-purple-400" />
                }
              ].map((faq, index) => (
                <div key={index} className="group bg-white/5 backdrop-blur-lg rounded-xl p-6 hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-white/20" style={{animationDelay: `${index * 0.1}s`}}>
                  <div className="flex items-start gap-4">
                    <div className="bg-white/10 p-2 rounded-lg group-hover:scale-110 transition-transform duration-300">
                      {faq.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-bold mb-3 group-hover:text-blue-300 transition-colors duration-300">{faq.question}</h4>
                      <p className="text-gray-300 text-sm leading-relaxed group-hover:text-gray-200 transition-colors duration-300">{faq.answer}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Social Media Section */}
          <div className="glass-effect-strong rounded-2xl shadow-2xl p-8 hover-lift transition-all duration-500 interactive-card">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 p-3 rounded-xl">
                <FaStar className="text-pink-400 text-2xl" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gradient">Connect With Us</h3>
                <div className="w-16 h-1 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full mt-1"></div>
              </div>
            </div>
            
            <div className="space-y-4 mb-6">
              {[
                { icon: <FaLinkedin />, name: "LinkedIn", handle: "@SimplyTix", color: "blue", bg: "from-blue-600/20 to-blue-800/20", border: "border-blue-400/30" },
                { icon: <FaTwitter />, name: "Twitter", handle: "@SimplyTix", color: "sky", bg: "from-sky-600/20 to-sky-800/20", border: "border-sky-400/30" },
                { icon: <FaInstagram />, name: "Instagram", handle: "@SimplyTix", color: "pink", bg: "from-pink-600/20 to-pink-800/20", border: "border-pink-400/30" }
              ].map((social, index) => (
                <div key={index} className={`group flex items-center gap-4 bg-gradient-to-r ${social.bg} backdrop-blur-lg p-4 rounded-xl border ${social.border} hover:border-white/40 hover:scale-105 transition-all duration-300 cursor-pointer`}>
                  <div className={`text-${social.color}-400 text-xl group-hover:animate-bounce-custom`}>
                    {social.icon}
                  </div>
                  <div className="flex-1">
                    <span className="text-white font-semibold">{social.name}</span>
                    <span className="text-gray-400 ml-2">{social.handle}</span>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-xs text-gray-400">Click to visit</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center">
              <p className="text-gray-400 text-sm mb-4">Follow us for updates and behind-the-scenes content</p>
              <div className="flex justify-center gap-2">
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
              </div>
            </div>
          </div>

          {/* Emergency Support Section */}
          <div className="glass-effect-strong rounded-2xl shadow-2xl p-8 hover-lift transition-all duration-500 interactive-card border-2 border-red-500/20 hover:border-red-400/40">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 p-3 rounded-xl animate-pulse-custom">
                <FaHeadset className="text-red-400 text-2xl" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gradient">Emergency Support</h3>
                <div className="w-16 h-1 bg-gradient-to-r from-red-500 to-orange-500 rounded-full mt-1"></div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-red-600/10 to-orange-600/10 backdrop-blur-lg rounded-xl p-6 border border-red-400/20">
              <p className="text-gray-300 mb-6 leading-relaxed">
                For urgent issues during events or technical emergencies, our 24/7 support line is available. 
                Our emergency team responds within minutes to critical situations.
              </p>
              
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-red-500/20 p-3 rounded-full animate-glow">
                    <FaPhone className="text-red-400 text-xl" />
                  </div>
                  <div>
                    <div className="text-white font-bold text-lg">(555) 911-HELP</div>
                    <div className="text-red-300 text-sm">Emergency Hotline</div>
                  </div>
                </div>
                
                <button className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 hover-lift animate-pulse-custom">
                  Call Emergency
                </button>
              </div>
              
              <div className="mt-4 text-center">
                <div className="flex justify-center items-center gap-2">
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-ping"></div>
                  <span className="text-red-300 text-xs">Available 24/7/365</span>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics Section */}
          <div className="glass-effect-strong rounded-2xl shadow-2xl p-8 hover-lift transition-all duration-500 interactive-card">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 p-3 rounded-xl">
                <FaCheckCircle className="text-green-400 text-2xl" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gradient">Our Track Record</h3>
                <div className="w-16 h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mt-1"></div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {[
                { number: "99.9%", label: "Uptime", color: "green" },
                { number: "<2hr", label: "Response Time", color: "blue" },
                { number: "10k+", label: "Happy Clients", color: "purple" },
                { number: "24/7", label: "Support", color: "orange" }
              ].map((stat, index) => (
                <div key={index} className={`text-center p-4 bg-gradient-to-br from-${stat.color}-500/10 to-${stat.color}-700/10 rounded-xl border border-${stat.color}-400/20 hover:border-${stat.color}-400/40 transition-all duration-300 hover:scale-105`}>
                  <div className={`text-2xl font-bold text-${stat.color}-400 mb-1`}>{stat.number}</div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};



// Floating Background Elements Component
const FloatingBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Large floating elements */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-full blur-3xl animate-float-slow"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-cyan-500/3 to-blue-500/3 rounded-full blur-2xl animate-pulse-custom"></div>
      
      {/* Medium floating elements */}
      <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-br from-green-500/8 to-emerald-500/8 rounded-full blur-xl animate-float" style={{animationDelay: '1s'}}></div>
      <div className="absolute bottom-20 left-20 w-40 h-40 bg-gradient-to-br from-pink-500/6 to-red-500/6 rounded-full blur-xl animate-float-slow" style={{animationDelay: '3s'}}></div>
      
      {/* Small floating particles */}
      <div className="absolute top-32 left-32 w-8 h-8 bg-blue-400/20 rounded-full animate-bounce-custom" style={{animationDelay: '0.5s'}}></div>
      <div className="absolute top-64 right-64 w-6 h-6 bg-purple-400/20 rounded-full animate-float" style={{animationDelay: '1.5s'}}></div>
      <div className="absolute bottom-32 left-1/3 w-10 h-10 bg-pink-400/20 rounded-full animate-float-slow" style={{animationDelay: '2.5s'}}></div>
      <div className="absolute bottom-64 right-1/4 w-4 h-4 bg-cyan-400/30 rounded-full animate-bounce-custom" style={{animationDelay: '0.8s'}}></div>
      <div className="absolute top-1/3 right-1/3 w-5 h-5 bg-green-400/25 rounded-full animate-float" style={{animationDelay: '1.2s'}}></div>
      <div className="absolute bottom-1/3 left-1/4 w-7 h-7 bg-yellow-400/15 rounded-full animate-float-slow" style={{animationDelay: '1.8s'}}></div>
    </div>
  );
};

const Contactus = () => {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (!loggedInUser) {
      navigate("/contact");
    } else {
      setUsername(loggedInUser);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("accessToken");
    navigate("/contact");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex flex-col relative overflow-hidden">
      {/* Floating background elements */}
      <FloatingBackground />
      
      {/* Main content */}
      <div className="relative z-10">
        <Navbar username={username} onLogout={handleLogout} />
        <main className="flex-1">
          <HeroSection />
          <ContactInfo />
          <ContactForm />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Contactus;
