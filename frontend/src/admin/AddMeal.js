
import {Form, Button, Container, Row, Col} from 'react-bootstrap';
import { useState, Component } from 'react';


import MealToIngredient from './MealToIngredient';

export default class MealLogger extends Component{

    constructor(props){
        super(props);
        //I need a key/value approach to handle updating names
        this.state = {
            ingredients: [],
            openIngredient: true,
            openIngredient: "null",
            allIngredients: null
        }
        this.back = props.back;
        
    }

    async componentDidMount() {
        // This code will run after the component has been added to the DOM 
        await this.loadIngredients();
    }

    async loadIngredients() {
        console.log("Executing get/ingredientList API Call...")
        const response = await fetch(process.env.REACT_APP_API_URL + "get/ingredientList", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if(!response.ok)
            console.log("Getting ingredient list failed!")
        let data = await response.json();
        const names = data.map(item => item.ingredientName);
        names.sort();
        this.setState({allIngredients: data, ingredientNames: names});
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

    updateName({key, name}){

    }

    removeIngredient({key}){
        //remove the ingredient with the specified key from the list of ingredients
        // re render display?

    }

    displayInfo(){
        console.log(this.state.ingredients);
    }

    mealIngredient = (item) => {
        return(
            <Container style ={{border: "1px solid black", borderRadius: "5px", width: "50%", height: "50px"}} className="pb-5 d-flex flex-direction-row">
                <p style={{fontSize: "20px"}}>{item.amount + " " + item.name + "\t " + item.portion.name + " (" + item.portion.grams + "g)"}</p>
                {!this.state.openIngredient && <Button style ={{height: "50px", width: "100px"}} onClick={() => this.setOpenIngredient(item.ingredientKey)}>Edit</Button>}
            </Container>
        )
    }

    render(){
        return (
            <Container>
                <Button onClick = {() => this.back("welcome")}>Back</Button>
                <h4>Add A Meal</h4>
                <Form>
                    <Form.Group>
                                    <Form.Label>Meal name</Form.Label>
                                    <Form.Control
                                    type="text"
                                    placeholder={"Name of the meal"}
                                    autoComplete="off"
                                    />
                                </Form.Group>
                    <Container className = "pt-5">
                        {this.state.ingredients != null && this.state.ingredients.map((item) => 
                           this.mealIngredient(item)
                        )}
                        {/*loop - for x in ingredientCount, display an ingredient*/}
                        {this.state.openIngredient &&
                            <MealToIngredient  
                                allIngredients={this.state.allIngredients}
                                finalize = {(data) => this.addIngredient(data)}
                                editIngredient={this.state.openIngredient}
                            />
                        }

                        <br></br>

                    </Container>
                    <Button onClick = {() => this.displayInfo()}>display state info</Button>
                    {!this.state.openIngredient && <Button onClick = {() => this.setState({openIngredient: true})}>Add Ingredient</Button>}
                </Form>
            </Container>

        );
    }
}