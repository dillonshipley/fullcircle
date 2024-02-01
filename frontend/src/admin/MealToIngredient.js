import React, {useState, useEffect} from 'react';
import {Container, Row, Form, FormControl, Col, Button, InputGroup} from 'react-bootstrap';
import NutritionLabel from '../tools/NutritionLabel';

export default function MealToIngredient({allIngredients, finalize, editIngredient = "null"}){
    const [variableAmount, setVariableAmount] = useState(false);
    const [nutrients, setNutrients] = useState(false); 
    const [allPortions, setAllPortions] = useState(null); 
    const [selectedPortion, setSelectedPortion] = useState(null);
    const [amount, setAmount] = useState(1);

    const [errorMessage, setErrorMessage] = useState("");
    const [selectedIngredientKey, setSelectedIngredientKey] = useState(0);
    const [selectedIngredientName, setSelectedIngredientName] = useState("");
    


    //When the Meal to Ingredient is loaded from an already-existing ingredient in the meal, execute this
    useEffect(() => {
        const fetchData = async () => {
            try {
                if (editIngredient === "null" || !allIngredients || !Array.isArray(allIngredients))
                    return; 
                else{
                    await getIngredient(editIngredient.name, editIngredient.ingredientKey); // Call getIngredient and wait for it to complete
        
                    // Once getIngredient is done, proceed with state updates
                    if (selectedPortion == null) {
                        console.log("error null: edit ingredient portion is " + editIngredient.portion);
                    }
                    setAmount(editIngredient.amount);
                    setSelectedPortion(editIngredient.portion);
                }
            } catch (error) {
                console.error("Error fetching ingredient:", error);
            }
        };
    
        fetchData(); // Call the async function
    
    }, [editIngredient, allIngredients, selectedPortion]);

    const getIngredient = async(name, ingredientParam = "null") => {
        let ingredientKey;
        if(ingredientParam == "null")
            ingredientKey = allIngredients.find(item => item.ingredientName === name).ingredientKey;
        else
            ingredientKey = ingredientParam;
        setSelectedIngredientKey(ingredientKey);
        setSelectedIngredientName(name);
        console.log("Executing get/IngredientByKey API Call with key " + ingredientKey + "...");
        const response = await fetch(process.env.REACT_APP_API_URL + "get/ingredientByKey", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({"ingredientKey": ingredientKey})

        });
        if(!response.ok)
            console.log(`Getting ingredient key ${ingredientKey} failed!`)

        const data = await response.json();
        const nutrients = Object.entries(data.nutrients)
            .filter(([key, value]) => typeof value === 'number') // Filter out non-numeric values
            .map(([name, amount]) => ({ name, amount }));

        setNutrients(nutrients);
        setAllPortions(data.portions);
        setSelectedPortion(null);
    }

    const changeIngredient = (event) => {
        const newValue = event.target.value;
        getIngredient(newValue);
    }

    const changePortion = (event) => {
        let newValue = event.target.value;
        newValue = allPortions.find(item => item.name === newValue);
        setSelectedPortion(newValue);
    }

    const changeAmount = (event) => {
        let newValue = event.target.value;
        setAmount(newValue);
    }

    const submitIngredient = () => {
        if(amount === 0){
            setErrorMessage("Amount is 0!");
            return;
        } else if(selectedPortion === "" || selectedPortion == null){
            setErrorMessage("Portion not selected!");
            return;
        } else if (selectedIngredientKey === 0 || selectedIngredientKey === null){
            setErrorMessage("Ingredient not selected!");
        } else {
            const data = {
                "ingredientKey": selectedIngredientKey,
                "name": selectedIngredientName,
                "portion": selectedPortion,
                "amount": amount
            }
            finalize(data);
        }
    }

    return (
        <Row>
            <Col>
                <div style = {{border: '1px solid black'}}>
                    {/*dropdown with all ingredients in the system*/}
                    <Form.Group>
                        <Form.Label className = "ml-5">Ingredient</Form.Label>
                        <Form.Control
                        as="select"
                        onChange= {(e) => changeIngredient(e)}
                        value = {selectedIngredientName}
                        style={{ width: '80%' }}
                        className = "ml-5"
                        >
                            <option value = ""></option>
                            {/* Assuming availableIngredients is an array of available ingredients */}
                            {(allIngredients != null) && allIngredients.map((ingredient, index) => (
                                <option key = {index}>{ingredient.ingredientName}</option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Is amount variable?</Form.Label>
                        <Form.Control
                            type = "checkbox"
                            onClick = {() => setVariableAmount(!variableAmount)}
                            />
                    </Form.Group>
                    {variableAmount &&
                        <Form.Group>
                            <Form.Label>Ingredient amount</Form.Label>
                            <Form.Control type = "text" placeholder = "From" autoComplete = "off" />
                            <Form.Control type = "text" placeholder = "To" autoComplete = "off" />
                        </Form.Group>

                    }
                    {!variableAmount &&
                    <Form.Group>
                        <Form.Label className = "ml-5">Ingredient amount</Form.Label>
                        <Form.Control
                        type = "text"
                        placeholder = "Enter an amount"
                        value = {amount}
                        onChange = {changeAmount}
                        style={{ width: '80%' }}
                        className = "ml-5"
                        autoComplete = "off" />
                    </Form.Group>

                    }
                    <Form.Group>
                        <Form.Label className = "ml-5 pt-3">Ingredient amount unit</Form.Label>
                        <Form.Control
                            as="select"
                            onChange= {(e) => changePortion(e)}
                            value = {selectedPortion?.name ?? ""}
                            style={{ width: '80%' }}
                            className = "ml-5"
                        >
                            <option value = ""></option>
                            {/* Assuming availableIngredients is an array of available ingredients */}
                            {(allPortions != null) && allPortions.map((x, index) => (
                                <option key = {index} value = {x.name}>{x.name + " (" + x.grams + "g)"}</option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                    <Button>Remove Ingredient</Button>
                 <Button onClick = {() => submitIngredient()}>Finalize</Button>
                 <p>{errorMessage}</p>
                </div>
            </Col>
            <Col>
                {(selectedPortion != null && nutrients != null) && <NutritionLabel nutrients = {nutrients} amount = {amount} amountUnit = {selectedPortion.name} grams = {selectedPortion.grams * amount}/>}
            </Col>
        </Row>

    );
}