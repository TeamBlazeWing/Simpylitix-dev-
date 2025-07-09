import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/General/Navbar";
import Footer from "../components/General/Footer";
import HeroSection from "../components/Contactus/HeroSection";
import ContactInfo from "../components/Contactus/ContactInfo";
import ContactForm from "../components/Contactus/ContactForm";
import FloatingBackground from "../components/Contactus/FloatingBackground";
import "../components/Contactus/styles.css";

const Contactus = () => {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (!loggedInUser) {
      navigate("/contact");
    } else {
      setUsername(loggedInUser);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("accessToken");
    navigate("/contact");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex flex-col relative overflow-hidden">
      {/* Floating background elements */}
      <FloatingBackground />
      
      {/* Main content */}
      <div className="relative z-10">
        <Navbar username={username} onLogout={handleLogout} />
        <main className="flex-1">
          <HeroSection />
          <ContactInfo />
          <ContactForm />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Contactus;