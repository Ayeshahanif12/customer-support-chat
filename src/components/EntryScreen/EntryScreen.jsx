import React, { useState } from "react";

import "./EntryScreen.css";




function EntryScreen({ handleRoleSelect }) {
    const [selectedRole, setSelectedRole] = useState("");

    const [name, setName] = useState("");
    return (
        <div className="entry-screen">
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