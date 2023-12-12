import React, {useEffect, useState} from 'react';

export default function UserDashboard({userKey}){
    const [username, setUsername] = useState("");
    const [goals, setGoals] = useState(null);

    const [carbs, setCarbs] = useState(null);
    const [fat, setFat] = useState(null);
    const [protein, setProtein] = useState(null);
    const [cals, setCals] = useState(null);

    useEffect(() => {

        async function fetchData(){
            const response = await fetch(process.env.REACT_APP_API_URL + "user/currentGoal", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({"userKey": userKey})
              });
    
              const x = await response.json();
            setUsername(x.user[0].username)
            setGoals(x.goals[0]);
            console.log(goals);
        }

        fetchData();
      }, []);

    return (
        <>
            <h1>Welcome, {username}</h1>
            <p>
            </p>
        
        </>
    );
}