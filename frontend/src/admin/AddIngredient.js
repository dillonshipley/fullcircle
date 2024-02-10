import React, {useState, useCallback} from 'react';
import {Container, Row, Form, FormControl, Col, Button, InputGroup} from 'react-bootstrap';
import NutritionLabel from '../tools/NutritionLabel';

export default function AddIngredient({back}){
    const [term, setSearchTerm] = useState(null);
    const [ingredients, setIngredients] = useState(null);
    const [selectedIngredientID, setSelectedIngredientID] = useState(null);
    const [selectedIngredientName, setSelectedIngredientName] = useState(null);
    const [selectedNutrients, setSelectedNutrients] = useState(null);
    const [selectedPortions, setSelectedPortions] = useState(null);
    const [insertedPortions, setInsertedPortions] = useState([]);

    const [meat, setMeat] = useState(false);
    const [dairy, setDairy] = useState(false);
    const [wholeIngredient, setWholeIngredient] = useState(false);
    const [message, setMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    
    const search = async (event) => {
        event.preventDefault();
        console.log("Executing adminRoutes/searchByNameFDC API Call...")
        const response = await fetch(process.env.REACT_APP_API_URL + "adminRoutes/searchByNameFDC", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({"searchTerm": term})
        });

        const x = await response.json();
        const array = x.map(x => [x.description, x.id]);
        setIngredients(array);
        setInsertedPortions([])
    }

    const selectIngredient = async (name, FDCID) => {
        console.log("Executing adminRoutes/searchByIDFDC API Call...")
        const response = await fetch(process.env.REACT_APP_API_URL + "adminRoutes/searchByIDFDC", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({"id": FDCID})
        });
        if(!response.ok){
            console.log("Search by ID Failed!");
            return;
        }

        let food = null;
        try{
            food = await response.json();
        } catch(error){
            console.log(`Error - could not fetch ingredient ${name}`);
            setErrorMessage(`Error - could not fetch ingredient ${name}`);
            return;
        }
        setErrorMessage(null);
        setSelectedNutrients(food.nutrients);
        setSelectedPortions(food.portions);
        setSelectedIngredientID(FDCID);;
        setSelectedIngredientName(name);
        setMeat(false);
        setDairy(false);
        setWholeIngredient(false);
    }

    const addIDToDB = async(event) => {
        event.preventDefault();
        var inputElement = document.getElementById("ingredientName");
        var inputValue = inputElement.value;
        console.log(inputValue);
        if(inputValue != "")
            setSelectedIngredientName(inputValue);
        
        const response = await fetch(process.env.REACT_APP_API_URL + "adminRoutes/addIDToDB", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(
                {"id": selectedIngredientID,
                "name": selectedIngredientName, 
                "attributes": [
                    {"name": "Meat", "value": meat},
                    {"name": "Dairy", "value": dairy},
                ],
                "portions": insertedPortions
            })
        });
        if(!response.ok)
            setMessage(selectedIngredientName + " could not be added to the database.");

        const data = await response.text();
        if(data === "Ingredient Successfully Added!")
            setMessage(selectedIngredientName + " was successfully added to the database!");

    }

    const handlePortionChange = (portionDescription) => {
        const isSelected = insertedPortions.includes(portionDescription);
        if (isSelected) {
            setInsertedPortions(insertedPortions.filter(item => item !== portionDescription));
        } else {
            setInsertedPortions([...insertedPortions, portionDescription]);
        }
    };

    const Attributes = () => {
        return (
            <Form onSubmit={(e) => addIDToDB(e)}>
                <input
                    type="text"
                    id = "ingredientName"
                    placeholder={selectedIngredientName} className="mt-5"
                />
                <Form.Check
                        type="checkbox"
                        label="Meat Product?"
                        checked={meat}
                        onChange={() => setMeat(!meat)}
                    />
                <Form.Check
                        type="checkbox"
                        label="Dairy Product?"
                        checked={dairy}
                        onChange={() => setDairy(!dairy)}
                    />


                <h3 className="mt-5">Portion to insert:</h3>
                <InputGroup>
                {selectedPortions.map((portion, index) => (
                    <div key = {index} style={{ display: 'block', width: "100%" }}>
                        <p></p>
                        <Form.Check
                            name = "selectedPortion"
                            checked = {insertedPortions.includes(portion.description)}
                            label = {`${portion.description} (${portion.grams}g)`}
                            onChange = {() => handlePortionChange(portion.description)}             
                        />
                        <br/ >
                    </div>

                ))}

                <Form.Check
                    type="checkbox"
                    label="Is this a whole item (that can be purchased individually)"
                    checked={wholeIngredient}
                    onChange={() => setWholeIngredient(!wholeIngredient)}
                />

                </InputGroup>
                <Button className="mt-5" type = "submit">Add to Database</Button>
            </Form>
        )
    }

    return (
        <>
            <Container fluid>
                <Button onClick = {() => back("welcome")}>Back</Button>
                <Row className = "ml-5 mr-5 mt-5">
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
                                <div key = {index} 
                                    style = {{height: "50px", border: "1px solid black"}}
                                    onClick = {() => selectIngredient(x[0], x[1])}>
                                        {x[0]}
                                </div>
                            ))}
                        </Form>
                    </Col>
                    <Col className="justify-content-center">
                        <Row>
                            <Col>{selectedNutrients != null && <NutritionLabel nutrients={selectedNutrients} amount = {100} amountUnit = {"grams"} grams = {100}/>}</Col>
                            <Col>
                                {(selectedNutrients != null && selectedPortions != null) && <Attributes />}
                            </Col>
                        </Row>
                        {message != null && message}
                    </Col>
                </Row>
            </Container>

        </>
    )
}
