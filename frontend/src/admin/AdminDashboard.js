import IngredientLogger     from "./addForms/IngredientLogger";
import MealLogger           from "./addForms/MealLogger";
import AddSchedule       from "./addForms/AddSchedule";

import {Container, Row, Col} from "react-bootstrap";

export default function AdminDashboard(){
    return (
        <Container fluid>
            <Row>
                <Col xs = {4}>
                    {/*<IngredientLogger />*/}
                </Col>
                <Col xs = {4}>
                    {/*<MealLogger />*/}
                </Col>
                <Col xs = {4}>
                    <AddSchedule />                    
                </Col>

            </Row>
        </Container>      
    );   
}