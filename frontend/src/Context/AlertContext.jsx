import { createContext, useContext, useState } from "react";

const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const [alert, setAlert] = useState({ message: "", type: "" });

  const showAlert = (message, type = "info", duration = 3000) => {
    setAlert({ message, type });

    setTimeout(() => {
      setAlert({ message: "", type: "" });
    }, duration);
  };

  return (
    <AlertContext.Provider value={{ alert, showAlert }}>
      {children}
    </AlertContext.Provider>
  );
};

export const useAlert = () => useContext(AlertContext);
