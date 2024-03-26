import {Container, Button, Row, Col, ListGroup, Alert, Form} from 'react-bootstrap';
import NutritionLabel from '../tools/NutritionLabel';
import { useState, useEffect } from 'react';
export default function SingleMeal({token, name, ingredients, mealKey, defaultServings, reload}){
    let [editing, setEditing] = useState(false);
    let [servings, setServings] = useState(defaultServings);

    let [updatedName, setUpdatedName] = useState(name);

    let [changedIngredients, setChangedIngredients] = useState(ingredients);
    let [changedMealNutrients, setChangedMealNutrients] = useState(null); 
    let [ingredientNutrients, setIngredientNutrients] = useState(null);
    
    let [selectedIngredientName, setSelectedIngredientName] = useState("");
    let [selectedIngredientKey, setSelectedIngredientKey] = useState(null);
    let [selectedIngredientPortion, setSelectedIngredientPortion] = useState(null);
    let [selectedIngredientAmount, setSelectedIngredientAmount] = useState(null);
    let [selectedPortionGrams, setSelectedPortionGrams] = useState(null);
    let [allIngredientPortions, setAllIngredientPortions] = useState(null);

    useEffect(() => {
        addMealNutrients();
        setChangedIngredients(ingredients);
        clearIngredient();
        setEditing(false);
    }, [name])

    useEffect(() => {
        console.log("changed");
        addMealNutrients();
    }, [changedIngredients, servings])

    useEffect(() => {
        clearIngredient();
    }, [editing]);

    const addIngredientNutrients = (result, ingredientKey, ingredient) => {
        console.log(servings / defaultServings);
        let resultCopy = result;
        for(let key in ingredient.nutrients){
            let value;
            if(ingredient.ingredientKey == selectedIngredientKey){
                let originalValue = ingredientNutrients.find(item => item.name === key).amount;
                value = (originalValue / 100) * (selectedIngredientAmount * selectedPortionGrams) * (parseInt(servings) / defaultServings);
            }
            else 
                value = parseFloat(ingredient.nutrients[key]) * (parseInt(servings) / defaultServings);
    
            // If the property doesn't exist in the result, create it
            if (!result.hasOwnProperty(key)) {
                resultCopy[key] = value;
            } else {
                // Otherwise, add the value to the existing property
                resultCopy[key] += value;
            }
        }
        return resultCopy;
    }

    const addMealNutrients = () => {
        let result = {};

        for(let x of changedIngredients){
            if(x.nutrients == null){
                console.log("Error - nutrients does not exist!")
                return;
            }
            result = addIngredientNutrients(result, x.ingredientKey, x)
        }
    
        result = Object.entries(result)
                .filter(([key, value]) => typeof value === 'number') // Filter out non-numeric values
                .map(([name, amount]) => ({ name, amount }));
        setChangedMealNutrients(result);
        clearIngredient();
    }

    const fetchIngredient = async (type, ingredientKey, amount, portionKey, portionGrams) => {
        console.log("Executing foods/IngredientByKey API Call with key " + ingredientKey + "...");
        const response = await fetch(process.env.REACT_APP_API_URL + `foods/ingredientByKey/${ingredientKey}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });
        if(!response.ok)
            console.log(`Getting ingredient key ${ingredientKey} failed!`)

        const x = await response.json();
        if(!"nutrients" in x){
            console.log("error!")
        } else {
            const nutrients = Object.entries(x.nutrients)
                .filter(([key, value]) => typeof value === 'number') // Filter out non-numeric values
                .map(([name, amount]) => ({ name, amount }));
            setIngredientNutrients(nutrients);
            if(type === "edit")
                setSelectedIngredientKey(ingredientKey);
            setSelectedIngredientName(x.ingredient.ingredientName)
            setAllIngredientPortions(x.portions)
            setSelectedIngredientPortion(portionKey)
            setSelectedIngredientAmount(amount);
            setSelectedPortionGrams(portionGrams);
        }
    }

    const clearIngredient = () => {
        setSelectedIngredientName("");
        setSelectedIngredientPortion(null);
        setSelectedIngredientAmount(null)
        setIngredientNutrients(null);
        setSelectedIngredientKey(null);
    }

    const removeIngredient = (ingredientKey) => {
        console.log(ingredientKey);
        let updatedIngredients = [...changedIngredients];
        updatedIngredients = updatedIngredients.filter(item => item.ingredientKey !== ingredientKey);
        setChangedIngredients(updatedIngredients);
    }

    const updateIngredient = (ingredientKey) => {
        let updatedIngredients = [...changedIngredients];
        let oldValues = updatedIngredients.find(item => item.ingredientKey === ingredientKey)
        updatedIngredients = updatedIngredients.filter(item => item.ingredientKey !== ingredientKey);

        let currentPortion = allIngredientPortions.find(item => item.name === selectedIngredientPortion);
        let update = {
            "name": selectedIngredientName,
            "ingredientKey": oldValues.ingredientKey,
            "amount": selectedIngredientAmount,
            "portion": currentPortion.name,
            "portionKey": currentPortion.portionKey,
            "portionGrams": currentPortion.grams,
            "nutrients": oldValues.nutrients,
        }
        updatedIngredients.push(update);
        setChangedIngredients(updatedIngredients);
    }

    const changePortion = (name, grams) => {
        setSelectedIngredientPortion(name);
        setSelectedPortionGrams(grams);
    }

    function roundToTwoDecimals(num) {
        if (Number.isInteger(num)) {
            return num; // Return the number as is if it's already a whole number
        } else {
            return Math.round(num * 100) / 100; // Round to two decimal places otherwise
        }
    }

    function editableIngredient(ingredient){

        return (

            <div className = "flex d-flex flex-direction-row align-items-center">  
                {(selectedIngredientKey === ingredient.ingredientKey) &&(
                    <>
                    <ListGroup.Item style = {{width: "80%"}}>
                        <div style={{fontSize: "20px", marginLeft: "10px"}} className = "flex d-flex flex-direction-row align-items center">
                                <Form.Control 
                                    type = "text"
                                    style = {{width: "20%", marginRight: "10px"}}
                                    value = {selectedIngredientAmount} 
                                    onChange = {(e) => setSelectedIngredientAmount(e.target.value)}
                                    autoComplete = "off" 
                                />
                                <Form.Control
                                            as="select"
                                            onChange= {(e) => changePortion(e.target.value, e.target.selectedOptions[0].getAttribute('data-grams'))}
                                            value = {selectedIngredientPortion}
                                            style={{ marginRight: "10px", width: '40%' }}
                                            >
                                                <option value = ""></option>
                                                {/* Assuming availableIngredients is an array of available attributes */}
                                                {(allIngredientPortions != null) && allIngredientPortions.map((portion, index) => (
                                                    <option key = {portion.portionKey} data-grams={portion.grams}>{portion.name}</option>
                                                ))}
                                </Form.Control>
                                 {` ${selectedIngredientName.toLowerCase()} `} 
                                
                        </div>
                    </ListGroup.Item>
                    <img style = {{height: "20px", marginTop: "10px", marginLeft: "10px", float: "right"}} src={process.env.PUBLIC_URL + "/images/plus.png"} onClick={() => updateIngredient(ingredient.ingredientKey)}/>
                    <img style = {{height: "20px", marginTop: "10px", marginLeft: "10px", float: "right"}} src={process.env.PUBLIC_URL + "/images/x.png"} onClick={() => clearIngredient()}/>
                    </>

                )}
                {(selectedIngredientKey != ingredient.ingredientKey) &&(
                    <>
                        <ListGroup.Item style = {{width: "80%"}}>
                            <p style={{fontSize: "20px", marginLeft: "10px"}}>{roundToTwoDecimals(ingredient.amount * (servings / defaultServings)) + " " + ingredient.portion.toLowerCase() + "\t " + ingredient.name.toLowerCase() + " (" + ingredient.amount * ingredient.portionGrams + "g)"}</p>
                        </ListGroup.Item>
                        {editing && <img style = {{height: "20px", marginLeft: "10px", float: "right"}} src={process.env.PUBLIC_URL + "/images/edit.png"} onClick={() => fetchIngredient("edit", ingredient.ingredientKey, ingredient.amount, ingredient.portion, ingredient.portionGrams)}/>}
                        {editing && <img style = {{height: "20px", marginLeft: "10px"}} src={process.env.PUBLIC_URL + "/images/remove.png"} onClick = {() => removeIngredient(ingredient.ingredientKey)}/>}
                        <img style = {{height: "20px", marginLeft: "10px"}} src={process.env.PUBLIC_URL + "/images/eye.png"} onClick = {() => fetchIngredient("view", ingredient.ingredientKey, ingredient.amount, ingredient.portion, ingredient.portionGrams)}/>
                    </>
                  
                )}

            </div>
            
        );
    }

    const updateMeal = async () => {
        console.log(changedIngredients);
        const response = await fetch(process.env.REACT_APP_API_URL + `foods/updateMeal/${mealKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({"updatedIngredients": changedIngredients, "newName": updatedName})
        });
        clearIngredient();
        reload();
    }

    const deleteMeal = async () => {
        const response = await fetch(process.env.REACT_APP_API_URL + `foods/deleteMeal/${mealKey}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });
        reload();
    }

    return (
        <Container fluid>
            <div className = "flex d-flex flex-direction-row" style = {{width: "50%"}}>
                {!editing && <h2 style = {{marginTop: "20px", marginBottom: "20px"}}>{updatedName}</h2>}
                {editing && 
                    (
                        <Form.Control 
                                onChange = {(e) => setUpdatedName(e.target.value)} 
                                value = {updatedName} 
                                placeholder = {name}
                                style = {{width: "70%", marginTop: "20px", marginBottom: "20px", fontSize: "24px"}} 
                            />
                    )
                }
               
                {changedIngredients != ingredients && <Button style = {{height: "50%", marginTop: "20px", marginLeft: "20px"}} onClick = {() => setChangedIngredients(ingredients)}>Restore</Button>}
                {editing && <Button variant = "danger" style = {{height: "80%", marginTop: "25px", marginLeft: "10px"}} onClick = {() => deleteMeal()}>Delete</Button>}
                {!editing && <img style = {{height: "30px", marginTop: "30px", marginLeft: "10px", marginRight: "10px",float: "right"}} className = "ml-auto" src={process.env.PUBLIC_URL + "/images/edit.png"} onClick={() => setEditing(true)}/>}
                {editing && <img style = {{height: "30px", marginTop: "30px", marginLeft: "10px",marginRight: "10px", float: "right"}} className = "ml-auto" src={process.env.PUBLIC_URL + "/images/x.png"} onClick={() => setEditing(false)}/>}
            </div>

            <div className = "flex d-flex flex-direction-row" style = {{width: "50%"}}>
                <Form.Control
                        onChange = {(e) => setServings(e.target.value)}
                        value = {servings}
                        placeholder={defaultServings}
                        style = {{width: "50px", marginBottom: "20px", fontSize: "24px"}} 
                        />
                    <h3 style = {{marginLeft: "10px", marginTop: "10px"}}> servings</h3>
            </div>

            <Row>
                <Col>
                    <ListGroup>
                        {changedIngredients.slice() // Create a shallow copy to avoid mutating the original array
                                .sort((a, b) => a.name.localeCompare(b.name))
                                .map((ingredient) => (
                                editableIngredient(ingredient)
                            ))}
                    </ListGroup>
                    {(changedIngredients != ingredients || updatedName != name) && <Button style = {{height: "40px", marginTop: "20px", marginLeft: "20px"}} onClick = {() => updateMeal()}>Submit</Button>}

                </Col>
                <Col>
                    <div className="flex d-flex flex-direction-row">
                        {ingredientNutrients != null && <Alert style={{width: "80%"}} variant = {"warning"}>Viewing nutrition for {selectedIngredientAmount * (defaultServings / servings)} {selectedIngredientPortion} {selectedIngredientName.toLowerCase()}</Alert>}
                        {ingredientNutrients != null && <img style = {{height: "30px", marginRight: "20px", float: "right"}} className = "ml-auto" src={process.env.PUBLIC_URL + "/images/x.png"} onClick={() => clearIngredient()}/>}
                    </div>
                    <NutritionLabel 
                        nutrients = {ingredientNutrients ?? changedMealNutrients}
                        amount = {selectedIngredientAmount ?? servings} 
                        amountUnit = {selectedIngredientPortion ?? "serving"} 
                        grams = {(selectedPortionGrams != null && selectedIngredientAmount != null) ? selectedPortionGrams * selectedIngredientAmount : 100}/>
                </Col>
            </Row>


        </Container>
       
                        
    )
}