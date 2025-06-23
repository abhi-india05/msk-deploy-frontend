{/*import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FiCamera, FiEdit2, FiLock, FiMail, FiSave } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import user_img from '../assets/user_img.jpg';
import Footer from "../components/Footer";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import { useTheme } from "../contexts/ThemeContext";
const UserProfile = () => {
  const { user_id } = useParams();
  const { darkMode } = useTheme();
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [data, setData] = useState(null);
  const [avatar, setAvatar] = useState(null);

  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [bio, setBio] = useState("");
  const [joined, setJoined] = useState("");
  const navigate=useNavigate();
  useEffect(() => {
    fetch(`http://localhost:3000/user/${user_id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setName(data.user.user_name || "");
        setEmail(data.user.user_email || "");
        setCompany(data.user.user_company || "");
        setBio(data.user.user_bio || "");
        setJoined(data.user.createdAt || "");
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user_id, token]);

  const handleAvatarChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setAvatar(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setEditMode(false);

    fetch(`http://localhost:3000/user/${user_id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        user_name: name,
        user_email: email, // Email is not editable
        user_company: company,
        user_bio: bio,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.user) {
          setData({ user: result.user });
          setName(result.user.user_name || "");
          setEmail(result.user.user_email || "");
          setCompany(result.user.user_company || "");
          setBio(result.user.user_bio || "");
          setJoined(result.user.createdAt || "");
          toast.success("Profile updated successfully!",{toastId:"profile-update-success"});
        } else {
          toast.error("Profile updated successfully!",{toastId:"profile-update-failure"});
        }
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
        toast.error("An error occurred while updating your profile.");
      });
  };

  if (loading) return <Loader />;

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? "bg-gray-900" : "bg-gradient-to-br from-blue-50 to-indigo-100"}`}>
      <Navbar />
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, type: "spring" }}
        className="flex-1 flex flex-col items-center justify-center px-4 py-12"
      >
        <div className={`
          w-full max-w-2xl rounded-3xl shadow-2xl p-8 relative overflow-hidden
          ${darkMode ? "bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 border border-gray-700" : "bg-white border border-blue-100"}
        `}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ duration: 1.2, delay: 0.2 }}
            className="absolute -top-16 -left-16 w-72 h-72 rounded-full bg-gradient-to-br from-blue-400 via-indigo-400 to-purple-400 blur-3xl opacity-30 pointer-events-none"
          />
          <div className="flex flex-col items-center mb-6 relative z-10">
            <div className="relative group">
              <img
                src={user_img || "/avatar-default.png"}
                alt="User Avatar"
                className="w-32 h-32 rounded-full border-4 border-blue-500 shadow-lg object-cover transition-all duration-300 group-hover:scale-105"
              />
              {editMode && (
                <label className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full shadow-lg cursor-pointer hover:bg-blue-700 transition">
                  <FiCamera size={18} />
                  <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                </label>
              )}
            </div>
            <motion.h2
              className={`mt-4 text-3xl font-extrabold tracking-tight ${darkMode ? "text-white" : "text-blue-900"}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {name}
            </motion.h2>
            <p className={`text-sm mt-1 ${darkMode ? "text-blue-300" : "text-blue-600"}`}>{company}</p>
            <div className="flex items-center gap-2 mt-2">
              <FiMail className={darkMode ? "text-blue-400" : "text-blue-600"} />
              <span className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>{email}</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <FiLock className={darkMode ? "text-gray-500" : "text-gray-400"} />
              <span className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                Joined {joined && new Date(joined).toLocaleDateString(undefined, { year: "numeric", month: "short" })}
              </span>
            </div>
          </div>
           <form className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 z-10 relative">
            <div>
              <label className={`block mb-1 font-semibold ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Full Name</label>
              <input
                type="text"
                name="name"
                value={name}
                onChange={e => setName(e.target.value)}
                disabled={!editMode}
                className={`
                  w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 transition-all
                  ${darkMode
                    ? "bg-gray-800 border-gray-700 text-white focus:ring-blue-500"
                    : "bg-white border-blue-200 text-gray-900 focus:ring-blue-400"}
                  ${editMode ? "" : "opacity-70 cursor-not-allowed"}
                `}
              />
            </div>
            <div>
              <label className={`block mb-1 font-semibold ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Email</label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                disabled
                className={`
                  w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 transition-all
                  ${darkMode
                    ? "bg-gray-800 border-gray-700 text-white focus:ring-blue-500"
                    : "bg-white border-blue-200 text-gray-900 focus:ring-blue-400"}
                  opacity-70 cursor-not-allowed
                `}
              />
            </div>
            <div className="md:col-span-2">
              <label className={`block mb-1 font-semibold ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Company</label>
              <input
                type="text"
                name="company"
                value={company}
                onChange={e => setCompany(e.target.value)}
                disabled={!editMode}
                className={`
                  w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 transition-all
                  ${darkMode
                    ? "bg-gray-800 border-gray-700 text-white focus:ring-blue-500"
                    : "bg-white border-blue-200 text-gray-900 focus:ring-blue-400"}
                  ${editMode ? "" : "opacity-70 cursor-not-allowed"}
                `}
              />
            </div>
            <div className="md:col-span-2">
              <label className={`block mb-1 font-semibold ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Bio</label>
              <textarea
                name="bio"
                value={bio}
                onChange={e => setBio(e.target.value)}
                disabled={!editMode}
                rows={3}
                className={`
                  w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 transition-all
                  ${darkMode
                    ? "bg-gray-800 border-gray-700 text-white focus:ring-blue-500"
                    : "bg-white border-blue-200 text-gray-900 focus:ring-blue-400"}
                  ${editMode ? "" : "opacity-70 cursor-not-allowed"}
                  resize-none
                `}
              />
            </div>
          </form>
          edit save
 <div className="flex justify-between items-center mt-8 z-10 relative">
            <button
    onClick={() => navigate(`/${user_id}/dashboard`)}
    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
  >
    ← Back to Dashboard
  </button>
  
            {editMode ? (
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all"
              >
                <FiSave size={18} /> Save Changes
              </button>
            ) : (
              <button
                onClick={() => setEditMode(true)}
                className="flex items-center gap-2 px-6 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold shadow-lg hover:from-blue-600 hover:to-indigo-600 transition-all"
              >
                <FiEdit2 size={18} /> Edit Profile
              </button>
            )}
          </div>
        </div>
      </motion.div>
      <Footer />
    </div>
  );
}
  export default UserProfile;*/}


  import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FiCamera, FiEdit2, FiLock, FiMail, FiSave } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import user_img from '../assets/user_img.jpg';
import Footer from "../components/Footer";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import { useTheme } from "../contexts/ThemeContext";
const UserProfile = () => {
  const { user_id } = useParams();
  const { darkMode } = useTheme();
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [data, setData] = useState(null);
  const [avatar, setAvatar] = useState(null);

  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [bio, setBio] = useState("");
  const [joined, setJoined] = useState("");
  const navigate=useNavigate();
  useEffect(() => {
    fetch(`http://localhost:3000/user/${user_id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setName(data.user.user_name || "");
        setEmail(data.user.user_email || "");
        setCompany(data.user.user_company || "");
        setBio(data.user.user_bio || "");
        setJoined(data.user.createdAt || "");
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user_id, token]);

  const handleAvatarChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setAvatar(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    navigate("/login");
  };


  const handleSave = async (e) => {
    e.preventDefault();
    setEditMode(false);

    fetch(`http://localhost:3000/user/${user_id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        user_name: name,
        user_email: email, // Email is not editable
        user_company: company,
        user_bio: bio,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.user) {
          setData({ user: result.user });
          setName(result.user.user_name || "");
          setEmail(result.user.user_email || "");
          setCompany(result.user.user_company || "");
          setBio(result.user.user_bio || "");
          setJoined(result.user.createdAt || "");
          toast.success("Profile updated successfully!",{toastId:"profile-update-success"});
        } else {
          toast.error("Profile updated successfully!",{toastId:"profile-update-failure"});
        }
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
        toast.error("An error occurred while updating your profile.");
      });
  };

  if (loading) return <Loader />;

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? "bg-gray-900" : "bg-gradient-to-br from-blue-50 to-indigo-100"}`}>
      <Navbar />
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, type: "spring" }}
        className="flex-1 flex flex-col items-center justify-center px-4 py-12"
      >
        {/* Profile Card */}
        <div className={`
          w-full max-w-2xl rounded-3xl shadow-2xl p-8 relative overflow-hidden
          ${darkMode ? "bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 border border-gray-700" : "bg-white border border-blue-100"}
        `}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ duration: 1.2, delay: 0.2 }}
            className="absolute -top-16 -left-16 w-72 h-72 rounded-full bg-gradient-to-br from-blue-400 via-indigo-400 to-purple-400 blur-3xl opacity-30 pointer-events-none"
          />
          {/* Avatar */}
          <div className="flex flex-col items-center mb-6 relative z-10">
            <div className="relative group">
              <img
                src={user_img || "/avatar-default.png"}
                alt="User Avatar"
                className="w-32 h-32 rounded-full border-4 border-blue-500 shadow-lg object-cover transition-all duration-300 group-hover:scale-105"
              />
              {editMode && (
                <label className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full shadow-lg cursor-pointer hover:bg-blue-700 transition">
                  <FiCamera size={18} />
                  <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                </label>
              )}
            </div>
            <motion.h2
              className={`mt-4 text-3xl font-extrabold tracking-tight ${darkMode ? "text-white" : "text-blue-900"}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {name}
            </motion.h2>
            <p className={`text-sm mt-1 ${darkMode ? "text-blue-300" : "text-blue-600"}`}>{company}</p>
            <div className="flex items-center gap-2 mt-2">
              <FiMail className={darkMode ? "text-blue-400" : "text-blue-600"} />
              <span className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>{email}</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <FiLock className={darkMode ? "text-gray-500" : "text-gray-400"} />
              <span className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                Joined {joined && new Date(joined).toLocaleDateString(undefined, { year: "numeric", month: "short" })}
              </span>
            </div>
          </div>
          {/* Editable Fields */}
          <form className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 z-10 relative">
            <div>
              <label className={`block mb-1 font-semibold ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Full Name</label>
              <input
                type="text"
                name="name"
                value={name}
                onChange={e => setName(e.target.value)}
                disabled={!editMode}
                className={`
                  w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 transition-all
                  ${darkMode
                    ? "bg-gray-800 border-gray-700 text-white focus:ring-blue-500"
                    : "bg-white border-blue-200 text-gray-900 focus:ring-blue-400"}
                  ${editMode ? "" : "opacity-70 cursor-not-allowed"}
                `}
              />
            </div>
            <div>
              <label className={`block mb-1 font-semibold ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Email</label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                disabled
                className={`
                  w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 transition-all
                  ${darkMode
                    ? "bg-gray-800 border-gray-700 text-white focus:ring-blue-500"
                    : "bg-white border-blue-200 text-gray-900 focus:ring-blue-400"}
                  opacity-70 cursor-not-allowed
                `}
              />
            </div>
            <div className="md:col-span-2">
              <label className={`block mb-1 font-semibold ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Company</label>
              <input
                type="text"
                name="company"
                value={company}
                onChange={e => setCompany(e.target.value)}
                disabled={!editMode}
                className={`
                  w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 transition-all
                  ${darkMode
                    ? "bg-gray-800 border-gray-700 text-white focus:ring-blue-500"
                    : "bg-white border-blue-200 text-gray-900 focus:ring-blue-400"}
                  ${editMode ? "" : "opacity-70 cursor-not-allowed"}
                `}
              />
            </div>
            <div className="md:col-span-2">
              <label className={`block mb-1 font-semibold ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Bio</label>
              <textarea
                name="bio"
                value={bio}
                onChange={e => setBio(e.target.value)}
                disabled={!editMode}
                rows={3}
                className={`
                  w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 transition-all
                  ${darkMode
                    ? "bg-gray-800 border-gray-700 text-white focus:ring-blue-500"
                    : "bg-white border-blue-200 text-gray-900 focus:ring-blue-400"}
                  ${editMode ? "" : "opacity-70 cursor-not-allowed"}
                  resize-none
                `}
              />
            </div>
          </form>
          {/* Edit/Save Button */}
          <div className="flex justify-between items-center mt-8 z-10 relative">
            <button
              onClick={() => navigate(`/${user_id}/dashboard`)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              ← Back to Dashboard
            </button>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  navigate("/login");
                  toast.success("Logged out successfully");
                }}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
              >
                Logout
              </button>
              {editMode ? (
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-6 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all"
                >
                  <FiSave size={18} /> Save Changes
                </button>
              ) : (
                <button
                  onClick={() => setEditMode(true)}
                  className="flex items-center gap-2 px-6 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold shadow-lg hover:from-blue-600 hover:to-indigo-600 transition-all"
                >
                  <FiEdit2 size={18} /> Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
      <Footer />
    </div>
  );
}
export default UserProfile;