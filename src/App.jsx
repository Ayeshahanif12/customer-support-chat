import { useState, useEffect, useContext } from "react";
import { ThemeContext } from "./context/ThemeContext";
import EntryScreen from "./components/EntryScreen/EntryScreen";
import ChatContainer from "./components/EntryScreen/chat/ChatContainer";
import "./App.css";

function App() {
  const { theme } = useContext(ThemeContext);
  const [currentRole, setCurrentRole] = useState(null);
  const [customerName, setCustomerName] = useState("");

  useEffect(() => {
    const savedRole = localStorage.getItem("chatAppRole");
    const savedName = localStorage.getItem("chatAppName");

    if (savedRole) {
      setCurrentRole(savedRole);
      setCustomerName(savedName || "");
    }
  }, []);

  const handleRoleSelect = (role, name) => {
    setCurrentRole(role);
    setCustomerName(name);
    localStorage.setItem("chatAppRole", role);
    localStorage.setItem("chatAppName", name);
  };

  const handleBack = () => {
    setCurrentRole(null);
  };

  const handleLogout = () => {
    setCurrentRole(null);
    setCustomerName("");
    localStorage.clear();
  };

  return (
    <div className={`app-container ${theme}`}>
      {!currentRole ? (
        <EntryScreen handleRoleSelect={handleRoleSelect} />
      ) : (
        <ChatContainer
          role={currentRole}
          customerName={customerName}
          onBack={handleBack}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}

export default App;
