import {Container, Row, Col, Tabs, Tab} from 'react-bootstrap'
import BrowseMeals from './BrowseMeals'
import AddMeal from './AddMeal'

export default function Meals({token, back}){
    return (
        <Container fluid>
            <img style = {{width: "30px", marginTop: "10px"}} src={process.env.PUBLIC_URL + "/images/back.png"} onClick = {() => back("welcome")}/>
            <h1 style = {{marginBottom: "30px", marginLeft: "50px"}}>Meals</h1>
            <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example">
                    <Tab eventKey="Browse Meals" title="Browse Meals">
                        <BrowseMeals token = {token}/>
                    </Tab>
                    <Tab eventKey="Add Meal" title = "Add Meal (Admin)">
                        <AddMeal token = {token}/>
                    </Tab>
            </Tabs>
        </Container>
    )
}