import React, {useState} from 'react';
import {Container, Form} from 'react-bootstrap';


export default function AddIngredient(){
    const [term, setSearchTerm] = useState(null);
    const [ingredients, setIngredients] = useState(null);
    
    const search = async (event) => {
        event.preventDefault();
        console.log("Executing tf/ingredientListFDC API Call...")
        const response = await fetch(process.env.REACT_APP_API_URL + "tf/ingredientListFDC", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({"searchTerm": term})
        });

        const x = await response.json();
        const array = x.map(x => x.description);
        console.log(array);
        setIngredients(array);
    }

    return (
        <>
            <Container>
                <Form onSubmit ={(e) => search(e)}>
                    <Form.Group>
                        <Form.Control 
                                type = "text"
                                placeholder = "Find an ingredient"
                                onChange = {(e) => setSearchTerm(e.target.value)}
                                autoComplete = "off" 
                        />
                    </Form.Group>
                </Form>
            </Container>
            {ingredients != null && ingredients.map((x, index) => (
                <p key = {index}>{x}</p>
            ))}
        </>
    );
}