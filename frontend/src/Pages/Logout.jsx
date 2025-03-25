import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const logoutUser = async () => {
      try {
        // Clear Local Storage
        localStorage.removeItem("session_id");
        localStorage.removeItem("email");
        localStorage.removeItem("username");

        // Clear Cookies
        Cookies.remove("session_id", { path: "/" });
        Cookies.remove("username", { path: "/" });
        Cookies.remove("isAdmin", { path: "/" });
        Cookies.remove("email", { path: "/" });

        // Send Logout Request to Backend
        await axios.post("http://localhost/onlineplatform/backend-php/logout.php");

        // Notify user
        console.log("Logout successful");
      } catch (error) {
        console.error("Logout failed", error);
      }
    };

    logoutUser();
  }, []);

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
      <div className="text-center p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold text-red-500">You have been logged out!</h2>
        <button
          onClick={() => navigate("/login")}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
};

export default Logout;
