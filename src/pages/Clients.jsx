{/*import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FiPlus, FiSearch } from "react-icons/fi";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import ClientCard from "../components/ClientCard";
import Footer from "../components/Footer";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import { useTheme } from "../contexts/ThemeContext";

function Clients() {
  const { darkMode } = useTheme();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user_id } = useParams();
  const token = localStorage.getItem("token");
  const [showForm, setshowForm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [address, setAddress] = useState("");
  const [search, setSearch] = useState(""); // <-- Search state

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:3000/${user_id}/clients`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  }, [user_id, token, showForm]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const client = {
      client_name: name,
      client_email: email,
      client_company: company,
      client_address: address,
      client_user: user_id,
    };

    try {
      const response = await fetch(
        `http://localhost:3000/${user_id}/addclient`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(client),
        }
      );

      const res = await response.json();

      if (response.status === 201) {
        toast.success(res.message, { toastId: "client-add-success" });
        setshowForm(false);
        setEmail("");
        setName("");
        setCompany(""), setAddress("");
        
      } else toast.error(res.message, { toastId: "client-add-error" });
    } catch (err) {
      toast.error(err.message, { toastId: "client-add-error" });
    }
  };

  const handleDelete = async (client_id) => {
    try {
      const response = await fetch(
        `http://localhost:3000/${user_id}/${client_id}/deleteclient`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const res = await response.json();
      if (response.status === 200) {
        toast.success(res.message, { toastId: "client-delete-success" });
        setData((prev) => ({
          ...prev,
          clients: prev.clients.filter((c) => c._id !== client_id),
        }));
      } else {
        toast.error(res.message, { toastId: "client-delete-error" });
      }
    } catch (err) {
      toast.error(err.message, { toastId: "client-delete-error" });
    }
  };

  // Filter clients by search
  let filteredClients = data.clients || [];
  if (search.trim()) {
    filteredClients = filteredClients.filter((client) =>
      client.client_name?.toLowerCase().includes(search.trim().toLowerCase())
    );
  }

  if (loading) return <Loader />;
  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.5 }}
    >
      <div
        className={`min-h-screen flex flex-col transition-colors duration-300 ${
          darkMode
            ? "bg-gray-900"
            : "bg-gradient-to-b from-blue-50 to-indigo-50"
        }`}
      >
        <Navbar />

        <main className="flex-1">
          
          <div className="p-6 pb-2 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h1
              className={`text-3xl font-bold transition-colors duration-300 ${
                darkMode ? "text-white" : "text-gray-800"
              }`}
            >
              My Clients
            </h1>
            
            <div className="flex items-center rounded-lg border transition-colors px-3 py-2 w-full sm:w-64
              bg-white border-gray-200 text-gray-900
              dark:bg-gray-800 dark:border-gray-700 dark:text-white
            ">
              <FiSearch className="mr-2 text-gray-500 dark:text-gray-400" />
              <input
                type="text"
                placeholder="Search by client name"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="bg-transparent outline-none w-full text-inherit placeholder-gray-400"
              />
            </div>
            
            <button
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
              onClick={() => setshowForm(true)}
            >
              <FiPlus size={18} />
              Add Client
            </button>
          </div>

          {showForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
              <div
                className={`relative w-full max-w-md mx-auto rounded-xl p-8 shadow-2xl
      ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"}
    `}
              >
                <button
                  className="absolute top-3 right-3 text-xl text-gray-400 hover:text-gray-600"
                  onClick={() => setshowForm(false)}
                  aria-label="Close"
                >
                  &times;
                </button>
                <h2 className="text-2xl font-bold mb-6 text-center">
                  Add Client
                </h2>
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="block mb-1 font-medium">
                      Client Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                      }}
                      required
                      className={`w-full px-3 py-2 rounded border outline-none transition
              ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white focus:ring-2 focus:ring-blue-500"
                  : "bg-white border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500"
              }`}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-1 font-medium">
                      Client Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                      }}
                      required
                      className={`w-full px-3 py-2 rounded border outline-none transition
              ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white focus:ring-2 focus:ring-blue-500"
                  : "bg-white border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500"
              }`}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-1 font-medium">
                      Client Address
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => {
                        setAddress(e.target.value);
                      }}
                      required
                      className={`w-full px-3 py-2 rounded border outline-none transition
              ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white focus:ring-2 focus:ring-blue-500"
                  : "bg-white border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500"
              }`}
                    />
                  </div>
                  <div className="mb-6">
                    <label className="block mb-1 font-medium">
                      Client Company
                    </label>
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => {
                        setCompany(e.target.value);
                      }}
                      required
                      className={`w-full px-3 py-2 rounded border outline-none transition
              ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white focus:ring-2 focus:ring-blue-500"
                  : "bg-white border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500"
              }`}
                    />
                  </div>
                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setshowForm(false)}
                      className={`px-4 py-2 rounded-lg font-medium transition
              ${
                darkMode
                  ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className={`px-4 py-2 rounded-lg font-medium shadow
              ${
                darkMode
                  ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
                    >
                      Add
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredClients && filteredClients.length > 0 ? (
              filteredClients.map((client) => (
                <ClientCard
                  key={client._id}
                  client={{
                    user_id: user_id,
                    client_id: client._id,
                    name: client.client_name,
                    email: client.client_email,
                    phone: client.client_phone,
                    company: client.client_company,
                    address: client.client_address,
                    status: "backlog",
                  }}
                  onDelete={() => handleDelete(client._id)}
                />
              ))
            ) : (
              <p className="text-red-300">No clients! </p>
            )}
          </div>
        </main>
        <Footer />
        </div>
    </motion.div>
  );
}

export default Clients;*/}

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FiPlus, FiSearch } from "react-icons/fi";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import ClientCard from "../components/ClientCard";
import Footer from "../components/Footer";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import { useTheme } from "../contexts/ThemeContext";

function Clients() {
  const { darkMode } = useTheme();
  const [data, setData] = useState({ clients: [] }); // Initialize with empty clients array
  const [loading, setLoading] = useState(true);
  const { user_id } = useParams();
  const token = localStorage.getItem("token");
  const [showForm, setshowForm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [address, setAddress] = useState("");
  const [search, setSearch] = useState("");

  const fetchClients = () => {
    setLoading(true);
    fetch(`http://localhost:3000/${user_id}/clients`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch clients");
        return res.json();
      })
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err.message);
      });
  };

  useEffect(() => {
    fetchClients();
  }, [user_id, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const client = {
      client_name: name,
      client_email: email,
      client_company: company,
      client_address: address,
      client_user: user_id,
    };

    try {
      const response = await fetch(
        `http://localhost:3000/${user_id}/addclient`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(client),
        }
      );

      const res = await response.json();

      if (!response.ok) {
        throw new Error(res.message || "Failed to add client");
      }

      toast.success(res.message || "Client added successfully");
      setshowForm(false);
      setEmail("");
      setName("");
      setCompany("");
      setAddress("");
      
      // Update the clients list immediately
      fetchClients();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (client_id) => {
    try {
      const response = await fetch(
        `http://localhost:3000/${user_id}/${client_id}/deleteclient`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      const res = await response.json();
      
      if (!response.ok) {
        throw new Error(res.message || "Failed to delete client");
      }

      toast.success(res.message || "Client deleted successfully");
      // Optimistically update the UI
      setData(prev => ({
        ...prev,
        clients: prev.clients.filter((c) => c._id !== client_id),
      }));
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Filter clients by search
  const filteredClients = data.clients.filter((client) =>
    client.client_name?.toLowerCase().includes(search.trim().toLowerCase())
  );

  if (loading) return <Loader />;
  
  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.5 }}
    >
      <div
        className={`min-h-screen flex flex-col transition-colors duration-300 ${
          darkMode
            ? "bg-gray-900"
            : "bg-gradient-to-b from-blue-50 to-indigo-50"
        }`}
      >
        <Navbar />

        <main className="flex-1">
          {/* Header section */}
          <div className="p-6 pb-2 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h1
              className={`text-3xl font-bold transition-colors duration-300 ${
                darkMode ? "text-white" : "text-gray-800"
              }`}
            >
              My Clients
            </h1>
            {/* Search Bar */}
            <div className="flex items-center rounded-lg border transition-colors px-3 py-2 w-full sm:w-64
              bg-white border-gray-200 text-gray-900
              dark:bg-gray-800 dark:border-gray-700 dark:text-white
            ">
              <FiSearch className="mr-2 text-gray-500 dark:text-gray-400" />
              <input
                type="text"
                placeholder="Search by client name"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="bg-transparent outline-none w-full text-inherit placeholder-gray-400"
              />
            </div>
            <button
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
              onClick={() => setshowForm(true)}
            >
              <FiPlus size={18} />
              Add Client
            </button>
          </div>

          {showForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
              <div
                className={`relative w-full max-w-md mx-auto rounded-xl p-8 shadow-2xl
                  ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"}
                `}
              >
                <button
                  className="absolute top-3 right-3 text-xl text-gray-400 hover:text-gray-600"
                  onClick={() => setshowForm(false)}
                  aria-label="Close"
                >
                  &times;
                </button>
                <h2 className="text-2xl font-bold mb-6 text-center">
                  Add Client
                </h2>
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="block mb-1 font-medium">
                      Client Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className={`w-full px-3 py-2 rounded border outline-none transition
                        ${
                          darkMode
                            ? "bg-gray-700 border-gray-600 text-white focus:ring-2 focus:ring-blue-500"
                            : "bg-white border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500"
                        }`}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-1 font-medium">
                      Client Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className={`w-full px-3 py-2 rounded border outline-none transition
                        ${
                          darkMode
                            ? "bg-gray-700 border-gray-600 text-white focus:ring-2 focus:ring-blue-500"
                            : "bg-white border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500"
                        }`}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-1 font-medium">
                      Client Address
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                      className={`w-full px-3 py-2 rounded border outline-none transition
                        ${
                          darkMode
                            ? "bg-gray-700 border-gray-600 text-white focus:ring-2 focus:ring-blue-500"
                            : "bg-white border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500"
                        }`}
                    />
                  </div>
                  <div className="mb-6">
                    <label className="block mb-1 font-medium">
                      Client Company
                    </label>
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      required
                      className={`w-full px-3 py-2 rounded border outline-none transition
                        ${
                          darkMode
                            ? "bg-gray-700 border-gray-600 text-white focus:ring-2 focus:ring-blue-500"
                            : "bg-white border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500"
                        }`}
                    />
                  </div>
                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setshowForm(false)}
                      className={`px-4 py-2 rounded-lg font-medium transition
                        ${
                          darkMode
                            ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className={`px-4 py-2 rounded-lg font-medium shadow
                        ${
                          darkMode
                            ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                            : "bg-blue-600 hover:bg-blue-700 text-white"
                        }`}
                    >
                      Add
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
          
          {/* Client cards grid */}
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredClients.length > 0 ? (
              filteredClients.map((client) => (
                <ClientCard
                  key={client._id}
                  client={{
                    user_id: user_id,
                    client_id: client._id,
                    name: client.client_name,
                    email: client.client_email,
                    phone: client.client_phone,
                    company: client.client_company,
                    address: client.client_address,
                    status: "backlog",
                  }}
                  onDelete={() => handleDelete(client._id)}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-10">
                <p className={`text-lg ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}>
                  {search.trim() ? "No clients match your search" : "No clients found"}
                </p>
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </motion.div>
  );
}

export default Clients;