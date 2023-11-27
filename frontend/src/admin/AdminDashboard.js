import IngredientLogger     from "./addForms/IngredientLogger";
import MealLogger           from "./addForms/MealLogger";
import AddRecipe       from "./addForms/AddRecipe";

import {Container, Row, Col} from "react-bootstrap";

export default function AdminDashboard(){
    return (
        <Container fluid>
            <Row>
                <Col xs = {4}>
                    <IngredientLogger />
                </Col>
                <Col xs = {4}>
                    <MealLogger />
                </Col>
                <Col xs = {4}>
                    <AddRecipe />                    
                </Col>

            </Row>
        </Container>      
    );   
}