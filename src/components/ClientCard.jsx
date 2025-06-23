import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';


function ClientCard({ 
  client = {
    user_id: '1',
    client_id:'1',
    name: 'Alex Johnson',
    email: 'alex@example.com',
    company: 'Creative Solutions Inc.',
    address: '123 Business Ave, New York',
  },onDelete
}) {

  
  const navigate=useNavigate();
  const { darkMode } = useTheme();
  const handleViewProjects=()=>{
    navigate(`/${client.user_id}/${client.client_id}/projects`)
  }
  return (
    <div className={`
      rounded-xl p-5 transition-all duration-300
      ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
      border hover:shadow-lg hover:-translate-y-1
      flex flex-col h-full relative
    `}>
      {/* Client Header */}
      <div className="mb-3">
        <h3 className={`text-xl font-extrabold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {client.name}
        </h3>
        <p className={`text-sm font-semibold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
          {client.company}
        </p>
      </div>

       <button
    onClick={() => onDelete && onDelete(client.client_id)}
    className={`
      absolute top-3 right-3 p-2 rounded-full transition
      ${darkMode
        ? 'bg-gray-700 hover:bg-red-700 text-red-400 hover:text-white'
        : 'bg-gray-100 hover:bg-red-100 text-red-500 hover:text-red-700'
      }
      shadow
    `}
    title="Delete Client"
  >
    {/* Trash SVG */}
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 7h12M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3m2 0v12a2 2 0 01-2 2H8a2 2 0 01-2-2V7h12z" />
    </svg>
  </button>


      {/* Contact Info */}
      <div className={`mt-auto space-y-2 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
        <div className="flex items-center">
          <span className="mr-2">📧</span>
          <span>{client.email}</span>
        </div>
        <div className="flex items-center">
          <span className="mr-2">🏢</span>
          <span>{client.address}</span>
        </div>
      </div>

      <button
  onClick={handleViewProjects}
  className={`
    mt-4 w-full py-3 rounded-xl font-bold relative overflow-hidden group
    transition-all duration-300
    ${darkMode
      ? "bg-gradient-to-r from-blue-700 via-indigo-700 to-violet-700 hover:from-blue-800 hover:via-indigo-800 hover:to-violet-800"
      : "bg-gradient-to-r from-blue-400 via-indigo-500 to-violet-500 hover:from-blue-500 hover:via-indigo-600 hover:to-violet-600"
    }
    text-white shadow-lg hover:shadow-2xl
    focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2
    active:scale-95
  `}
  style={{
    boxShadow: darkMode
      ? "0 4px 24px 0 rgba(80, 70, 255, 0.25)"
      : "0 4px 24px 0 rgba(80, 70, 255, 0.15)"
  }}
>
  {/* Shine animation overlay */}
  <span
    className="absolute left-0 top-0 h-full w-full pointer-events-none"
    aria-hidden="true"
  >
    <span className="
      absolute left-[-75%] top-0 h-full w-1/2
      bg-gradient-to-r from-white/30 via-white/60 to-white/10
      opacity-0 group-hover:opacity-80
      group-hover:animate-shine
      rounded-xl
      transition-opacity duration-300
    " />
  </span>
  <span className="relative z-10 flex items-center justify-center gap-2">
    View Projects
    <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
      fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
  </span>
</button>
    </div>
  );
}

export default ClientCard;