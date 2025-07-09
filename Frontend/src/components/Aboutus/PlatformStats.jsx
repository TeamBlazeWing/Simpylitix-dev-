import { FaCalendar, FaTicket, FaUsers, FaHeart, FaLaptopCode, FaCode, FaDatabase, FaPalette, FaMobile } from "react-icons/fa6";
import "./styles.css";

const developmentTeam = [
  {
    name: "Alex Thompson",
    role: "Full Stack Developer",
    experience: "5+ years",
    specialty: "React & Node.js",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80",
    skills: ["Frontend", "Backend", "Database"],
    icon: <FaLaptopCode className="text-blue-400" />,
  },
  {
    name: "Sarah Chen",
    role: "Frontend Developer",
    experience: "4+ years",
    specialty: "React & UI/UX",
    image: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?auto=format&fit=crop&w=150&q=80",
    skills: ["React", "TypeScript", "CSS"],
    icon: <FaCode className="text-green-400" />,
  },
  {
    name: "Michael Rodriguez",
    role: "Backend Developer",
    experience: "6+ years",
    specialty: "Node.js & APIs",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    skills: ["Node.js", "MongoDB", "APIs"],
    icon: <FaDatabase className="text-purple-400" />,
  },
  {
    name: "Emily Watson",
    role: "UI/UX Designer",
    experience: "4+ years",
    specialty: "Design & Prototyping",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80",
    skills: ["Figma", "Adobe XD", "Prototyping"],
    icon: <FaPalette className="text-pink-400" />,
  },
  {
    name: "David Kim",
    role: "DevOps Engineer",
    experience: "7+ years",
    specialty: "Cloud & Deployment",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    skills: ["AWS", "Docker", "CI/CD"],
    icon: <FaCode className="text-orange-400" />,
  },
  {
    name: "Lisa Park",
    role: "Mobile Developer",
    experience: "3+ years",
    specialty: "React Native",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    skills: ["React Native", "iOS", "Android"],
    icon: <FaMobile className="text-cyan-400" />,
  },
];

const PlatformStats = ({ stats, loading }) => {
  const statsConfig = [
    {
      icon: <FaCalendar className="text-4xl text-blue-400" />,
      number: stats?.totalEvents || 0,
      label: "Total Events",
      description: "Events hosted on our platform",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: <FaTicket className="text-4xl text-green-400" />,
      number: stats?.totalTickets || 0,
      label: "Tickets Sold",
      description: "Happy customers served",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: <FaUsers className="text-4xl text-purple-400" />,
      number: developmentTeam.length,
      label: "Team Members",
      description: "Dedicated developers",
      gradient: "from-purple-500 to-violet-500",
    },
    {
      icon: <FaHeart className="text-4xl text-pink-400" />,
      number: "99%",
      label: "Satisfaction",
      description: "User satisfaction rate",
      gradient: "from-pink-500 to-rose-500",
    },
  ];

  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto mb-16 px-4">
        <h2 className="text-4xl font-bold text-white text-center mb-12">Platform Impact</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map((i) => (
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
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {/* Gradient background on hover */}
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>

            <div className="relative z-10">
              <div className="flex justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                {stat.icon}
              </div>
              <h3 className="text-4xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-white group-hover:to-gray-300 transition-all duration-300">
                {typeof stat.number === "number" ? stat.number.toLocaleString() : stat.number}
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

export default PlatformStats;