import { useState } from "react";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import bg from "../Media/signupbg.mp4";

const Signup = () => {
  const [formData, setFormData] = useState({
    uname: "",
    mail: "",
    phno: "",
    date: "",
    gender: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    let newErrors = {};
    const emailPattern = /\S+@\S+\.\S+/;
    const phonePattern = /^\d{10}$/;
    const passwordPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    if (!formData.uname.match(/^[a-zA-Z_ ]+$/)) newErrors.uname = "Invalid username";
    if (!emailPattern.test(formData.mail)) newErrors.mail = "Invalid email";
    if (!phonePattern.test(formData.phno)) newErrors.phno = "Invalid phone number";
    
    if (new Date(formData.date).setHours(0,0,0,0) >= new Date().setHours(0,0,0,0)) {
        newErrors.date = "Invalid DOB (Select past date)";
    }

    if (!passwordPattern.test(formData.password)) {
      newErrors.password = "Password must be 8+ chars, contain [a-z], [A-Z], [0-9]";
    }

    if (!formData.gender) {
      newErrors.gender = "Please select a gender";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
  
    axios.post("http://localhost/onlineplatform/backend-php/Signup.php", formData, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true, // Required if using cookies/sessions
    })
    .then((response) => {
      console.log(response.data);
      alert(response.data.message);
      if (response.data.status === "success") {
        window.location.href = "/login"; // Redirect on success
      }
    })
    .catch((error) => {
      console.error("Signup failed:", error);
      alert("Signup failed! Please try again.");
    });
  };
  

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <video autoPlay loop muted className="absolute top-0 left-0 w-full h-full object-cover z-0">
        <source src='https://videos.pexels.com/video-files/3129957/3129957-uhd_2560_1440_25fps.mp4' type="video/mp4" />
      </video>

      <div className="relative bg-black/60 bg-opacity-70 backdrop-blur-md p-8 rounded-lg w-full max-w-xl border-2 border-yellow-400 z-10">
        <h2 className="text-3xl font-semibold text-center mb-4">Sign Up</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <label className="block">Username</label>
          <input type="text" name="uname" placeholder="Enter username"
            value={formData.uname} onChange={handleChange} 
            className="w-full p-3 rounded bg-gray-700 text-white placeholder-gray-300 focus:ring-2 focus:ring-yellow-400"
          />
          {errors.uname && <p className="text-red-400 text-sm">{errors.uname}</p>}

          <label className="block">Email</label>
          <input type="email" name="mail" placeholder="Enter email"
            value={formData.mail} onChange={handleChange} 
            className="w-full p-3 rounded bg-gray-700 text-white placeholder-gray-300 focus:ring-2 focus:ring-yellow-400"
          />
          {errors.mail && <p className="text-red-400 text-sm">{errors.mail}</p>}

          <label className="block">Phone Number</label>
          <input type="tel" name="phno" placeholder="Enter phone number"
            value={formData.phno} onChange={handleChange} 
            className="w-full p-3 rounded bg-gray-700 text-white placeholder-gray-300 focus:ring-2 focus:ring-yellow-400"
          />
          {errors.phno && <p className="text-red-400 text-sm">{errors.phno}</p>}

          <label className="block">Date of Birth</label>
          <input type="date" name="date" 
            value={formData.date} onChange={handleChange} 
            className="w-full p-3 rounded bg-gray-700 text-white focus:ring-2 focus:ring-yellow-400"
          />
          {errors.date && <p className="text-red-400 text-sm">{errors.date}</p>}

          <label className="block">Gender</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input type="radio" name="gender" value="male" onChange={handleChange} /> Male
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="gender" value="female" onChange={handleChange} /> Female
            </label>
          </div>
          {errors.gender && <p className="text-red-400 text-sm">{errors.gender}</p>}

          <label className="block">Password</label>
          <div className="relative">
            <input type={showPassword ? "text" : "password"} name="password" placeholder="Enter password"
              value={formData.password} onChange={handleChange}
              className="w-full p-3 pr-10 rounded bg-gray-700 text-white placeholder-gray-300 focus:ring-2 focus:ring-yellow-400"
            />
            <span className="absolute top-3 right-3 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </span>
          </div>
          {errors.password && <p className="text-red-400 text-sm">{errors.password}</p>}

          <div className="relative">
            
            <span className=" flex justify-center text-blue-800 content-center">
              <a href="/login">Already has account ? go to Login</a>
            </span>
          </div>

          <button className="w-full py-3 bg-yellow-500 hover:bg-yellow-600 rounded text-gray-900 font-semibold transition">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default Signup;