import React, {useState, useEffect} from 'react';
import {Container, Row, Form, Pagination, Col, Button, InputGroup, ListGroup} from 'react-bootstrap';
import NutritionLabel from '../tools/NutritionLabel';

export default function AddIngredientAttributes({token, nutrients, portions, id, name, add}){

    const [ingredientName, setIngredientName] = useState(name);

    const [message, setMessage] = useState(null);
    const [insertedPortions, setInsertedPortions] = useState([]);

    const handlePortionChange = (portionDescription) => {
        const isSelected = insertedPortions.some(insertedPortion => {
            return insertedPortion.portion === portionDescription;
        });
        if (isSelected) {
            setInsertedPortions(insertedPortions.filter(item => item.portion !== portionDescription));
        } else {
            setInsertedPortions([...insertedPortions, {portion: portionDescription}]);
        }
    };

    useEffect(() => {
        setIngredientName(name);
      }, [id]);

    const addIDToDB = async(event) => {
        event.preventDefault();
        var inputElement = document.getElementById("ingredientName");
        var inputValue = inputElement.value;
        console.log(inputValue);
        if(inputValue !== "")
            setIngredientName(inputValue);
        
        const response = await fetch(process.env.REACT_APP_API_URL + "adminRoutes/addIDToDB", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(
                {"id": id,
                "name": ingredientName, 
                "portions": insertedPortions
            })
        });
        if(!response.ok)
            setMessage(ingredientName + " could not be added to the database.");

        let data = await response.json();
        if (data.message == ("Error")){
            const index = data.indexOf('[');
            if (index !== -1) {
                data = data.slice(index, data.length);
                console.log(data);
            }
        }
        if(data.message === "SUCCESS")
            setMessage(ingredientName + " was successfully added to the database!");
        add();
    }

    const changeName = (event) => {
        setIngredientName(event.target.value);
    }

    return (
        <Col className="justify-content-center">
        
        <Row>
            <Col>
                {name != null && <h3>{name}</h3>}
                {nutrients != null && <NutritionLabel nutrients={nutrients} amount = {100} amountUnit = {"grams"} grams = {100}/>}
            </Col>
            <Col>
                {(nutrients != null && portions != null) && ( 
                    <Form onSubmit={(e) => addIDToDB(e)}>
                       <Form.Control id = "ingredientName" value = {ingredientName}placeholder={name} onChange={changeName} style = {{width: "50%"}}/>
                        <h3 className="mt-5">Portion to insert:</h3>
                        <InputGroup>
                        {portions.map((portion, index) => (
                            <div key = {index} style={{ display: 'block', width: "100%" }}>
                                <p></p>
                                <Form.Check
                                    name = "selectedPortion"
                                    checked = {insertedPortions.some(insertedPortion => {return insertedPortion.portion === portion.description;})}
                                    label = {`${portion.description} (${portion.grams}g)`}
                                    onChange = {() => handlePortionChange(portion.description)}             
                                />
                                <br/ >
                            </div>

                        ))}

                        </InputGroup>
                        <Button className="mt-5" type = "submit">Add to Database</Button>
                        <br></br>
                        {message != null && message}
                    </Form>
                    )}
                </Col>
            </Row>
        </Col>
    )
}