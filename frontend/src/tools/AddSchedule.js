import React, {useState} from 'react';
import {Container, Col, Row, Form, Button} from 'react-bootstrap';

function Day({index, minimized, changeEvent, meals, snacks, breakfast, show, renderMe}){

    const changeInput = (event, type) => {
        console.log("input changed");
        if(type == "breakfast"){
            changeEvent("breakfast", event.target.checked, index);
        } else if (type == "meals"){
            changeEvent("meals", event.target.value, index);
        } else if (type == "snacks"){
            changeEvent("snacks", event.target.value, index);
        }
    }

    if(!renderMe)
        return;

    if(!minimized){
        return (
            <div>
                <Row >
                    <Col xs={3}>
                        <h5>{"Day " + (index + 1)}</h5>
                    </Col>
                    <Col xs={6} style = {{display: "inline"}} className = "d-flex flex-direction-row">
                        <div className = "mr-3"> Meals : {meals}</div>
                        <div className = "mr-3"> Snacks : {snacks}</div>
                        <div className = "mr-3" > Breakfast : {breakfast ? "True" : "False"}</div>
                    </Col>
                    <Col xs={3}>
                        <Button onClick = {() => {console.log("click");show(index)}}> Edit </Button>
                    </Col>
                </Row>
                
                
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
                        value = {meals}
                        onChange = {(e) => changeInput(e, "meals")}
                        autoComplete = "off" />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Snacks</Form.Label>
                    <Form.Control 
                        type = "text"
                        placeholder = "Between 0 and 5"
                        value = {snacks}
                        onChange = {(e) => changeInput(e, "snacks")}
                        autoComplete = "off" />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Breakfast?</Form.Label>
                    <Form.Control 
                        type = "checkbox"
                        placeholder = "Between 0 and 5"
                        checked = {breakfast}
                        onChange = {(e) => changeInput(e, "breakfast")}
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
        let days = [];
        for(let i = 0; i < 7; i++){
            days.push({
                "meals": 0,
                "snacks": 0,
                "breakfast": true
            });
        }
        
        this.state = {
            days: 7,
            dayArray: days,
            shown: null
        }
        this.daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    }

    increaseDays = () => {
        if(this.state.days === 7)
            return;
            this.setState({days: this.state.days + 1});
    }

    decreaseDays = () => {
        if(this.state.days === 1)
            return;
        this.setState({days: this.state.days - 1});
    }

    handleSubmit = async (event) => {
        event.preventDefault();

        //TODO:
        let userKey = "239894c2-4887-4de7-bf7c-4651e70c7090";
        let goalKey = "50dd8c7b-3b12-49e1-a192-fde441ace0ac";

        const response = await fetch(process.env.REACT_APP_API_URL + "users/schedule", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: {"schedule": this.state.dayArray, "userKey": userKey, "goalKey": goalKey}
        });
        console.log(response.json());

    };

      setShownDay = (e) => {
        this.setState({shown: e})
      }

      handleSelectChange = (e) => {
        this.setState({firstDay: e});
      }

      handleDayChange = (type, event, index) => {
        let newDayArray = this.state.dayArray;
        switch(type){
            case "meals":
                newDayArray[index].meals = event;
                break;
            case "snacks":
                newDayArray[index].snacks = event;
                break;
            case "breakfast":
                newDayArray[index].breakfast = event;
                break;
        }
        this.setState({dayArray: newDayArray}, () => console.log(this.state.dayArray));
      }

    render(){
        let type;
        return (
            <Container>
                <Button onClick = {() => this.props.back("welcome")}>Back</Button>
                <h1 style={{textAlign: "center"}}>Your Schedule</h1>
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
                            changeEvent={(type, e) => this.handleDayChange(type, e, index)}
                            meals={key.meals}
                            snacks={key.snacks}
                            breakfast={key.breakfast}
                            show = {() => this.setShownDay(index)}
                            renderMe = {index < this.state.days}
                        />
                    ))
                }
                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>  
            </Container>
 
        );
    }

}