import React, {useState, useEffect} from 'react';
import {Container, Row, Form, Pagination, Col, Button, InputGroup, ListGroup} from 'react-bootstrap';

import AddIngredientAttributes from './AddIngredientAttributes';

export default function AddIngredient({token, add}){
    const [term, setSearchTerm] = useState(null);
    const [ingredients, setIngredients] = useState(null);

    const [selectedIngredientName, setSelectedIngredientName] = useState(null);
    const [selectedNutrients, setSelectedNutrients] = useState(null);
    const [selectedPortions, setSelectedPortions] = useState(null);
    const [selectedIngredientID, setSelectedIngredientID] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    const [message, setMessage] = useState("");
    
    
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

        if(response.headers.get('content-type').includes('application/json')){
            const x = await response.json();
            const array = x.map(x => [x.description, x.id]);
            console.log(array);
            setIngredients(array);
            setTotalPages(Math.ceil(array.length / itemsPerPage));
            setEndIndex(Math.min(startIndex + itemsPerPage, array.length));
        } else {
            const y = await response.text();
            console.log(y)
            setErrorMessage(y);
        }

        
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
        setSelectedIngredientID(FDCID);
        setSelectedIngredientName(name);
        setMessage(null);
    }




    const itemsPerPage = 5; // Number of items per page
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [endIndex, setEndIndex] = useState(0);

    // Calculate index range for current page
    const startIndex = (currentPage - 1) * itemsPerPage;

    // Function to handle page change
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <>
            <Container fluid>
                <Row className = "ml-5 mr-5">
                    <Col>
                        <Form onSubmit ={(e) => search(e)}>
                            <Form.Group>
                                <h2>Ingredient Search</h2>
                                <h5>All nutritional labels are displayed for 100g of the given ingredient</h5>
                                <Form.Control 
                                        type = "text"
                                        placeholder = "Find an ingredient"
                                        onChange = {(e) => setSearchTerm(e.target.value)}
                                        autoComplete = "off" 
                                        className = "mt-5"
                                />
                            </Form.Group>
                            {ingredients !== null && ingredients.length > 0 && (
                                <ListGroup>
                                    {ingredients.slice(((currentPage - 1) * itemsPerPage), (currentPage * itemsPerPage) + itemsPerPage).map((x, index) => (
                                        <ListGroup.Item key={startIndex + index} onClick={() => selectIngredient(x[0], x[1])}>
                                            {x[0]}
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            )}

                            {/* Pagination controls */}
                            {ingredients !== null && (
                                <Pagination>
                                    <Pagination.Prev
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                    />
                                    {Array.from({ length: totalPages }, (_, i) => (
                                        <Pagination.Item
                                            key={i + 1}
                                            active={i + 1 === currentPage}
                                            onClick={() => handlePageChange(i + 1)}
                                        >
                                            {i + 1}
                                        </Pagination.Item>
                                    ))}
                                    <Pagination.Next
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                    />
                                </Pagination>
                            )}


                            {errorMessage != null && errorMessage}
                        </Form>
                    </Col>
                    {selectedIngredientID !== null && <AddIngredientAttributes token = {token} nutrients={selectedNutrients} portions = {selectedPortions} id = {selectedIngredientID} name = {selectedIngredientName} add = {add}/>}
                </Row>
            </Container>

        </>
    )
}
