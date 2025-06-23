import { Briefcase, Calendar, DollarSign, Users, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import { API_BASE_URL } from "../config";
import { useTheme } from '../contexts/ThemeContext';

const Dashboard = () => {
  const { user_id } = useParams();

  const { darkMode } = useTheme();
  const [boards, setBoards] = useState({
    backlog: { id: 'backlog', title: 'Backlog', color: 'bg-gray-500', tasks: [] },
    todo: { id: 'todo', title: 'To Do', color: 'bg-blue-500', tasks: [] },
    inProgress: { id: 'inProgress', title: 'In Progress', color: 'bg-yellow-500', tasks: [] },
    review: { id: 'review', title: 'Review', color: 'bg-green-500', tasks: [] }
  });

  // State for price drawer
  const [priceDrawerOpen, setPriceDrawerOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [taskPrice, setTaskPrice] = useState(0);
  const [draggedItem, setDraggedItem] = useState(null);
  const [draggedFromBoard, setDraggedFromBoard] = useState(null);
  const token=localStorage.getItem("token");
  const [showTaskModal, setShowTaskModal] = useState(false);
const [clients, setClients] = useState([]);
const [projects, setProjects] = useState([]);
const [selectedClient, setSelectedClient] = useState("");
const [selectedProject, setSelectedProject] = useState("");
const [taskName, setTaskName] = useState("");
const [taskDesc, setTaskDesc] = useState("");
const [taskPriority, setTaskPriority] = useState(1);
const [loadingProjects, setLoadingProjects] = useState(false);
const [addingTask, setAddingTask] = useState(false);
  // Board to status mapping (using numbers as per your model)
  const boardStatusMapping = {
    backlog: 1,
    todo: 3,
    inProgress: 2,
    review: 4
  };

  // Priority mapping (1: highest, 4: lowest)
  const priorityTextMapping = {
    1: 'high',
    2: 'medium-high',
    3: 'medium-low',
    4: 'low'
  };

  // Priority colors
  const priorityColors = {
    1: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    2: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
    3: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    4: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
  };

  // Task type mapping
  const taskTypeTextMapping = {
    1: 'professional',
    2: 'personal'
  };

  // Fetch tasks from API
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/${user_id}/dashboard`, {
          headers: {
             'Content-Type': 'application/json',
             Authorization: `Bearer ${token}`,
          }
        });
        const { tasks } = await response.json();
        
        // Organize tasks into boards based on their status
        const updatedBoards = { ...boards };
        
        // Clear existing tasks
        Object.keys(updatedBoards).forEach(boardId => {
          updatedBoards[boardId].tasks = [];
        });

        tasks.forEach(task => {
          if (task.task_status === false) {
            // Find which board this task belongs to based on priority
            if (task.task_priority === 1) updatedBoards.backlog.tasks.push(task);
            else if (task.task_priority === 3) updatedBoards.todo.tasks.push(task);
            else if (task.task_priority === 2) updatedBoards.inProgress.tasks.push(task);
          } else {
            // Completed tasks go to review
            updatedBoards.review.tasks.push(task);
          }
        });
        
        setBoards(updatedBoards);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    if (user_id) {
      fetchTasks();
    }
  }, [user_id,showTaskModal]);

useEffect(() => {
  if (selectedClient) {
    setLoadingProjects(true);
    fetch(`${API_BASE_URL}/${user_id}/${selectedClient}/projectdropdown`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        // Defensive filter in case backend ever returns status:true projects
        const activeProjects = (data.projects || []).filter(
          project => project.status === false
        );
        console.log(Array.isArray(activeProjects), activeProjects);

        console.log("Active Projects (status false):", activeProjects);
        setProjects(activeProjects);
        console.log(projects);
        setLoadingProjects(false);
      });
  } else {
    setProjects([]);
  }
}, [selectedClient]);

  useEffect(() => {
    console.log("Updated projects state:", projects);
  }, [projects]);

  useEffect(() => {
  if (showTaskModal) {
    fetch(`${API_BASE_URL}/${user_id}/clients`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setClients(data.clients || []));
  }
}, [showTaskModal]);

{/*
useEffect(() => {
  if (selectedClient) {
    setLoadingProjects(true);
    fetch(`http://localhost:3000/${user_id}/${selectedClient}/projects`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setProjects(data.projects || []);
        setLoadingProjects(false);
      });
  } else {
    setProjects([]);
  }
}, [selectedClient]);
*/}



  // Handler for non-review board drops
  const handleRegularDrop = async (taskId, fromBoardId, toBoardId) => {
    const newPriority = boardStatusMapping[toBoardId];
    console.log('new priority:', newPriority);
    console.log('token:', token);
    try {
      // Update task priority in backend
      const response = await fetch(`${API_BASE_URL}/${user_id}/${taskId}/priority`, {
        method: 'PATCH',
        headers: {
           'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ task_priority: Number(newPriority) })
      });
      console.log("Response from server:", response);
      if (!response.ok) {
        throw new Error('Failed to update task priority');
      }

      // Update local state
      setBoards(prev => {
        const updatedBoards = { ...prev };
        
        // Remove from original board
        updatedBoards[fromBoardId] = {
          ...updatedBoards[fromBoardId],
          tasks: updatedBoards[fromBoardId].tasks.filter(task => task._id !== taskId)
        };

        // Find the task and update its priority
        const movedTask = prev[fromBoardId].tasks.find(task => task._id === taskId);
        const updatedTask = { 
          ...movedTask, 
          task_priority: newPriority 
        };

        // Add to target board
        updatedBoards[toBoardId] = {
          ...updatedBoards[toBoardId],
          tasks: [...updatedBoards[toBoardId].tasks, updatedTask]
        };

        return updatedBoards;
      });

    } catch (error) {
      console.error('Error updating task priority:', error);
    }
  };

  // Handler for review board drops
  const handleReviewDrop = async (taskId, fromBoardId) => {
    try {
      // First update status to completed (true)
      const statusResponse = await fetch(`${API_BASE_URL}/${user_id}/${taskId}/status`, {
        method: 'PATCH',
        headers: {
           'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      if (!statusResponse.ok) {
        throw new Error('Failed to update task status');
      }

      // Update local state to move to review board
      setBoards(prev => {
        const updatedBoards = { ...prev };
        
        // Remove from original board
        updatedBoards[fromBoardId] = {
          ...updatedBoards[fromBoardId],
          tasks: updatedBoards[fromBoardId].tasks.filter(task => task._id !== taskId)
        };

        // Find the task and update its status
        const movedTask = prev[fromBoardId].tasks.find(task => task._id === taskId);
        const updatedTask = { 
          ...movedTask, 
          task_status: true 
        };

        // Add to review board
        updatedBoards.review = {
          ...updatedBoards.review,
          tasks: [...updatedBoards.review.tasks, updatedTask]
        };

        return updatedBoards;
      });

      // Open price drawer
      const task = boards[fromBoardId].tasks.find(t => t._id === taskId);
      setCurrentTask(task);
      setTaskPrice(task.task_price || 0);
      setPriceDrawerOpen(true);

    } catch (error) {
      console.error('Error moving task to review:', error);
    }
  };

  // Unified drop handler
  const handleDrop = (e, targetBoardId) => {
    e.preventDefault();
    
    if (!draggedItem || draggedFromBoard === targetBoardId) return;

    if (targetBoardId === 'review') {
      handleReviewDrop(draggedItem._id, draggedFromBoard);
    } else {
      handleRegularDrop(draggedItem._id, draggedFromBoard, targetBoardId);
    }

    // Reset drag state
    setDraggedItem(null);
    setDraggedFromBoard(null);
  };

  const handleDragStart = (e, task, boardId) => {
    setDraggedItem(task);
    setDraggedFromBoard(boardId);
    e.dataTransfer.setData('text/plain', task._id);
    e.currentTarget.style.opacity = '0.4';
  };

  const handleDragEnd = (e) => {
    e.currentTarget.style.opacity = '1';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handlePriceSubmit = async () => {
    if (!currentTask) return;

    try {
      // Update task price in backend
      const response = await fetch(`${API_BASE_URL}/${user_id}/${currentTask._id}/price`, {
        method: 'PATCH',
        headers: {
         'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          task_price: parseFloat(taskPrice)
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update task price');
      }

      // Update local state
      setBoards(prev => {
        const updatedBoards = { ...prev };
        const reviewBoard = updatedBoards.review;
        const taskIndex = reviewBoard.tasks.findIndex(t => t._id === currentTask._id);
        
        if (taskIndex !== -1) {
          reviewBoard.tasks[taskIndex].task_price = parseFloat(taskPrice);
        }
        
        return updatedBoards;
      });

      setPriceDrawerOpen(false);
      setCurrentTask(null);
    } catch (error) {
      console.error('Error updating task price:', error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const isOverdue = (dateString) => {
    if (!dateString) return false;
    return new Date(dateString) < new Date();
  };

  const formatPrice = (price) => {
    if (!price || price === 0) return '';
    return `$${price.toLocaleString()}`;
  };

  const TaskCard = ({ task, boardId }) => (
    <div 
      draggable
      onDragStart={(e) => handleDragStart(e, task, boardId)}
      onDragEnd={handleDragEnd}
      className={`p-4 rounded-lg shadow-sm border transition-all duration-200 hover:shadow-md ${
        darkMode 
          ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' 
          : 'bg-white border-gray-200 hover:bg-gray-50'
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className={`font-semibold text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {task.task_name}
        </h4>
      </div>
      
      {task.task_description && (
        <p className={`text-xs mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          {task.task_description}
        </p>
      )}

      <div className="space-y-2 mb-3">
        {task.task_project && (
          <div className={`flex items-center text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            <Briefcase size={12} className="mr-1" />
            <span className="font-medium">Project:</span>
            <span className="ml-1">{task.task_project.project_name}</span>
          </div>
        )}
        {task.task_client && (
          <div className={`flex items-center text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            <Users size={12} className="mr-1" />
            <span className="font-medium">Client:</span>
            <span className="ml-1">{task.task_client.client_name}</span>
          </div>
        )}
        {task.task_price > 0 && (
          <div className={`flex items-center text-xs font-semibold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
            <DollarSign size={12} className="mr-1" />
            {formatPrice(task.task_price)}
          </div>
        )}
      </div>

      <div className="flex justify-between items-center">
        <span className={`px-2 py-1 text-xs rounded-full font-medium ${priorityColors[task.task_priority]}`}>
          {priorityTextMapping[task.task_priority]}
        </span>
        
        {task.task_commissioned && (
          <div className={`flex items-center text-xs ${
            isOverdue(task.task_commissioned) 
              ? 'text-red-500' 
              : darkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            <Calendar size={12} className="mr-1" />
            {formatDate(task.task_commissioned)}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      darkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
 <Navbar/>
      <div className="flex justify-end max-w-7xl mx-auto px-4 pt-6">
  <button
    onClick={() => setShowTaskModal(true)}
    className={`
      flex items-center gap-2 px-5 py-2 rounded-xl font-semibold shadow-lg
      transition-all duration-300
      ${darkMode
        ? "bg-indigo-600 hover:bg-indigo-700 text-white"
        : "bg-blue-600 hover:bg-blue-700 text-white"
      }
    `}
  >
    + Add Task
  </button>
</div>
      {/* Kanban Board */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6 overflow-x-auto pb-6">
          {Object.values(boards).map((board) => (
            <div
              key={board.id}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, board.id)}
              className={`flex-shrink-0 w-80 rounded-lg ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              } shadow-sm border ${
                darkMode ? 'border-gray-700' : 'border-gray-200'
              }`}
            >
              {/* Board Header */}
              <div className={`p-4 border-b ${
                darkMode ? 'border-gray-700' : 'border-gray-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${board.color}`}></div>
                    <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {board.title}
                    </h3>
                    <span className={`text-sm px-2 py-1 rounded-full ${
                      darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {board.tasks.length}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tasks */}
              <div className="p-4 space-y-3 min-h-[600px] max-h-[600px] overflow-y-auto">
                {board.tasks.map((task) => (
                  <TaskCard key={task._id} task={task} boardId={board.id} />
                ))}
                {board.tasks.length === 0 && (
                  <div className={`flex items-center justify-center h-32 border-2 border-dashed rounded-lg ${
                    darkMode ? 'border-gray-600 text-gray-500' : 'border-gray-300 text-gray-400'
                  }`}>
                    <span className="text-sm">No tasks yet</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Price Drawer */}
      {priceDrawerOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`w-full max-w-md rounded-lg p-6 ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Set Task Price
              </h3>
              <button
                onClick={() => setPriceDrawerOpen(false)}
                className={`p-1 rounded-full ${
                  darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
              >
                <X size={20} className={darkMode ? 'text-gray-300' : 'text-gray-500'} />
              </button>
            </div>
            
            <div className="space-y-4">
              {currentTask && (
                <div>
                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Task: <span className="font-medium">{currentTask.task_name}</span>
                  </p>
                </div>
              )}
              
              <div>
                <label className={`block text-sm font-medium mb-1 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Price ($)
                </label>
                <input
                  type="number"
                  value={taskPrice}
                  onChange={(e) => setTaskPrice(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Enter price"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setPriceDrawerOpen(false)}
                className={`px-4 py-2 rounded-lg ${
                  darkMode 
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } transition-colors`}
              >
                Cancel
              </button>
              <button
                onClick={handlePriceSubmit}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

       {showTaskModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
    <div className={`relative w-full max-w-md mx-auto rounded-xl p-8 shadow-2xl
      ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"}
    `}>
      <button
        className="absolute top-3 right-3 text-xl text-gray-400 hover:text-gray-600"
        onClick={() => setShowTaskModal(false)}
        aria-label="Close"
      >
        &times;
      </button>
      <h2 className="text-2xl font-bold mb-6 text-center">Add Task</h2>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setAddingTask(true);
          const body = {
            task_name: taskName,
            task_description: taskDesc,
            task_priority: taskPriority,
            task_type: 1 // company
          };
          console.log(selectedProject);
          console.log(selectedClient);
          const response = await fetch(`${API_BASE_URL}/${user_id}/${selectedClient}/addtask`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
              ...body,
              project_id: selectedProject
            })
          });
          setAddingTask(false);
          if (response.status === 201) {
            setShowTaskModal(false);
            setTaskName(""); setTaskDesc(""); setTaskPriority(1); setSelectedClient(""); setSelectedProject("");
             toast.success("Task added successfully",{toastId: "task-success"});
            // Optionally refresh tasks here
          } else {
            const err = await response.json();
            toast.error("Failed to add task", err.message);
          }
        }}
      >
        <div className="mb-4">
          <label className="block mb-1 font-medium">Client</label>
          <select
            required
            value={selectedClient}
            onChange={e => { setSelectedClient(e.target.value); setSelectedProject(""); }}
            className={`w-full px-3 py-2 rounded border outline-none transition
              ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"}
            `}
          >
            <option value="">Select Client</option>
            {clients.map(client => (
              <option key={client._id} value={client._id}>{client.client_name}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Project</label>
          <select
            required
            value={selectedProject}
            onChange={e => setSelectedProject(e.target.value)}
            disabled={!selectedClient || loadingProjects}
            className={`w-full px-3 py-2 rounded border outline-none transition
              ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"}
            `}
          >
            <option value="">Select Project</option>
            {projects.map(project => (
              <option key={project.id || project._id} value={project.id || project._id}>{project.projectName || project.project_name}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Task Name</label>
          <input
            type="text"
            required
            value={taskName}
            onChange={e => setTaskName(e.target.value)}
            className={`w-full px-3 py-2 rounded border outline-none transition
              ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"}
            `}
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Task Description</label>
          <textarea
            required
            value={taskDesc}
            onChange={e => setTaskDesc(e.target.value)}
            className={`w-full px-3 py-2 rounded border outline-none transition
              ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"}
            `}
          />
        </div>
        <div className="mb-6">
          <label className="block mb-1 font-medium">Task Priority</label>
          <select
            required
            value={taskPriority}
            onChange={e => setTaskPriority(Number(e.target.value))}
            className={`w-full px-3 py-2 rounded border outline-none transition
              ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"}
            `}
          >
            <option value={1}>Backlog</option>
            <option value={3}>To Do</option>
            <option value={2}>In Progress</option>
            {/* Review (4) not selectable */}
          </select>
        </div>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setShowTaskModal(false)}
            className={`px-4 py-2 rounded-lg font-medium transition
              ${darkMode ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}
            `}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={addingTask}
            className={`px-4 py-2 rounded-lg font-medium shadow
              ${darkMode ? "bg-indigo-600 hover:bg-indigo-700 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"}
            `}
          >
            {addingTask ? "Adding..." : "Add Task"}
          </button>
        </div>
      </form>
    </div>
  </div>
)}

    </div>
  );
};

export default Dashboard;