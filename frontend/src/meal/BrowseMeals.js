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

            this.setState({
                selectedMealName: data.name,
                selectedIngredients: data.ingredients,
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
                    <Col xs = "4" style = {{marginTop: "30px"}}>
                        <ListGroup>
                            {this.state.displayedMeals != null && this.state.displayedMeals.map((meal) => (
                                <ListGroup.Item style = {{height: "75px", border: "1px solid black"}} className = "align-items-center" onClick = {() => this.displayMeal(meal.mealKey)}>
                                    <h6>{meal.mealName} {meal.defaultServings}</h6>
                                    <p>{this.printArrayLimited(meal.ingredientNames, 3)}</p>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>

                    </Col>
                    <Col xs = "8">
                        {(this.state.selectedMealName != null &&
                            this.state.selectedIngredients != null) && (
                                <SingleMeal
                                    token = {this.state.token}
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