import './App.css';

import React from 'react';
import {Button} from 'react-bootstrap';

import UserDashboard      from './dashboard/UserDashboard.js'
import Login from './dashboard/Login.js'

import {useState} from 'react';


function App() {
  const [mode, setMode] = useState("user");
  const [userKey, setUserKey] = useState("");
  const [goals, setGoals] = useState(null);
  const [username, setUsername] = useState(null);

    async function getGoal(newUserKey){
      console.log("Executing user/currentGoal API Call...");
      const response = await fetch(process.env.REACT_APP_API_URL + "user/currentGoal", {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({"userKey": newUserKey})
        });

        const x = await response.json();
      setUsername(x.user[0].username)
      setGoals(x.goals[0]);
    }


  const login = async (newUserKey, mode) => {
    setUserKey(newUserKey);
    setMode(mode);
    await getGoal(newUserKey);

  }

  return (
    <div className="App">
      {mode == "admin" && <UserDashboard username = {username} goals = {goals}/>}
      {mode == "user" && <Login login = {(userKey) => login(userKey, "admin")}/>}
    </div>

    
  );
}

export default App;
