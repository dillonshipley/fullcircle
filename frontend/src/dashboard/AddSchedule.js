import React from 'react';
import {Container, Col, Row, Form, Button} from 'react-bootstrap';

function Day({index, minimized, changeEvent, userMeals, show, renderMe}){

    const changeInput = (event, type) => {
        console.log("input changed");

        if (type === "meals"){
            changeEvent("meals", event.target.value, index);
        }
    }

    if(!renderMe)
        return;

    if(!minimized){
        return (
            <Col >
                <div>
                    <h5>{`Day ${index + 1}`}</h5>
                </div>
                <Col xs={6} className = "">
                    <div className = "mr-3"> Meals : {userMeals.length}</div>
                    {userMeals.map((meal) => (
                        <div style = {{border: "2px solid black", borderRadius: "4px"}}>
                            <div>{meal.name}</div>
                            <div>{meal.mealKey}</div>
                        </div>
                    ))}
                </Col>
            </Col>
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
                        onChange = {(e) => changeInput(e, "meals")}
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
            days: [],
            userKey: props.userKey,
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

        const response = await fetch(process.env.REACT_APP_API_URL + "plans/schedule", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: {"schedule": this.state.dayArray, "userKey": this.state.userKey}
        });
        console.log(response.json());

    };

    async loadSchedule(){
        console.log("works");
        console.log(this.state.userKey)
        const response = await fetch(process.env.REACT_APP_API_URL + "plans/getSchedule", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({"userKey": this.state.userKey})
        });
        if(!response.ok){
            console.log("Error fetching response!")
        }

        const data = await response.json();
        console.log(data);
       this.setState({
            days: data.days
       });
    }
    
    componentDidMount(){
        this.loadSchedule();
    }

    render(){
        let type;
        return (
            <Container fluid>
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
                <Counter count = {this.state.days.length} handleDecrement={() => this.decreaseDays()} handleIncrement={() => this.increaseDays()}/>
                <Row>
                {(this.state.days != null && this.state.days.length > 0) && 
                    this.state.days.map((day, index) => (
                        <Day 
                            key = {index} 
                            index = {index}
                            date = {day.date}
                            userMeals = {day.userMeals}
                            show = {() => this.setShownDay(index)}
                            renderMe = {index < this.state.days.length}
                        />
                    ))
                }
                </Row>

                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>  
            </Container>
 
        );
    }

}