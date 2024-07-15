import React,{createContext,useState} from "react";
import Home from "./components/Home"
import Login from "./components/Login"
import Signup from "./components/Signup"
import Welcome from "./components/Welcome";
import Admin from "./components/Admin";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";


// function PrivateRoute({ children }) {
//   const user = sessionStorage.getItem('user');
//   return user ? children : <Navigate to="/login" />;
// }

export const AppContext = createContext();

function App() {

  const[UserLogged,setUserLogged] = useState(false)

  return (
    <div className="App">
      <AppContext.Provider value={{ UserLogged,setUserLogged }}>
      <Router>
        <Routes>
          <Route path="/login" element={ UserLogged ?<Navigate to="/welcome" /> : <Login/> }/>
          <Route path="/signup" element={<Signup/>}/>
          <Route path="/" element={<Home/>}/>
          <Route path="/welcome" element={UserLogged ? <Welcome /> :<Navigate to="/login" /> }/>
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Router>
      </AppContext.Provider>
    </div>
  );
}

export default App;
