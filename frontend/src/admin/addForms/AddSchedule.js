import React from 'react';
import {Form} from 'react-bootstrap';

function Day({index, minimized, meals}){
    return (
        <div>
            <h3>{"Day " + (index + 1)}</h3>
            <Form.Group>
                <Form.Label>Meals</Form.Label>
                <Form.Control 
                    type = "text"
                    placeholder = "Between 1 and 6"
                    autoComplete = "off" />
            </Form.Group>
            <Form.Group>
                <Form.Label>Snacks</Form.Label>
                <Form.Control 
                    type = "text"
                    placeholder = "Between 0 and 5"
                    autoComplete = "off" />
            </Form.Group>
            <Form.Group>
                <Form.Label>Breakfast?</Form.Label>
                <Form.Control 
                    type = "checkbox"
                    placeholder = "Between 0 and 5"
                    autoComplete = "off" />
            </Form.Group>

        </div>

    );
}

const Counter = React.memo(({ count, handleIncrement, handleDecrement }) => {
    return (
      <div>
        <button onClick={() => handleDecrement()}>-</button>
        <span>{count}</span>
        <button onClick={() => handleIncrement()}>+</button>
      </div>
    );
  });

export default class AddSchedule extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            days: 7,
            dayArray: [undefined, undefined, undefined, undefined, undefined, undefined, undefined]
        }
    }

    increaseDays = () => {
        if(this.state.days === 7)
            return;
        this.setState({days: this.state.days + 1}, () => {
            this.setState({dayArray: new Array(this.state.days).fill(undefined)});
        });
    }

    decreaseDays = () => {
        if(this.state.days === 1)
            return;
        this.setState({days: this.state.days - 1}, () => {
            this.setState({dayArray: new Array(this.state.days).fill(undefined)});
        });
    }

     handleSubmit = (event) => {
        event.preventDefault(); // Make sure to prevent the default form submission
        // Your form submission logic here
      };

    render(){
        return (
            <Form onSubmit ={this.handleSubmit}>
                <Counter count = {this.state.days} handleDecrement={() => this.decreaseDays()} handleIncrement={() => this.increaseDays()}/>
                {
                    this.state.dayArray.map((key, index) => (
                        <Day key = {index} index = {index} minimized = {this.state.shown === index} meals = {1}/>
                    ))
                }
            </Form>   
        );
    }

}