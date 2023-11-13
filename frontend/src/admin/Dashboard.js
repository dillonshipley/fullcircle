import IngredientLogger     from "./addForms/IngredientLogger";
import MealLogger           from "./addForms/MealLogger";
import ViewIngredient       from "./addForms/ViewIngredient";


export default function Dashboard(){
    return (
        <>
            <IngredientLogger />
            <ViewIngredient />
            <MealLogger />
        </>

        
    );   
}