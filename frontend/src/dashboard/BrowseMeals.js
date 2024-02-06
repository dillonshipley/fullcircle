import React, {Component} from 'react';
import {Button, Container, Row, Col} from 'react-bootstrap';
import NutritionLabel from '../tools/NutritionLabel';

//Frontend meals browser
//CHILD FUNCTIONS:
// 1. Load meals                - runs the foods/mealList route
// 2. addIngredientNutrients    - adds all ingredients together from meal received from the database
// 3. displayMeal               - fetches a meal from the database
export default class BrowseMeals extends React.Component{
    constructor(props){
        super(props);
        this.back = props.back;
        this.state = {
            displayedMeals: [],
            selectedMealName: '',
            selectedIngredients: []
        }
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
        const response = await fetch(process.env.REACT_APP_API_URL + "foods/mealByKey", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(
                    {"mealKey": mealKey}
                )
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

    render(){
        return(
            <Container>
                <Button onClick = {() => this.back("welcome")}>Back</Button>
                <Row>
                    <Col xs = "6">
                        <h1>Meals</h1>
                        {this.state.displayedMeals != null && this.state.displayedMeals.map((meal) => (
                            <div style = {{height: "75px", border: "1px solid black"}} className = "align-items-center" onClick = {() => this.displayMeal(meal.mealKey)}>
                                <h4>{meal.mealName}</h4>
                                <p>{meal.ingredientNames}</p>
                            </div>
                        ))}
                    </Col>
                    <Col xs = "6">
                        {this.state.selectedMealName != null && <h2>{this.state.selectedMealName}</h2>}
                        {this.state.selectedIngredients != null &&
                            this.state.selectedIngredients.map((ingredient) => (
                                <div>{ingredient.amount} {ingredient.portion} {ingredient.name}</div>
                            ))}
                            {this.state.selectedMealNutrients != null && 
                                <NutritionLabel 
                                    nutrients = {this.state.selectedMealNutrients}
                                    amount = {1} 
                                    amountUnit = "serving" 
                                    grams = {100}/>}

                    </Col>
                </Row>
            </Container>
        );
    } 
}