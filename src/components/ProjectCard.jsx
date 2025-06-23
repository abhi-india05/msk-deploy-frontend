import { useState } from 'react';
import { FiBriefcase, FiCalendar, FiEye, FiFileText, FiTrash2, FiUser } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useTheme } from '../contexts/ThemeContext';

function ProjectCard({ 
  project = {
    projectName: '',
    projectDescription: '',
    clientName: '',
    clientCompany: '',
    status: false, // boolean status (true = completed, false = incomplete)
    deadline: '',
    user_id: '',
    client_id: '',
    project_id: '',
    invoiceGenerated: false,
  },
  onDelete // <-- Pass this prop from parent for delete functionality
}) {
  const token = localStorage.getItem("token");
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const [invoiceGenerated, setInvoiceGenerated] = useState(project.invoiceGenerated || false);
  const [loading, setLoading] = useState(false);
  const [invoiceId, setInvoiceId] = useState(null);

  // Status colors configuration
  const statusColors = {
    completed: {
      bg: darkMode ? 'bg-gray-800' : 'bg-green-50',
      border: darkMode ? 'border-gray-700' : 'border-green-200',
      text: darkMode ? 'text-green-400' : 'text-green-600',
      accent: darkMode ? 'bg-green-600' : 'bg-green-500'
    },
    incomplete: {
      bg: darkMode ? 'bg-gray-800' : 'bg-gray-100',
      border: darkMode ? 'border-gray-700' : 'border-gray-300',
      text: darkMode ? 'text-gray-400' : 'text-gray-600',
      accent: darkMode ? 'bg-gray-600' : 'bg-gray-500'
    }
  };

  // Determine current status
  const isCompleted = project.status === true || project.status === 'completed';
  const colors = isCompleted ? statusColors.completed : statusColors.incomplete;
  const statusText = isCompleted ? 'Completed' : 'Incomplete';

  const formatDate = (dateString) => {
    if (!dateString) return 'No deadline';
    try {
      const options = { month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (e) {
      return 'Invalid date';
    }
  };

  const handleGenerateInvoice = async () => {
    if (!isCompleted || invoiceGenerated) return;
    setLoading(true);
    
    if (!token) {
      toast.error('You must be logged in to generate an invoice');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/${project.user_id}/${project.client_id}/${project.project_id}/addinvoice`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          }
        }
      );
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to generate invoice');
      }

      toast.success('Invoice generated successfully!');
      setInvoiceGenerated(true);
      setInvoiceId(data.invoice?._id || null);
    } catch (error) {
      toast.error(error.message || 'Error generating invoice');
    } finally {
      setLoading(false);
    }
  };

  const handleViewInvoice = () => {
    if (!project.user_id || !project.client_id || !project.project_id) {
      toast.error('Missing required information to view invoice');
      return;
    }
    navigate(`/${project.user_id}/${project.client_id}/${project.project_id}/viewinvoice`);
  };

  // Render the appropriate button based on status and invoice state
  const renderInvoiceButton = () => {
    if (isCompleted) {
      if (invoiceGenerated) {
        return (
          <button 
            className={`
              mt-4 w-full py-2.5 rounded-lg font-medium
              flex items-center justify-center
              transition-all duration-300
              ${darkMode ? 
                'bg-green-600 hover:bg-green-700 text-white' : 
                'bg-green-500 hover:bg-green-600 text-white'
              }
            `}
            onClick={handleViewInvoice}
          >
            <FiEye className="mr-2" size={16} />
            <span>View Invoice</span>
          </button>
        );
      } else {
        return (
          <button 
            className={`
              mt-4 w-full py-2.5 rounded-lg font-medium
              flex items-center justify-center
              transition-all duration-300
              ${darkMode ? 
                'bg-blue-600 hover:bg-blue-700 text-white' : 
                'bg-blue-500 hover:bg-blue-600 text-white'
              }
            `}
            disabled={loading}
            onClick={handleGenerateInvoice}
          >
            <FiFileText className="mr-2" size={16} />
            <span>{loading ? "Generating..." : "Generate Invoice"}</span>
          </button>
        );
      }
    } else {
      return (
        <button 
          className={`
            mt-4 w-full py-2.5 rounded-lg font-medium
            flex items-center justify-center
            transition-all duration-300
            ${darkMode ? 
              'bg-gray-600 text-gray-300 cursor-not-allowed' : 
              'bg-gray-300 text-gray-600 cursor-not-allowed'
            }
          `}
          disabled
        >
          <FiFileText className="mr-2" size={16} />
          <span>Generate Invoice</span>
        </button>
      );
    }
  };

  return (
    <div className={`
      rounded-xl p-5 transition-all duration-300
      relative
      ${darkMode ? 'bg-gray-900' : 'bg-white'}
      border ${colors.border}
      hover:shadow-lg hover:-translate-y-1
      flex flex-col h-full
    `}>
      {/* Delete Button */}
      {onDelete && (
        <button
          className="absolute top-3 right-3 text-red-500 hover:text-red-700 z-10"
          title="Delete Project"
          onClick={onDelete}
        >
          <FiTrash2 size={18} />
        </button>
      )}

      {/* Status indicator bar */}
      <div className={`h-1.5 w-full -mx-5 -mt-5 mb-4 rounded-t-lg ${colors.accent}`}></div>

      {/* Project Info */}
      <div className="mb-4">
        <h4 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {project.projectName || 'Untitled Project'}
        </h4>
        <p className={`text-sm mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          {project.projectDescription || 'No description provided'}
        </p>
      </div>

      {/* Client Info */}
      <div className="mb-4 space-y-2">
        <div className={`flex items-center text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          <FiUser className={`mr-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} size={14} />
          <span>{project.clientName || 'Unknown Client'}</span>
        </div>
        <div className={`flex items-center text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          <FiBriefcase className={`mr-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} size={14} />
          <span>{project.clientCompany || 'No company'}</span>
        </div>
      </div>

      {/* Status & Deadline */}
      <div className="mt-auto grid grid-cols-2 gap-4 items-center">
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${colors.text} ${colors.bg}`}>
          {statusText}
        </span>
        <div className={`flex items-center justify-end text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          <FiCalendar className={`mr-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} size={14} />
          <span>{`Deadline: ${formatDate(project.deadline)}`}</span>
        </div>
      </div>

      {/* Invoice Button */}
      {renderInvoiceButton()}
    </div>
  );
}

export default ProjectCard;