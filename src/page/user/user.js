import React, { useState } from "react";
import { useSelector } from "react-redux";
import ModifyModal from "../../components/modifyModal/modifyModal";
import Account from "../../components/account/account";
import "../../style/main.css";

function User() {
    const { firstName, lastName } = useSelector((state) => state.user);
    const [mode, setMode] = useState("normal");

    return (
        <main className="main bg-dark">
            <div className="header">
                <h1>Welcome back<br />{` ${firstName} ${lastName}`}</h1>
                <ModifyModal mode={mode} setMode={setMode} />
            </div>
            <h2 className="sr-only">Accounts</h2>
            <Account title="Argent Bank Checking (x8349)" amount="$2,082.79" description="Available Balance" />
            <Account title="Argent Bank Savings (x6712)" amount="$10,928.42" description="Available Balance" />
            <Account title="Argent Bank Credit Card (x8349)" amount="$184.30" description="Current Balance" />
        </main>
    );
}

export default User;
