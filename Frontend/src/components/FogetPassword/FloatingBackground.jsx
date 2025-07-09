import "./styles.css";

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

export default FloatingBackground;