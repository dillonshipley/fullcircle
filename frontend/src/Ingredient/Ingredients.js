import React, {useState, useEffect} from 'react';
import {Container, Row, Form, FormControl, Col, Button, InputGroup, ListGroup, Tabs, Tab} from 'react-bootstrap';

import AddIngredient from './AddIngredient';
import SingleIngredient from './SingleIngredient';
import IngredientByAttribute from './IngredientByAttribute';
import IngredientListView from './IngredientListView';

export default function EditIngredients({token, back}){

    let [selectedIngredientKey, setSelectedIngredientKey] = useState(null);
    let [ingredients, setIngredients] = useState(null);
    let [allAttributes, setAllAttributes] = useState(null);
   
    const loadIngredients = async (reload = false) => {
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

        if(reload){
            setSelectedIngredientKey(null)
        }
    }

    useEffect(() => {
        loadIngredients();
    }, [back]);    




    return (
        <Container fluid>
            <img style = {{width: "30px", marginTop: "10px"}} src={process.env.PUBLIC_URL + "/images/back.png"} onClick = {() => back("welcome")}/>
            <h1 style = {{marginBottom: "30px", marginLeft: "50px"}}>Ingredients</h1>
            {/*Filter*/}
            <Tabs defaultActiveKey="profile"
                    id="uncontrolled-tab-example"
                    className="mb-3">
                

                        <Tab eventKey="Search By Name" title="Search By Name">
                            <Row>
                                <IngredientListView ingredients={ingredients} changeIngredient={setSelectedIngredientKey}/>
                                <Col xs = {6}>
                                    {selectedIngredientKey != null && <SingleIngredient token = {token} ingredientKey = {selectedIngredientKey} loadIngredients={() => loadIngredients(true)} attributes = {allAttributes}/>}
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