import React, {useState, useEffect} from 'react';
import {Container, Row, Form, FormControl, Col, Button, InputGroup, ListGroup} from 'react-bootstrap';
import NutritionLabel from '../tools/NutritionLabel';

export default function EditIngredients({back}){
    let [ingredients, setIngredients] = useState(null);
    let [selectedIngredientKey, setSelectedIngredientKey] = useState(null);
    let [selectedIngredient, setSelectedIngredient] = useState(null);
    let [portionsData, setPortionsData] = useState(null);
    let [selectedIngredientName, setSelectedIngredientName] = useState(null);

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
        setPortionsData(x.portions);
    }

    useEffect(() => {
        loadIngredients();
    }, [back]);

    useEffect(() => {
        if(selectedIngredientKey !== null){
            loadIngredientPortions();
        }
        
    }, [selectedIngredientKey])
    

    const portionChange = (e) => {
        const { name, value } = e.target;
        const updatedPortionsData = portionsData.map(item => {
            if (item.portionKey === name) {
                return { ...item, name: value };
            }
            return item;
        });
        setPortionsData(updatedPortionsData);
      };

    const updateIngredient = async (event) => {
        event.preventDefault();
        //let newPortions = portionsData.filter(item => item.name != oldPortions.find(x => x.portionKey === item.portionKey)?.name); such a pretty line but I couldn't make it work
        
        console.log("Executing foods/updateIngredient API Call with key " + selectedIngredientKey + "...");
        const response = await fetch(process.env.REACT_APP_API_URL + "foods/updateIngredient", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({"portions": portionsData, "updatedName": selectedIngredientName, "ingredientKey": selectedIngredientKey})

        });
        if (!response.ok) {
            console.log("Error:", response.status, response.statusText);
        } else {
            console.log("Request successful");
        }
        
    }

    const changeIngredientName = (event) => {
        let newValue = event.target.value;
        setSelectedIngredientName(newValue);
    }

    const singleIngredient = () => {
        return (
            <Container fluid>
                <Form onSubmit = {updateIngredient}>
                    <Row className = "mt-5">
                        {selectedIngredient != null && <Form.Control onChange = {changeIngredientName} placeholder = {selectedIngredient.ingredient.ingredientName} />}
                    </Row>
                    <Row>
                        <Col xs = {6}>
                            <h2>Nutrition</h2>
                            <NutritionLabel 
                            nutrients = {selectedIngredient.nutrients}
                            amount = {1} 
                            amountUnit = "serving" 
                            grams = {100}/>
                        </Col>
                        <Col xs = {6}>
                            <h2 className ="mb5">Portions</h2>
                            {selectedIngredient.portions.map((portion, index) => (
                                <Form.Control name = {portion.portionKey} value = {portionsData[index].name}placeholder={portion.name} onChange={portionChange}/>
                            ))}
                        </Col>

                    </Row>
                    <Button type = "submit">Submit</Button>
                    
                </Form>


                                
            </Container>
        )
    }

    return (
        <Container fluid>
           <Row>
                <Col xs = {6}>
                    <Button onClick = {() => back("welcome")}>Back</Button>
                    <ListGroup>
                        {ingredients != null && ingredients.map((ingredient) => (
                            <ListGroup.Item style = {{height: "50px"}} onClick = {() => setSelectedIngredientKey(ingredient.ingredientKey)}>{ingredient.ingredientName}</ListGroup.Item>
                        ))}
                    </ListGroup>
                </Col>
                <Col xs = {6}>
                    {selectedIngredient != null && singleIngredient()}
                </Col>
            </Row>
        </Container>
    )
}