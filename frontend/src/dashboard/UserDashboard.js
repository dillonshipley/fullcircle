import React, {useEffect, useState} from 'react';

import AddSchedule from './AddSchedule';
import EditGoals from '../tools/EditGoals';
import Meals from '../meal/Meals.js';
import EditIngredients from '../Ingredient/Ingredients.js';
import AddMeal from '../meal/AddMeal.js';

import 'chart.js/auto';

import { Doughnut } from 'react-chartjs-2';
import { Container, Col, Button, Nav, Row } from 'react-bootstrap';
import _default from 'react-bootstrap/esm/Accordion';

const DonutChart = ({carbs, fats, protein}) => {
  // Sample data
    const data = {
        labels: ['Carbohydrates', 'Fat', 'Protein'],
        datasets: [
        {
            data: [carbs, fats, protein], // Values for each section
            backgroundColor: ['#36A2EB', '#FFCE56', '#FF6384'], // Colors for each section
        },
        ],
    };

    const options = {
        cutoutPercentage: 50, // Percentage of the chart that is cut out of the middle (0-100)
        responsive: true,
        maintainAspectRatio: false,
    };

    return (
        <Container>
          <Doughnut data={data} options={options} />
        </Container>
      );

}

const NutritionalText = ({goals}) => {
    return (
        <>
            <DonutChart carbs = {goals.carbs} fats = {goals.fats} protein = {goals.protein}/>
            <p className="mt-5">{goals.carbs}g of carbohydrates, {goals.fats}g of fat, and {goals.protein}g of protein</p>
            <h2 >{goals.cals} Calories</h2>
        </>
    );

}

const Welcome = ({token, userKey, change}) => {
    const [goals, setGoals] = useState(null);
    const [username, setUsername] = useState('');


    useEffect(() => {
        //On load fetch goal
        console.log(token);
        
    }, [token]);

    useEffect(() => {
        //On load fetch goal
        const getGoal = async () => {
            console.log("Executing user/currentGoal API Call...");
            const response = await fetch(process.env.REACT_APP_API_URL + `users/currentGoal/${userKey}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
              });
      
              const x = await response.json();
              if(x != null){
                setUsername(x.user.username)
                setGoals(x.goals[0]);
              }
          }
          
        getGoal();
        
    }, [userKey]);

    const Sidebar = () => {
        return (
          <Nav className="d-none d-md-block bg-light sidebar">
            <div className="sidebar-sticky">
                <h1 style = {{paddingLeft: "15px", paddingTop: "25px", paddingBottom: "25px"}}>Nutrition</h1>
                <h3 style = {{paddingLeft: "15px", paddingTop: "25px", paddingBottom: "25px"}} onClick = {() => change("editIngredient")}>Ingredients</h3>
                <h3 style = {{paddingLeft: "15px", paddingTop: "25px", paddingBottom: "25px"}} onClick = {() => change("browseMeals")}>Browse All Meals</h3>
            </div>
          </Nav>
        );
      };

    return (
        <>
            <Row>
                <Col xs ={9}>
                    <Container fluid className = "d-flex align-items-center justify-content-center"  style={{ height: '100vh' }}>
                        <Col style={{ textAlign: 'center' }} xs = {6}>
                            <h1 className="mb-5">Welcome, {username}</h1>
                            <h2>Goals</h2>
                            {goals != null && <NutritionalText goals = {goals}/>}
                            <Button onClick = {() => change("goals")}>Edit Your Goals or Personal Information</Button>
                            <p></p>
                            <Button onClick = {() => change("schedule")}>Edit Your Schedule</Button>
                            <p></p>
                            
                        </Col>
                    </Container>
                </Col>
                <Col xs={3}>
                    <Sidebar />
                </Col>            
            </Row>
        </>
    );
}

export default function UserDashboard({userKey, token}){
    const [mode, setMode] = useState("welcome");
    // Chart configuration

    return (
        <>
            {mode === "welcome" &&          <Welcome token = {token} userKey = {userKey} change = {(e) => setMode(e)}/>}
            {mode === "schedule" &&         <AddSchedule token = {token} back = {(e) => setMode(e)} userKey = {userKey}/>}
            {mode === "goals" &&            <EditGoals token = {token} back = {(e) => setMode(e)} currentInfo={{"weight": 150}}/>}
            {mode === "addMeal" &&          <AddMeal token = {token} back = {(e => setMode(e))} />}
            {mode === "browseMeals" &&      <Meals token = {token} back = {(e => setMode(e))} />}
            {mode === "editIngredient" &&   <EditIngredients token = {token} back = {(e) => setMode(e)}/>}
        </>
    
    );
}