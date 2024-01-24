import React, {useEffect, useState} from 'react';

import AddSchedule from '../tools/AddSchedule';
import EditGoals from '../tools/EditGoals';
import BrowseMeals from './BrowseMeals.js';
import AddIngredient from '../admin/AddIngredient.js';
import AddMeal from '../admin/AddMeal.js';

import 'chart.js/auto';

import { Doughnut } from 'react-chartjs-2';
import { Container, Col, Button } from 'react-bootstrap';
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

const Welcome = ({username, goals, change}) => {
    return (
        <>
            <h1 className="mb-5">Welcome, {username}</h1>
            <Container fluid className = "d-flex align-items-center justify-content-center"  style={{ height: '100vh' }}>
                <Col style={{ textAlign: 'center' }} xs = {6}>
                    <h2>Goals</h2>
                    
                    {goals != null && <NutritionalText goals = {goals}/>}
                    <Button onClick = {() => change("goals")}>Edit Your Goals or Personal Information</Button>
                    <p></p>
                    <Button onClick = {() => change("schedule")}>Edit Your Schedule</Button>
                    <Button onClick = {() => change("addMeal")}>(Admin) Add a Meal</Button>
                    <Button onClick = {() => change("addIngredient")}>(Admin) Add Ingredient to Database</Button>
                </Col>
                <Col xs = {6} style={{ textAlign: 'center' }}>
                    <h2>Meals</h2>
                    <Button onClick = {() => change("browseMeals")}>Browse All Meals</Button>
                </Col>
            </Container>
        </>
    );
}

export default function UserDashboard({username, goals}){
    const [mode, setMode] = useState("welcome");
    // Chart configuration

    return (
        <>
            {mode === "welcome" && <Welcome username = {username} goals = {goals} change = {(e) => setMode(e)}/>}
            {mode === "schedule" && <AddSchedule back = {(e) => setMode(e)}/>}
            {mode === "goals" && <EditGoals back = {(e) => setMode(e)} currentInfo={{"weight": 150}}/>}
            {mode === "addMeal" && <AddMeal back = {(e => setMode(e))} />}
            {mode === "browseMeals" && <BrowseMeals back = {(e => setMode(e))} />}
            {mode === "addIngredient" && <AddIngredient back = {(e) => setMode(e)} />}
        </>
    
    );
}