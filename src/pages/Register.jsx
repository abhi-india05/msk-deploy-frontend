import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { FiMoon, FiSun } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../App.css';
import { useTheme } from '../contexts/ThemeContext';

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [passwordChecks, setPasswordChecks] = useState({
    length: false,
    upper: false,
    lower: false,
    number: false,
    symbol: false,
  });

  const handlePasswordChange = (e) => {
  const val = e.target.value;
  setPassword(val);
  const checks = {
    length: val.length >= 8 && val.length <= 20,
    upper: /[A-Z]/.test(val),
    lower: /[a-z]/.test(val),
    number: /\d/.test(val),
    symbol: /[\W_]/.test(val),
  };
  setPasswordChecks(checks);
  setVerifyPassword(Object.values(checks).every(Boolean));
};



  const { darkMode, toggleDarkMode } = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [company, setCompany] = useState('');
  const [verifyPassword, setVerifyPassword] = useState();
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [formLoaded, setFormLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setFormLoaded(true);
  }, []);

  const handleSubmit = async(e) => {
    e.preventDefault();
    const newUser = {
      user_name: name,
      user_email: email,
      user_password: password,
      user_company: company
    };
    try {
      const response = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify(newUser)
      });
      const res = await response.json();
      if (response.status === 201) {
        toast.success(`${res.message}`);
        navigate("/login");
      } else {
        toast.error(`${res.message}`);
      }
    } catch(err) {
      toast.error(err.message);
    }
  };
  
  const passwordHandler = (e) => {
    setPassword(e.target.value);
    if (
      e.target.value.length < 8 ||
      e.target.value.length > 20 ||
      e.target.value.includes(' ') ||
      !/[A-Z]/.test(e.target.value) ||      // at least one uppercase
      !/[a-z]/.test(e.target.value) ||      // at least one lowercase
      !/\d/.test(e.target.value) ||         // at least one digit
      !/[\W_]/.test(e.target.value)) {
        setVerifyPassword(false);
      } else {
        setVerifyPassword(true);
      }
  };

  // Animation variants matching the Login component
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
    <div className={`
      w-full min-h-screen transition-colors duration-300 
      ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-800'}
    `}>
      {/* Dark Mode Toggle */}
      <div className="flex justify-end p-4">
        <button
          onClick={toggleDarkMode}
          className={`p-2 rounded-full ${
            darkMode ? 'bg-gray-700 text-yellow-300' : 'bg-white text-gray-700'
          } shadow-md hover:shadow-lg transition-all`}
          aria-label="Toggle dark mode"
        >
          {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
        </button>
      </div>
          
      {/* Register Form Container */}
      <div className="flex items-center justify-center p-4">
        <div className={`
          w-full max-w-md p-8 rounded-2xl shadow-xl transition-all
          ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-blue-200'} border
        `}>
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={formLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className={`
              text-2xl font-bold mb-6 text-center
              ${darkMode ? 'text-white' : 'text-blue-800'}
            `}
          >
            Create your SoloFlow Account
          </motion.h2>

          <form onSubmit={handleSubmit}>
            {/* Name */}
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
                  ${darkMode ? 'text-gray-300' : 'text-gray-700'}
                `}
              >
                Full Name
              </motion.label>
              <motion.input
                variants={placeholderVariants}
                initial="hidden"
                animate={formLoaded ? "visible" : "hidden"}
                transition={{ delay: 0.3 }}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                name="name"
                required
                className={`
                  w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 transition-all
                  ${darkMode ? 'bg-gray-700 border-gray-600 focus:ring-blue-500 text-white' :
                    'bg-white border-gray-300 focus:ring-blue-300 text-gray-800'}
                `}
              />
            </motion.div>

            {/* Email */}
            <motion.div 
              className="mb-4"
              initial={{ opacity: 0 }}
              animate={formLoaded ? { opacity: 1 } : {}}
              transition={{ delay: 0.3 }}
            >
              <motion.label
                variants={placeholderVariants}
                initial="hidden"
                animate={formLoaded ? "visible" : "hidden"}
                className={`
                  block mb-2 text-sm font-medium
                  ${darkMode ? 'text-gray-300' : 'text-gray-700'}
                `}
              >
                Email
              </motion.label>
              <motion.input
                variants={placeholderVariants}
                initial="hidden"
                animate={formLoaded ? "visible" : "hidden"}
                transition={{ delay: 0.4 }}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                name="email"
                required
                className={`
                  w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 transition-all
                  ${darkMode ? 'bg-gray-700 border-gray-600 focus:ring-blue-500 text-white' :
                    'bg-white border-gray-300 focus:ring-blue-300 text-gray-800'}
                `}
              />
            </motion.div>

            {/* Password */}
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
                  ${darkMode ? 'text-gray-300' : 'text-gray-700'}
                `}
              >
                Password
              </motion.label>
              <motion.input
                variants={placeholderVariants}
                initial="hidden"
                animate={formLoaded ? "visible" : "hidden"}
                transition={{ delay: 0.5 }}
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={handlePasswordChange}
                onFocus={() => setPasswordTouched(true)}
                required
                className={`
                  w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 transition-all pr-10
                  ${darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500'
                    : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-300'}
                `}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-10"
              >
                <img
                  src={showPassword ? "/eye-open.png" : "/eye-closed.png"}
                  alt="Toggle Password"
                  className="w-5 h-5 opacity-70"
                />
              </button>

              {/* Password rule indicators */}
              {passwordTouched && (
                <div className="mt-3 text-sm space-y-1">
                  <p className={passwordChecks.length ? "text-green-500" : "text-red-500"}>
                    {passwordChecks.length ? "✔" : "✘"} At least 8 characters
                  </p>
                  <p className={passwordChecks.upper ? "text-green-500" : "text-red-500"}>
                    {passwordChecks.upper ? "✔" : "✘"} At least one uppercase letter
                  </p>
                  <p className={passwordChecks.lower ? "text-green-500" : "text-red-500"}>
                    {passwordChecks.lower ? "✔" : "✘"} At least one lowercase letter
                  </p>
                  <p className={passwordChecks.number ? "text-green-500" : "text-red-500"}>
                    {passwordChecks.number ? "✔" : "✘"} At least one number
                  </p>
                  <p className={passwordChecks.symbol ? "text-green-500" : "text-red-500"}>
                    {passwordChecks.symbol ? "✔" : "✘"} At least one special character
                  </p>
                </div>
              )}
            </motion.div>

            {/* Company name */}
            <motion.div 
              className="mb-6"
              initial={{ opacity: 0 }}
              animate={formLoaded ? { opacity: 1 } : {}}
              transition={{ delay: 0.5 }}
            >
              <motion.label
                variants={placeholderVariants}
                initial="hidden"
                animate={formLoaded ? "visible" : "hidden"}
                className={`
                  block mb-2 text-sm font-medium
                  ${darkMode ? 'text-gray-300' : 'text-gray-700'}
                `}
              >
                Company Name
              </motion.label>
              <motion.input
                variants={placeholderVariants}
                initial="hidden"
                animate={formLoaded ? "visible" : "hidden"}
                transition={{ delay: 0.6 }}
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                name="company"
                required
                className={`
                  w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 transition-all
                  ${darkMode ? 'bg-gray-700 border-gray-600 focus:ring-blue-500 text-white' :
                    'bg-white border-gray-300 focus:ring-blue-300 text-gray-800'}
                `}
              />
            </motion.div>

            {/* Submit */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={formLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.7 }}
              type="submit"
              className={`
                w-full py-3 px-4 rounded-lg font-medium transition-all
                ${darkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' :
                  'bg-blue-500 hover:bg-blue-600 text-white'}
                shadow-md hover:shadow-lg
              `}
            >
              Sign Up
            </motion.button>

            {/* Redirect Link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={formLoaded ? { opacity: 1 } : {}}
              transition={{ delay: 0.8 }}
              className={`mt-4 text-center text-sm ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              Already have an account?{' '}
              <Link to="/login" className={`font-medium hover:underline ${
                darkMode ? 'text-blue-400' : 'text-blue-600'
              }`}>
                Log in
              </Link>
            </motion.div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;