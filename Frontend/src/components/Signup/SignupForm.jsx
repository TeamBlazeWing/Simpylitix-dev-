import { FaUser, FaEnvelope, FaPhone, FaLock, FaEye, FaEyeSlash, FaCheck, FaSpinner } from "react-icons/fa";

const SignupForm = ({
  name,
  setName,
  phoneNumber,
  setPhoneNumber,
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  errors,
  passwordStrength,
  getPasswordStrengthColor,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  isNameValid,
  isLoading,
  focusedField,
  setFocusedField,
  handleSubmit,
  navigate,
}) => {
  const isFormInvalid =
    Object.keys(errors).length > 0 ||
    !name ||
    !phoneNumber ||
    !email ||
    !password ||
    !confirmPassword;

  return (
    <div className="bg-white/10 dark:bg-black/20 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/50">
      <div className="p-8 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-white">Join SimplyTix</h2>
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
  );
};

export default SignupForm;