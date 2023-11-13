import { useState } from "react";
import {Form, Button} from 'react-bootstrap';

const FormGroup = ({macro, value, setValue}) => {
    const handleInputChange = (event) => {
        const inputValue = event.target.value;

        // Use a regular expression to allow only numeric input
        if (/^[0-9]*$/.test(inputValue) || inputValue === '') {
        setValue(inputValue);
        }
    };


    return (
        <Form.Group controlId="calsInput">
            <Form.Label>{macro + ":"}</Form.Label>
            <Form.Control
            type="text"
            placeholder={"Enter the ingredient's " + macro + "s"}
            value={value}
            onChange={handleInputChange}
            />
            <Form.Text className="text-muted">Only numeric input is allowed.</Form.Text>
        </Form.Group>
    );
}


export default class IngredientLogger{
    constructor(props){
        this.state = {
            cals: 0,
            carbs: 0,
            fats : 0,
            protein: 0,
            amountUnit: "",
            amount: 0
        }
    }

    handleSubmit = (event) => {
        event.preventDefault();
        // Handle submission or any other logic with the numeric value
        console.log(cals);
    };

    changeState(macro, value){
        this.setState({})
    }

    render(){
        return (
            <Form onSubmit={handleSubmit}>
                <FormGroup macro = "Calories"       value = {this.state.cals} setValue = {setCals} />
                <FormGroup macro = "Carbohydrates"  value = {this.state.carbs} setValue = {setCarbs} />
                <FormGroup macro = "Fats"           value = {this.state.fats} setValue = {setFats} />
                <FormGroup macro = "Protein"        value = {this.state.protein} setValue = {setProtein} />
                <FormGroup macro = "Amount Unit"    value = {this.state.protein} setValue = {setProtein} />
    
        
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
          );
    }

}