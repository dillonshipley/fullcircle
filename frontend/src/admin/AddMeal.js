
import {Form, Button, Container, Row, Col} from 'react-bootstrap';
import { useState, Component } from 'react';
import NutritionLabel from '../tools/NutritionLabel';

function AddIngredient({availableIngredients, setIngredient}){
    const [variableAmount, setVariableAmount] = useState(false);

    const handleChange = (event) => {
        const newValue = event.target.value;
        console.log("works")
        setIngredient(newValue);
    }

    return (
        <div style = {{border: '1px solid black'}}>
            {/*dropdown with all ingredients in the system*/}
            <Form.Group>
                <Form.Label className = "ml-5">Ingredient</Form.Label>
                <Form.Control
                    as="select"
                    onChange= {(e) => handleChange(e)}
                    style={{ width: '80%' }}
                    className = "ml-5"
                >
                    {/* Assuming availableIngredients is an array of available ingredients */}
                    {(availableIngredients != null) && availableIngredients.map((ingredient) => (
                        <option>{ingredient}</option>
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
                        autoComplete="off" />
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
                    autoComplete = "off" />
            </Form.Group>
            <Button>Remove Ingredient</Button>
            <Button>Finalize</Button>
            </div>
    );
}

export default class MealLogger extends Component{

    constructor(props){
        super(props);
        //I need a key/value approach to handle updating names
        this.ingredients = [{key: 1, value: ""}];
        this.state = {
            allIngredients: null
        }
        this.back = props.back;
        
    }

    async componentDidMount() {
        // This code will run after the component has been added to the DOM 
        
        await this.loadIngredients();
    }

    async loadIngredients() {
        console.log("Getting Ingredient List...")
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
        await this.setState({allIngredients: data, ingredientNames: names});
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

    async getIngredient(name){
        const ingredientKey = this.state.allIngredients.find(item => item.ingredientName == name).ingredientKey;
        console.log("Getting Ingredient From ID " + ingredientKey);
        const response = await fetch(process.env.REACT_APP_API_URL + "get/ingredientByKey", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({"ingredientKey": ingredientKey})

        });
        if(!response.ok)
            console.log("Getting ingredient list failed!")

        const data = await response.json();
        const nutrients = Object.entries(data.nutrients)
            .filter(([key, value]) => typeof value === 'number') // Filter out non-numeric values
            .map(([name, amount]) => ({ name, amount }));

        this.setState({ selectedNutrients: nutrients });
    }

    render(){
        return (
            <Container>
                <Button onClick = {() => this.back("welcome")}>Back</Button>
                <h4>Add A Meal</h4>
                <Row>
                    <Col>
                        <Form>
                            <Form.Group>
                                <Form.Label>Meal name</Form.Label>
                                <Form.Control
                                type="text"
                                placeholder={"Name of the meal"}
                                autoComplete="off"
                                />
                            </Form.Group>
                            {/*loop - for x in ingredientCount, display an ingredient*/}
                            {this.ingredients.map((ingredient) => (
                                <AddIngredient 
                                    key={ingredient.key} 
                                    availableIngredients={this.state.ingredientNames}
                                    setIngredient = {(e) => this.getIngredient(e)}
                                />
                            ))}

                            <br></br>
                            <Button onClick = {() => this.addIngredient()}>Add Ingredient</Button>
            
                        </Form>
                    </Col>
                    <Col>
                        <NutritionLabel nutrients={this.state.selectedNutrients}/>
                    </Col>



                </Row>

            </Container>

        );
    }
}