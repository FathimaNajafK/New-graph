import React, { useState,useEffect,useContext  } from "react";
import axios from "axios";
import { useNavigate,Navigate, Link } from "react-router-dom";
import "./Login.css";
import backendBaseUrl from "./config";
import { useMsal } from "@azure/msal-react";
import { AppContext } from "../App";



function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { instance, accounts, inProgress } = useMsal();
    const { setUserLogged } = useContext(AppContext);
    useEffect(()=>{
        if (accounts.length > 0) {
            setUserLogged(true)
        }
    },[accounts])

    async function submit(e) {
        e.preventDefault();
        try {
            const response = await axios.post(`${backendBaseUrl}/login`, {
                email,
                password
            });

            if (response.data.status === "exist") {
                const { name } = response.data;
                sessionStorage.setItem('user', JSON.stringify({ name, email })); 
                navigate("/welcome", { state: { name, email } });
            } else if (response.data.status === "notexist") {
                alert("User has not signed up");
            } else {
                alert("Invalid credentials");
            }
        } catch (error) {
            console.error("Error logging in", error);
            alert("Wrong details");
        }
    }

    return (
        <div className="login-container">
            <h1 className="login-heading">Login</h1>
            <div className="loginParentDiv">
                <form onSubmit={submit}>
                    <label>Email</label>
                    <br />
                    <input
                        className="input"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        required
                    />
                    <br />
                    <label>Password</label>
                    <br />
                    <input
                        className="input"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        required
                    />
                    <br />
                    <br />
                    <button type="submit" className="login-button">Login</button>
                </form>
                <button onClick={() => instance.loginPopup()} className="login-button">Login with microsoft</button>
                <p>New here? Sign up now! <Link to="/signup" className="login-signup-button">Signup</Link></p>
            </div>
        </div>
    );
}


export default Login;
