// components/ThemeProvider.tsx
import { useEffect, useState, type ReactNode } from "react";
import { ThemeContext } from "./theme_context";

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

    const toggleTheme = () => {
        setIsDarkMode((prev) => !prev);
    };

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            document.body.style.backgroundColor = '#111827';
            document.body.style.color = '#f9fafb';
        } else {
            document.documentElement.classList.remove('dark');
            document.body.style.backgroundColor = '#f9fafb';
            document.body.style.color = '#111827';
        }
    }, [isDarkMode]);

    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};