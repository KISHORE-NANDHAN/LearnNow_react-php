import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie"; // Import js-cookie for managing cookies
import bg from '../Media/signupbg.mp4';
import logo from '../Media/logo2.png';
import Alert from "../components/Alert"; // Import Alert component

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [alert, setAlert] = useState({ message: "", type: "" }); // State for Alert
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateForm = (e) => {
    e.preventDefault();
    let valid = true;
    let newErrors = { email: "", password: "" };

    if (!email) {
      newErrors.email = "* Email should not be empty";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "* Enter a valid email address";
      valid = false;
    }

    const passwordPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!password) {
      newErrors.password = "* Password field should not be empty";
      valid = false;
    } else if (!passwordPattern.test(password)) {
      newErrors.password = "* Password should contain uppercase, lowercase, and numbers (min 8 characters)";
      valid = false;
    }

    setErrors(newErrors);
    if (!valid) return;

    // Send request using Axios
    axios
      .post(
        "http://localhost/onlineplatform/backend-php/login.php",
        new URLSearchParams({ mail: email, password }), // Convert to x-www-form-urlencoded
        { withCredentials: true } // Allow credentials (cookies)
      )
      .then((response) => {
        if (response.data.success) {
          // Store user details in localStorage & cookies
          console.log(response);
          localStorage.setItem("session_id", response.data.session_id);
          localStorage.setItem("email", response.data.email);
          localStorage.setItem("username", response.data.username);

          Cookies.set("session_id", response.data.session_id, { expires: 30, path: "/" });
          Cookies.set("username", response.data.username, { expires: 30, path: "/" });
          Cookies.set("isAdmin", response.data.isAdmin, { expires: 30, path: "/" });
          Cookies.set("email", response.data.email, { expires: 30, path: "/" });

          // Show success alert
          setAlert({ message: "Login successful!", type: "success" });

          // Redirect after delay to allow user to see the alert
          setTimeout(() => {
            navigate("/");
          }, 1200);
        } else {
          console.log(response);
          setAlert({ message: response.data.message, type: "error" });
        }
      })
      .catch((error) => {
        console.error("Login Error:", error);
        setAlert({ message: "An error occurred while logging in.", type: "error" });
      });
  };

  return (
    <div className="relative w-full h-screen flex items-center justify-center">
      <video autoPlay muted loop className="absolute inset-0 w-full h-full object-cover">
        <source src={bg} type="video/mp4" />
      </video>

      {/* Show alert if there's a message */}
      {alert.message && <Alert message={alert.message} type={alert.type} onClose={() => setAlert({ message: "", type: "" })} />}

      <div className="relative bg-black/60 backdrop-blur-md text-white p-8 rounded-xl w-96 border-2 border-yellow-400 text-center">
        <img src={logo} alt="Logo" className="w-full h-20 object-contain mb-4" />
        <h2 className="text-2xl font-bold mb-4">Login before continuing</h2>

        <form onSubmit={validateForm} className="space-y-4">
          <div className="text-left">
            <label className="text-lg">Email ID:</label>
            <input
              type="email"
              placeholder="Eg: user@gmail.com"
              value={email}
              name="mail"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/30 border border-gray-400 rounded-md p-3 text-white placeholder-white focus:outline-none"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div className="text-left">
            <label className="text-lg">Enter password:</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={password}
                name="password"
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/30 border border-gray-400 rounded-md p-3 text-white placeholder-white focus:outline-none"
              />
              <span
                className="absolute top-3 right-4 cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
              </span>
            </div>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          <div className="flex flex-col items-center">
            <Link to="/otp" className="text-cyan-400 text-sm hover:text-white">Forgot password?</Link>
            <Link to="/signup" className="text-cyan-400 text-sm hover:text-white">Don't have an account? Sign up</Link>
          </div>

          <button
            type="submit"
            className="bg-yellow-400 text-black px-6 py-2 rounded-md text-lg font-bold hover:bg-yellow-500 transition"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
