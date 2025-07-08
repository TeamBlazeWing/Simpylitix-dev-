import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaUser, 
  FaUsers, 
  FaCalendar, 
  FaLocationDot, 
  FaHeart, 
  FaStar, 
  FaAward,
  FaTicket,
  FaCode,
  FaLaptopCode,
  FaDatabase,
  FaPalette,
  FaMobile
} from "react-icons/fa6";
import { FaMessage } from "react-icons/fa6";
import { TiThMenu } from "react-icons/ti";
import Navbar from "../components/Aboutus component/Navbar";
import  Footer from "../components/Aboutus component/Footer";
import ImageSlider from "../components/Aboutus component/ImageSlider";


// CSS animations for enhanced UI
const styles = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
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

  .animate-fade-in-up {
    animation: fadeInUp 0.6s ease-out;
  }

  .animate-pulse-custom {
    animation: pulse 2s ease-in-out infinite;
  }

  .animate-slide-in-left {
    animation: slideInLeft 0.8s ease-out;
  }

  .hover-scale {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .hover-scale:hover {
    transform: translateY(-5px) scale(1.02);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  }

  .gradient-text {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .glass-effect {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }
`;

// Development team profiles
const developmentTeam = [
  {
    name: "Alex Thompson",
    role: "Full Stack Developer",
    experience: "5+ years",
    specialty: "React & Node.js",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80",
    skills: ["Frontend", "Backend", "Database"],
    icon: <FaLaptopCode className="text-blue-400" />
  },
  {
    name: "Sarah Chen",
    role: "Frontend Developer",
    experience: "4+ years",
    specialty: "React & UI/UX",
    image: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?auto=format&fit=crop&w=150&q=80",
    skills: ["React", "TypeScript", "CSS"],
    icon: <FaCode className="text-green-400" />
  },
  {
    name: "Michael Rodriguez",
    role: "Backend Developer",
    experience: "6+ years",
    specialty: "Node.js & APIs",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    skills: ["Node.js", "MongoDB", "APIs"],
    icon: <FaDatabase className="text-purple-400" />
  },
  {
    name: "Emily Watson",
    role: "UI/UX Designer",
    experience: "4+ years",
    specialty: "Design & Prototyping",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80",
    skills: ["Figma", "Adobe XD", "Prototyping"],
    icon: <FaPalette className="text-pink-400" />
  },
  {
    name: "David Kim",
    role: "DevOps Engineer",
    experience: "7+ years",
    specialty: "Cloud & Deployment",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    skills: ["AWS", "Docker", "CI/CD"],
    icon: <FaCode className="text-orange-400" />
  },
  {
    name: "Lisa Park",
    role: "Mobile Developer",
    experience: "3+ years",
    specialty: "React Native",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    skills: ["React Native", "iOS", "Android"],
    icon: <FaMobile className="text-cyan-400" />
  }
];


// Hero Section with dynamic animations
const HeroSection = () => {
  return (
    <div className="w-full max-w-6xl mx-auto mb-16 px-4">
      <style>{styles}</style>
      <div className="glass-effect rounded-3xl shadow-2xl p-12 text-center relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-custom"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-pink-500 to-red-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-custom" style={{animationDelay: '1s'}}></div>
        </div>
        
        <div className="relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 animate-fade-in-up">
            About <span className="gradient-text">SimplyTix</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-4xl mx-auto leading-relaxed animate-slide-in-left">
            Revolutionizing event discovery and management through cutting-edge technology and innovative design. 
            Built by developers, for the community.
          </p>
          <div className="flex flex-wrap justify-center gap-6 mb-10">
            <div className="bg-gradient-to-r from-blue-600/30 to-blue-800/30 px-8 py-4 rounded-full border border-blue-400/30 hover-scale">
              <span className="text-white font-semibold text-lg">🚀 Tech-Driven</span>
            </div>
            <div className="bg-gradient-to-r from-green-600/30 to-green-800/30 px-8 py-4 rounded-full border border-green-400/30 hover-scale">
              <span className="text-white font-semibold text-lg">💡 Innovation First</span>
            </div>
            <div className="bg-gradient-to-r from-purple-600/30 to-purple-800/30 px-8 py-4 rounded-full border border-purple-400/30 hover-scale">
              <span className="text-white font-semibold text-lg">🎯 User-Focused</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Platform Statistics with API data
const PlatformStats = ({ stats, loading }) => {
  const statsConfig = [
    {
      icon: <FaCalendar className="text-4xl text-blue-400" />,
      number: stats?.totalEvents || 0,
      label: "Total Events",
      description: "Events hosted on our platform",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: <FaTicket className="text-4xl text-green-400" />,
      number: stats?.totalTickets || 0,
      label: "Tickets Sold",
      description: "Happy customers served",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: <FaUsers className="text-4xl text-purple-400" />,
      number: developmentTeam.length,
      label: "Team Members",
      description: "Dedicated developers",
      gradient: "from-purple-500 to-violet-500"
    },
    {
      icon: <FaHeart className="text-4xl text-pink-400" />,
      number: "99%",
      label: "Satisfaction",
      description: "User satisfaction rate",
      gradient: "from-pink-500 to-rose-500"
    }
  ];

  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto mb-16 px-4">
        <h2 className="text-4xl font-bold text-white text-center mb-12">Platform Impact</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[1,2,3,4].map((i) => (
            <div key={i} className="glass-effect rounded-2xl p-8 text-center animate-pulse">
              <div className="w-16 h-16 bg-gray-600 rounded-full mx-auto mb-6"></div>
              <div className="h-8 bg-gray-600 rounded mb-4"></div>
              <div className="h-4 bg-gray-700 rounded mb-2"></div>
              <div className="h-3 bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto mb-16 px-4">
      <h2 className="text-4xl font-bold text-white text-center mb-12 animate-fade-in-up">
        Platform <span className="gradient-text">Impact</span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {statsConfig.map((stat, index) => (
          <div 
            key={index} 
            className="glass-effect rounded-2xl p-8 text-center hover-scale group relative overflow-hidden"
            style={{animationDelay: `${index * 0.1}s`}}
          >
            {/* Gradient background on hover */}
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
            
            <div className="relative z-10">
              <div className="flex justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                {stat.icon}
              </div>
              <h3 className="text-4xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-white group-hover:to-gray-300 transition-all duration-300">
                {typeof stat.number === 'number' ? stat.number.toLocaleString() : stat.number}
              </h3>
              <h4 className="text-xl font-semibold text-white mb-3">{stat.label}</h4>
              <p className="text-gray-300 text-sm leading-relaxed">{stat.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Mission & Vision with enhanced styling
const MissionVision = () => {
  return (
    <div className="w-full max-w-6xl mx-auto mb-16 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-effect rounded-2xl p-10 hover-scale group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative z-10">
            <div className="flex items-center mb-8">
              <div className="p-4 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl mr-6">
                <FaStar className="text-3xl text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white">Our Mission</h2>
            </div>
            <p className="text-gray-300 leading-relaxed mb-6 text-lg">
              To revolutionize event discovery and management through innovative technology, 
              creating seamless experiences that connect communities and bring people together 
              around shared interests and passions.
            </p>
            <p className="text-gray-300 leading-relaxed text-lg">
              We leverage cutting-edge development practices and user-centered design to build 
              a platform that serves both event organizers and attendees with equal excellence.
            </p>
          </div>
        </div>
        
        <div className="glass-effect rounded-2xl p-10 hover-scale group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative z-10">
            <div className="flex items-center mb-8">
              <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl mr-6">
                <FaAward className="text-3xl text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white">Our Vision</h2>
            </div>
            <p className="text-gray-300 leading-relaxed mb-6 text-lg">
              To become the leading global platform for event discovery and management, 
              setting new standards for user experience, technological innovation, 
              and community engagement in the events industry.
            </p>
            <p className="text-gray-300 leading-relaxed text-lg">
              We envision a future where finding and managing events is effortless, 
              intuitive, and accessible to everyone, regardless of their technical expertise.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Development Team Section
const DevelopmentTeam = () => {
  return (
    <div className="w-full max-w-6xl mx-auto mb-16 px-4">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-white mb-6 animate-fade-in-up">
          Meet Our <span className="gradient-text">Development Team</span>
        </h2>
        <p className="text-gray-300 text-lg mb-8 max-w-3xl mx-auto leading-relaxed">
          Our passionate team of developers, designers, and engineers who bring SimplyTix to life. 
          We combine creativity with cutting-edge technology to deliver exceptional user experiences.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {developmentTeam.map((member, index) => (
          <div 
            key={index} 
            className="glass-effect rounded-2xl p-8 text-center hover-scale group relative overflow-hidden"
            style={{animationDelay: `${index * 0.1}s`}}
          >
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div className="relative z-10">
              {/* Profile Image */}
              <div className="relative mb-6">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-28 h-28 rounded-full mx-auto object-cover border-4 border-white/20 group-hover:border-white/40 transition-all duration-300 group-hover:scale-105"
                />
                <div className="absolute -bottom-2 -right-2 p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full">
                  {member.icon}
                </div>
              </div>

              {/* Member Info */}
              <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-blue-400 group-hover:to-purple-400 transition-all duration-300">
                {member.name}
              </h3>
              <p className="text-blue-400 font-semibold text-lg mb-3">{member.role}</p>
              <p className="text-gray-300 text-sm mb-4">{member.specialty}</p>
              <p className="text-gray-400 text-sm mb-6">{member.experience}</p>
              
              {/* Skills */}
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                {member.skills.map((skill, skillIndex) => (
                  <span 
                    key={skillIndex}
                    className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 px-3 py-1 rounded-full text-xs font-semibold text-blue-300 border border-blue-400/30"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* Social Links */}
              <div className="flex justify-center space-x-4 mt-6">
                <button className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors">
                  <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286z"/>
                  </svg>
                </button>
                <button className="p-2 bg-gray-500/20 hover:bg-gray-500/30 rounded-lg transition-colors">
                  <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Event Categories Overview
const EventCategories = () => {
  const categories = [
    {
      name: "Music",
      count: 2,
      icon: "🎵",
      description: "Concerts, jazz evenings, and musical performances"
    },
    {
      name: "Art",
      count: 3,
      icon: "🎨",
      description: "Exhibitions, workshops, and cultural events"
    },
    {
      name: "Technology",
      count: 2,
      icon: "💻",
      description: "Conferences, pitch nights, and tech meetups"
    },
    {
      name: "Food",
      count: 2,
      icon: "🍽️",
      description: "Festivals, tastings, and culinary experiences"
    },
    {
      name: "Sports",
      count: 2,
      icon: "⚽",
      description: "Tournaments, competitions, and fitness events"
    },
    {
      name: "Comedy",
      count: 2,
      icon: "😄",
      description: "Stand-up shows and entertainment nights"
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto mb-16 px-4">
      <h2 className="text-3xl font-bold text-white text-center mb-8">Event Categories</h2>
      <p className="text-gray-300 text-center mb-12 max-w-2xl mx-auto">
        We host a diverse range of events across multiple categories, 
        ensuring there's something for everyone in our community.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category, index) => (
          <div key={index} className="bg-white/10 dark:bg-black/30 backdrop-blur-lg rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl mb-4">{category.icon}</div>
            <h3 className="text-xl font-bold text-white mb-2">{category.name}</h3>
            <p className="text-blue-400 font-semibold mb-3">{category.count} Active Events</p>
            <p className="text-gray-300 text-sm">{category.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Call to Action with enhanced design
const CallToAction = () => {
  return (
    <div className="w-full max-w-6xl mx-auto mb-16 px-4">
      <div className="glass-effect rounded-3xl p-12 text-center relative overflow-hidden group">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <div className="relative z-10">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to <span className="gradient-text">Get Started?</span>
          </h2>
          <p className="text-gray-300 mb-10 max-w-3xl mx-auto text-lg leading-relaxed">
            Join thousands of users who trust SimplyTix for their event discovery and management needs. 
            Experience the future of event technology today.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <a
              href="/events"
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
            >
              🎉 Explore Events
            </a>
            <a
              href="/contact"
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
            >
              💼 Join Our Team
            </a>
          </div>
          
          {/* Additional stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 pt-8 border-t border-white/20">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400 mb-1">24/7</div>
              <div className="text-gray-400 text-sm">Support</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400 mb-1">99.9%</div>
              <div className="text-gray-400 text-sm">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400 mb-1">Fast</div>
              <div className="text-gray-400 text-sm">Loading</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-pink-400 mb-1">Secure</div>
              <div className="text-gray-400 text-sm">Platform</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const About = () => {
  const [username, setUsername] = useState("");
  const [stats, setStats] = useState({ totalEvents: 0, totalTickets: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (!loggedInUser) {
      navigate("/about");
    } else {
      setUsername(loggedInUser);
    }
    fetchStats();
  }, [navigate]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      // Get the access token for authentication
      const token = localStorage.getItem("accessToken");
      const headers = {
        "Content-Type": "application/json",
        ...(token && { "Authorization": `Bearer ${token}` })
      };
      
      // Fetch events with authentication
      const eventsResponse = await fetch("http://localhost:3000/api/events", {
        method: "GET",
        headers: headers
      });
      
      let eventsData = {};
      if (eventsResponse.ok) {
        eventsData = await eventsResponse.json();
      } else {
        console.warn("Events API failed:", eventsResponse.status, eventsResponse.statusText);
      }
      
      // Fetch tickets with authentication
      const ticketsResponse = await fetch("http://localhost:3000/api/tickets", {
        method: "GET",
        headers: headers
      });
      
      let ticketsData = {};
      if (ticketsResponse.ok) {
        ticketsData = await ticketsResponse.json();
      } else {
        console.warn("Tickets API failed:", ticketsResponse.status, ticketsResponse.statusText);
      }
      
      setStats({
        totalEvents: eventsData.events ? eventsData.events.length : 0,
        totalTickets: ticketsData.tickets ? ticketsData.tickets.length : 0
      });
      
      console.log("Stats fetched successfully:", {
        events: eventsData.events ? eventsData.events.length : 0,
        tickets: ticketsData.tickets ? ticketsData.tickets.length : 0
      });
      
    } catch (error) {
      console.error("Error fetching stats:", error);
      // Set default values if API fails
      setStats({ totalEvents: 0, totalTickets: 0 });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("accessToken");
    navigate("/about");
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex flex-col relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="relative z-10">
        <Navbar username={username} onLogout={handleLogout} />
        <ImageSlider/>
        
        <main className="flex-1 py-8">
          <HeroSection />
          <PlatformStats stats={stats} loading={loading} />
          <MissionVision />
          <DevelopmentTeam />
          <CallToAction />
        </main>
        
        <Footer />
      </div>
    </div>
  );
};

export default About;
