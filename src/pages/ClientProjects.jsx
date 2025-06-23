import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FiClock, FiPlus, FiSearch } from "react-icons/fi";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import ProjectCard from "../components/ProjectCard";
import { useTheme } from "../contexts/ThemeContext";

function ClientProjects() {
  const { darkMode } = useTheme();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");
  const { user_id, client_id } = useParams();
  const [refresh, setRefresh] = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectDeadline, setProjectDeadline] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [sortByDeadline, setSortByDeadline] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/${user_id}/${client_id}/projects`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch projects");
        }
        const result = await response.json();
        const projectsData = Array.isArray(result) ? result : result.projects || [];
        setProjects(projectsData);
      } catch (err) {
        setError(err.message);
        toast.error(err.message || "Error loading projects");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [user_id, client_id, token, refresh]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const project = {
      project_name: projectName,
      deadline: projectDeadline,
      project_description: projectDescription
    };

    try {
      const response = await fetch(`${API_BASE_URL}/${user_id}/${client_id}/addproject`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(project)
      });

      const res = await response.json();

      if (response.status === 201) {
        toast.success(res.message, { toastId: "project-add-success" });
        setShowProjectForm(false);
        setProjectDeadline("");
        setProjectName("");
        setProjectDescription("");
        setRefresh(r => !r);
        return;
      }
      toast.error(res.message, { toastId: "project-add-failure" });
    } catch (err) {
      toast.error(err.message, { toastId: "project-add-failure" });
    }
  };

  // Delete project handler
  const handleDeleteProject = async (projectId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/${user_id}/${projectId}/deleteproject`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const res = await response.json();
      if (response.status === 200) {
        toast.success(res.message, { toastId: "project-delete-success" });
        setProjects((prev) => prev.filter((p) => p.id !== projectId && p._id !== projectId));
      } else {
        toast.error(res.message, { toastId: "project-delete-error" });
      }
    } catch (err) {
      toast.error(err.message, { toastId: "project-delete-error" });
    }
  };

  // --- Search and Sorting logic ---
  let filteredProjects = [...projects];
  if (search.trim()) {
    filteredProjects = filteredProjects.filter((project) =>
      (project.projectName || "")
        .toLowerCase()
        .includes(search.trim().toLowerCase())
    );
  }
  if (sortByDeadline) {
    filteredProjects.sort((a, b) => {
      const dateA = new Date(a.deadline || a.project_deadline || 0);
      const dateB = new Date(b.deadline || b.project_deadline || 0);
      if (!a.deadline && !a.project_deadline && !b.deadline && !b.project_deadline) return 0;
      if (!a.deadline && !a.project_deadline) return 1;
      if (!b.deadline && !b.project_deadline) return -1;
      return dateA - dateB;
    });
  }

  if (loading) {
    return (
      <div className={`min-h-screen flex flex-col transition-colors duration-300 ${
        darkMode ? "bg-gray-900" : "bg-blue-50"
      }`}>
        <Navbar />
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 flex items-center justify-center"
        >
          <p className={`${darkMode ? "text-white" : "text-gray-700"} text-lg`}>
            Loading projects...
          </p>
        </motion.div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen flex flex-col transition-colors duration-300 ${
        darkMode ? "bg-gray-900" : "bg-blue-50"
      }`}>
        <Navbar />
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 flex items-center justify-center"
        >
          <p className={darkMode ? "text-red-400" : "text-red-600"}>
            Error: {error}
          </p>
        </motion.div>
        <Footer />
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${
      darkMode ? "bg-gradient-to-br from-gray-900 to-gray-800" : "bg-gradient-to-br from-blue-50 to-indigo-50"
    }`}>
      <Navbar />
     
      <main className="flex-1 px-6 py-8">
        <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <motion.h1 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className={`text-3xl font-bold mb-2 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Client Projects
            </motion.h1>
            <motion.p 
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className={`${darkMode ? "text-gray-400" : "text-gray-600"} text-lg`}
            >
              Manage all your client projects in one place
            </motion.p>
          </div>
          <div className="flex gap-3 items-center">
            {/* Search Bar */}
            <div className="flex items-center rounded-lg border transition-colors px-3 py-2 w-full sm:w-64
              bg-white border-gray-200 text-gray-900
              dark:bg-gray-800 dark:border-gray-700 dark:text-white
            ">
              <FiSearch className="mr-2 text-gray-500 dark:text-gray-400" />
              <input
                type="text"
                placeholder="Search by project name"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="bg-transparent outline-none w-full text-inherit placeholder-gray-400"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className={`
                flex items-center gap-2 px-4 py-3 rounded-xl font-medium
                transition-all duration-300
                ${
                  darkMode
                    ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }
                shadow-lg hover:shadow-xl
              `}
              onClick={() => setShowProjectForm(true)}
            >
              <FiPlus size={18} />
              Add Project to this Client
            </motion.button>
            {/* Sort by Deadline Button */}
            <button
              className={`
                flex items-center gap-2 px-4 py-3 rounded-xl font-medium
                transition-all duration-300
                ${
                  sortByDeadline
                    ? darkMode
                      ? "bg-yellow-600 text-white"
                      : "bg-yellow-400 text-gray-900"
                    : darkMode
                      ? "bg-gray-700 text-gray-200"
                      : "bg-gray-200 text-gray-700"
                }
                shadow hover:shadow-lg
              `}
              onClick={() => setSortByDeadline((prev) => !prev)}
              title="Sort by Deadline"
            >
              <FiClock size={18} />
              {sortByDeadline ? "Sorted by Deadline" : "Sort by Deadline"}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {showProjectForm && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", damping: 20, stiffness: 300 }}
                className={`relative w-full max-w-md mx-auto rounded-xl p-8 shadow-2xl ${
                  darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
                }`}
              >
                <button
                  className={`absolute top-3 right-3 text-xl ${
                    darkMode ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-700"
                  } transition-colors`}
                  onClick={() => setShowProjectForm(false)}
                  aria-label="Close"
                >
                  &times;
                </button>
                <h2 className="text-2xl font-bold mb-6 text-center">
                  Add Project
                </h2>
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className={`block mb-1 font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Project Name
                    </label>
                    <input
                      type="text"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      required
                      className={`w-full px-3 py-2 rounded border outline-none transition ${
                        darkMode
                          ? "bg-gray-700 border-gray-600 text-white focus:ring-2 focus:ring-blue-500"
                          : "bg-white border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500"
                      }`}
                    />
                  </div>
                  <div className="mb-4">
                    <label className={`block mb-1 font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Project Description
                    </label>
                    <textarea
                      value={projectDescription}
                      onChange={(e) => setProjectDescription(e.target.value)}
                      required
                      className={`w-full px-3 py-2 rounded border outline-none transition resize-none ${
                        darkMode
                          ? "bg-gray-700 border-gray-600 text-white focus:ring-2 focus:ring-blue-500"
                          : "bg-white border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500"
                      }`}
                      rows={4}
                    />
                  </div>
                  <div className="mb-6">
                    <label className={`block mb-1 font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Deadline
                    </label>
                    <input
                      type="date"
                      value={projectDeadline}
                      onChange={(e) => setProjectDeadline(e.target.value)}
                      required
                      className={`w-full px-3 py-2 rounded border outline-none transition ${
                        darkMode
                          ? "bg-gray-700 border-gray-600 text-white focus:ring-2 focus:ring-blue-500"
                          : "bg-white border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500"
                      }`}
                    />
                  </div>
                  <div className="flex justify-end gap-3">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowProjectForm(false)}
                      className={`px-4 py-2 rounded-lg font-medium transition ${
                        darkMode
                          ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-4 py-2 rounded-lg font-medium shadow ${
                        darkMode
                          ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                          : "bg-blue-600 hover:bg-blue-700 text-white"
                      }`}
                    >
                      Add
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {filteredProjects.length > 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project._id || project.project_id || project.id || Math.random().toString(36).substr(2, 9)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <ProjectCard
                  project={{
                    projectName: project.projectName,
                    user_id: user_id,
                    client_id: client_id,
                    project_id: project.id,
                    clientName: project.clientName,
                    clientCompany: project.clientCompany,
                    projectDescription: project.projectDescription,
                    status: project.status || 'incomplete',
                    deadline: project.deadline,
                    invoiceGenerated: project.invoiceGenerated || false,
                  }}
                  onDelete={() => handleDeleteProject(project.id || project._id || project.project_id)}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="col-span-full text-center py-10"
          >
            <p className={`text-lg ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              No projects found for this client
            </p>
          </motion.div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default ClientProjects;