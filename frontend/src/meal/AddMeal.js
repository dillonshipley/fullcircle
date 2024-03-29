
import {Form, Button, Container, Row, Col, ListGroup} from 'react-bootstrap';
import { useState, Component } from 'react';


import MealToIngredient from './MealToIngredient';

export default class MealLogger extends Component{

    constructor(props){
        super(props);
        //I need a key/value approach to handle updating names
        this.state = {
            mealName: '',
            ingredients: [],
            openIngredient: false,
            openIngredient: null,
            allIngredients: null,
            token: props.token,
            defaultServings: 0
        }
        this.back = props.back;
        
    }

    async componentDidMount() {
        // This code will run after the component has been added to the DOM 
        await this.loadIngredients();
    }

    async loadIngredients() {
        console.log("Executing get/ingredientList API Call...")
        const response = await fetch(process.env.REACT_APP_API_URL + "foods/ingredientList", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if(!response.ok)
            console.log("Getting ingredient list failed!")
        let data = await response.json();
        const names = data.ingredients.map(item => item.ingredientName);
        console.log(names);
        names.sort();
        console.log(names);
        this.setState({allIngredients: data.ingredients, ingredientNames: names});
    }



    addIngredient(data){
        console.log(data);
        let ingredients = this.state.ingredients;
        ingredients.push(data);
        this.setState({
            ingredients: ingredients,
            openIngredient: false,
            openIngredientKey: "null"
        });
    }

    setOpenIngredient(ingredientKey){
        const updatedIngredients = [...this.state.ingredients];
        const openIngredient = updatedIngredients.find(ingredient => ingredient.ingredientKey === ingredientKey);
        const indexToRemove = updatedIngredients.findIndex(ingredient => ingredient.ingredientKey === ingredientKey);
        if (indexToRemove !== -1) 
            updatedIngredients.splice(indexToRemove, 1); // Remove 1 element at indexToRemove

        this.setState({ ingredients: updatedIngredients, openIngredient: true, openIngredient: openIngredient});// Update the state with the modified array
    }

    removeIngredient(ingredientKey){
        let updatedIngredients = [...this.state.ingredients];
        console.log(ingredientKey);
        updatedIngredients = updatedIngredients.filter(obj => obj.ingredientKey != ingredientKey);
        console.log(updatedIngredients);
        this.setState({ingredients: updatedIngredients});
    }

    displayInfo(){
        console.log(this.state.ingredients);
    }
    changeState = (key, event) => {
        this.setState({ [key]: event.target.value });
    }

    submitMeal = async () => {
        let updatedIngredients = [...this.state.ingredients];
        for(let i = 0; i < updatedIngredients.length; i++){
            updatedIngredients[i].portion = updatedIngredients[i].portion.portionKey;
        }
        const meal = JSON.stringify({
            "ingredients": updatedIngredients,
            "name": this.state.mealName, 
            "defaultServings": this.state.defaultServings,
            "type": ''
        })
        console.log(meal);
        console.log(updatedIngredients);
        const response = await fetch(process.env.REACT_APP_API_URL + "foods/addMeal", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.state.token}`
            },
            body: meal
        });
        this.setState({
            mealName: '',
            ingredients: [],
            openIngredient: true,
            openIngredient: "null",
        });
    }

    render(){
        return (
            <Container fluid>
                <h4 style = {{marginTop: "20px"}}>Add A Meal</h4>
                <Form>
                    <Row>
                        <Col xs={8}>
                            <Form.Group>
                                <Form.Label>Meal name</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={this.state.mealName}
                                    onChange = {(e) => this.changeState("mealName", e)}
                                    placeholder={"Name of the meal"}
                                    autoComplete="off"
                                />
                                </Form.Group>
                        </Col>
                        <Col xs = {4}>
                            <Form.Group>
                                <Form.Label>Default servings</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={this.state.defaultServings}
                                    onChange = {(e) => this.changeState("defaultServings", e)}
                                    placeholder={"Servings"}
                                    autoComplete="off"
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    
                    <Container className = "pt-5" fluid>
                        <Row>
                            <Col xs = {4}>
                                <ListGroup>
                                    {this.state.ingredients !== null && this.state.ingredients.map((item) =>
                                        <div className = "flex d-flex flex-direction-row alight-items-center">
                                            <ListGroup.Item  style = {{width: "60%"}}>
                                                <p style={{fontSize: "20px"}}>{item.amount + " " + item.name + "\t " + item.portion.name + " (" + item.portion.grams + "g)"}</p>
                                            </ListGroup.Item>
                                            {!this.state.openIngredient && <img style = {{height: "30px", marginLeft: "10px", float: "right"}} src={process.env.PUBLIC_URL + "/images/edit.png"} onClick={() => this.setOpenIngredient(item.ingredientKey)}/>}
                                            <img style = {{height: "30px", marginLeft: "10px"}} src={process.env.PUBLIC_URL + "/images/remove.png"} onClick={() => this.removeIngredient(item.ingredientKey)}/>
                                        </div> 

                                    )}
                                </ListGroup>
                            </Col>
                            <Col xs = {8}>
                                {this.state.openIngredient &&
                                    <MealToIngredient
                                        token = {this.state.token}  
                                        allIngredients={this.state.allIngredients}
                                        finalize = {(data) => this.addIngredient(data)}
                                        editIngredient={this.state.openIngredient}
                                        close = {() => this.setState({openIngredient: false})}
                                    />
                                }
                            </Col>
                        </Row>

                        {/*loop - for x in ingredientCount, display an ingredient*/}


                        <br></br>

                    </Container>
                    {!this.state.openIngredient && <Button onClick = {() => this.setState({openIngredient: true})}>Add Ingredient</Button>}
                    {this.state.ingredients.length > 0 && <Button onClick = {() => this.submitMeal()}>Add Meal</Button>}
                </Form>
            </Container>

        );
    }
}