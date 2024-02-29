import React, {useState, useEffect} from 'react';
import {Container, Row, Form, FormControl, Col, Button, InputGroup} from 'react-bootstrap';
import NutritionLabel from '../tools/NutritionLabel';

export default function MealToIngredient({allIngredients, finalize, editIngredient = "null"}){
    const [selectedIngredientKey, setSelectedIngredientKey] = useState(0);
    const [selectedIngredientName, setSelectedIngredientName] = useState("");
    const [loaded, setLoaded] = useState(false);

    const [nutrients, setNutrients] = useState(false); 
    
    const [variableAmount, setVariableAmount] = useState(false);
    const [amount, setAmount] = useState(1);
    const [amountFrom, setAmountFrom] = useState(0)
    const [amountTo, setAmountTo] = useState(0);

    const [allPortions, setAllPortions] = useState(null); 
    const [selectedPortion, setSelectedPortion] = useState(null);

    const [errorMessage, setErrorMessage] = useState("");

    //When the Meal to Ingredient is loaded from an already-existing ingredient in the meal, execute this
    useEffect(() => {
        const fetchData = async () => {
            try {
                if (editIngredient === "null" || !allIngredients || !Array.isArray(allIngredients))
                    return; 
                else{
                    await getIngredient(editIngredient.name, editIngredient.ingredientKey); // Call getIngredient and wait for it to complete
        
                    // Once getIngredient is done, proceed with state updates
                    setAmount(editIngredient.amount);
                    if(editIngredient.amountTo != 0){
                        console.log(true);
                        setVariableAmount(true);
                    }
                    setAmountTo(editIngredient.amountTo);
                    setAmountFrom(editIngredient.amountFrom);
                    setSelectedPortion(editIngredient.portion);
                    setLoaded(true)
                }
            } catch (error) {
                console.error("Error fetching ingredient:", error);
            }
        };
    
        fetchData(); // Call the async function
    
    }, [editIngredient, allIngredients]);

    const getIngredient = async(name, ingredientParam = "null") => {
        let ingredientKey;
        if(ingredientParam == "null" || loaded)
            ingredientKey = allIngredients.find(item => item.ingredientName === name).ingredientKey;
        else
            ingredientKey = ingredientParam;
        setSelectedIngredientKey(ingredientKey);
        setSelectedIngredientName(name);
        console.log("Executing get/IngredientByKey API Call with key " + ingredientKey + "...");
        const response = await fetch(process.env.REACT_APP_API_URL + `foods/ingredientByKey/${ingredientKey}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
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
        
        setAmount(0);
        setAmountFrom(0);
        setAmountTo(0);
        setVariableAmount(false);
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

    const handleChange = (event, setter) =>{
        let newValue = event.target.value;
        setter(newValue);
    }
    

    const setVariable = (value) => {
        if(value == false){
            setAmountTo(0)
            setAmountFrom(0)
        }
        setVariableAmount(value);
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
                "amount": amount,
                "amountFrom": amountFrom,
                "amountTo": amountTo
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
                    <Form.Group  style={{ width: '80%' }} className = "ml-5">
                        <Form.Label>Is amount variable?</Form.Label>
                        <Form.Control
                            type = "checkbox"
                            checked = {variableAmount}
                            onClick = {() => setVariable(!variableAmount)}
                            />
                    </Form.Group>
                    {variableAmount &&
                        <Form.Group style={{ width: '80%' }} className = "ml-5 pt-5">
                            <Form.Label>Ingredient amount</Form.Label>
                            <Form.Control 
                                type = "text" 
                                placeholder = "From" 
                                value = {amountFrom}
                                onChange={(event) => handleChange(event, setAmountFrom)}
                                autoComplete = "off" 
                            />
                            <Form.Control 
                                type = "text" 
                                placeholder = "To" 
                                value = {amountTo}
                                onChange={(event) => handleChange(event, setAmountTo)}
                                autoComplete = "off" 
                            />
                        </Form.Group>

                    }
                    <Form.Group style={{ width: '80%' }} className = "ml-5 pt-5">
                        <Form.Label >{!variableAmount && "Ingredient amount"}{variableAmount && "Standard Ingredient Amount"}</Form.Label>
                        <Form.Control
                        type = "text"
                        placeholder = "Enter an amount"
                        value = {amount}
                        onChange = {(event) => handleChange(event, setAmount)}
                        autoComplete = "off" />
                    </Form.Group>

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
                    <Button className = "mt-5">Remove Ingredient</Button>
                    <Button className = "mt-5" onClick = {() => submitIngredient()}>Finalize</Button>
                     <p>{errorMessage}</p>
                </div>
            </Col>
            <Col>
                {(selectedPortion != null && nutrients != null) && <NutritionLabel nutrients = {nutrients} amount = {amount} amountUnit = {selectedPortion.name} grams = {selectedPortion.grams * amount}/>}
            </Col>
        </Row>

    );
}