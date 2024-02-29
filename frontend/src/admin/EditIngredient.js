import React, {useState, useEffect} from 'react';
import {Container, Row, Form, FormControl, Col, Button, InputGroup, ListGroup} from 'react-bootstrap';
import NutritionLabel from '../tools/NutritionLabel';

function SingleIngredient({ingredientKey, loadIngredients}){
    let [portionsData, setPortionsData] = useState(null);
    let [selectedIngredientName, setSelectedIngredientName] = useState(null);
    let [selectedIngredient, setSelectedIngredient] = useState(null);
    let [openPortion, setOpenPortion] = useState(false);
    
    let [openPortionName, setOpenPortionName] = useState(false);
    let [openPortionGrams, setOpenPortionGrams] = useState(false);
    
    const changeIngredientName = (event) => {
        let newValue = event.target.value;
        setSelectedIngredientName(newValue);
    }

    const removePortion = (portionKey) => {
        console.log(portionsData);
        let updatedPortions = portionsData.filter(item => item.portionKey !== portionKey)
        setPortionsData(updatedPortions);
    }

    //On load and when selected ingredient key change, load new ingredeint portions
    useEffect(() => {
        console.log("ingredient Key" + ingredientKey)
        if(ingredientKey !== null){
            loadIngredientPortions();
        }
        
    }, [ingredientKey])

    //Execute the foods/IngredientByKey call
    const loadIngredientPortions = async () => {
        console.log("Executing foods/IngredientByKey API Call with key " + ingredientKey + "...");
        const response = await fetch(process.env.REACT_APP_API_URL + `foods/ingredientByKey/${ingredientKey}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if(!response.ok)
            console.log(`Getting ingredient key ${ingredientKey} failed!`)

        const x = await response.json();
        const nutrients = Object.entries(x.nutrients)
                .filter(([key, value]) => typeof value === 'number') // Filter out non-numeric values
                .map(([name, amount]) => ({ name, amount }));
        x.nutrients = nutrients;
        setSelectedIngredient(x);
        setSelectedIngredientName(x.ingredient.ingredientName);
        setPortionsData(x.portions);

        setOpenPortionGrams("");
        setOpenPortionName("");
        setOpenPortion(false);
    }

    //Execute the foods/IngredientByKey call
    const portionChange = (e) => {
        const { name, value } = e.target;
        const updatedPortionsData = portionsData.map(item => {
            if (item.portionKey === name) {
                return { ...item, name: value };
            }
            return item;
        });
        setPortionsData(updatedPortionsData);
    };

    const updateIngredient = async (event) => {
        event.preventDefault();
        //let newPortions = portionsData.filter(item => item.name != oldPortions.find(x => x.portionKey === item.portionKey)?.name); such a pretty line but I couldn't make it work
        
        console.log("Executing foods/updateIngredient API Call with key " + ingredientKey + "...");
        const response = await fetch(process.env.REACT_APP_API_URL + "foods/updateIngredient", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({"portions": portionsData, "updatedName": selectedIngredientName, "ingredientKey": ingredientKey})

        });
        if (!response.ok) {
            console.log("Error:", response.status, response.statusText);
        } else {
            console.log("Request successful");
        }
        loadIngredients();
    }

    const changePortionName = (event) =>{
        setOpenPortionName(event.target.value);
    }

    const changePortionGrams = (event) =>{
        setOpenPortionGrams(event.target.value);
    }

    const addPortionData = () => {
        if(openPortionName === "" || openPortionGrams === 0)
            return;
        
        const updatedPortions = portionsData;
        updatedPortions.push({"name": openPortionName, "grams": openPortionGrams, "portionKey": `${portionsData.length + 1}`});
        setPortionsData(updatedPortions);
        setOpenPortion(false);
    }

    if(selectedIngredient != null){
        return (
            <Container fluid>
                <Form onSubmit = {updateIngredient}>
                    <Row className = "mt-5">
                        {selectedIngredient != null && <Form.Control onChange = {changeIngredientName} value = {selectedIngredientName} placeholder = {selectedIngredient.ingredient.ingredientName} />}
                    </Row>
                    <Row>
                        <Col xs = {6}>
                            <h2>Nutrition</h2>
                            <NutritionLabel 
                            nutrients = {selectedIngredient.nutrients}
                            amount = {1} 
                            amountUnit = "serving" 
                            grams = {100}/>
                        </Col>
                        <Col xs = {6}>
                            <h2 className ="mb5">Portions</h2>
                            {portionsData.map((portion, index) => (

                                <div className={"d-flex align-items-center flex-direction-row"}>
                                    <Form.Control name = {portion.portionKey} value = {portionsData[index].name}placeholder={portion.name} onChange={portionChange} style = {{width: "50%"}}/>
                                    <p  style={{marginLeft: "10px"}}>({portion.grams}g)</p>
                                    <img style = {{width: "5%", marginLeft: "10px"}} src={process.env.PUBLIC_URL + "/images/remove.png"} onClick = {(e) => removePortion(portion.portionKey)}/>
                                </div>
                            ))}
                            {!openPortion && <Button onClick = {() => setOpenPortion(true)}>Add New Portion</Button>}
                            {openPortion && (
                                <div className={"d-flex align-items-center flex-direction-row"}>
                                    <Form.Control placeholder={"Add new portion..."} onChange={(e) => changePortionName(e)} style = {{width: "50%"}}/>
                                    <Form.Control placeholder = {"g"} onChange={(e) => changePortionGrams(e)} style = {{width: "10%"}} />
                                    <img style = {{width: "5%", marginLeft: "10px"}} src={process.env.PUBLIC_URL + "/images/remove.png"} onClick = {(e) => setOpenPortion(false)}/>
                                    <img style = {{width: "5%", marginLeft: "10px"}} src={process.env.PUBLIC_URL + "/images/plus.png"} onClick = {() => addPortionData()}/>
                                </div>
                            )}
                        </Col>

                    </Row>
                    <Button type = "submit">Submit</Button>
                </Form>
            </Container>
        )   
    } else {
        return <></>
    }


}

export default function EditIngredients({token, back}){
    let [ingredients, setIngredients] = useState(null);
    let [ingredientFilter, setIngredientFilter] = useState("");
    let [selectedIngredientKey, setSelectedIngredientKey] = useState(null);
   
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
        x.sort((a, b) => {
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
        setIngredients(x);
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
           <Row>
                <Col xs = {6}>
                    <Button onClick = {() => back("welcome")}>Back</Button>
                    <h2>Find an Ingredient</h2>
                    
                    {/*Filter*/}
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
                    {selectedIngredientKey != null && <SingleIngredient ingredientKey = {selectedIngredientKey} loadIngredients={loadIngredients}/>}
                </Col>
            </Row>
        </Container>
    )
}