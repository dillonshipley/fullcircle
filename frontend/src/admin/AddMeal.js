
import {Form, Button, Container, Row, Col} from 'react-bootstrap';
import { useState, Component } from 'react';


import MealToIngredient from './MealToIngredient';

export default class MealLogger extends Component{

    constructor(props){
        super(props);
        //I need a key/value approach to handle updating names
        this.state = {
            mealName: '',
            ingredients: [],
            openIngredient: true,
            openIngredient: "null",
            allIngredients: null,
            token: props.token,
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

    mealIngredient = (item) => {
        console.log(item.portion);
        return(
            <Container style ={{border: "1px solid black", borderRadius: "5px", width: "70%", height: "50px"}} className="pb-5 d-flex flex-direction-row">
                <p style={{fontSize: "20px"}}>{item.amount + " " + item.name + "\t " + item.portion.name + " (" + item.portion.grams + "g)"}</p>
                {!this.state.openIngredient && <Button style ={{height: "50px", width: "100px"}} onClick={() => this.setOpenIngredient(item.ingredientKey)}>Edit</Button>}
                <Button style={{ height: "50px", width: "100px" }} onClick={() => this.removeIngredient(item.ingredientKey)}>Remove</Button>            
            </Container>
        )
    }

    changeName = (event) => {
        this.setState({ mealName: event.target.value });
    }

    submitMeal = async () => {
        let updatedIngredients = [...this.state.ingredients];
        for(let i = 0; i < updatedIngredients.length; i++){
            updatedIngredients[i].portion = updatedIngredients[i].portion.portionKey;
        }
        const meal = JSON.stringify({
            "ingredients": updatedIngredients,
            "name": this.state.mealName, 
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
            <Container>
                <Button onClick = {() => this.back("welcome")}>Back</Button>
                <h4>Add A Meal</h4>
                <Form>
                    <Form.Group>
                        <Form.Label>Meal name</Form.Label>
                        <Form.Control
                            type="text"
                            value={this.state.mealName}
                            onChange = {this.changeName}
                            placeholder={"Name of the meal"}
                            autoComplete="off"
                        />
                    </Form.Group>
                    <Container className = "pt-5">
                        {this.state.ingredients !== null && this.state.ingredients.map((item) => 
                           this.mealIngredient(item)
                        )}
                        {/*loop - for x in ingredientCount, display an ingredient*/}
                        {this.state.openIngredient &&
                            <MealToIngredient
                                token = {this.state.token}  
                                allIngredients={this.state.allIngredients}
                                finalize = {(data) => this.addIngredient(data)}
                                editIngredient={this.state.openIngredient}
                            />
                        }

                        <br></br>

                    </Container>
                    {!this.state.openIngredient && <Button onClick = {() => this.setState({openIngredient: true})}>Add Ingredient</Button>}
                    {this.state.ingredients.length > 0 && <Button onClick = {() => this.submitMeal()}>Add Meal</Button>}
                </Form>
            </Container>

        );
    }
}