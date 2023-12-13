import React, {useEffect, useState} from 'react';

import 'chart.js/auto';

import { Doughnut } from 'react-chartjs-2';
import { Container, Col } from 'react-bootstrap';

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
            <h2 className="mt-5">{goals.cals} Calories</h2>
            <p>{goals.carbs}g of carbs * 4 cal/g = {goals.carbs * 4}</p>
            <p>{goals.protein}g of protein * 4 cal/g = {goals.protein * 4}</p>
            <p>{goals.fats}g of fats * 9 cal/g = {goals.fats * 9}</p>
            <p>{goals.carbs * 4} + {goals.protein * 4} + {goals.fats * 9} = {(goals.carbs * 4) + (goals.protein * 4) + (goals.fats * 9)}</p>
        </>
    );

}

export default function UserDashboard({username, goals}){

    // Chart configuration

    return (
        <Container fluid className = "d-flex align-items-center justify-content-center"  style={{ height: '100vh' }}>
            <Col style={{ textAlign: 'center' }}>
                <h1 className="mb-5">Welcome, {username}</h1>
                {goals != null && <NutritionalText goals = {goals}/>}
            </Col>

        </Container>
    );
}