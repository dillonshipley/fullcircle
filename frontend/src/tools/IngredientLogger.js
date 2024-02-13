import React, {Component} from 'react';
import {Form, Button} from 'react-bootstrap';

const FormGroup = ({macro, val, setValue, type}) => {
    const handleInputChange = (event) => {
        const inputValue = event.target.val;

        // Use a regular expression to allow only numeric input
        if ((/^[0-9]*$/.test(inputValue) || inputValue === '') && type === "Numeric") {
            setValue(macro, inputValue);
        } else if (type === "Text"){
            console.log("Works");
            setValue(macro, inputValue)
        }
            
    };

    return (
        <Form.Group controlId="calsInput">
            <Form.Label>{macro + ":"}</Form.Label>
            <Form.Control
            type="text"
            placeholder={"Enter the ingredient's " + macro}
            value={val}
            onChange={handleInputChange}
            autoComplete="off"
            />
            {type === "Numeric" && <Form.Text className="text-muted">Only numeric input is allowed.</Form.Text>}
        </Form.Group>
    );
}


export default class IngredientLogger extends Component{
    constructor(props){
        super(props);
        this.state = {
            Name: "",
            Calories: "",
            Carbohydrates: "",
            Fats : "",
            Protein: "",
            AmountUnit: "",
            Amount: "",
            error: ""
        }
    }

    checkNumeric = (value) => {
        return isNaN(parseFloat(value));
    }

    checkNonEmpty = (value) => {
        return value === "";
    }

    handleSubmit = async (event) => {
        console.log("works");

        //Initially set the error state to null
        this.changeState("error", "");
        
        //Error checking - check that strings are not empty, numeric fields are numeric
        if(this.checkNonEmpty(this.state.Name)) this.changeState("error", "Name");;
        if(this.checkNonEmpty(this.state.Calories)      || this.checkNumeric(this.state.Calories)) this.changeState("error", "Calories");
        if(this.checkNonEmpty(this.state.Protein)       || this.checkNumeric(this.state.Protein)) this.changeState("error", "Protein");
        if(this.checkNonEmpty(this.state.Carbohydrates) || this.checkNumeric(this.state.Carbohydrates)) this.changeState("error", "Carbohydrates");
        if(this.checkNonEmpty(this.state.Fats)          || this.checkNumeric(this.state.Fats)) this.changeState("error", "Fats");
        if(this.checkNonEmpty(this.state.Amount)        || this.checkNumeric(this.state.Amount)) this.changeState("error", "Amount");
        if(this.checkNonEmpty(this.state.AmountUnit)) this.changeState("error", "Amount Unit");

        let ingredient = JSON.stringify({
            'ingredientName':   this.state.Name,
            'cals':             parseInt(this.state.Calories),
            'protein':          parseInt(this.state.Protein),
            'carbs':            parseInt(this.state.Carbohydrates),
            'fats':             parseInt(this.state.Fats),
            'amount':           parseInt(this.state.Amount),
            'amountUnit':       this.state.AmountUnit
        });

        const response = await fetch(process.env.REACT_APP_API_URL + "foods/ingredient", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: ingredient
        });
        console.log(response);

    };

    changeState = (key, value) => {
        this.setState({
            [`${key}`]: value
        });
    }

    render(){
        return (
            <>
                <h4>Add An Ingredient</h4>
                <Form onSubmit={this.handleSubmit}>
                    <FormGroup macro = "Name"           val = {this.state.name}       setValue = {this.changeState} type = "Text"/>
                    <FormGroup macro = "Calories"       val = {this.state.cals}       setValue = {this.changeState} type = "Numeric"/>
                    <FormGroup macro = "Carbohydrates"  val = {this.state.carbs}      setValue = {this.changeState} type = "Numeric"/>
                    <FormGroup macro = "Fats"           val = {this.state.fats}       setValue = {this.changeState} type = "Numeric"/>
                    <FormGroup macro = "Protein"        val = {this.state.protein}    setValue = {this.changeState} type = "Numeric"/>
                    <FormGroup macro = "AmountUnit"     val = {this.state.AmountUnit} setValue = {this.changeState} type = "Text"/>
                    <FormGroup macro = "Amount"         val = {this.state.amount}     setValue = {this.changeState} type = "Numeric"/>
            
                <Button variant="primary" type="submit" onClick = {async () => this.handleSubmit()}>
                    Submit
                </Button>
                {this.state.error != "" && <p style={{color: "red"}}>There is an error with the {this.state.error} input. Please correct it and try again.</p>}
                </Form>
            </>
          );
    }

}