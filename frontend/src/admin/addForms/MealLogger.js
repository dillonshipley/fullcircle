
import {Form, Button} from 'react-bootstrap';
import { useState, Component } from 'react';

function AddIngredient({name, availableIngredients, addIngredient, removeIngredient}){
    const [variableAmount, setVariableAmount] = useState(false);

    return (
        <div style = {{border: "1px solid black"}}>
            {/*dropdown with all ingredients in the system*/}
            <Form.Group>
                <Form.Label>Ingredient</Form.Label>
                <Form.Control
                    as="select"
                    value={name} // Assuming name is the selected ingredient value
                >
                    {/* Assuming availableIngredients is an array of available ingredients */}
                    {availableIngredients.map((ingredient) => (
                        <option key={ingredient.id} value={ingredient.name}>
                            {ingredient.name}
                        </option>
                    ))}
                </Form.Control>
            </Form.Group>
            <Form.Group>
                <Form.Label>Is amount variable?</Form.Label>
                <Form.Control
                    type = "checkbox"
                    onClick = {() => setVariableAmount(!variableAmount)}
                    />
            </Form.Group>
            {!variableAmount &&
                <Form.Group>
                    <Form.Label>Ingredient amount</Form.Label>
                    <Form.Control 
                        type = "text"
                        placeholder = {"Ingredient amount"}
                        autocomplete="off" />
                </Form.Group>
            }
            {variableAmount &&
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
        </div>
    );
}

export default class MealLogger extends Component{

    constructor(props){
        super(props);
        //I need a key/value approach to handle updating names
        this.ingredients = [{key: 1, value: ""}];
        this.allIngredients = null;
        
    }

    componentDidMount() {
        // This code will run after the component has been added to the DOM
        this.loadDataAsync();
    }

    async loadIngredients() {
        const getIngredients = async () => {
            const response = await fetch(process.env.REACT_APP_API_URL + "get/ingredientList", {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            console.log(response.json);
            this.allIngredients = response.json;
        }
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
                    {this.ingredients.map((ingredient) => (
                        <AddIngredient 
                            key={ingredient.key} 
                            name={ingredient.value} 
                            availableIngredients={this.allIngredients}
                            updateName={(e) => this.updateName(e)}
                            removeIngredient={(e) => this.removeIngredient(e)}
                        />
                    ))}

                    <br></br>
                    <Button onClick = {() => this.addIngredient()}>Add Ingredient</Button>
    
                </Form>
            </>

        );
    }
}