import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FiMoon, FiSun } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { API_BASE_URL } from "../config";
import { useTheme } from "../contexts/ThemeContext";

function Login() {
  const [show, setShow] = useState(false);
  const { darkMode, toggleDarkMode } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState();
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [formLoaded, setFormLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Trigger the animation when component mounts
    setFormLoaded(true);
  }, []);

  const handleSubmit = async(e) => {
    e.preventDefault();

    const loginUser={
      useremail: email,
      password: password,
    }
    try{
        const response= await fetch(`${API_BASE_URL}/login`,{
          method: 'POST',
          headers:{
            'Content-Type':'application/json'
          },
          body: JSON.stringify(loginUser)
        })

        const res= await response.json();

        if(!response.ok){
          toast.error(res.message );
          return;
        }
        else{ 
          
          toast.success(res.message);
          localStorage.setItem("token", res.token);
          localStorage.setItem("user_id", res.user._id);
          navigate(`/${res.user._id}/dashboard`);
        }
      }
      catch(err){
        toast.error(err.message);
      }
  };

  const passwordHandler = (e) => {
    setPassword(e.target.value);
    if (
      e.target.value.length < 8 ||
      e.target.value.length > 20 ||
      e.target.value.includes(" ") ||
      !/[A-Z]/.test(e.target.value) || // at least one uppercase
      !/[a-z]/.test(e.target.value) || // at least one lowercase
      !/\d/.test(e.target.value) || // at least one digit
      !/[\W_]/.test(e.target.value)
    ) {
      setVerifyPassword(false);
    } else {
      setVerifyPassword(true);
    }
  };

  // Animation variants for placeholders
  const placeholderVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <div
      className={`
  w-full min-h-screen transition-colors duration-300 
  ${
    darkMode
      ? "bg-gray-900 text-gray-100"
      : "bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-800"
  }
`}
    >
      {/* Dark Mode Toggle */}
      <div className="flex justify-end p-4">
        <button
          onClick={toggleDarkMode}
          className={`p-2 rounded-full ${
            darkMode ? "bg-gray-700 text-yellow-300" : "bg-white text-gray-700"
          } shadow-md hover:shadow-lg transition-all`}
          aria-label="Toggle dark mode"
        >
          {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
        </button>
      </div>
          
      {/* Login Form Container */}
      <div className="flex items-center justify-center p-4">
        <div
          className={`
      w-full max-w-md p-8 rounded-2xl shadow-xl transition-all
      ${
        darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-blue-200"
      } border
    `}
        >
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={formLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className={`
        text-2xl font-bold mb-6 text-center
        ${darkMode ? "text-white" : "text-blue-800"}
      `}
          >
            Login to SoloFlow
          </motion.h2>

          <form onSubmit={handleSubmit}>
            <motion.div 
              className="mb-4"
              initial={{ opacity: 0 }}
              animate={formLoaded ? { opacity: 1 } : {}}
              transition={{ delay: 0.2 }}
            >
              <motion.label
                variants={placeholderVariants}
                initial="hidden"
                animate={formLoaded ? "visible" : "hidden"}
                className={`
            block mb-2 text-sm font-medium
            ${darkMode ? "text-gray-300" : "text-gray-700"}
          `}
              >
                Email
              </motion.label>
              <motion.input
                variants={placeholderVariants}
                initial="hidden"
                animate={formLoaded ? "visible" : "hidden"}
                transition={{ delay: 0.3 }}
                type="email"
                value={email}
                name="email"
                onChange={(e) => setEmail(e.target.value)}
                className={`
              w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 transition-all
              ${
                darkMode
                  ? "bg-gray-700 border-gray-600 focus:ring-blue-500 text-white"
                  : "bg-white border-gray-300 focus:ring-blue-300 text-gray-800"
              }
            `}
                required
              />
            </motion.div>

            <motion.div 
              className="mb-6 relative"
              initial={{ opacity: 0 }}
              animate={formLoaded ? { opacity: 1 } : {}}
              transition={{ delay: 0.4 }}
            >
              <motion.label
                variants={placeholderVariants}
                initial="hidden"
                animate={formLoaded ? "visible" : "hidden"}
                className={`
    block mb-2 text-sm font-medium
    ${darkMode ? "text-gray-300" : "text-gray-700"}
  `}
              >
                Password
              </motion.label>
              <motion.div 
                variants={placeholderVariants}
                initial="hidden"
                animate={formLoaded ? "visible" : "hidden"}
                transition={{ delay: 0.5 }}
                className="relative"
              >
                <input
                  type={show ? "text" : "password"}
                  value={password}
                  onChange={passwordHandler}
                  onFocus={() => {
                    setPasswordTouched(true);
                  }}
                  name="password"
                  className={`
        w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 transition-all
        ${
          darkMode
            ? "bg-gray-700 border-gray-600 focus:ring-blue-500 text-white"
            : "bg-white border-gray-300 focus:ring-blue-300 text-gray-800"
        }
      `}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  tabIndex={-1}
                >
                  {show ? (
                    <AiOutlineEyeInvisible size={20} />
                  ) : (
                    <AiOutlineEye size={20} />
                  )}
                </button>
              </motion.div>
            </motion.div>

            {!verifyPassword && passwordTouched && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="text-red-600 bg-red-50 border-2 border-dotted mb-2 border-red-200 rounded px-4 py-2 mt-2 text-sm"
              >
                Password should contain a minimum of 8 characters including at
                least 1 uppercase letter, 1 lowercase letter, 1 digit, and 1
                symbol.
              </motion.div>
            )}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={formLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6 }}
              type="submit"
              className={`
            w-full py-3 px-4 rounded-lg font-medium transition-all
            ${
              darkMode
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            } shadow-md hover:shadow-lg
          `}
            >
              Log In
            </motion.button>

            {/* Additional Links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={formLoaded ? { opacity: 1 } : {}}
              transition={{ delay: 0.7 }}
              className={`mt-4 text-center text-sm ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Don't have an account?{" "}
              <Link
                to="/register"
                className={`font-medium hover:underline ${
                  darkMode ? "text-blue-400" : "text-blue-600"
                }`}
              >
                Sign up
              </Link>
            </motion.div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;