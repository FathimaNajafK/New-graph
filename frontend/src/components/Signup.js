import React, {  useState } from "react"
import axios from "axios"
import { useNavigate} from "react-router-dom"
import "./Signup.css"
import backendBaseUrl from "./config";


function Signup() {
    const history=useNavigate();

    const [name,setName]=useState('')
    const [email,setEmail]=useState('')
    const [password,setPassword]=useState('')

  const submit =async (e)=> {
        e.preventDefault();
        if(name === '' || email === '' || password === '') {
            alert("PLease enter all value")
            return
        }

        try{

            await axios.post(`${backendBaseUrl}/signup`,{
                name,email,password
            })
            .then(res=>{
                if(res.data==="exist"){
                    alert("User already exists")
                }
                else if(res.data==="notexist"){
                    history("/login",{state:{id:email}})
                }
            })
            .catch(e=>{
                alert("wrong details")
                console.log(e);
            })

        }
        catch(e){
            console.log(e);

        }

    }


    return (

        <div className="login-container">
            <h1 className="login-heading">Signup</h1>
            <div className="loginParentDiv">
                <form onSubmit={submit}/>
                <form action="POST">
                <label >Name</label>
                    <br />
                    <input
                        className="input"
                        type="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Name"

                    />
                    <br />
                    <label >Email</label>
                    <br />
                    <input
                        className="input"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"

                    />
                    <br />
                    <label >Password</label>
                    <br />
                    <input
                        className="input"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                    />
                    <br />
                    <input type="submit" className="signup-button" onClick={submit} />
                    
                </form>
               
            </div>
        </div>

    )
}

export default Signup