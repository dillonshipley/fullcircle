import React from 'react';
import {Form} from 'react-bootstrap';

function Day({index, minimized, meals, show}){

    if(!minimized){
        return (
            <div>
                <h5>{"Day " + (index + 1)}</h5>
                <p onClick = {() => {console.log("click");show(index)}}> + </p>
            </div> 
        );
    } else {
        return (
            <div>
                <h5>{"Day " + (index + 1)}</h5>
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
            dayArray: [undefined, undefined, undefined, undefined, undefined, undefined, undefined],
            shown: null
        }
        this.daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
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

      setShownDay = (e) => {
        this.setState({shown: e})
      }

      handleSelectChange = (e) => {
        this.setState({firstDay: e});
      }

    render(){
        return (
            <Form onSubmit ={this.handleSubmit}>
                <p>What day do you want to start on?</p>
                    <select id = "dropdown" onChange={() => this.handleSelectChange()}>
                        {
                            this.daysOfWeek.map((day) => (
                                <option key = {day} value = {day} >{day}</option>
                            ))
                        }
                    </select>

                <p>How many days a week do you want to plan for?</p>
                <Counter count = {this.state.days} handleDecrement={() => this.decreaseDays()} handleIncrement={() => this.increaseDays()}/>
                {
                    this.state.dayArray.map((key, index) => (
                        <Day 
                            key = {index} 
                            index = {index} 
                            minimized = {this.state.shown === index} 
                            meals = {1}
                            show = {() => this.setShownDay(index)}
                        />
                    ))
                }
            </Form>   
        );
    }

}