import React, {useState, useCallback} from 'react';
import {Container, Row, Form, FormControl, Col, Button} from 'react-bootstrap';
import NutritionLabel from '../tools/NutritionLabel';


export default function AddIngredient({back}){
    const [term, setSearchTerm] = useState(null);
    const [ingredients, setIngredients] = useState(null);
    const [selectedIngredientID, setSelectedIngredientID] = useState(null);
    const [selectedIngredientName, setSelectedIngredientName] = useState(null);
    const [selectedNutrients, setSelectedNutrients] = useState(null);

    const [meat, setMeat] = useState(false);
    const [dairy, setDairy] = useState(false);
    const [storeAmount, setStoreAmount] = useState(false);

    const [message, setMessage] = useState(null);
    
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

    const selectIngredient = async (name, FDCID) => {
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
        setMeat(false);
        setDairy(false);
        setStoreAmount(false);
    }

    const addIDToDB = async(event) => {

        var inputElement = document.getElementById("ingredientName");
        var inputValue = inputElement.value;
        if(inputValue != "")
            setSelectedIngredientName(inputValue);
        event.preventDefault();
        const response = await fetch(process.env.REACT_APP_API_URL + "tf/addIDToDB", {
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
                    {"name": "StoreAmount", "value": storeAmount}
                ]})
        });
        if(!response.ok)
            setMessage(selectedIngredientName + " could not be added to the database.");

        const data = await response.text();
        if(data === "Ingredient Successfully Added!")
            setMessage(selectedIngredientName + " was successfully added to the database!");

    }

    const Attributes = () => {
        return (
            <Form onSubmit={(e) => addIDToDB(e)}>
                <input
                    type="text"
                    id = "ingredientName"
                    placeholder={selectedIngredientName} className="mt-5"
                ></input>
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
                <Form.Check
                        type="checkbox"
                        label="Is this a whole item (that can be purchased individually)"
                        checked={storeAmount}
                        onChange={() => setStoreAmount(!storeAmount)}
                    />
                <Button type = "submit">Add to Database</Button>
            </Form>
        )
    }

    return (
        <>
            <Container>
                <Button onClick = {() => back("welcome")}>Back</Button>
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
                                <div key = {index} onClick = {() => selectIngredient(x[0], x[1])}>{x[0]}</div>
                            ))}
                        </Form>
                    </Col>
                    <Col className="justify-content-center">
                        <Row>
                            <Col>{selectedNutrients != null && <NutritionLabel nutrients={selectedNutrients}/>}</Col>
                            <Col>{selectedNutrients != null && <Attributes />}</Col>
                        </Row>
                        {message != null && message}
                    </Col>
                </Row>
            </Container>

        </>
    )
}