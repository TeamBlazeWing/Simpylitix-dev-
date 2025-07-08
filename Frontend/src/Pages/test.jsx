import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Custom CSS animations
const animationStyles = `
  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
    100% { transform: translateY(0px); }
  }
  @keyframes pulse-soft {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
  @keyframes rotateAndFloat {
    0% { transform: rotate(0deg) translateY(0); }
    50% { transform: rotate(180deg) translateY(-10px); }
    100% { transform: rotate(360deg) translateY(0); }
  }
`;

const Particles = () => {
  return (
    <div className="particles-container">
      {[...Array(20)].map((_, i) => (
        <div 
          key={i} 
          className="particle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${3 + Math.random() * 2}s`,
          }}
        />
      ))}
    </div>
  );
};

const Home = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
      mirror: true
    });
  }, []);

  // Add styles to head
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = animationStyles;
    document.head.appendChild(styleSheet);
    return () => document.head.removeChild(styleSheet);
  }, []);

  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-6 py-28 bg-gradient-to-br from-orange-50 via-white to-orange-100 relative overflow-hidden">
        {/* Floating particles */}
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-${Math.random() * 8 + 2} h-${Math.random() * 8 + 2} bg-orange-${300 + i * 100} rounded-full opacity-${20 + i * 5} animate-float`}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 10 + 5}s`
            }}
          ></div>
        ))}

        {/* Enhanced Background Decorations */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-orange-200 to-orange-300 rounded-full opacity-60 animate-pulse shadow-2xl"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-gradient-to-br from-orange-300 to-orange-400 rounded-full opacity-40 animate-pulse delay-1000 shadow-2xl"></div>
        <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full opacity-30 animate-pulse delay-500 shadow-xl"></div>
        
        {/* Additional floating elements */}
        <div className="absolute top-1/3 left-1/4 w-8 h-8 bg-orange-400 rounded-full opacity-20 animate-bounce delay-300"></div>
        <div className="absolute bottom-1/3 left-1/3 w-12 h-12 bg-orange-300 rounded-full opacity-25 animate-bounce delay-700"></div>
        <div className="absolute top-3/4 right-1/3 w-6 h-6 bg-orange-500 rounded-full opacity-30 animate-bounce delay-1000"></div>

        {/* Animated background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-50/30 to-transparent animate-pulse opacity-50"></div>

        <div className="container mx-auto max-w-7xl text-center relative z-10">
          <div className="space-y-16">
            
            {/* Main Heading Section */}
            <div className="mb-20" data-aos="fade-down">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold leading-tight tracking-tight text-gray-800 transform hover:scale-105 transition-all duration-700">
                <span className="block mb-6 text-gray-800 animate-slideDown">Transforming</span>
                <span className="block bg-gradient-to-r from-orange-600 via-orange-500 to-orange-700 bg-clip-text text-transparent hover:from-orange-500 hover:to-orange-800 transition-all duration-500 animate-slideUp">
                  Ideas Into Reality
                </span>
              </h1>
            </div>

            {/* Subtitle Section */}
            <div className="mb-20" data-aos="fade-up" data-aos-delay="200">
              <p className="text-center text-lg md:text-xl lg:text-2xl text-gray-700 font-light leading-relaxed max-w-4xl mx-auto transform hover:scale-102 transition-all duration-500">
                Jaspern is where <span className="font-semibold text-orange-600 hover:text-orange-700 transition-colors duration-300">innovation meets impact</span>. 
                With expertise across IoT, software development, and cutting-edge solutions, we&apos;re reshaping 
                industries and empowering businesses worldwide.
              </p>
            </div>

            {/* Enhanced CTA Buttons Section */}
            <div className="mb-24" data-aos="fade-up" data-aos-delay="400">
              <div className="flex flex-col sm:flex-row justify-center items-center gap-8 max-w-5xl mx-auto">
                <button className="group min-w-[240px] flex items-center justify-center space-x-3 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 px-12 py-5 font-semibold text-lg text-white shadow-lg transition-all duration-500 hover:from-orange-600 hover:to-orange-700 hover:scale-110 hover:shadow-2xl hover:shadow-orange-500/40 transform hover:-translate-y-2 active:scale-95">
                  <span className="group-hover:animate-pulse">Our Purpose</span>
                  <svg className="w-5 h-5 stroke-current group-hover:translate-x-2 group-hover:scale-110 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                <button className="group min-w-[240px] rounded-full border-2 border-orange-500 px-12 py-5 font-semibold text-lg text-orange-700 transition-all duration-500 hover:bg-gradient-to-r hover:from-orange-500 hover:to-orange-600 hover:text-white hover:scale-110 hover:shadow-xl transform hover:-translate-y-2 active:scale-95 relative overflow-hidden">
                  <span className="relative z-10 group-hover:animate-pulse">Meet the Team</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                </button>

                <button className="group min-w-[220px] rounded-full px-10 py-5 font-semibold text-lg text-orange-700 transition-all duration-500 hover:bg-orange-100 hover:scale-110 hover:shadow-lg transform hover:-translate-y-2 active:scale-95">
                  <span className="relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-orange-500 after:transition-transform after:duration-300 after:ease-in-out group-hover:after:origin-bottom-left group-hover:after:scale-x-100">
                    Get in Touch
                  </span>
                </button>
              </div>
            </div>

            {/* Stats Section */}
            <div data-aos="fade-up" data-aos-delay="600">
              <div className="grid max-w-6xl mx-auto grid-cols-1 md:grid-cols-3 gap-16">
                {[
                  {
                    number: '3+',
                    title: 'Industries Served',
                    desc: 'Building reliable partnerships across diverse sectors',
                  },
                  {
                    number: '10+',
                    title: 'Projects Delivered',
                    desc: 'Consistently evolving with innovation',
                  },
                  {
                    number: '100%',
                    title: 'Client Satisfaction',
                    desc: 'Delivering proven results every time',
                  },
                ].map(({ number, title, desc }) => (
                  <div key={title} className="group text-center space-y-4 px-4 transform hover:scale-105 transition-all duration-500 cursor-pointer">
                    <div className="text-6xl md:text-7xl font-extrabold text-orange-600 group-hover:scale-125 group-hover:text-orange-700 transition-all duration-500 mb-4 relative">
                      <span className="group-hover:animate-bounce inline-block">{number}</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-600 opacity-0 group-hover:opacity-20 rounded-full blur-xl transition-all duration-500"></div>
                    </div>
                    <p className="text-gray-800 font-bold text-2xl mb-3 group-hover:text-orange-600 transition-colors duration-300">{title}</p>
                    <p className="text-gray-600 text-base leading-relaxed max-w-sm mx-auto group-hover:text-gray-700 transition-colors duration-300">{desc}</p>
                    <div className="w-0 group-hover:w-16 h-1 bg-gradient-to-r from-orange-500 to-orange-600 mx-auto transition-all duration-500 rounded-full"></div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </section>

      {/* Enhanced Services Section */}
      <section className="py-32 px-6 bg-gradient-to-b from-white to-orange-50/30 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-10 right-10 w-64 h-64 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full opacity-30 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-48 h-48 bg-gradient-to-br from-orange-200 to-orange-300 rounded-full opacity-20 blur-2xl animate-pulse delay-1000"></div>

        <div className="container mx-auto max-w-7xl relative z-10">
          
          {/* Enhanced Section Heading */}
          <div className="text-center mb-32 space-y-8 group" data-aos="fade-down">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-800 transform group-hover:scale-105 transition-all duration-500">
              Our <span className="text-orange-600 hover:text-orange-700 transition-colors duration-300">Services</span>
            </h2>
            <p className="max-w-4xl mx-auto text-xl md:text-2xl text-gray-600 leading-relaxed transform group-hover:scale-102 transition-all duration-500">
              Comprehensive solutions tailored to drive your business forward.
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-orange-600 mx-auto rounded-full"></div>
          </div>

          {/* Enhanced Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {[
              {
                title: 'IoT Services',
                description: 'Transform your operations with innovative Internet of Things (IoT) solutions tailored to your specific needs and requirements.',
                icon: (
                  <svg className="h-8 w-8 stroke-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                ),
                gradient: 'from-orange-500 to-orange-600',
                hoverGradient: 'from-orange-600 to-orange-700'
              },
              {
                title: 'Web Development',
                description: 'Build high-performance, user-friendly websites designed to engage your audience and achieve your business goals effectively.',
                icon: (
                  <svg className="h-8 w-8 stroke-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                ),
                gradient: 'from-orange-400 to-orange-500',
                hoverGradient: 'from-orange-500 to-orange-600'
              },
              {
                title: 'Problem Solving',
                description: 'Solve complex challenges with innovative solutions that drive success, efficiency, and sustainable growth for your business.',
                icon: (
                  <svg className="h-8 w-8 stroke-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                ),
                gradient: 'from-orange-600 to-orange-700',
                hoverGradient: 'from-orange-700 to-orange-800'
              },
            ].map(({ title, description, icon, gradient, hoverGradient }, index) => (
              <div
                key={title}
                data-aos="fade-up"
                data-aos-delay={index * 200}
                className="group rounded-3xl border border-orange-100 bg-gradient-to-br from-white to-orange-50/50 p-10 shadow-lg transition-all duration-500 hover:shadow-2xl hover:shadow-orange-500/20 hover:-translate-y-6 hover:scale-105 cursor-pointer relative overflow-hidden"
              >
                {/* Hover background effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-orange-100 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
                
                {/* Content */}
                <div className="relative z-10 space-y-6">
                  <div className={`mb-8 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-r ${gradient} group-hover:bg-gradient-to-r group-hover:${hoverGradient} transition-all duration-500 group-hover:scale-125 group-hover:rotate-12 shadow-lg group-hover:shadow-2xl mx-auto`}>
                    <div className="group-hover:scale-110 transition-transform duration-300">
                      {icon}
                    </div>
                  </div>
                  
                  <h3 className="mb-6 text-2xl md:text-3xl font-bold text-gray-800 group-hover:text-orange-600 transition-colors duration-300 text-center">
                    {title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300 text-center text-lg">
                    {description}
                  </p>
                  
                  {/* Learn More link that appears on hover */}
                  <div className="pt-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0 text-center">
                    <a href="#" className="text-orange-600 font-semibold hover:text-orange-700 transition-colors duration-300 flex items-center justify-center space-x-2">
                      <span>Learn More</span>
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                  </div>
                </div>

                {/* Decorative corner elements */}
                <div className="absolute top-6 right-6 w-3 h-3 bg-orange-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute bottom-6 left-6 w-2 h-2 bg-orange-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0);
          }
          50% {
            transform: translateY(-20px) rotate(10deg);
          }
        }
        .animate-float {
          animation: float linear infinite;
        }

        .landing-page {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
        }

        .particles-container {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          pointer-events: none;
        }

        .particle {
          position: absolute;
          width: 6px;
          height: 6px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          animation: rotateAndFloat 5s infinite;
        }

        .content {
          position: relative;
          z-index: 1;
          padding: 2rem;
        }

        .card {
          backdrop-filter: blur(10px);
          background: rgba(255, 255, 255, 0.1);
          border-radius: 15px;
          padding: 2rem;
          margin: 1rem;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
        }

        button {
          background: linear-gradient(45deg, #ff6b6b, #ff8e8e);
          border: none;
          border-radius: 25px;
          padding: 12px 24px;
          color: white;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        button:hover {
          transform: scale(1.05);
          box-shadow: 0 5px 15px rgba(255, 107, 107, 0.4);
        }

        button::after {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(
            rgba(255, 255, 255, 0.2),
            transparent,
            transparent
          );
          transform: rotate(45deg);
          transition: all 0.3s ease;
          opacity: 0;
        }

        button:hover::after {
          opacity: 1;
          transform: rotate(45deg) translate(50%, 50%);
        }

        @media (max-width: 768px) {
          .card {
            margin: 0.5rem;
            padding: 1.5rem;
          }
          
          button {
            padding: 10px 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;