import {Container, ListGroup, Form} from 'react-bootstrap';
import {useState} from 'react';

export default function IngredientByAttributes({token, all, reload}){
    let [newAttributeName, setNewAttributeName] = useState(null);
    let [allAttributes, setAllAttributes] = useState(all);

    let [selectedAttribute, setSelectedAttribute] = useState(null)

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
                <ListGroup>
                {allAttributes != null && allAttributes.map((attribute) =>
                    <div>
                        <div className={"d-flex align-items-center flex-direction-row"}>
                            <ListGroup.Item style = {{height: "50px", width: "50%"}} onClick = {() => setSelectedAttribute(attribute.attributeName)}>{attribute.attributeName}</ListGroup.Item>
                            <img style = {{width: "30px", marginLeft: "10px"}} src={process.env.PUBLIC_URL + "/images/remove.png"} onClick = {(e) => removeAttribute(attribute.attributeKey)}/>
                        </div>
                        {selectedAttribute == attribute.attributeName && (
                            <div> Hi </div>
                        )}
                    </div>
                )}
            </ListGroup>
            <Form>
                <div className={"d-flex align-items-center flex-direction-row"}>
                    <Form.Control placeholder={"Add new attribute..."} value = {newAttributeName} onChange={(e) => changeAttributeName(e)} style = {{width: "50%"}}/>
                    <img style = {{width: "30px", marginLeft: "10px"}} src={process.env.PUBLIC_URL + "/images/plus.png"} onClick = {() => addAttribute()}/>
                </div>

            </Form>
        </Container>

    );

}