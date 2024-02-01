
import {Form, Button, Container, Row, Col} from 'react-bootstrap';
import { useState, Component } from 'react';
import NutritionLabel from '../tools/NutritionLabel';

function MealToIngredient({allIngredients, finalize}){
    const [variableAmount, setVariableAmount] = useState(false);
    const [nutrients, setNutrients] = useState(false); 
    const [allPortions, setAllPortions] = useState(null); 
    const [selectedPortion, setSelectedPortion] = useState(null);
    const [amount, setAmount] = useState(1);

    const [errorMessage, setErrorMessage] = useState("");
    const [selectedIngredientKey, setSelectedIngredientKey] = useState(0);
    const [selectedIngredientName, setSelectedIngredientName] = useState("");
    
    const getIngredient = async(name) => {
        const ingredientKey = allIngredients.find(item => item.ingredientName === name).ingredientKey;
        setSelectedIngredientKey(ingredientKey);
        setSelectedIngredientName(name);
        console.log("Executing get/IngredientByKey API Call with key " + ingredientKey + "...");
        const response = await fetch(process.env.REACT_APP_API_URL + "get/ingredientByKey", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({"ingredientKey": ingredientKey})

        });
        if(!response.ok)
            console.log(`Getting ingredient key ${ingredientKey} failed!`)

        const data = await response.json();
        const nutrients = Object.entries(data.nutrients)
            .filter(([key, value]) => typeof value === 'number') // Filter out non-numeric values
            .map(([name, amount]) => ({ name, amount }));

        setNutrients(nutrients);
        setAllPortions(data.portions);
        setSelectedPortion(null);
    }

    const changeIngredient = (event) => {
        const newValue = event.target.value;
        getIngredient(newValue);
    }

    const changePortion = (event) => {
        let newValue = event.target.value;
        newValue = allPortions.find(item => item.name === newValue);
        setSelectedPortion(newValue);
    }

    const changeAmount = (event) => {
        let newValue = event.target.value;
        setAmount(newValue);
    }

    const submitIngredient = () => {
        if(amount === 0){
            setErrorMessage("Amount is 0!");
            return;
        } else if(selectedPortion === ""){
            setErrorMessage("Portion not selected!");
            return;
        } else if (selectedIngredientKey === 0 || selectedIngredientKey === null){
            setErrorMessage("Ingredient not selected!");
        } else {
            const data = {
                "ingredientKey": selectedIngredientKey,
                "name": selectedIngredientName,
                "portion": selectedPortion,
                "amount": amount
            }
            finalize(data);
        }
    }

    return (
        <Row>
            <Col>
                <div style = {{border: '1px solid black'}}>
                    {/*dropdown with all ingredients in the system*/}
                    <Form.Group>
                        <Form.Label className = "ml-5">Ingredient</Form.Label>
                        <Form.Control
                        as="select"
                        onChange= {(e) => changeIngredient(e)}
                        style={{ width: '80%' }}
                        className = "ml-5"
                        >
                            <option value = ""></option>
                            {/* Assuming availableIngredients is an array of available ingredients */}
                            {(allIngredients != null) && allIngredients.map((ingredient, index) => (
                                <option key = {index}>{ingredient.ingredientName}</option>
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
                    {!variableAmount &&
                    <Form.Group>
                        <Form.Label className = "ml-5">Ingredient amount</Form.Label>
                        <Form.Control
                        type = "text"
                        placeholder = "Enter an amount"
                        value = {amount}
                        onChange = {changeAmount}
                        style={{ width: '80%' }}
                        className = "ml-5"
                        autoComplete = "off" />
                    </Form.Group>

                    }
                    <Form.Group>
                        <Form.Label className = "ml-5 pt-3">Ingredient amount unit</Form.Label>
                        <Form.Control
                            as="select"
                            onChange= {(e) => changePortion(e)}
                            value = {selectedPortion?.name ?? ""}
                            style={{ width: '80%' }}
                            className = "ml-5"
                        >
                            <option value = ""></option>
                            {/* Assuming availableIngredients is an array of available ingredients */}
                            {(allPortions != null) && allPortions.map((x, index) => (
                                <option key = {index} value = {x.name}>{x.name + " (" + x.grams + "g)"}</option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                    <Button>Remove Ingredient</Button>
                 <Button onClick = {() => submitIngredient()}>Finalize</Button>
                 <p>{errorMessage}</p>
                </div>
            </Col>
            <Col>
                {(selectedPortion != null && nutrients != null) && <NutritionLabel nutrients = {nutrients} amount = {selectedPortion.name} grams = {selectedPortion.grams * amount}/>}
            </Col>
        </Row>

    );
}

export default class MealLogger extends Component{

    constructor(props){
        super(props);
        //I need a key/value approach to handle updating names
        this.state = {
            ingredients: [],
            openIngredient: true,
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



    setIngredient(data){
        console.log(data);
        let ingredients = this.state.ingredients;
        ingredients.push(data);
        this.setState({
            ingredients: ingredients,
            openIngredient: false
        });
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
                            <div>{item.name} {item.amount}</div>
                        )}
                        {/*loop - for x in ingredientCount, display an ingredient*/}
                        {this.state.openIngredient &&
                            <MealToIngredient  
                                allIngredients={this.state.allIngredients}
                                finalize = {(data) => this.setIngredient(data)}
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