import './App.css';

import React from 'react';
import {Button} from 'react-bootstrap';

import InitialForm    from './initialForm/InitialForm';
import AdminDashboard      from './admin/AdminDashboard'
import Login from './dashboard/Login.js'

import {useState} from 'react';


function App() {
  const [mode, setMode] = useState("user");

  const login = (userKey, mode) => {
    setMode("admin");
    console.log(userKey);
  }

  return (
    <div className="App">
      {mode == "admin" && <AdminDashboard />}
      {mode == "user" && <Login login = {(userKey) => setMode(userKey, "admin")}/>}
      {/*mode === "user" && <InitialForm />*/}
    </div>

    
  );
}

export default App;
