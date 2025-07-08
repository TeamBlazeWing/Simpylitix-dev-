import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaUser, FaArrowRight, FaSpinner } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFormFocused, setIsFormFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
  }, []);

  const validate = () => {
    let tempErrors = {};
    
    // Email validation with better regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      tempErrors.email = "Email is required";
    } else if (!emailRegex.test(email)) {
      tempErrors.email = "Please enter a valid email address";
    }
    
    // Password validation
    if (!password) {
      tempErrors.password = "Password is required";
    } else if (password.length < 6) {
      tempErrors.password = "Password must be at least 6 characters";
    }
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handlefogetpassword = () => {
    navigate("/forgetpassword");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validate()) return;
  
    try {
      setIsLoading(true);
      setErrors({});
      console.log('Attempting login with:', { email, password: '***' });
      
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
      console.log('Login response:', { status: response.status, data });

      if (response.ok && (data.accessToken || data.token)) {
        // Store the token directly (not as JSON string)
        const token = data.accessToken || data.token;
        localStorage.setItem("accessToken", token);
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("loggedInUser", data.user?.name || data.user?.email || email);
        localStorage.setItem("userId", data.user?._id || data.user?.id);
        
        console.log('Stored in localStorage:', {
          accessToken: localStorage.getItem("accessToken"),
          isLoggedIn: localStorage.getItem("isLoggedIn"),
          loggedInUser: localStorage.getItem("loggedInUser"),
          userId: localStorage.getItem("userId")
        });
        
        // Success animation before redirect
        setErrors({ general: "✅ Login successful! Redirecting..." });
        setTimeout(() => navigate("/dashboard"), 1500);
      } else {
        // Handle login failure (e.g., wrong email/password)
        console.error('Login failed:', data);
        setErrors({ general: data.message || "❌ Invalid email or password" });
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrors({ general: "🔌 Network error. Please check your connection and try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupNavigate = () => {
    navigate("/signup");
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 dark:from-black dark:via-gray-900 dark:to-black flex items-center justify-center relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -top-10 -right-10 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>
      
      {/* Large Background Logo */}
      <div className="absolute inset-0 flex items-center justify-center opacity-5 dark:opacity-10">
        <img 
          src="/simplytix.svg" 
          alt="SimplyTix Background" 
          className="w-96 h-96 md:w-[500px] md:h-[500px] lg:w-[600px] lg:h-[600px] object-contain animate-pulse"
        />
      </div>
      
      <div className={`flex flex-col items-center justify-center px-6 py-8 mx-auto w-full max-w-md relative z-10 transform transition-all duration-1000 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        {/* Logo and Brand Name */}
        <div className="flex items-center space-x-4 mb-8 transform hover:scale-105 transition-transform duration-300">
          <img 
            src="/simplytix.svg" 
            alt="SimplyTix Logo" 
            className="w-16 h-16 md:w-20 md:h-20 drop-shadow-lg"
          />
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            SimplyTix
          </h1>
        </div>
        
        <div className={`w-full bg-white/10 dark:bg-black/20 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/50 transform transition-all duration-500 ${isFormFocused ? 'scale-105 shadow-3xl' : 'scale-100'}`}>
          <div className="p-8 space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-white">
                Welcome Back
              </h2>
              <p className="text-gray-300 text-sm">
                Sign in to access your events
              </p>
            </div>
            
            {/* Error Message */}
            {errors.general && (
              <div className={`p-4 rounded-lg border transition-all duration-300 ${
                errors.general.includes('✅') 
                  ? 'bg-green-500/20 border-green-500/50 text-green-300' 
                  : 'bg-red-500/20 border-red-500/50 text-red-300'
              }`}>
                <p className="text-sm font-medium text-center">{errors.general}</p>
              </div>
            )}
            
            <form 
              className="space-y-6" 
              onSubmit={handleLogin}
              onFocus={() => setIsFormFocused(true)}
              onBlur={() => setIsFormFocused(false)}
            >
              {/* Email Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Email Address
                </label>
                <div className={`relative transform transition-all duration-300 ${emailFocused ? 'scale-105' : 'scale-100'}`}>
                  <FaEnvelope className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${emailFocused ? 'text-blue-400' : 'text-gray-400'}`} />
                  <input
                    type="email"
                    name="email"
                    className={`w-full pl-12 pr-4 py-3 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                      errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-600 hover:border-gray-500'
                    }`}
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setEmailFocused(true)}
                    onBlur={() => setEmailFocused(false)}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-400 text-sm flex items-center space-x-1 animate-shake">
                    <span>⚠️</span>
                    <span>{errors.email}</span>
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Password
                </label>
                <div className={`relative transform transition-all duration-300 ${passwordFocused ? 'scale-105' : 'scale-100'}`}>
                  <FaLock className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${passwordFocused ? 'text-blue-400' : 'text-gray-400'}`} />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    className={`w-full pl-12 pr-12 py-3 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                      errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-600 hover:border-gray-500'
                    }`}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-300"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-400 text-sm flex items-center space-x-1 animate-shake">
                    <span>⚠️</span>
                    <span>{errors.password}</span>
                  </p>
                )}
              </div>

              {/* Forgot Password */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handlefogetpassword}
                  className="text-sm text-blue-400 hover:text-blue-300 transition-colors duration-300 hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              {/* Login Button */}
              <button 
                type="submit" 
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-300 transform ${
                  isLoading 
                    ? 'bg-gray-600 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:scale-105 active:scale-95'
                } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent shadow-lg hover:shadow-xl`}
              >
                <div className="flex items-center justify-center space-x-2">
                  {isLoading ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
                    </>
                  )}
                </div>
              </button>
            </form>

            {/* Sign Up Link */}
            <div className="text-center pt-4 border-t border-gray-600/50">
              <p className="text-sm text-gray-400">
                Don't have an account?{' '}
                <button
                  onClick={handleSignupNavigate}
                  className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-300 hover:underline"
                >
                  Sign up
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
