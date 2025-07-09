import { useState } from "react";
import { FaMessage, FaStar, FaHeadset, FaPhone, FaLinkedin, FaTwitter, FaInstagram, FaPaperPlane, FaUser, FaEnvelope } from "react-icons/fa6";
import { FaCheckCircle } from "react-icons/fa";
import { MdEventAvailable, MdVolunteerActivism, MdSupportAgent } from "react-icons/md";
import "./styles.css";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    inquiryType: 'general'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Invalid email format';
    if (!formData.subject.trim()) errors.subject = 'Subject is required';
    if (!formData.message.trim()) errors.message = 'Message is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        inquiryType: 'general'
      });
      
      // Reset success message after 5 seconds
      setTimeout(() => setSubmitted(false), 5000);
    }, 1500);
  };

  return (
    <div className="w-full max-w-6xl mx-auto mb-16 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Enhanced Contact Form */}
        <div className="glass-effect-strong rounded-2xl shadow-2xl p-8 hover-lift transition-all duration-500 interactive-card animate-slide-in-left">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gradient mb-4">Send Us a Message</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-shimmer"></div>
          </div>
          
          {submitted && (
            <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-400/50 rounded-2xl p-6 mb-8 animate-fade-in-up backdrop-blur-lg">
              <div className="flex items-center gap-3">
                <FaCheckCircle className="text-green-400 text-2xl animate-bounce-custom" />
                <div>
                  <p className="text-green-300 font-semibold">Message Sent Successfully!</p>
                  <p className="text-green-400 text-sm">We'll get back to you within 24 hours.</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-300 mb-3 transition-colors duration-300">
                  Full Name *
                </label>
                <div className="relative">
                  <FaUser className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${
                    focusedField === 'name' ? 'text-blue-400' : 'text-gray-500'
                  }`} />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField(null)}
                    required
                    className={`w-full pl-12 pr-4 py-4 glass-effect rounded-xl border-2 transition-all duration-300 text-white placeholder-gray-400 focus:outline-none ${
                      focusedField === 'name' 
                        ? 'border-blue-400 shadow-lg shadow-blue-400/25' 
                        : formErrors.name 
                          ? 'border-red-400' 
                          : 'border-gray-600 hover:border-gray-500'
                    }`}
                    placeholder="Your full name"
                  />
                </div>
                {formErrors.name && (
                  <p className="text-red-400 text-sm mt-2 animate-fade-in-up">{formErrors.name}</p>
                )}
              </div>
              
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-300 mb-3">
                  Email Address *
                </label>
                <div className="relative">
                  <FaEnvelope className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${
                    focusedField === 'email' ? 'text-purple-400' : 'text-gray-500'
                  }`} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    required
                    className={`w-full pl-12 pr-4 py-4 glass-effect rounded-xl border-2 transition-all duration-300 text-white placeholder-gray-400 focus:outline-none ${
                      focusedField === 'email' 
                        ? 'border-purple-400 shadow-lg shadow-purple-400/25' 
                        : formErrors.email 
                          ? 'border-red-400' 
                          : 'border-gray-600 hover:border-gray-500'
                    }`}
                    placeholder="your.email@example.com"
                  />
                </div>
                {formErrors.email && (
                  <p className="text-red-400 text-sm mt-2 animate-fade-in-up">{formErrors.email}</p>
                )}
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm font-semibold text-gray-300 mb-3">
                Inquiry Type
              </label>
              <select
                name="inquiryType"
                value={formData.inquiryType}
                onChange={handleInputChange}
                className="w-full px-4 py-4 glass-effect rounded-xl border-2 border-gray-600 hover:border-gray-500 focus:border-green-400 focus:shadow-lg focus:shadow-green-400/25 transition-all duration-300 text-white focus:outline-none"
              >
                <option value="general" className="bg-gray-800 text-white">General Inquiry</option>
                <option value="event" className="bg-gray-800 text-white">Event Organization</option>
                <option value="volunteer" className="bg-gray-800 text-white">Volunteer Opportunities</option>
                <option value="technical" className="bg-gray-800 text-white">Technical Support</option>
                <option value="partnership" className="bg-gray-800 text-white">Partnership</option>
              </select>
            </div>

            <div className="relative">
              <label className="block text-sm font-semibold text-gray-300 mb-3">
                Subject *
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                onFocus={() => setFocusedField('subject')}
                onBlur={() => setFocusedField(null)}
                required
                className={`w-full px-4 py-4 glass-effect rounded-xl border-2 transition-all duration-300 text-white placeholder-gray-400 focus:outline-none ${
                  focusedField === 'subject' 
                    ? 'border-yellow-400 shadow-lg shadow-yellow-400/25' 
                    : formErrors.subject 
                      ? 'border-red-400' 
                      : 'border-gray-600 hover:border-gray-500'
                }`}
                placeholder="Brief subject of your message"
              />
              {formErrors.subject && (
                <p className="text-red-400 text-sm mt-2 animate-fade-in-up">{formErrors.subject}</p>
              )}
            </div>

            <div className="relative">
              <label className="block text-sm font-semibold text-gray-300 mb-3">
                Message *
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                onFocus={() => setFocusedField('message')}
                onBlur={() => setFocusedField(null)}
                required
                rows={6}
                className={`w-full px-4 py-4 glass-effect rounded-xl border-2 transition-all duration-300 text-white placeholder-gray-400 resize-vertical focus:outline-none ${
                  focusedField === 'message' 
                    ? 'border-pink-400 shadow-lg shadow-pink-400/25' 
                    : formErrors.message 
                      ? 'border-red-400' 
                      : 'border-gray-600 hover:border-gray-500'
                }`}
                placeholder="Tell us more about your inquiry..."
              />
              {formErrors.message && (
                <p className="text-red-400 text-sm mt-2 animate-fade-in-up">{formErrors.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-4 px-8 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-3 relative overflow-hidden group ${
                isSubmitting 
                  ? 'bg-gray-600 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover-lift animate-glow'
              } text-white`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10 flex items-center space-x-3">
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <FaPaperPlane className="group-hover:animate-bounce-custom" />
                    <span>Send Message</span>
                  </>
                )}
              </div>
            </button>
          </form>
        </div>

        {/* Enhanced Additional Information */}
        <div className="space-y-8 animate-slide-in-right">
          {/* FAQ Section */}
          <div className="glass-effect-strong rounded-2xl shadow-2xl p-8 hover-lift transition-all duration-500 interactive-card">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 p-3 rounded-xl">
                <FaMessage className="text-yellow-400 text-2xl" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gradient">Frequently Asked Questions</h3>
                <div className="w-16 h-1 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full mt-1"></div>
              </div>
            </div>
            
            <div className="space-y-6">
              {[
                {
                  question: "How do I organize an event?",
                  answer: "Contact our events team at events@simplytix.com or call (555) 123-4568. We'll guide you through the process.",
                  icon: <MdEventAvailable className="text-blue-400" />
                },
                {
                  question: "Can I become a volunteer?",
                  answer: "Absolutely! We're always looking for passionate volunteers. Fill out the contact form or visit our office.",
                  icon: <MdVolunteerActivism className="text-green-400" />
                },
                {
                  question: "How do I cancel my event subscription?",
                  answer: "You can manage your subscriptions in your profile or contact our support team for assistance.",
                  icon: <MdSupportAgent className="text-purple-400" />
                }
              ].map((faq, index) => (
                <div key={index} className="group bg-white/5 backdrop-blur-lg rounded-xl p-6 hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-white/20" style={{animationDelay: `${index * 0.1}s`}}>
                  <div className="flex items-start gap-4">
                    <div className="bg-white/10 p-2 rounded-lg group-hover:scale-110 transition-transform duration-300">
                      {faq.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-bold mb-3 group-hover:text-blue-300 transition-colors duration-300">{faq.question}</h4>
                      <p className="text-gray-300 text-sm leading-relaxed group-hover:text-gray-200 transition-colors duration-300">{faq.answer}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Social Media Section */}
          <div className="glass-effect-strong rounded-2xl shadow-2xl p-8 hover-lift transition-all duration-500 interactive-card">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 p-3 rounded-xl">
                <FaStar className="text-pink-400 text-2xl" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gradient">Connect With Us</h3>
                <div className="w-16 h-1 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full mt-1"></div>
              </div>
            </div>
            
            <div className="space-y-4 mb-6">
              {[
                { icon: <FaLinkedin />, name: "LinkedIn", handle: "@SimplyTix", color: "blue", bg: "from-blue-600/20 to-blue-800/20", border: "border-blue-400/30" },
                { icon: <FaTwitter />, name: "Twitter", handle: "@SimplyTix", color: "sky", bg: "from-sky-600/20 to-sky-800/20", border: "border-sky-400/30" },
                { icon: <FaInstagram />, name: "Instagram", handle: "@SimplyTix", color: "pink", bg: "from-pink-600/20 to-pink-800/20", border: "border-pink-400/30" }
              ].map((social, index) => (
                <div key={index} className={`group flex items-center gap-4 bg-gradient-to-r ${social.bg} backdrop-blur-lg p-4 rounded-xl border ${social.border} hover:border-white/40 hover:scale-105 transition-all duration-300 cursor-pointer`}>
                  <div className={`text-${social.color}-400 text-xl group-hover:animate-bounce-custom`}>
                    {social.icon}
                  </div>
                  <div className="flex-1">
                    <span className="text-white font-semibold">{social.name}</span>
                    <span className="text-gray-400 ml-2">{social.handle}</span>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-xs text-gray-400">Click to visit</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center">
              <p className="text-gray-400 text-sm mb-4">Follow us for updates and behind-the-scenes content</p>
              <div className="flex justify-center gap-2">
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
              </div>
            </div>
          </div>

          {/* Emergency Support Section */}
          <div className="glass-effect-strong rounded-2xl shadow-2xl p-8 hover-lift transition-all duration-500 interactive-card border-2 border-red-500/20 hover:border-red-400/40">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 p-3 rounded-xl animate-pulse-custom">
                <FaHeadset className="text-red-400 text-2xl" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gradient">Emergency Support</h3>
                <div className="w-16 h-1 bg-gradient-to-r from-red-500 to-orange-500 rounded-full mt-1"></div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-red-600/10 to-orange-600/10 backdrop-blur-lg rounded-xl p-6 border border-red-400/20">
              <p className="text-gray-300 mb-6 leading-relaxed">
                For urgent issues during events or technical emergencies, our 24/7 support line is available. 
                Our emergency team responds within minutes to critical situations.
              </p>
              
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-red-500/20 p-3 rounded-full animate-glow">
                    <FaPhone className="text-red-400 text-xl" />
                  </div>
                  <div>
                    <div className="text-white font-bold text-lg">(555) 911-HELP</div>
                    <div className="text-red-300 text-sm">Emergency Hotline</div>
                  </div>
                </div>
                
                <button className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 hover-lift animate-pulse-custom">
                  Call Emergency
                </button>
              </div>
              
              <div className="mt-4 text-center">
                <div className="flex justify-center items-center gap-2">
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-ping"></div>
                  <span className="text-red-300 text-xs">Available 24/7/365</span>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics Section */}
          <div className="glass-effect-strong rounded-2xl shadow-2xl p-8 hover-lift transition-all duration-500 interactive-card">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 p-3 rounded-xl">
                <FaCheckCircle className="text-green-400 text-2xl" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gradient">Our Track Record</h3>
                <div className="w-16 h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mt-1"></div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {[
                { number: "99.9%", label: "Uptime", color: "green" },
                { number: "<2hr", label: "Response Time", color: "blue" },
                { number: "10k+", label: "Happy Clients", color: "purple" },
                { number: "24/7", label: "Support", color: "orange" }
              ].map((stat, index) => (
                <div key={index} className={`text-center p-4 bg-gradient-to-br from-${stat.color}-500/10 to-${stat.color}-700/10 rounded-xl border border-${stat.color}-400/20 hover:border-${stat.color}-400/40 transition-all duration-300 hover:scale-105`}>
                  <div className={`text-2xl font-bold text-${stat.color}-400 mb-1`}>{stat.number}</div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;