import {Container, Button, Row, Col, ListGroup} from 'react-bootstrap';
import NutritionLabel from '../tools/NutritionLabel';
export default function SingleMeal({name, ingredients, nutrients}){

    function editableIngredient(ingredient, editing){

        const removeIngredient = (ingredientKey) => {
            let updatedIngredients = [...this.state.selectedIngredients];
            updatedIngredients = updatedIngredients.filter(item => item.ingredientKey !== ingredientKey)
            this.setState({selectedIngredients: updatedIngredients});
        }

        return (
            <div className = "flex d-flex flex-direction-row align-items-center">  
                <ListGroup.Item style = {{width: "80%"}}>
                    <p style={{fontSize: "20px", marginLeft: "10px"}}>{ingredient.amount + " " + ingredient.portion + "\t " + ingredient.name}</p>
                </ListGroup.Item>
                <img style = {{height: "20px", marginLeft: "10px"}} src={process.env.PUBLIC_URL + "/images/remove.png"} onClick = {(e) => removeIngredient(ingredient.ingredientKey)}/>
            </div>
            
        );
    }

    return (
        <Container fluid>
            <div className = "flex d-flex flex-direction-row" style = {{width: "50%"}}>
                <h2>{name}</h2>
                <img style = {{width: "10%", float: "right"}} className = "ml-auto" src={process.env.PUBLIC_URL + "/images/edit.png"} />
            </div>

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