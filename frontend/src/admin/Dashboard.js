import IngredientLogger     from "./addForms/IngredientLogger";
import MealLogger           from "./addForms/MealLogger";
import ViewIngredient       from "./addForms/ViewIngredient";

import {Container, Row, Col} from "react-bootstrap";

export default function Dashboard(){
    return (
        <Container fluid>
            <Row>
                <Col xs = {4}>
                    <IngredientLogger />
                </Col>
                <Col xs = {4}>
                    <ViewIngredient />
                </Col>
                <Col xs = {4}>
                    <MealLogger />                    
                </Col>

            </Row>
        </Container>

        
    );   
}