import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaArrowRight, FaSpinner } from "react-icons/fa";

const LoginForm = ({
  email,
  setEmail,
  password,
  setPassword,
  errors,
  showPassword,
  setShowPassword,
  isLoading,
  isFormFocused,
  setIsFormFocused,
  emailFocused,
  setEmailFocused,
  passwordFocused,
  setPasswordFocused,
  handleLogin,
  handleForgetPassword,
  handleSignupNavigate,
}) => {
  return (
    <div className={`w-full bg-white/10 dark:bg-black/20 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/50 transform transition-all duration-500 ${isFormFocused ? 'scale-105 shadow-3xl' : 'scale-100'}`}>
      <div className="p-8 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
          <p className="text-gray-300 text-sm">Sign in to access your events</p>
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
              onClick={handleForgetPassword}
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
  );
};

export default LoginForm;