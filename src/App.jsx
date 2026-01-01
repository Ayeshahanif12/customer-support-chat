import { useState, useEffect } from "react";
import EntryScreen from "./components/EntryScreen/EntryScreen";
import "./App.css";
import ChatContainer from "./components/EntryScreen/chat/ChatContainer";

function App() {
  // top-level state
  const [currentRole, setCurrentRole] = useState(null);
  const [customerName, setCustomerName] = useState("");

  // restore session on app load
  useEffect(() => {
    const savedRole = localStorage.getItem("chatAppRole");
    const savedName = localStorage.getItem("chatAppName");

    if (savedRole) {
      setCurrentRole(savedRole);
      setCustomerName(savedName || "");
    }
  }, []);

  // called from EntryScreen
  function handleRoleSelect(role, name) {
    setCurrentRole(role);
    setCustomerName(name);

    localStorage.setItem("chatAppRole", role);
    localStorage.setItem("chatAppName", name);
  }

  // BACK = role change (data safe)
  function handleBack() {
    setCurrentRole(null);
    console.log("buttonclicked");
    
  }

  // LOGOUT = full reset
  function handleLogout() {
    setCurrentRole(null);
    setCustomerName("");
    localStorage.removeItem("chatAppRole");
    localStorage.removeItem("chatAppName");
    localStorage.removeItem("chatMessages"); // future use
    console.log("logout");
    
  }

  // Entry screen
  if (!currentRole) {
    return <EntryScreen handleRoleSelect={handleRoleSelect} />;
  }

  // Chat screen
  return (
    <ChatContainer
      role={currentRole}
      customerName={customerName}
      onBack={handleBack}
      onLogout={handleLogout}
    />
  );
}

export default App;
