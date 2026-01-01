function ChatHeader({ role, onBack, onLogout }) {
  return (
    <div className="chat-header">
      <button onClick={onBack}>Back</button>
      <h3>{role === "customer" ? "Customer Support" : "Support Panel"}</h3>
      <button onClick={onLogout}>Logout</button>
    </div>
  );
}

export default ChatHeader;
