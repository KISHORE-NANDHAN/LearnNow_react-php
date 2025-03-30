import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home.jsx";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup.jsx";
import Profile from "./Pages/Profile.jsx";
import Explore from "./Pages/ExploreCourses.jsx";
import Course from "./Pages/Course.jsx";
import AdminDashboard from "./Pages/AdminDashboard";
import NotFound from "./Pages/NotFound";
import Bot from './Pages/Bot.jsx';
import MyCourses from './Pages/MyCourses.jsx';
import Certifications from './Pages/Certifications.jsx';
import Forget_password from './Pages/Forget_password.jsx';
import Logout from './Pages/Logout.jsx';
import { AlertProvider } from "./Context/AlertContext.jsx";

function App() {
  return (
    <AlertProvider> {/* ✅ Wrap the entire app */}
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/course/:courseId" element={<Course />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/MyCourses" element={<MyCourses />} />
          <Route path="/bot" element={<Bot />} />
          <Route path="/certifications" element={<Certifications />} />
          <Route path="/otp" element={<Forget_password />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AlertProvider>
  );
}

export default App;
