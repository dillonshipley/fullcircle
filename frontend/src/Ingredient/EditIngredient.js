import React, {useState, useEffect} from 'react';
import {Container, Row, Form, FormControl, Col, Button, InputGroup, ListGroup, Tabs, Tab} from 'react-bootstrap';

import AddIngredient from './AddIngredient';
import SingleIngredient from './SingleIngredient';
import IngredientByAttribute from './IngredientByAttribute';

export default function EditIngredients({token, back}){
    let [ingredients, setIngredients] = useState(null);
    let [ingredientFilter, setIngredientFilter] = useState("");
    let [selectedIngredientKey, setSelectedIngredientKey] = useState(null);

    let [allAttributes, setAllAttributes] = useState(null);
   
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
        let allIngredients = x.ingredients;
        allIngredients.sort((a, b) => {
            // Convert both names to lowercase for case-insensitive comparison
            const nameA = a.ingredientName.toLowerCase();
            const nameB = b.ingredientName.toLowerCase();
        
            if (nameA < nameB) {
                return -1; // Name A comes before Name B
            } else if (nameA > nameB) {
                return 1; // Name B comes before Name A
            } else {
                return 0; // Names are equal
            }
        });
        setIngredients(allIngredients);

        setAllAttributes(x.attributes);
    }

    useEffect(() => {
        loadIngredients();
        console.log(token);
    }, [back]);    

    const handleFilterChange = (e) => {
        setIngredientFilter(e.target.value.toLowerCase());
      };



    return (
        <Container fluid>
            <Button onClick = {() => back("welcome")}>Back</Button>
            <h2>Ingredients</h2>
            {/*Filter*/}
            <Tabs defaultActiveKey="profile"
                    id="uncontrolled-tab-example"
                    className="mb-3">
                

                        <Tab eventKey="Search By Name" title="Search By Name">
                            <Row>
                                <Col xs = {6}>
                                    <Form.Group controlId="filterInput">
                                        <Form.Control
                                        type="text"
                                        placeholder="Search for items..."
                                        value={ingredientFilter}
                                        onChange={handleFilterChange}
                                        />
                                    </Form.Group>

                                    {/*List of ingredients*/}
                                    <ListGroup>
                                        {ingredients != null && ingredients
                                            .filter(ingredient => ingredient.ingredientName.toLowerCase().includes(ingredientFilter))
                                            .map((ingredient) => (
                                            <ListGroup.Item style = {{height: "50px"}} onClick = {() => setSelectedIngredientKey(ingredient.ingredientKey)}>{ingredient.ingredientName}</ListGroup.Item>
                                        ))}
                                    </ListGroup>
                                </Col>
                                <Col xs = {6}>
                                    {selectedIngredientKey != null && <SingleIngredient token = {token} ingredientKey = {selectedIngredientKey} loadIngredients={loadIngredients} attributes = {allAttributes}/>}
                                </Col>
                            </Row>
                        </Tab>
                        <Tab eventKey="Search By Attribute" title="Search By Attribute">
                            {allAttributes != null && <IngredientByAttribute token = {token} all = {allAttributes} reload={loadIngredients}/>}
                        </Tab>
                        <Tab eventKey = "Add Ingredient (Admin)" title = "Add Ingredient (Admin)">
                            <AddIngredient token = {token} add = {loadIngredients} />
                        </Tab>
            </Tabs>
        </Container>
    )
}