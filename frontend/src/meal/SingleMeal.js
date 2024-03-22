import {Container, Button, Row, Col, ListGroup} from 'react-bootstrap';
import NutritionLabel from '../tools/NutritionLabel';
export default function SingleMeal({name, ingredients, nutrients}){

    function editableIngredient(ingredient){

        const removeIngredient = (ingredientKey) => {
            let updatedIngredients = [...this.state.selectedIngredients];
            updatedIngredients = updatedIngredients.filter(item => item.ingredientKey !== ingredientKey)
            this.setState({selectedIngredients: updatedIngredients});
        }

        return (
            <>  
                <ListGroup.Item>
                    <p style={{fontSize: "20px", marginLeft: "10px"}}>{ingredient.amount + " " + ingredient.portion + "\t " + ingredient.name}</p>
                    <Button style={{ height: "50px", width: "100px", marginRight: 0}} onClick={() => removeIngredient(ingredient.ingredientKey)}>Remove</Button>
                {/*!this.state.openIngredient && <Button style ={{height: "50px", width: "100px"}} onClick={() => this.setOpenIngredient(ingredient.ingredientKey)}>Edit</Button>
                <Button style={{ height: "50px", width: "100px" }} onClick={() => this.removeIngredient(ingredient.ingredientKey)}>Remove</Button>         */}   
                </ListGroup.Item>
            </>
            
        );
    }

    return (
        <Container fluid>
            <h2>{name}</h2>
            <img style = {{width: "5%", marginLeft: "10px"}} src={process.env.PUBLIC_URL + "/images/edit.png"} />
            <Row>
                <Col>
                <ListGroup>
                    {ingredients.map((ingredient) => (
                            editableIngredient(ingredient)
                        ))}
                </ListGroup>

                </Col>
                <Col>
                    <NutritionLabel 
                        nutrients = {nutrients}
                        amount = {1} 
                        amountUnit = "serving" 
                        grams = {100}/>
                </Col>
            </Row>


        </Container>
       
                        
    )
}