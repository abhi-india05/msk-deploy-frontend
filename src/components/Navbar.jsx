import { motion } from 'framer-motion'
import { FiBell, FiMoon, FiSun, FiUser } from 'react-icons/fi'
import { NavLink, useParams } from 'react-router-dom'
import { useNotification } from '../contexts/NotificationContext'
import { useTheme } from '../contexts/ThemeContext'

function Navbar() {
  const { darkMode, toggleDarkMode } = useTheme()
  const { user_id } = useParams();
  const { drawerOpen, toggleDrawer, notifications } = useNotification();

  const activeLinkStyle = darkMode 
    ? 'text-blue-300 border-blue-400 font-medium' 
    : 'text-blue-600 border-blue-500 font-medium'

  return (
    <div className={`
      w-full top-0 py-4 px-6
      ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}
      border-b
      flex items-center justify-between
      transition-colors duration-300
    `}>
      {/* Updated Logo - matches Header.jsx */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center space-x-2 cursor-pointer"
      >
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <span className="text-white font-bold text-sm">S</span>
        </div>
        <NavLink 
          to="/" 
          className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
        >
          Soloflow
        </NavLink>
      </motion.div>

      {/* Navigation Links - unchanged */}
      <div className="flex items-center space-x-8">
        <NavLink 
          to={`/${user_id}/dashboard`}
          className={({ isActive }) => `
            py-2 px-1 border-b-2
            ${darkMode ? 
              'text-gray-300 hover:text-blue-300 border-transparent' : 
              'text-gray-600 hover:text-blue-500 border-transparent'
            }
            ${isActive ? activeLinkStyle : ''}
            transition-colors duration-200
          `}
        >
          Dashboard
        </NavLink>

        <NavLink 
          to={`/${user_id}/clients`}
          className={({ isActive }) => `
            py-2 px-1 border-b-2
            ${darkMode ? 
              'text-gray-300 hover:text-blue-300 border-transparent' : 
              'text-gray-600 hover:text-blue-500 border-transparent'
            }
            ${isActive ? activeLinkStyle : ''}
            transition-colors duration-200
          `}
        >
          Clients
        </NavLink>

        <NavLink 
          to={`/${user_id}/statistics`}
          className={({ isActive }) => `
            py-2 px-1 border-b-2
            ${darkMode ? 
              'text-gray-300 hover:text-blue-300 border-transparent' : 
              'text-gray-600 hover:text-blue-500 border-transparent'
            }
            ${isActive ? activeLinkStyle : ''}
            transition-colors duration-200
          `}
        >
          Statistics
        </NavLink>

        {/* Icon-only profile link */}
        <NavLink 
          to= {`/${user_id}/userprofile`} 
          className={({ isActive }) => `
            p-2 rounded-full
            ${darkMode ? 
              'text-gray-300 hover:text-blue-300 hover:bg-gray-700' : 
              'text-gray-600 hover:text-blue-500 hover:bg-gray-100'
            }
            ${isActive ? (darkMode ? 'text-blue-300 bg-gray-700' : 'text-blue-500 bg-gray-100') : ''}
            transition-colors duration-200
          `}
          aria-label="Profile"
        >
          <FiUser className="text-xl" />
        </NavLink>
      </div>
      <button
  onClick={toggleDrawer}
  className={`relative ml-4 p-2 rounded-full transition-all duration-300 ${
    darkMode ? "bg-gray-800 text-blue-300 hover:bg-gray-700" : "bg-gray-100 text-blue-600 hover:bg-blue-200"
  }`}
  aria-label="Show notifications"
>
  <FiBell size={20} />
  {notifications.length > 0 && (
    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
  )}
</button>

      {/* Dark Mode Toggle - unchanged */}
      <button
        onClick={toggleDarkMode}
        className={`
          p-2 rounded-full
          ${darkMode ? 
            'bg-gray-700 text-yellow-300 hover:bg-gray-600' : 
            'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }
          shadow-md hover:shadow-lg 
          transition-all duration-300
        `}
        aria-label="Toggle dark mode"
      >
        {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
      </button>
    </div>
  )
}

export default Navbar