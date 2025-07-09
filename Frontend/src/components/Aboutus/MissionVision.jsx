import { FaStar, FaAward } from "react-icons/fa6";
import "./styles.css";

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

export default MissionVision;