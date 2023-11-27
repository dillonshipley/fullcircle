import {Form, Button} from 'react-bootstrap';
import { useState } from 'react';

function AddIngredient({name, addIngredient, removeIngredient}){
    const [variableAmount, setVariableAmount] = useState(false);

    return (
        <>
            {/*dropdown with all ingredients in the system*/}
            <Form.Group>
                <Form.Label>Ingredient</Form.Label>
                <Form.Control 
                    type = "text"
                    placeholder = {"Ingredient"}
                    autocomplete="off" />
            </Form.Group>
            <Form.Group>
                <Form.Label>Is amount variable?</Form.Label>
                <Form.Control
                    type = "checkbox"
                    onClick = {() => setVariableAmount(!variableAmount)}
                    />
            </Form.Group>
            {variableAmount &&
                <Form.Group>
                    <Form.Label>Ingredient amount</Form.Label>
                    <Form.Control 
                        type = "text"
                        placeholder = {"Ingredient amount"}
                        autocomplete="off" />
                </Form.Group>
            }
            {!variableAmount &&
                <Form.Group>
                    <Form.Label>Ingredient amount</Form.Label>
                    <Form.Control
                        type = "text"
                        placeholder = "From"
                        autoComplete = "off" />
                    <Form.Control
                        type = "text"
                        placeholder = "To"
                        autoComplete = "off" />

                </Form.Group>

            }
            <Form.Group>
                <Form.Label>Ingredient amount unit</Form.Label>
                <Form.Control 
                    type = "text"
                    placeholder = "oz, cup, tbsp, etc;"
                    autocomplete = "off" />
            </Form.Group>
            <Button>Remove Ingredient</Button>
        </>
    );
}

export default class MealLogger {

    constructor(props){
        //I need a key/value approach to handle updating names
        this.ingredients = [{key: 1, value: ""}];
    }

    addIngredient(){
        //if there exists an ingredient with a blank name, don't add and instead prompt user to fill out the blank one instead
        //find the highest key, increment by one

    }

    updateName({key, name}){

    }

    removeIngredient({key}){
        //remove the ingredient with the specified key from the list of ingredients
        // re render display?
    }

    render(){
        return (
            <>
                <h4>Add A Meal</h4>
                <Form>
                    <Form.Group>
                        <Form.Label>Meal name</Form.Label>
                        <Form.Control
                        type="text"
                        placeholder={"Name of the meal"}
                        autocomplete="off"
                        />
                    </Form.Group>
                    {/*loop - for x in ingredientCount, display an ingredient*/}
                    {this.ingredients.map((ingredient) => {
                        <AddIngredient 
                            key = {ingredient.key} 
                            name = {ingredient.value} 
                            updateName = {(e) => this.updateName(e)}
                            removeIngredient = {(e) => this.removeIngredient(e)}/> 
                    })}
                    <br></br>
                    <Button onClick = {() => this.addIngredient()}>Add Ingredient</Button>
    
                </Form>
            </>
        );
    }
}