import { useContext } from "react";
import { ThemeContext } from "../../../context/ThemeContext";

function ChatHeader({ role, onBack, onLogout }) {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <div className={`chat-header ${theme}`}>
      <button onClick={onBack}>Back</button>
      <h3>{role === "customer" ? "Customer Support" : "Support Panel"}</h3>
      <div>
        <button
          onClick={toggleTheme}
          style={{
            backgroundColor: theme === "light" ? "#555" : "#e0e0e0",
            color: theme === "light" ? "#fff" : "#000",
          }}
        >
          {theme === "light" ? "Dark Mode" : "Light Mode"}
        </button>
        <button onClick={onLogout}>Logout</button>
      </div>
    </div>
  );
}

export default ChatHeader;
