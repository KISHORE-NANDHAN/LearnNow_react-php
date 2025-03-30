import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Cropper from 'react-easy-crop'; // Import the Cropper component
import getCroppedImg from '../utils/cropImage'; // Utility to handle cropping

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [updatedData, setUpdatedData] = useState({});
  const navigate = useNavigate();

  // Image Cropping State
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [newProfileImage, setNewProfileImage] = useState(null); // Stores the newly selected image file
  const [croppedImage, setCroppedImage] = useState(null); // Stores the cropped data URL

  const profileImageInputRef = useRef(null); // Reference for the hidden file input


  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = Cookies.get('session_id');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.post('http://localhost/onlineplatform/backend-php/getUser.php', { token }, { withCredentials: true });

        if (response.data.success) {
          setUserData(response.data.user);
          setUpdatedData(response.data.user);
        } else {
          Cookies.remove('session_id');
          navigate('/login');
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        Cookies.remove('session_id');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleToggleEdit = () => {
    setEditing(!editing);
    if (!editing) {
      setUpdatedData(userData);
      setNewProfileImage(null); // Clear newly selected image
      setCroppedImage(null); // Clear cropped image
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewProfileImage(file); // Store the file
      setCroppedImage(URL.createObjectURL(file)); // Set croppedImage to the uploaded image for cropping

    }
  };

  const onCropComplete = React.useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleShowImageDialog = () => {
    profileImageInputRef.current.click(); // Programmatically open file selector
  };

  const handleCropImage = async () => {
    if (!newProfileImage) {
      alert("Please select a profile image first.");
      return;
    }

    try {
      const croppedImageResult = await getCroppedImg(
        croppedImage, // Pass croppedImage here
        croppedAreaPixels
      );
      setCroppedImage(croppedImageResult); // Update the croppedImage state with the cropped data URL

    } catch (e) {
      console.error(e);
      alert('Error cropping image.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = Cookies.get('session_id');
      const formData = new FormData();

      formData.append('token', token);
      for (const key in updatedData) {
        formData.append(key, updatedData[key]);
      }

      if (croppedImage) {
        formData.append('pfp', croppedImage); // Send cropped image data URL
      }
      const response = await axios.post('http://localhost/onlineplatform/backend-php/updateUser.php', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }, withCredentials: true
      });

      if (response.data.success) {
        // If image updated, update the user's data to reflect the new image URL (or other identifier)
        if (croppedImage) {
            setUserData({ ...updatedData, pfp: croppedImage }); // Update pfp to cropped Image
        } else {
            setUserData(updatedData);
        }
        setEditing(false);
        alert('Profile updated successfully!');
      } else {
        alert('Failed to update profile.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading profile...</div>;
  }

  if (!userData) {
    return <div className="flex justify-center items-center h-screen">Failed to load profile.</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="container mx-auto py-10 px-4 md:px-0">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden max-w-2xl mx-auto">

          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">
                {editing ? 'Edit Profile' : 'User Profile'}
              </h2>
              <button
                onClick={handleToggleEdit}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                {editing ? 'Cancel Edit' : 'Edit Profile'}
              </button>
            </div>

            {/* Profile Picture  */}
            <div className="mb-6 flex justify-center items-center flex-col">
              <img
                src={croppedImage || userData.pfp || "https://via.placeholder.com/150"}
                alt="Profile"
                className="rounded-full h-32 w-32 object-cover border-4 border-white cursor-pointer"
                onClick={editing ? handleShowImageDialog : null}  // Only allow image selection when editing
              />
              {editing && (
                <button
                  onClick={handleShowImageDialog}
                  className="mt-2 text-sm text-blue-500 hover:text-blue-700 focus:outline-none"
                >
                  Change Profile Picture
                </button>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                ref={profileImageInputRef} // Attach the ref
              />
            </div>

            {/* Cropping UI */}
            {editing && newProfileImage && (
              <div className="mb-4">
                <div className="relative w-full h-64">
                  <Cropper
                    image={croppedImage}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                  />
                </div>
                <div className="flex justify-between mt-2">
                  <label className="block text-gray-700 text-sm font-bold">Zoom:</label>
                  <input
                    type="range"
                    min={1}
                    max={3}
                    step={0.1}
                    value={zoom}
                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                    className="w-3/4"
                  />
                  <button
                      type="button"
                      onClick={handleCropImage}
                      className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                      Crop Image
                    </button>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className={editing ? '' : 'pointer-events-none opacity-50'}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                  Name:
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={updatedData?.name || ''}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  disabled={!editing}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                  Email:
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={updatedData?.email || ''}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  disabled={true}
                />
              </div>

              <div className="mb-4">
                <label htmlFor="mobile" className="block text-gray-700 text-sm font-bold mb-2">
                  Mobile:
                </label>
                <input
                  type="text"
                  id="mobile"
                  name="mobile"
                  value={updatedData?.mobile || ''}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  disabled={!editing}
                />
              </div>

              <div className="mb-4">
                <label htmlFor="dob" className="block text-gray-700 text-sm font-bold mb-2">
                  Date of Birth:
                </label>
                <input
                  type="date"
                  id="dob"
                  name="dob"
                  value={updatedData?.dob || ''}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  disabled={!editing}
                />
              </div>

              <div className="mb-4">
                <label htmlFor="gender" className="block text-gray-700 text-sm font-bold mb-2">
                  Gender:
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={updatedData?.gender || ''}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  disabled={!editing}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="drno" className="block text-gray-700 text-sm font-bold mb-2">
                  Door No:
                </label>
                <input
                  type="text"
                  id="drno"
                  name="drno"
                  value={updatedData?.drno || ''}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  disabled={!editing}
                />
              </div>

              <div className="mb-4">
                <label htmlFor="street" className="block text-gray-700 text-sm font-bold mb-2">
                  Street:
                </label>
                <input
                  type="text"
                  id="street"
                  name="street"
                  value={updatedData?.street || ''}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  disabled={!editing}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="pincode" className="block text-gray-700 text-sm font-bold mb-2">
                  Pin Code:
                </label>
                <input
                  type="text"
                  id="pincode"
                  name="pincode"
                  value={updatedData?.pincode || ''}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  disabled={!editing}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="city" className="block text-gray-700 text-sm font-bold mb-2">
                  City:
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={updatedData?.city || ''}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  disabled={!editing}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="state" className="block text-gray-700 text-sm font-bold mb-2">
                  State:
                </label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={updatedData?.state || ''}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  disabled={!editing}
                />
              </div>

              {editing && (
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;