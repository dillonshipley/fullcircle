import React, {useState, useEffect} from 'react';
import {Container, Row, Form, FormControl, Col, Button, InputGroup} from 'react-bootstrap';
import NutritionLabel from '../tools/NutritionLabel';

export default function EditIngredients({back}){
    let [ingredients, setIngredients] = useState(null);
    let [selectedIngredientKey, setSelectedIngredientKey] = useState(null);
    let [selectedIngredient, setSelectedIngredient] = useState(null);

    const loadIngredients = async () => {
        const response = await fetch(process.env.REACT_APP_API_URL + "foods/ingredientList", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if(!response.ok){
            console.log("error - response could not be found");
        }

        const x = await response.json();
        setIngredients(x);
        
    }

    const loadIngredientPortions = async () => {
        console.log("Executing foods/IngredientByKey API Call with key " + selectedIngredientKey + "...");
        const response = await fetch(process.env.REACT_APP_API_URL + "foods/ingredientByKey", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({"ingredientKey": selectedIngredientKey})

        });
        if(!response.ok)
            console.log(`Getting ingredient key ${selectedIngredientKey} failed!`)

        const x = await response.json();
        const nutrients = Object.entries(x.nutrients)
                .filter(([key, value]) => typeof value === 'number') // Filter out non-numeric values
                .map(([name, amount]) => ({ name, amount }));
        x.nutrients = nutrients;
        setSelectedIngredient(x);
    }

    useEffect(() => {
        loadIngredients();
    }, [back]);

    useEffect(() => {
        if(selectedIngredientKey !== null){
            loadIngredientPortions();
        }
        
    }, [selectedIngredientKey])
    
    return (
        <Container>
           <Row>
                <Col xs = {6}>
                    <Button onClick = {() => back("welcome")}>Back</Button>
                    {ingredients != null && ingredients.map((ingredient) => (
                        <div style = {{height: "50px"}} onClick = {() => setSelectedIngredientKey(ingredient.ingredientKey)}>{ingredient.ingredientName}</div>
                    ))}
                </Col>
                <Col xs = {6}>
                    {selectedIngredient != null && <NutritionLabel nutrients = {selectedIngredient.nutrients}/>}
                </Col>
            </Row>
        </Container>
    )
}