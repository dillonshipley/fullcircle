import React, {Component} from 'react';
import {Button, Container, Row, Col, ListGroup} from 'react-bootstrap';
import SingleMeal from './SingleMeal.js';

//Frontend meals browser
//CHILD FUNCTIONS:
// 1. Load meals                - runs the foods/mealList route
// 2. addIngredientNutrients    - adds all ingredients together from meal received from the database
// 3. displayMeal               - fetches a meal from the database
export default class BrowseMeals extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            displayedMeals: [],
            selectedMealName: null,
            selectedIngredients: [],
            token: props.token
        }
    }

    printArrayLimited(array, limit) {
        let output = '';
        for (let i = 0; i < Math.min(array.length, limit); i++) {
            output += array[i];
            if (i < Math.min(array.length, limit) - 1) {
                output += ', ';
            }
        }
        return output;
    }
    
    async loadMeals() {
        const response = await fetch(process.env.REACT_APP_API_URL + "foods/mealList", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        let mealList = Array.from(await response.json());
        this.setState({displayedMeals: mealList})
        console.log(mealList);
    }

    componentDidMount(){
        const res = this.loadMeals();
        
    }

    addIngredientNutrients(array) {
        const result = {};
    
        // Iterate over each object in the array
        for(let z of array){
            for(let key in z){
                const value = parseFloat(z[key]);
        
                // If the property doesn't exist in the result, create it
                if (!result.hasOwnProperty(key)) {
                    result[key] = value;
                } else {
                    // Otherwise, add the value to the existing property
                    result[key] += value;
                }
            }
        }

        return result;
    }

    async displayMeal(mealKey){
        console.log("meal name" + mealKey);
        const response = await fetch(process.env.REACT_APP_API_URL + `foods/mealByKey/${mealKey}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.state.token}`
            },
        });
        if(!response.ok){
            console.log("foods/mealByKey call unsuccessful");
        } else{
            const data = await response.json();
            console.log(data);
    
            if(data.ingredients == null){
                console.log("Error - no ingredients included in ")
                return;
            }

            const ingredientNutrients = [];
            for(let x of data.ingredients){
                if(x.nutrients == null){
                    console.log("Error - nutrients does not exist!")
                    return;
                }
                ingredientNutrients.push(x.nutrients);
            }

            const mealNutrients = this.addIngredientNutrients(ingredientNutrients);
            const nutrients = Object.entries(mealNutrients)
                .filter(([key, value]) => typeof value === 'number') // Filter out non-numeric values
                .map(([name, amount]) => ({ name, amount }));
            this.setState({
                selectedMealName: data.name,
                selectedIngredients: data.ingredients,
                selectedMealNutrients: nutrients
            })
        }
    };

    async AddMealToPlan(){
        
        return;
    }


    render(){
        return(
            <Container fluid>
                <Row>
                    <Col xs = "4">
                        <ListGroup>
                            {this.state.displayedMeals != null && this.state.displayedMeals.map((meal) => (
                                <ListGroup.Item style = {{height: "75px", border: "1px solid black"}} className = "align-items-center" onClick = {() => this.displayMeal(meal.mealKey)}>
                                    <h6>{meal.mealName}</h6>
                                    <p>{this.printArrayLimited(meal.ingredientNames, 3)}</p>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>

                    </Col>
                    <Col xs = "8">
                        {(this.state.selectedMealName != null &&
                            this.state.selectedMealNutrients != null &&
                            this.state.selectedIngredients != null) && (
                                <SingleMeal 
                                    name={this.state.selectedMealName} 
                                    ingredients={this.state.selectedIngredients}
                                     nutrients = {this.state.selectedMealNutrients}/>
                            )}

                    </Col>
                </Row>
            </Container>
        );
    } 
}