import { motion } from "framer-motion";
import { useTheme } from "../contexts/ThemeContext";

function Loader() {
  const { darkMode } = useTheme();

  return (
    <div
      className={`
        fixed inset-0 z-50 flex items-center justify-center
        ${darkMode ? "bg-gray-900 bg-opacity-90" : "bg-white bg-opacity-80"}
      `}
      style={{ minHeight: "100vh" }}
    >
      <motion.div
        className="relative flex items-center justify-center"
        initial={{ scale: 0.9, opacity: 0.7 }}
        animate={{ scale: [0.9, 1.05, 0.9], opacity: [0.7, 1, 0.7] }}
        transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
      >
        {/* Animated gradient ring */}
        <motion.div
          className={`
            w-20 h-20 rounded-full
            border-4
            ${darkMode
              ? "border-transparent bg-gradient-to-tr from-blue-700 via-indigo-500 to-violet-600"
              : "border-transparent bg-gradient-to-tr from-blue-400 via-indigo-400 to-violet-400"
            }
            animate-spin-slow
            shadow-2xl
          `}
          style={{
            borderImage: "linear-gradient(135deg, #3b82f6, #6366f1, #a78bfa) 1",
            borderStyle: "solid",
            borderWidth: "4px",
            boxShadow: darkMode
              ? "0 0 40px 8px #6366f1, 0 0 0 4px #1e293b"
              : "0 0 40px 8px #818cf8, 0 0 0 4px #e0e7ff"
          }}
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
        />
        {/* Pulsing blue dot in the center */}
        <motion.div
          className={`absolute w-7 h-7 rounded-full shadow-lg
            ${darkMode ? "bg-blue-500" : "bg-blue-600"}
          `}
          animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
        />
      </motion.div>
    </div>
  );
}

export default Loader;