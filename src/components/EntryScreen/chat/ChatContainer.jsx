import { useState, useEffect, useRef } from "react";
import ChatHeader from "./ChatHeader";
import "./ChatContainer.css";

function ChatContainer({ role, onBack, onLogout }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);

  // scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // restore messages from localStorage
  useEffect(() => {
    const savedMessages = JSON.parse(
      localStorage.getItem("chatMessages") || "[]"
    );
    setMessages(savedMessages);
  }, []);

  // update message status helper
  const updateStatus = (id, newStatus) => {
    setMessages((prev) => {
      const updated = prev.map((msg) =>
        msg.id === id ? { ...msg, status: newStatus } : msg
      );
      localStorage.setItem("chatMessages", JSON.stringify(updated));
      return updated;
    });
  };

  // SENT → DELIVERED (sender side)
  useEffect(() => {
    messages.forEach((msg) => {
      if (msg.status === "sent") {
        setTimeout(() => {
          updateStatus(msg.id, "delivered");
        }, 2000);
      }
    });
  }, [messages]);

  // ✅ DELIVERED → SEEN (receiver side)
  useEffect(() => {
    const updatedMessages = messages.map((msg) => {
      if (
        msg.sender !== role &&       // message mera nahi
        msg.status === "delivered"   // already delivered
      ) {
        return { ...msg, status: "seen" };
      }
      return msg;
    });

    // infinite loop se bachne ke liye
    if (
      JSON.stringify(updatedMessages) !== JSON.stringify(messages)
    ) {
      setMessages(updatedMessages);
      localStorage.setItem(
        "chatMessages",
        JSON.stringify(updatedMessages)
      );
    }
  }, [messages, role]);

  const handleSend = () => {
    if (newMessage.trim() === "") return;

    const messageObj = {
      id: Date.now(),
      sender: role,
      text: newMessage,
      status: "sent",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    const updatedMessages = [...messages, messageObj];
    setMessages(updatedMessages);
    setNewMessage("");
    localStorage.setItem(
      "chatMessages",
      JSON.stringify(updatedMessages)
    );

    // ✅ AUTO REPLY ONLY WHEN CUSTOMER SENDS MESSAGE
    if (role === "customer") {
      autoReply(newMessage);
    }
  };


  const autoReply = (customerMessage) => {
    const replies = [
      "Thanks for contacting support 😊",
      "We have received your message.",
      "Our agent will assist you shortly.",
      "Can you please provide more details?",
    ];

    const replyText =
      replies[Math.floor(Math.random() * replies.length)];

    const replyMessage = {
      id: Date.now() + 1,
      sender: "support",
      text: replyText,
      status: "sent",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    if (role === "customer") {
      setIsTyping(true); // typing start

      setTimeout(() => {
        setMessages((prev) => {
          const updated = [...prev, replyMessage];
          localStorage.setItem(
            "chatMessages",
            JSON.stringify(updated)
          );
          return updated;
        });
        setIsTyping(false);
      }, 2500); // ⏱ realistic delay
    };
  }


  return (
    <div className="chat-container">
      <ChatHeader role={role} onBack={onBack} onLogout={onLogout} />

      <div className="messages-list">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`message-wrapper ${msg.sender === "customer" ? "customer" : "support"
              }`}
          >

            <div
              className={
                msg.sender === "customer"
                  ? "message-customer"
                  : "message-support"
              }
            >
              <span className="message-text">{msg.text}</span>
              <span className="message-time">{msg.timestamp}</span>

              {/* ✅ status sirf sender ko dikhe */}
              {msg.sender === role && (
                <span className="message-status">{msg.status}</span>
              )}
            </div>

            {/* sender name bubble ke neeche */}
            <span className="message-sender">
              {msg.sender === "customer"
                ? "Customer"
                : "Support Agent"}
            </span>
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
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}

export default ChatContainer;
