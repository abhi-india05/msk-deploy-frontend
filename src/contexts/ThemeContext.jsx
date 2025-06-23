import { createContext, useContext, useState } from 'react';
const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
    // Ensure we get a boolean, not a string
    const getInitialMode = () => {
        const mode = localStorage.getItem("mode");
        if (mode === "true") return true;
        if (mode === "false") return false;
        return false; // default to light mode
    };

    const [darkMode, setDarkMode] = useState(getInitialMode);

    const toggleDarkMode = () => {
        setDarkMode(prev => {
            localStorage.setItem("mode", !prev);
            return !prev;
        });
    };

    return (
        <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
            {children}
        </ThemeContext.Provider>
    );
}