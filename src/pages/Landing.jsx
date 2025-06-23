import { motion, useAnimation } from "framer-motion";
import React from "react";
import { useInView } from "react-intersection-observer";
import { useNavigate } from "react-router-dom";
import { FacebookShareButton, TwitterShareButton, WhatsappShareButton } from 'react-share';
import img2_girl from "../assets/img2_girl.jpg";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { useTheme } from "../contexts/ThemeContext";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8 } }
};

const slideInFromLeft = {
  hidden: { x: -100, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.6 } }
};

const slideInFromRight = {
  hidden: { x: 100, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.6 } }
};

const scaleUp = {
  hidden: { scale: 0.95, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { duration: 0.5 } }
};

// Animated component wrapper
const AnimatedSection = ({ children, variants = fadeInVariants, threshold = 0.1 }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold });

  React.useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={variants}
    >
      {children}
    </motion.div>
  );
};

function ShareProject() {
  const shareUrl = "https://github.com/HackSomeThorns-2025/ManipalSuperKings";
  const shareTitle = "Share Soloflow with your friends";
  
  return (
    <AnimatedSection variants={containerVariants}>
      <div className="share p-6 text-center">
        <motion.h2 className="text-2xl font-bold mb-4" variants={itemVariants}>Share Our Project</motion.h2>
        <motion.p className="text-gray-600 mb-6" variants={itemVariants}>Help us spread the word </motion.p>
        <motion.div className="flex gap-4 justify-center flex-wrap" variants={containerVariants}>
          <motion.div variants={itemVariants}>
            <FacebookShareButton 
              url={shareUrl} 
              quote={shareTitle}
              className="transition-transform hover:scale-105"
            >
              <div className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-lg">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </div>
            </FacebookShareButton>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <TwitterShareButton 
              url={shareUrl} 
              title={shareTitle}
              hashtags={['HackSomeThorns2025', 'OpenSource', 'GitHub']}
              className="transition-transform hover:scale-105"
            >
              <div className="flex items-center px-6 py-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 shadow-lg">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
                Twitter
              </div>
            </TwitterShareButton>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <WhatsappShareButton 
              url={shareUrl} 
              title={shareTitle}
              className="transition-transform hover:scale-105"
            >
              <div className="flex items-center px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 shadow-lg">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
                WhatsApp
              </div>
            </WhatsappShareButton>
          </motion.div>
        </motion.div>
      </div>
    </AnimatedSection>
  );
}

function Landing() {
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.5 }}
    >
      <div
        className={`w-full min-h-screen transition-colors duration-300 ${
          darkMode
            ? "bg-gray-900 text-gray-100"
            : "bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-800"
        }`}
      >
        <Header/>

        <div className="container mx-auto px-6 py-12">
          {/* Hero Section */}
          <AnimatedSection variants={scaleUp}>
            <div
              style={{
                backgroundImage: `url(${img2_girl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                borderRadius: "20px",
                backgroundRepeat: "no-repeat",
              }}
              className="relative h-96 md:h-[500px] flex flex-col items-center justify-center gap-6 p-8 text-center overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-black/70 via-black/20 to-transparent rounded-2xl"></div>
              <div className="relative z-10">
                <motion.h1 
                  className="text-6xl md:text-7xl font-extrabold text-white drop-shadow-xl"
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  Soloflow
                </motion.h1>
                <motion.p 
                  className="text-lg md:text-xl text-indigo-200 mb-6 leading-relaxed"
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  One App. Your Entire Hustle.
                </motion.p>
                <motion.div 
                  className="flex flex-wrap gap-4 justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                <motion.button
                  onClick={() => navigate("/register")}
                  className="group relative px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-500 overflow-hidden"
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 20px 40px -12px rgba(59, 130, 246, 0.4)"
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  {/* Animated gradient border */}
                  <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
                  
                  {/* Main gradient background */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 group-hover:from-blue-700 group-hover:to-purple-700 transition-all duration-300"></div>
                  
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  </div>
                  
                  {/* Glow effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400/30 to-purple-400/30 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 scale-150"></div>
                  
                  {/* Button content */}
                  <div className="relative z-10 flex items-center justify-center gap-3 text-white">
                    <span className="font-bold">Register</span>
                  </div>
                </motion.button>

                {/* Enhanced Login Button */}
                <motion.button
                  onClick={() => navigate("/login")}
                  className={`group relative px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-500 overflow-hidden backdrop-blur-sm ${
                    darkMode 
                      ? "bg-gray-800/80 hover:bg-gray-700/90 text-white border border-gray-600" 
                      : "bg-white/90 hover:bg-white text-gray-800 border border-gray-200"
                  }`}
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: darkMode 
                      ? "0 20px 40px -12px rgba(0, 0, 0, 0.4)" 
                      : "0 20px 40px -12px rgba(0, 0, 0, 0.1)"
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  {/* Animated gradient border on hover */}
                  <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Glass morphism effect */}
                  <div className={`absolute inset-0 rounded-2xl backdrop-blur-md ${
                    darkMode 
                      ? "bg-gray-800/70 group-hover:bg-gray-700/80" 
                      : "bg-white/70 group-hover:bg-white/90"
                  } transition-all duration-300`}></div>
                  
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-r from-transparent ${
                      darkMode ? "via-white/10" : "via-gray-800/10"
                    } to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000`}></div>
                  </div>
                  
                  {/* Subtle glow */}
                  <div className={`absolute inset-0 rounded-2xl ${
                    darkMode 
                      ? "bg-blue-400/20 group-hover:bg-blue-400/30" 
                      : "bg-gray-400/20 group-hover:bg-gray-400/30"
                  } blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 scale-110`}></div>
                  
                  {/* Button content */}
                  <div className="relative z-10 flex items-center justify-center gap-3" id="about">
                    <span className="font-bold">Login</span>
                  </div>
                </motion.button>
                </motion.div>
              </div>
            </div>
          </AnimatedSection>

          {/* Description Section */}
          <AnimatedSection variants={slideInFromLeft}>
            <div
              id = "features"
              className={`my-16 p-6 rounded-2xl ${
                darkMode ? "bg-gray-800" : "bg-white"
              } shadow-xl`}
            >
              <h2
                className={`text-2xl md:text-5xl font-bold mb-6 tracking-tight ${
                  darkMode ? "text-white" : "text-gray-800"
                }`}
              >
                Your All-in-One Command Center
              </h2>
              <p
                className={`text-lg ${
                  darkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Soloflow is your all-in-one command center—designed for solo
                creators, student entrepreneurs, and self-starters. Simplify your
                workflow, manage tasks, organize ideas, and bring your projects to
                life—without the chaos.
              </p>
            </div>
          </AnimatedSection>

          {/* Features Grid */}
          <AnimatedSection variants={containerVariants}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {[
                {
                  icon: "💰",
                  title: "Invoicing",
                  desc: "Create and send professional invoices with ease. Track payments and manage your finances effortlessly.",
                },
                {
                  icon: "✅",
                  title: "Task Management",
                  desc: "Organize your tasks and projects efficiently with kanban boards, deadlines, and priority levels.",
                },
                {
                  icon: "👥",
                  title: "Client Tracking",
                  desc: "Keep track of your clients and their projects with detailed profiles and communication history.",
                },
                {
                  icon: "🎨",
                  title: "Content Showcasing",
                  desc: "Showcase your work and projects in a beautiful portfolio that impresses clients and collaborators.",
                },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  className={`p-6 rounded-2xl transition-all transform hover:-translate-y-2 hover:shadow-[0_8px_30px_rgba(0,0,0,0.1)] ${
                    darkMode
                      ? "bg-gray-800 hover:bg-gray-700"
                      : "bg-white hover:bg-blue-50"
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-full ${
                      darkMode ? "bg-indigo-900" : "bg-blue-100"
                    } flex items-center justify-center mb-4`}
                  >
                    <span
                      className={`text-xl ${
                        darkMode ? "text-indigo-300" : "text-blue-600"
                      }`}
                    >
                      {item.icon}
                    </span>
                  </div>
                  <h3
                    className={`text-xl font-bold mb-2 ${
                      darkMode ? "text-white" : "text-gray-800"
                    }`}
                  >
                    {item.title}
                  </h3>
                  <p className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>

          {/* Add the ShareProject component here */}
          <AnimatedSection variants={fadeInVariants}>
            <div className={`mb-16 p-6 rounded-2xl ${darkMode ? "bg-gray-800" : "bg-white"} shadow-xl`}>
              <ShareProject />
            </div>
          </AnimatedSection>
        </div>

          {/* Contact Us Section */}
          <AnimatedSection variants={slideInFromRight}>
            <div className="container mx-auto px-6" id="contact">
              <div
                id="contact"
                className={`mb-20 p-8 rounded-2xl shadow-xl ${
                  darkMode ? "bg-gray-800" : "bg-white"
                }`}
              >
                <h2
                  className={`text-4xl md:text-5xl font-extrabold mb-4 tracking-tight ${
                    darkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  Get in Touch
                </h2>
                <p
                  className={`text-lg mb-6 ${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Have questions or need support? Reach out to us!
                </p>
                <div
                  className={`flex flex-col sm:flex-row items-start sm:items-center gap-6 text-lg ${
                    darkMode ? "text-gray-200" : "text-gray-700"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <svg
                      className="w-6 h-6 text-blue-500"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M2.01 6.52A2 2 0 014 5h16a2 2 0 011.99 1.52L12 13.5 2.01 6.52zM2 8.49V18a2 2 0 002 2h16a2 2 0 002-2V8.49l-9.33 6.23a1 1 0 01-1.34 0L2 8.49z" />
                    </svg>
                    <a
                      href="mailto:soloflow@gmail.com"
                      className="underline decoration-dotted hover:text-blue-400 transition-colors"
                    >
                      soloflow@gmail.com
                    </a>
                  </div>

                  <div className="flex items-center gap-3">
                    <svg
                      className="w-6 h-6 text-green-500"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M6.62 10.79a15.092 15.092 0 006.59 6.59l2.2-2.2a1 1 0 011.06-.24 11.72 11.72 0 003.7.59 1 1 0 011 1V20a1 1 0 01-1 1C10.07 21 3 13.93 3 5a1 1 0 011-1h3.5a1 1 0 011 1c0 1.27.21 2.5.59 3.7a1 1 0 01-.24 1.06l-2.23 2.23z" />
                    </svg>
                    <a
                      href="tel:+919696969696"
                      className="underline decoration-dotted hover:text-green-400 transition-colors"
                    >
                      +91 96969 69696
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>



        <Footer darkMode={darkMode} />
      </div>
    </motion.div>
  );
}

export default Landing;