import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home.jsx";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup.jsx";
import Profile from "./Pages/Profile.jsx";
import Explore from "./Pages/ExploreCourses.jsx";
import Courses from "./Pages/Courses";
import OrderDelivery from "./Pages/OrderDelivery";
import AdminDashboard from "./Pages/AdminDashboard";
import NotFound from "./Pages/NotFound";
import Bot from './Pages/Bot.jsx';
import MyCourses from './Pages/MyCourses.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/order-delivery" element={<OrderDelivery />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/MyCourses" element={<MyCourses />} />
        <Route path="/bot" element={<Bot />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
