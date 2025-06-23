import { createContext, useContext, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../config";
const NotificationContext = createContext();

export function useNotification() {
  return useContext(NotificationContext);
}

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const lastSeenRef = useRef(Date.now());

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user_id = localStorage.getItem("user_id"); // Store user_id in localStorage on login

    if (!token || !user_id) return;

    const fetchNotifications = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/${user_id}/notifications`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (Array.isArray(data.notifications)) {
          // Find new notifications since lastSeenRef
          const newNotifs = data.notifications.filter(
            (n) => new Date(n.createdAt).getTime() > lastSeenRef.current
          );
          if (newNotifs.length > 0) {
            newNotifs.forEach((notif) => {
              toast.info(notif.title || notif.message, { toastId: notif._id });
            });
            lastSeenRef.current = Date.now();
          }
          setNotifications(data.notifications);
        }
      } catch (err) {
        // Optionally handle error
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, []);

  const toggleDrawer = () => setDrawerOpen((open) => !open);

  return (
    <NotificationContext.Provider value={{ notifications, drawerOpen, toggleDrawer }}>
      {children}
    </NotificationContext.Provider>
  );
}