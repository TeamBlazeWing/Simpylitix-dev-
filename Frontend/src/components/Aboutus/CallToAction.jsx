import "./styles.css";

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

export default CallToAction;