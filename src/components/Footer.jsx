import React from 'react'

function Footer({ darkMode }) {
  return (
    <div className={`max-w-full bottom-0 backdrop-blur-3xl flex flex-wrap p-4 mt-4 flex-col justify-center items-center transition-colors duration-300 ${
      darkMode ? 'bg-gray-800 text-gray-200' : 'bg-blue-900 text-white'
    }`}>
      2025 SoloFlow. All rights reserved.
    </div>
  )
}

export default Footer