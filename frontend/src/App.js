import './App.css';

import React from 'react';
import {Button} from 'react-bootstrap';

import UserDashboard      from './dashboard/UserDashboard.js'
import Login from './dashboard/Login.js'

import {useState} from 'react';


function App() {
  const [mode, setMode] = useState("user");
  const [userKey, setUserKey] = useState("");

  const login = async (newUserKey, mode) => {
    setUserKey(newUserKey);
    setMode(mode);
  }

  return (
    <div className="App">
      {mode == "admin" && <UserDashboard userKey = {userKey} />}
      {mode == "user" && <Login login = {(userKey) => login(userKey, "admin")}/>}
    </div>

    
  );
}

export default App;
