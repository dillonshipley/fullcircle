import React, {Component} from 'react';
import {Form, Button} from 'react-bootstrap';

const FormGroup = ({macro, value, setValue, type}) => {
    const handleInputChange = (event) => {
        const inputValue = event.target.value;

        // Use a regular expression to allow only numeric input
        if ((/^[0-9]*$/.test(inputValue) || inputValue === '') && macro === "Numeric") {
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
            value={value}
            onChange={handleInputChange}
            />
            <Form.Text className="text-muted">Only numeric input is allowed.</Form.Text>
        </Form.Group>
    );
}


export default class IngredientLogger extends Component{
    constructor(props){
        super(props);
        this.state = {
            Name: "",
            Calories: 0,
            Carbohydrates: 0,
            Fats : 0,
            Protein: 0,
            AmountUnit: "",
            Amount: 0
        }
    }

    handleSubmit = (event) => {
        event.preventDefault();
        // Handle submission or any other logic with the numeric value
        console.log(this.state);
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
                    <FormGroup macro = "Name"           value = {this.state.name}       setValue = {this.changeState} type = "Text"/>
                    <FormGroup macro = "Calories"       value = {this.state.cals}       setValue = {this.changeState} type = "Numeric"/>
                    <FormGroup macro = "Carbohydrates"  value = {this.state.carbs}      setValue = {this.changeState} type = "Numeric"/>
                    <FormGroup macro = "Fats"           value = {this.state.fats}       setValue = {this.changeState} type = "Numeric"/>
                    <FormGroup macro = "Protein"        value = {this.state.protein}    setValue = {this.changeState} type = "Numeric"/>
                    <FormGroup macro = "AmountUnit"     value = {this.state.AmountUnit} setValue = {this.changeState} type = "Text"/>
                    <FormGroup macro = "Amount"         value = {this.state.amount}     setValue = {this.changeState} type = "Numeric"/>
            
                <Button variant="primary" type="submit">
                    Submit
                </Button>
                </Form>
            </>
          );
    }

}