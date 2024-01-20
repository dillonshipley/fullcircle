import React, {useState} from 'react';
import {Container, Row, Form, Col, Button} from 'react-bootstrap';
import NutritionLabel from '../tools/NutritionLabel';


export default function AddIngredient(){
    const [term, setSearchTerm] = useState(null);
    const [ingredients, setIngredients] = useState(null);
    const [selectedIngredientID, setSelectedIngredientID] = useState(null);
    const [selectedIngredientName, setSelectedIngredientName] = useState(null);
    const [selectedNutrients, setSelectedNutrients] = useState(null);
    
    const search = async (event) => {
        event.preventDefault();
        console.log("Executing tf/ingredientListFDC API Call...")
        const response = await fetch(process.env.REACT_APP_API_URL + "tf/searchByNameFDC", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({"searchTerm": term})
        });

        const x = await response.json();
        console.log(x);
        const array = x.map(x => [x.description, x.id]);
        setIngredients(array);
    }

    const handleRadioChange = async (name, FDCID) => {
        const response = await fetch(process.env.REACT_APP_API_URL + "tf/searchByIDFDC", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({"id": FDCID})
        });

        const nutrients = await response.json();
        console.log(nutrients);
        setSelectedNutrients(nutrients);
        setSelectedIngredientID(FDCID);
        setSelectedIngredientName(name);
    }

    const NutrientsDisplay = () => {
        <div>{selectedNutrients[0]}</div>
    }

    return (
        <>
            <Container>
                <Row>
                <Col>
                    <Form onSubmit ={(e) => search(e)}>
                        <Form.Group>
                            <Form.Control 
                                    type = "text"
                                    placeholder = "Find an ingredient"
                                    onChange = {(e) => setSearchTerm(e.target.value)}
                                    autoComplete = "off" 
                            />
                        </Form.Group>
                        {ingredients != null && ingredients.slice(0, 10).map((x, index) => (
                        <div key = {index} onClick = {() => handleRadioChange(x[0], x[1])}>{x[0]}</div>
                        ))}
                    </Form>
                </Col>
                <Col>
                    {selectedNutrients != null && <h2>{selectedIngredientName}</h2>}
                    {selectedNutrients != null && <NutritionLabel nutrients={selectedNutrients}/>}
                    {selectedNutrients != null && <Button>Add to Database</Button>}
                    
                </Col>


                </Row>


            </Container>

        </>
    );
}