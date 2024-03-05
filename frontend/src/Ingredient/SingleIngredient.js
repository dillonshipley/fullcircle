import {Container, Row, Form, FormControl, Col, Button, InputGroup, ListGroup, Tabs, Tab} from 'react-bootstrap';
import NutritionLabel from '../tools/NutritionLabel';
import {useState, useEffect} from 'react';

export default function SingleIngredient({token, ingredientKey, loadIngredients, attributes}){
    let [portionsData, setPortionsData] = useState(null);
    let [selectedIngredientName, setSelectedIngredientName] = useState(null);
    let [selectedIngredient, setSelectedIngredient] = useState(null);
    let [openPortion, setOpenPortion] = useState(false);
    
    let [openPortionName, setOpenPortionName] = useState(false);
    let [openPortionGrams, setOpenPortionGrams] = useState(false);

    let [attributeData, setAttributeData] = useState(null);
    let [openAttribute, setOpenAttribute] = useState(false);
    let [selectedAttribute, setSelectedAttribute] = useState(false);
    
    const changeIngredientName = (event) => {
        let newValue = event.target.value;
        setSelectedIngredientName(newValue);
    }

    const removePortion = (portionKey) => {
        console.log(portionsData);
        let updatedPortions = portionsData.filter(item => item.portionKey !== portionKey)
        setPortionsData(updatedPortions);
    }

    const removeAttribute = (attributeKey) => {
        let updatedAttributes = attributeData.filter(item => item.attributeKey !== attributeKey)
        setAttributeData(updatedAttributes);
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
                'Authorization': `Bearer ${token}`
            },
        });
        if(!response.ok)
            console.log(`Getting ingredient key ${ingredientKey} failed!`)

        const x = await response.json();
        console.log(x);
        if(!"nutrients" in x){
            console.log("error!")
        } else {
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

    }

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
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({"portions": portionsData, "updatedName": selectedIngredientName, "ingredientKey": ingredientKey, "attributes": attributeData})

        });
        if (!response.ok) {
            console.log("Error:", response.status, response.statusText);
        } else {
            console.log("Request successful");
        }
        loadIngredients();
    }

    const handleChange = (event, setStateFunction) => {
        setStateFunction(event.target.value);
    }

    const addPortionData = () => {
        if(openPortionName === "" || openPortionGrams === 0)
            return;
        
        const updatedPortions = portionsData;
        updatedPortions.push({"name": openPortionName, "grams": openPortionGrams, "portionKey": `${portionsData.length + 1}`});
        setPortionsData(updatedPortions);
        setOpenPortion(false);
    }

    const addAttribute = () => {
        if(selectedAttribute === "")
            return;

        let attribute = attributes.find(item => item.attributeName === selectedAttribute);

        const updatedAttributes = attributeData ?? [];
        updatedAttributes.push(attribute);
        setAttributeData(updatedAttributes);
        setOpenAttribute(false);
        setSelectedAttribute("");
    }

    if(selectedIngredient != null){
        return (
            <Container fluid>
                <Form onSubmit = {updateIngredient}>
                    <Row>
                        {selectedIngredient != null && <Form.Control onChange = {changeIngredientName} value = {selectedIngredientName} placeholder = {selectedIngredient.ingredient.ingredientName} />}
                    </Row>
                    <Row>
                        <Col xs = {6}>
                            <h2 style = {{marginTop: "10px"}}>Nutrition</h2>
                            <NutritionLabel 
                            nutrients = {selectedIngredient.nutrients}
                            amount = {1} 
                            amountUnit = "serving" 
                            grams = {100}/>
                        </Col>
                        <Col xs = {6}>
                            <Row>
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
                                        <Form.Control placeholder={"Add new portion..."} onChange={(e) => handleChange(e, setOpenPortionName)} style = {{width: "50%"}}/>
                                        <Form.Control placeholder = {"g"} onChange={(e) => handleChange(e, setOpenPortionGrams)} style = {{width: "10%"}} />
                                        <img style = {{width: "5%", marginLeft: "10px"}} src={process.env.PUBLIC_URL + "/images/remove.png"} onClick = {(e) => setOpenPortion(false)}/>
                                        <img style = {{width: "5%", marginLeft: "10px"}} src={process.env.PUBLIC_URL + "/images/plus.png"} onClick = {() => addPortionData()}/>
                                    </div>
                                )}
                            </Row>
                            <Row className = "mt-5">
                                <Col style = {{paddingLeft: 0}}>

                                <h2 className ="mb5">Attributes</h2>
                                {attributeData != null && attributeData.map((attribute, index) => (

                                    <div className={"d-flex align-items-center flex-direction-row"}>
                                        <Form.Control name = {attribute.attributeKey} value = {attributeData[index].name}placeholder={attribute.attributeName} onChange={portionChange} style = {{width: "50%"}}/>
                                        <img style = {{width: "5%", marginLeft: "10px"}} src={process.env.PUBLIC_URL + "/images/remove.png"} onClick = {(e) => removeAttribute(attribute.attributeKey)}/>
                                    </div>
                                ))}
                                {(!openAttribute) && (
                                    <div>
                                        <Button onClick = {() => setOpenAttribute(true)}>Add New Attribute</Button>
                                    </div>
                                    
                                )}
                                {openAttribute && (
                                    <div className={"d-flex align-items-center flex-direction-row"}>
                                       <Form.Control
                                            as="select"
                                            onChange= {(e) => handleChange(e, setSelectedAttribute)}
                                            value = {selectedAttribute}
                                            style={{ width: '50%' }}
                                            >
                                                <option value = ""></option>
                                                {/* Assuming availableIngredients is an array of available attributes */}
                                                {(attributes != null) && attributes.map((attribute, index) => (
                                                    <option key = {index}>{attribute.attributeName}</option>
                                                ))}
                                            </Form.Control>
                                        <img style = {{width: "5%", marginLeft: "10px"}} src={process.env.PUBLIC_URL + "/images/remove.png"} onClick = {(e) => setOpenAttribute(false)}/>
                                        <img style = {{width: "5%", marginLeft: "10px"}} src={process.env.PUBLIC_URL + "/images/plus.png"} onClick = {() => addAttribute()}/>
                                    </div>
                                )}
                                </Col>  
                            </Row>
                            <Row className = "mt-5">
                                <Button style = {{marginLeft: 0}} type = "submit">Submit</Button>
                            </Row>
                        </Col>

                    </Row>

                </Form>
            </Container>
        )   
    } else {
        return <></>
    }


}
