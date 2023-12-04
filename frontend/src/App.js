import './App.css';

import React from 'react';
import {Button} from 'react-bootstrap';

import InitialForm    from './initialForm/InitialForm';
import AdminDashboard      from './admin/AdminDashboard'

import {useState} from 'react';


function App() {
  //const [mode, setMode] = useState("user");

  return (
    <div className="App">
      {/*<Button onClick = {() => setMode("admin")}>Enable Admin</Button>
      <Button onClick = {() => setMode("user")}>User View</Button>*/}
      <AdminDashboard />
      {/*mode === "user" && <InitialForm />*/}
    </div>

    
  );
}

export default App;
