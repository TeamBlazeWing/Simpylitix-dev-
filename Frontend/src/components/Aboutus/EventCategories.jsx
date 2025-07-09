import "./styles.css";

const EventCategories = () => {
  const categories = [
    {
      name: "Music",
      count: 2,
      icon: "🎵",
      description: "Concerts, jazz evenings, and musical performances",
    },
    {
      name: "Art",
      count: 3,
      icon: "🎨",
      description: "Exhibitions, workshops, and cultural events",
    },
    {
      name: "Technology",
      count: 2,
      icon: "💻",
      description: "Conferences, pitch nights, and tech meetups",
    },
    {
      name: "Food",
      count: 2,
      icon: "🍽️",
      description: "Festivals, tastings, and culinary experiences",
    },
    {
      name: "Sports",
      count: 2,
      icon: "⚽",
      description: "Tournaments, competitions, and fitness events",
    },
    {
      name: "Comedy",
      count: 2,
      icon: "😄",
      description: "Stand-up shows and entertainment nights",
    },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto mb-16 px-4">
      <h2 className="text-3xl font-bold text-white text-center mb-8">Event Categories</h2>
      <p className="text-gray-300 text-center mb-12 max-w-2xl mx-auto">
        We host a diverse range of events across multiple categories,
        ensuring there's something for everyone in our community.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category, index) => (
          <div key={index} className="bg-white/10 dark:bg-black/30 backdrop-blur-lg rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl mb-4">{category.icon}</div>
            <h3 className="text-xl font-bold text-white mb-2">{category.name}</h3>
            <p className="text-blue-400 font-semibold mb-3">{category.count} Active Events</p>
            <p className="text-gray-300 text-sm">{category.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventCategories;