import { useEffect } from "react";
import { FiTrash2, FiX } from "react-icons/fi";
import { useParams } from "react-router-dom";
import { API_BASE_URL } from "../config";
import { useNotification } from "../contexts/NotificationContext";
export default function NotificationDrawer() {
  const {
    notifications,
    removeNotification,
    clearNotifications,
    drawerOpen,
    toggleDrawer,
    setNotifications
  } = useNotification();

  const token = localStorage.getItem("token");
  const { user_id } = useParams();

  // Fetch notifications from backend when drawer opens
  useEffect(() => {
    if (drawerOpen && user_id && token) {
      fetch(`${API_BASE_URL}/${user_id}/notifications`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.notifications) setNotifications(data.notifications.map(n => ({
            ...n,
            id: n._id // for local removal
          })));
        });
    }
  }, [drawerOpen, user_id, token, setNotifications]);

  return (
    <div
      className={`fixed top-0 right-0 h-full w-80 bg-white dark:bg-gray-900 shadow-2xl z-50 transform transition-transform duration-300 ${
        drawerOpen ? "translate-x-0" : "translate-x-full"
      }`}
      style={{ maxWidth: "90vw" }}
    >
      <div className="flex items-center justify-between px-6 py-4 border-b dark:border-gray-700">
        <span className="text-lg font-bold dark:text-white">Notifications</span>
        <button
          onClick={toggleDrawer}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition"
          aria-label="Close notifications"
        >
          <FiX size={20} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4">
        {notifications.length === 0 ? (
          <div className="text-center text-gray-400 mt-8">No notifications</div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className="bg-blue-50 dark:bg-gray-800 rounded-lg p-4 shadow flex items-start justify-between"
            >
              <div>
                <div className="font-semibold text-blue-700 dark:text-blue-300">{n.title}</div>
                <div className="text-sm text-gray-700 dark:text-gray-300">{n.message}</div>
              </div>
              <button
                onClick={() => removeNotification(n.id)}
                className="ml-2 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                aria-label="Remove notification"
              >
                <FiX size={16} />
              </button>
            </div>
          ))
        )}
      </div>
      <div className="px-6 py-4 border-t dark:border-gray-700 flex justify-end">
        <button
          onClick={clearNotifications}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
          disabled={notifications.length === 0}
        >
          <FiTrash2 size={16} />
          Clear All
        </button>
      </div>
    </div>
  );
}