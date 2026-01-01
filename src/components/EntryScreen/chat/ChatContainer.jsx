import { useState, useEffect, useRef, useContext } from "react";
import ChatHeader from "../chat/ChatHeader";
import "./ChatContainer.css";
import { ThemeContext } from "../../../context/ThemeContext";


function ChatContainer({ role, customerName, onBack, onLogout }) {
  const { theme } = useContext(ThemeContext);

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);

  // scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // restore messages
  useEffect(() => {
    const savedMessages = JSON.parse(localStorage.getItem("chatMessages") || "[]");
    setMessages(savedMessages);
  }, []);

  // update status
  const updateStatus = (id, newStatus) => {
    setMessages(prev => {
      const updated = prev.map(msg =>
        msg.id === id ? { ...msg, status: newStatus } : msg
      );
      localStorage.setItem("chatMessages", JSON.stringify(updated));
      return updated;
    });
  };

  // simulate status updates
  useEffect(() => {
    messages.forEach(msg => {
      if (msg.status === "sent") {
        setTimeout(() => updateStatus(msg.id, "delivered"), 2000);
        setTimeout(() => updateStatus(msg.id, "seen"), 4000);
      }
    });
  }, [messages]);

  const autoReply = (customerMessage) => {
    const replies = [
      "Thanks for contacting support 😊",
      "We have received your message.",
      "Our agent will assist you shortly.",
      "Can you provide more details?"
    ];

    const replyText = replies[Math.floor(Math.random() * replies.length)];

    const replyMessage = {
      id: Date.now() + 1,
      sender: "support",
      text: replyText,
      status: "sent",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => {
        const updated = [...prev, replyMessage];
        localStorage.setItem("chatMessages", JSON.stringify(updated));
        return updated;
      });
    }, 2500);
  };

  const handleSend = () => {
    if (newMessage.trim() === "") return;

    const messageObj = {
      id: Date.now(),
      sender: role,
      text: newMessage,
      status: "sent",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    const updatedMessages = [...messages, messageObj];
    setMessages(updatedMessages);
    setNewMessage("");
    localStorage.setItem("chatMessages", JSON.stringify(updatedMessages));

    if (role === "customer") {
      autoReply(newMessage);
    }
  };

  return (
    <div className={`chat-container ${theme}`}>
      <ChatHeader role={role} onBack={onBack} onLogout={onLogout} />

      <div className="messages-list">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`message-wrapper ${msg.sender === "customer" ? "customer" : "support"}`}
          >
            <div className={msg.sender === "customer" ? "message-customer" : "message-support"}>
              <span className="message-text">{msg.text}</span>
              <span className="message-time">{msg.timestamp}</span>
              {msg.sender === role && (
                <span className="message-status">{msg.status}</span>
              )}
            </div>

            <div className="name-status">
              <span className="message-sender">
                {msg.sender === "customer" ? "Customer" : "Support Agent"}
              </span>
            </div>
          </div>
        ))}

        {isTyping && role === "customer" && (
          <div className="typing-indicator">Support is typing...</div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-container">
        <input
          type="text"
          placeholder="Type a message"
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}

export default ChatContainer;
