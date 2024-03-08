import './App.css';

import React from 'react';
import {Button} from 'react-bootstrap';

import UserDashboard      from './dashboard/UserDashboard.js'
import Login from './dashboard/Login.js'

import {useState} from 'react';


function App() {
  const [mode, setMode] = useState("user");
  const [userKey, setUserKey] = useState("");
  const [userToken, setToken] = useState(null);

  const login = async (newUserKey, mode, token) => {
    setUserKey(newUserKey);
    setToken(token);
    setMode(mode);
  }

  return (
    <div className="App">
      {mode == "admin" && <UserDashboard userKey = {userKey} token = {userToken}/>}
      {mode == "user" && <Login login = {(userKey, token) => login(userKey, "admin", token)}/>}
    </div>

    
  );
}

export default App;
