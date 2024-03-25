import {Container, ListGroup, Form, Col, Row} from 'react-bootstrap';
import {useState} from 'react';
import SingleIngredient from './SingleIngredient';

export default function IngredientByAttributes({token, all, reload}){
    let [newAttributeName, setNewAttributeName] = useState(null);
    let [allAttributes, setAllAttributes] = useState(all);

    let [selectedAttribute, setSelectedAttribute] = useState(null)

    let [attributeIngredients, setAttributeIngredients] = useState(null);
    let [ingredientKey, setIngredientKey] = useState(null);

    const loadAttributes = async() => {
        const response = await fetch(process.env.REACT_APP_API_URL + `foods/attributeList`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });
        if(!response.ok){
            throw new Error();
        }

        const x = await response.json();
        setAllAttributes(x);
        setAttributeIngredients(null);
        setIngredientKey(null)
    }

    const ingredientsByAttribute = async(selectedAttributeName) => {
        setSelectedAttribute(selectedAttributeName);
        const attribute = allAttributes.find(item => item.attributeName === selectedAttributeName);

        const response = await fetch(process.env.REACT_APP_API_URL + `foods/ingredientsByAttribute/${attribute.attributeKey}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });
        if(!response.ok){
            throw new Error();
        }

        const x = await response.json();
        console.log(x);
        setAttributeIngredients(x.ingredients);
    }

    const removeAttribute = async(attributeKey) => {
        const response = await fetch(process.env.REACT_APP_API_URL + `foods/deleteAttribute/${attributeKey}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });
        await loadAttributes();
    }

    const addAttribute = async() => {
        const response = await fetch(process.env.REACT_APP_API_URL + "foods/addAttribute", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                "attributeName": newAttributeName
            })
        });
        if(!response.ok){
            console.log("error - response could not be found");
        }
        setNewAttributeName("");
        reload();
        await loadAttributes();
    }

    const changeAttributeName = (event) => {
        setNewAttributeName(event.target.value)
    }

    return (
        <Container fluid>
            <Row>
                <Col xs = {6}>
                    <ListGroup>
                        {allAttributes != null && allAttributes.map((attribute) =>
                            <div key = {attribute.attributeKey}>
                                <div className={"d-flex align-items-center flex-direction-row"}>
                                    <ListGroup.Item style = {{height: "50px", width: "90%"}} onClick = {() => ingredientsByAttribute(attribute.attributeName)}>{attribute.attributeName}</ListGroup.Item>
                                    <img style = {{width: "30px", marginLeft: "10px"}} src={process.env.PUBLIC_URL + "/images/remove.png"} onClick = {(e) => removeAttribute(attribute.attributeKey)}/>
                                </div>
                                {(selectedAttribute == attribute.attributeName && attributeIngredients != null) && (
                                    <ListGroup style = {{marginBottom: "10px"}}>
                                        {attributeIngredients.map((item) => (
                                            <ListGroup.Item
                                                key = {item.ingredientKey} 
                                                style = {{height: "50px", width: "85%", marginLeft: "5%"}} 
                                                onClick = {() => setIngredientKey(item.ingredientKey)}>
                                                {item.ingredientName}
                                            </ListGroup.Item>
                                        ))}

                                    </ListGroup>
                                )}
                            </div>
                        )}
                    </ListGroup>
                    <Form style = {{marginTop: "10px"}}>
                        <div className={"d-flex align-items-center flex-direction-row"}>
                            <Form.Control placeholder={"Add new attribute..."} value = {newAttributeName} onChange={(e) => changeAttributeName(e)} style = {{width: "50%"}}/>
                            <img style = {{width: "30px", marginLeft: "10px"}} src={process.env.PUBLIC_URL + "/images/plus.png"} onClick = {() => addAttribute()}/>
                        </div>

                    </Form>
                </Col>
                <Col xs = {6}>
                    {ingredientKey != null && <SingleIngredient token = {token} ingredientKey = {ingredientKey} loadIngredients={loadAttributes} attributes = {allAttributes}/>}
                </Col>
            </Row>


        </Container>

    );

}