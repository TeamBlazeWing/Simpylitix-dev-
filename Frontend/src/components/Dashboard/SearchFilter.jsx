import Select from "react-select";
import { FaFilter, FaTimes, FaMapMarkerAlt, FaCalendarAlt, FaUsers, FaDollarSign, FaClock } from "react-icons/fa";
import { useState } from "react";

// Search Filter Component
const SearchFilter = ({ onFilterChange, filters, events }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  // Extract unique values from actual events data
  const districts = ["All", ...new Set(events.map(event => event.district))];
  const types = ["All", ...new Set(events.map(event => event.type))];
  const createdByUsers = ["All", ...new Set(events.map(event => event.createdByName).filter(Boolean))];

  // Date range options
  const dateRanges = [
    { value: "All", label: "All Dates" },
    { value: "today", label: "Today" },
    { value: "this-week", label: "This Week" },
    { value: "this-month", label: "This Month" },
    { value: "next-month", label: "Next Month" }
  ];

  // Price range options
  const priceRanges = [
    { value: "All", label: "All Prices" },
    { value: "free", label: "Free Events" },
    { value: "0-50", label: "$0 - $50" },
    { value: "50-100", label: "$50 - $100" },
    { value: "100-200", label: "$100 - $200" },
    { value: "200+", label: "$200+" }
  ];

  // Check if any filters are active
  const hasActiveFilters = filters.district !== "All" || filters.type !== "All" || filters.createdBy !== "All" || filters.dateRange !== "All" || filters.priceRange !== "All";

  // Custom styles for react-select with enhanced design and fixed visibility
  const customStyles = {
    control: (base, state) => ({
      ...base,
      padding: '8px 16px',
      borderRadius: '12px',
      color: 'white',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      border: state.isFocused 
        ? '2px solid rgba(147, 51, 234, 0.8)' 
        : '2px solid rgba(255, 255, 255, 0.2)',
      boxShadow: state.isFocused 
        ? '0 0 20px rgba(147, 51, 234, 0.3)' 
        : '0 4px 15px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s ease',
      minHeight: '50px',
      '&:hover': {
        borderColor: 'rgba(147, 51, 234, 0.6)',
        boxShadow: '0 4px 20px rgba(147, 51, 234, 0.2)',
      },
    }),
    placeholder: (base) => ({
      ...base,
      color: 'rgba(255, 255, 255, 0.7)',
      fontWeight: '500',
    }),
    input: (base) => ({
      ...base,
      color: 'white',
    }),
    dropdownIndicator: (base) => ({
      ...base,
      color: 'rgba(255, 255, 255, 0.8)',
      transition: 'color 0.3s ease',
      '&:hover': {
        color: 'rgba(147, 51, 234, 1)',
      },
    }),
    singleValue: (base) => ({
      ...base,
      color: 'white',
      fontWeight: '600',
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: 'rgba(0, 0, 0, 0.95)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(147, 51, 234, 0.3)',
      borderRadius: '12px',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
      overflow: 'hidden',
      zIndex: 9999, // Ensure dropdown appears above other elements
      position: 'absolute',
    }),
    menuList: (base) => ({
      ...base,
      maxHeight: '200px',
      // Custom scrollbar styling
      '&::-webkit-scrollbar': {
        width: '8px',
      },
      '&::-webkit-scrollbar-track': {
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '4px',
      },
      '&::-webkit-scrollbar-thumb': {
        background: 'rgba(147, 51, 234, 0.6)',
        borderRadius: '4px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
      },
      '&::-webkit-scrollbar-thumb:hover': {
        background: 'rgba(147, 51, 234, 0.8)',
      },
      // Firefox scrollbar styling
      scrollbarWidth: 'thin',
      scrollbarColor: 'rgba(147, 51, 234, 0.6) rgba(255, 255, 255, 0.1)',
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused 
        ? 'rgba(147, 51, 234, 0.3)' 
        : 'transparent',
      color: 'white',
      padding: '12px 16px',
      transition: 'all 0.2s ease',
      cursor: 'pointer',
      '&:active': {
        backgroundColor: 'rgba(147, 51, 234, 0.5)',
      },
      '&:hover': {
        backgroundColor: 'rgba(147, 51, 234, 0.3)',
        transform: 'translateX(4px)',
      },
    }),
    indicatorSeparator: (base) => ({
      ...base,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
    }),
    menuPortal: (base) => ({
      ...base,
      zIndex: 9999, // Ensure portal dropdown appears above other elements
    }),
  };

  // Convert arrays to options format for react-select
  const districtOptions = districts.map(district => ({ value: district, label: district }));
  const typeOptions = types.map(type => ({ value: type, label: type }));
  const createdByOptions = createdByUsers.map(user => ({ value: user, label: user }));

  // Clear all filters
  const clearAllFilters = () => {
    onFilterChange({ 
      district: "All", 
      type: "All", 
      createdBy: "All",
      dateRange: "All",
      priceRange: "All"
    });
  };

  return (
    <div className="w-full max-w-7xl mx-auto mb-8 px-4 md:px-6 lg:px-8">
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full shadow-lg">
              <FaFilter className="text-white text-xl" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">Filter Events</h2>
              <p className="text-gray-400 text-sm">Find the perfect event for you</p>
            </div>
          </div>
          
          {/* Toggle Button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="lg:hidden p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300 backdrop-blur-sm border border-white/20"
          >
            <FaFilter className={`text-white transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
          </button>
        </div>
        
        {/* Active Filters Indicator */}
        {hasActiveFilters && (
          <div className="mt-4 flex items-center gap-2">
            <span className="text-sm text-gray-400">Active filters:</span>
            <div className="flex flex-wrap gap-2">
              {filters.district !== "All" && (
                <span className="px-3 py-1 bg-purple-600/30 text-purple-300 rounded-full text-xs border border-purple-500/30 backdrop-blur-sm">
                  📍 {filters.district}
                </span>
              )}
              {filters.type !== "All" && (
                <span className="px-3 py-1 bg-blue-600/30 text-blue-300 rounded-full text-xs border border-blue-500/30 backdrop-blur-sm">
                  🎯 {filters.type}
                </span>
              )}
              {filters.createdBy !== "All" && (
                <span className="px-3 py-1 bg-green-600/30 text-green-300 rounded-full text-xs border border-green-500/30 backdrop-blur-sm">
                  � {filters.createdBy}
                </span>
              )}
              {filters.dateRange !== "All" && (
                <span className="px-3 py-1 bg-indigo-600/30 text-indigo-300 rounded-full text-xs border border-indigo-500/30 backdrop-blur-sm">
                  📅 {dateRanges.find(d => d.value === filters.dateRange)?.label}
                </span>
              )}
              {filters.priceRange !== "All" && (
                <span className="px-3 py-1 bg-yellow-600/30 text-yellow-300 rounded-full text-xs border border-yellow-500/30 backdrop-blur-sm">
                  � {priceRanges.find(p => p.value === filters.priceRange)?.label}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Filter Container */}
      <div className={`transition-all duration-500 ease-in-out ${isExpanded ? 'opacity-100 max-h-96' : 'opacity-0 max-h-0 lg:opacity-100 lg:max-h-96'} overflow-hidden`}>
        <div className="bg-gradient-to-br from-black/40 via-purple-900/20 to-black/40 backdrop-blur-xl rounded-2xl p-6 md:p-8 border border-white/10 shadow-2xl">
          
          {/* Filter Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 items-end">
            {/* District Filter */}
            <div className="group">
              <label className="block text-sm font-semibold text-white mb-3 flex items-center gap-2 transition-colors duration-300 group-hover:text-purple-300">
                <FaMapMarkerAlt className="text-purple-400" />
                District
              </label>
              <Select
                value={districtOptions.find(option => option.value === filters.district)}
                onChange={(selectedOption) => onFilterChange({ ...filters, district: selectedOption.value })}
                options={districtOptions}
                styles={customStyles}
                placeholder="Select District"
                className="react-select-container"
                classNamePrefix="react-select"
                menuPortalTarget={document.body}
                menuPosition="fixed"
              />
            </div>

            {/* Type Filter */}
            <div className="group">
              <label className="block text-sm font-semibold text-white mb-3 flex items-center gap-2 transition-colors duration-300 group-hover:text-blue-300">
                <FaCalendarAlt className="text-blue-400" />
                Event Type
              </label>
              <Select
                value={typeOptions.find(option => option.value === filters.type)}
                onChange={(selectedOption) => onFilterChange({ ...filters, type: selectedOption.value })}
                options={typeOptions}
                styles={customStyles}
                placeholder="Select Type"
                className="react-select-container"
                classNamePrefix="react-select"
                menuPortalTarget={document.body}
                menuPosition="fixed"
              />
            </div>

            {/* Created By Filter */}
            <div className="group">
              <label className="block text-sm font-semibold text-white mb-3 flex items-center gap-2 transition-colors duration-300 group-hover:text-green-300">
                <FaUsers className="text-green-400" />
                Created By
              </label>
              <Select
                value={createdByOptions.find(option => option.value === filters.createdBy)}
                onChange={(selectedOption) => onFilterChange({ ...filters, createdBy: selectedOption.value })}
                options={createdByOptions}
                styles={customStyles}
                placeholder="Select Creator"
                className="react-select-container"
                classNamePrefix="react-select"
                menuPortalTarget={document.body}
                menuPosition="fixed"
              />
            </div>

            {/* Date Range Filter */}
            <div className="group">
              <label className="block text-sm font-semibold text-white mb-3 flex items-center gap-2 transition-colors duration-300 group-hover:text-indigo-300">
                <FaClock className="text-indigo-400" />
                Date Range
              </label>
              <Select
                value={dateRanges.find(option => option.value === filters.dateRange)}
                onChange={(selectedOption) => onFilterChange({ ...filters, dateRange: selectedOption.value })}
                options={dateRanges}
                styles={customStyles}
                placeholder="Select Date Range"
                className="react-select-container"
                classNamePrefix="react-select"
                menuPortalTarget={document.body}
                menuPosition="fixed"
              />
            </div>

            {/* Price Range Filter */}
            <div className="group">
              <label className="block text-sm font-semibold text-white mb-3 flex items-center gap-2 transition-colors duration-300 group-hover:text-yellow-300">
                <FaDollarSign className="text-yellow-400" />
                Price Range
              </label>
              <Select
                value={priceRanges.find(option => option.value === filters.priceRange)}
                onChange={(selectedOption) => onFilterChange({ ...filters, priceRange: selectedOption.value })}
                options={priceRanges}
                styles={customStyles}
                placeholder="Select Price Range"
                className="react-select-container"
                classNamePrefix="react-select"
                menuPortalTarget={document.body}
                menuPosition="fixed"
              />
            </div>

            {/* Clear All Button */}
            <div className="group">
              <button
                onClick={clearAllFilters}
                disabled={!hasActiveFilters}
                className={`w-full h-[50px] px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform ${
                  hasActiveFilters
                    ? 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95'
                    : 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
                } backdrop-blur-sm border border-white/20 flex items-center justify-center gap-2`}
              >
                <FaTimes className="text-sm" />
                Clear All
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SearchFilter;