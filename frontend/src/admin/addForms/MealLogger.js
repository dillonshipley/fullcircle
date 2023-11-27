export default class MealLogger {


    getIngredients = async () => {
        const response = await fetch(process.env.REACT_APP_API_URL + "get/ingredientList", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        console.log(response.json)
    }

    render(){
        return (
            <h4>Add A Meal</h4>
        );
    }
}