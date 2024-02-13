import {Form, Container, Button} from 'react-bootstrap';
import {useState} from 'react';

export default function EditGoals({currentInfo, back}){
    const [generalGoal, setGeneralGoal] = useState("");
    const [protein, setProtein] = useState("");
    const [carbsFat, setCarbsFat] = useState("");

    const generalOptions = ["", 
        "Lose weight quickly", 
        "Lose weight at a moderate pace", 
        "Slight weight loss", 
        "Maintain my weight", 
        "Slight weight gain", 
        "Gain weight at a moderate pace", 
        "Gain weight quickly"];
    const proteinOptions = [
        `Balanced: ${currentInfo.weight * .6}g/day (.6g/lb of body weight)`, 
        `Moderate: ${currentInfo.weight * .8}g/day (.8g/lb of body weight)`, 
        `Athletic: ${currentInfo.weight * 1}g/day (1g/lb of body weight)`,
        "Pick a custom protein"];
    const fatCarbOption = [
        'Zero fat',
        'Much more carbs than fat',
        'An equal amount of carbs and fat',
        'Much more fat than carbs',
        'Zero carb'
    ]

    return (
        <Container>
            <Button onClick = {() => back("welcome")}>Back</Button>
            <Form>
                <p className = {"mt-5 ml-5"}>General Goal</p>
                <select  className = {"ml-5"} id = "dropdown" onChange={(e) => setGeneralGoal(e)}>
                        {
                            generalOptions.map((element) =>(
                                <option key = {element} value = {element}>{element}</option>
                            ))
                        }
                </select>
                <p className = {"mt-5 ml-5"}>Protein Intake</p>
                <select  className = {"ml-5"} id = "dropdown" onChange={(e) => setProtein(e)}>
                        {
                            proteinOptions.map((element) =>(
                                <option key = {element} value = {element}>{element}</option>
                            ))
                        }
                </select>
                <p className = {"mt-5 ml-5"}>Carb / Fat Balance</p>
                <select className = {"ml-5"} id = "dropdown" onChange={(e) => setCarbsFat(e)}>
                        {
                            fatCarbOption.map((element) =>(
                                <option key = {element} value = {element}>{element}</option>
                            ))
                        }
                </select>
            </Form>

        </Container>

    );

}