import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaUser, FaEnvelope, FaPhone, FaLock, FaCheck, FaTimes, FaSpinner } from "react-icons/fa";

const Signup = () => {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isNameValid, setIsNameValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [focusedField, setFocusedField] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
  }, []);

  const calculatePasswordStrength = (pwd) => {
    const hasLower = /[a-z]/.test(pwd);
    const hasUpper = /[A-Z]/.test(pwd);
    const hasSpecial = /[!@#$%^&*]/.test(pwd);
    const length = pwd.length >= 8;

    if (hasLower && hasUpper && hasSpecial && length) return "Strong";
    if ((hasLower || hasUpper) && length) return "Medium";
    if (length) return "Weak";
    if (pwd.length === 0) return "";
    return "Very Weak";
  };

  const getPasswordStrengthColor = (strength) => {
    switch (strength) {
      case "Strong": return "text-green-400";
      case "Medium": return "text-yellow-400";
      case "Weak": return "text-orange-400";
      case "Very Weak": return "text-red-400";
      default: return "text-gray-400";
    }
  };

  useEffect(() => {
    const newErrors = {};

    if (name && name.length < 8) {
      newErrors.name = "Name must be at least 8 characters";
      setIsNameValid(false);
    } else {
      setIsNameValid(true);
    }

    if (phoneNumber && !/^94\d{9}$/.test(phoneNumber)) {
      newErrors.phoneNumber = "Phone number must start with 94 followed by 9 digits";
    }

    if (email && !/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invalid email format";
    }

    if (password) {
      if (
        !/[a-z]/.test(password) ||
        !/[A-Z]/.test(password) ||
        !/[!@#$%^&*]/.test(password)
      ) {
        newErrors.password =
          "Must include lowercase, uppercase, and special character";
      }
    }

    if (confirmPassword && confirmPassword !== password) {
      newErrors.confirmPassword = "Passwords must match";
    }

    setErrors(newErrors);
    setPasswordStrength(calculatePasswordStrength(password));
  }, [name, phoneNumber, email, password, confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const newErrors = {};
    if (!name) newErrors.name = "Name is required";
    if (!phoneNumber) newErrors.phoneNumber = "Phone number is required";
    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";
    if (!confirmPassword)
      newErrors.confirmPassword = "Confirm Password is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          mobileNumber: phoneNumber,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
      }

      setErrors({ general: "✅ Signup successful! Redirecting to login..." });
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setErrors({ general: `❌ ${error.message || "Signup failed"}` });
      console.error("Signup failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  const isFormInvalid =
    Object.keys(errors).length > 0 ||
    !name ||
    !phoneNumber ||
    !email ||
    !password ||
    !confirmPassword;

  return (
    <section className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 dark:from-black dark:via-gray-900 dark:to-black flex items-center justify-center relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -left-10 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -top-10 -right-10 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Large Background Logo */}
      <div className="absolute inset-0 flex items-center justify-center opacity-5 dark:opacity-10">
        <img 
          src="/simplytix.svg" 
          alt="SimplyTix Background" 
          className="w-96 h-96 md:w-[500px] md:h-[500px] lg:w-[600px] lg:h-[600px] object-contain animate-pulse"
        />
      </div>

      <div className={`w-full max-w-2xl mx-auto p-6 relative z-10 transform transition-all duration-1000 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        {/* Logo and Brand Name */}
        <div className="flex items-center justify-center space-x-4 mb-8 transform hover:scale-105 transition-transform duration-300">
          <img 
            src="/simplytix.svg" 
            alt="SimplyTix Logo" 
            className="w-16 h-16 md:w-20 md:h-20 drop-shadow-lg"
          />
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
            SimplyTix
          </h1>
        </div>

        <div className="bg-white/10 dark:bg-black/20 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/50">
          <div className="p-8 space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-white">
                Join SimplyTix
              </h2>
              <p className="text-gray-300 text-sm">
                Create your account to start booking amazing events
              </p>
            </div>

            {/* Error/Success Message */}
            {errors.general && (
              <div className={`p-4 rounded-lg border transition-all duration-300 ${
                errors.general.includes('✅') 
                  ? 'bg-green-500/20 border-green-500/50 text-green-300' 
                  : 'bg-red-500/20 border-red-500/50 text-red-300'
              }`}>
                <p className="text-sm font-medium text-center">{errors.general}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Full Name
                </label>
                <div className={`relative transform transition-all duration-300 ${focusedField === 'name' ? 'scale-105' : 'scale-100'}`}>
                  <FaUser className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${focusedField === 'name' ? 'text-purple-400' : 'text-gray-400'}`} />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField('')}
                    className={`w-full pl-12 pr-12 py-3 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ${
                      errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-600 hover:border-gray-500'
                    }`}
                    placeholder="Enter your full name"
                  />
                  {name && isNameValid && (
                    <FaCheck className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-400" />
                  )}
                </div>
                {errors.name && (
                  <p className="text-red-400 text-sm flex items-center space-x-1 animate-shake">
                    <span>⚠️</span>
                    <span>{errors.name}</span>
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Email Address
                </label>
                <div className={`relative transform transition-all duration-300 ${focusedField === 'email' ? 'scale-105' : 'scale-100'}`}>
                  <FaEnvelope className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${focusedField === 'email' ? 'text-purple-400' : 'text-gray-400'}`} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField('')}
                    className={`w-full pl-12 pr-12 py-3 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ${
                      errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-600 hover:border-gray-500'
                    }`}
                    placeholder="Enter your email"
                  />
                  {email && !errors.email && /\S+@\S+\.\S+/.test(email) && (
                    <FaCheck className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-400" />
                  )}
                </div>
                {errors.email && (
                  <p className="text-red-400 text-sm flex items-center space-x-1 animate-shake">
                    <span>⚠️</span>
                    <span>{errors.email}</span>
                  </p>
                )}
              </div>

              {/* Phone Number Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Phone Number
                </label>
                <div className={`relative transform transition-all duration-300 ${focusedField === 'phone' ? 'scale-105' : 'scale-100'}`}>
                  <FaPhone className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${focusedField === 'phone' ? 'text-purple-400' : 'text-gray-400'}`} />
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    onFocus={() => setFocusedField('phone')}
                    onBlur={() => setFocusedField('')}
                    className={`w-full pl-12 pr-12 py-3 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ${
                      errors.phoneNumber ? 'border-red-500 focus:ring-red-500' : 'border-gray-600 hover:border-gray-500'
                    }`}
                    placeholder="Enter phone number (94XXXXXXXXX)"
                    maxLength="11"
                  />
                  {phoneNumber && !errors.phoneNumber && /^94\d{9}$/.test(phoneNumber) && (
                    <FaCheck className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-400" />
                  )}
                </div>
                {errors.phoneNumber && (
                  <p className="text-red-400 text-sm flex items-center space-x-1 animate-shake">
                    <span>⚠️</span>
                    <span>{errors.phoneNumber}</span>
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Password
                </label>
                <div className={`relative transform transition-all duration-300 ${focusedField === 'password' ? 'scale-105' : 'scale-100'}`}>
                  <FaLock className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${focusedField === 'password' ? 'text-purple-400' : 'text-gray-400'}`} />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField('')}
                    className={`w-full pl-12 pr-12 py-3 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ${
                      errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-600 hover:border-gray-500'
                    }`}
                    placeholder="Enter password"
                    disabled={!isNameValid}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-300"
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
                {password && passwordStrength && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-400">Password Strength:</span>
                    <span className={`text-sm font-medium ${getPasswordStrengthColor(passwordStrength)}`}>
                      {passwordStrength}
                    </span>
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Confirm Password
                </label>
                <div className={`relative transform transition-all duration-300 ${focusedField === 'confirmPassword' ? 'scale-105' : 'scale-100'}`}>
                  <FaLock className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${focusedField === 'confirmPassword' ? 'text-purple-400' : 'text-gray-400'}`} />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onFocus={() => setFocusedField('confirmPassword')}
                    onBlur={() => setFocusedField('')}
                    className={`w-full pl-12 pr-12 py-3 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ${
                      errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : 'border-gray-600 hover:border-gray-500'
                    }`}
                    placeholder="Confirm your password"
                    disabled={!isNameValid}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-300"
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-400 text-sm flex items-center space-x-1 animate-shake">
                    <span>⚠️</span>
                    <span>{errors.confirmPassword}</span>
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isFormInvalid || isLoading}
                className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-300 transform ${
                  isFormInvalid || isLoading
                    ? 'bg-gray-600 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 hover:scale-105 active:scale-95'
                } focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent shadow-lg hover:shadow-xl`}
              >
                <div className="flex items-center justify-center space-x-2">
                  {isLoading ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <span>Create Account</span>
                  )}
                </div>
              </button>
            </form>

            {/* Login Link */}
            <div className="text-center pt-4 border-t border-gray-600/50">
              <p className="text-sm text-gray-400">
                Already have an account?{' '}
                <button
                  onClick={() => navigate("/login")}
                  className="text-purple-400 hover:text-purple-300 font-medium transition-colors duration-300 hover:underline"
                >
                  Sign in
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Signup;
