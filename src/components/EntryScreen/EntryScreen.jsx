import React, { useState, useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";

import "./EntryScreen.css";




function EntryScreen({ handleRoleSelect }) {
    const { theme, toggleTheme } = useContext(ThemeContext);
    const [selectedRole, setSelectedRole] = useState("");

    const [name, setName] = useState("");
    return (
        <div className="entry-screen">
            <button
                type="button"
                onClick={toggleTheme}
                style={{
                    position: "fixed",
                    top: "10px",
                    right: "10px",
                    width: "auto",
                    padding: "5px 10px",
                    fontSize: "12px",
                    backgroundColor: theme === "light" ? "#555" : "#e0e0e0",
                    color: theme === "light" ? "#fff" : "#000",
                }}
            >
                {theme === "light" ? "Dark Mode" : "Light Mode"}
            </button>
            <h1>Continue As </h1>
            {selectedRole === "customer" && (
                <>
                    <input
                        type="text"
                        value={name}
                        placeholder="Enter your name"
                        onChange={(e) => setName(e.target.value)}
                    />
                    {name.trim() === "" && <p className="error">Please enter your name</p>}
                    <button
                        type="button"
                        onClick={() => handleRoleSelect("customer", name)}
                        disabled={name.trim() === ""}
                    >
                        Continue as Customer
                    </button>

                </>
            )}

            {selectedRole === "" && (
                <>
                    <button type="button" onClick={() => setSelectedRole("customer")}>
                        Customer
                    </button>
                    <button type="button" onClick={() => handleRoleSelect("support", "")}>
                        Agent
                    </button>
                </>
            )}


            <span className="info-text">Please select your role to continue</span>
        </div>
    );
}

export default EntryScreen;