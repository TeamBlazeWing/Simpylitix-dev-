import "./styles.css";

const HeroSection = () => {
  return (
    <div className="w-full max-w-6xl mx-auto mb-16 px-4">
      <div className="glass-effect rounded-3xl shadow-2xl p-12 text-center relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-custom"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-pink-500 to-red-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-custom" style={{ animationDelay: "1s" }}></div>
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

export default HeroSection;