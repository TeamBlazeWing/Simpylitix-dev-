import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Signup from './Pages/Signup'
import Login from './Pages/Login'
import Dashboard from './Pages/Dashboard'
import FogetPassword from './components/FogetPassword/FogetPassword'
import About from './Pages/Aboutus'
import Contactus from './Pages/Contactus'
import Payment from './Pages/Payment' 
import MyTickets from './Pages/MyTickets'
import Myevents from './Pages/Myevents' 


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/forgetpassword" element={<FogetPassword />} />
        <Route path="/events" element={<Event />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contactus />} />
        <Route path="/mytickets" element={<MyTickets />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/myevents" element={<Myevents />} />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  )
}

export default App