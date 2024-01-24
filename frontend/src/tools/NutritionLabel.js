import React, {useState} from 'react';
import './NutritionLabel.css';

export default function NutritionLabel({nutrients}) {

    let calories, totalfats, transfat, saturatedfat, cholesterol, sodium, carbohydrates, dietaryfiber, sugars, protein, amount, amountUnit;
    if(nutrients == null){
        return (
            <div>Nutrients could not be found!</div>
        )
    }
    if(nutrients && Array.isArray(nutrients)){
        calories =          nutrients.find(element => element.name === "calories")?.amount;
        console.log("from nutrition label " + nutrients);
        totalfats =         nutrients.find(element => element.name === "totalfats")?.amount;
        transfat =          nutrients.find(element => element.name === "transfat")?.amount ?? null;
        saturatedfat =      nutrients.find(element => element.name === "saturatedfat")?.amount;
        cholesterol =       nutrients.find(element => element.name === "cholesterol")?.amount;
        sodium =            nutrients.find(element => element.name === "sodium")?.amount;
        carbohydrates =     nutrients.find(element => element.name === "carbohydrates")?.amount;
        dietaryfiber =      nutrients.find(element => element.name === "dietaryfiber")?.amount;
        sugars =            nutrients.find(element => element.name === "sugars")?.amount;
        protein =           nutrients.find(element => element.name === "protein")?.amount;
        amount =            nutrients.find(element => element.name === "Total")?.amount;
        amountUnit =        nutrients.find(element => element.name === "Total")?.unit;
    }

    return (
        <>
            <section className="performance-facts">
            <header className="performance-facts__header">
                <h1 className="performance-facts__title">Nutrition Facts</h1>
                {/*<p>Serving Size 1/2 cup (about 82g)*/}
            </header>
            <table className="performance-facts__table">
                <thead>
                <tr>
                    <th colspan="3" className="small-info">
                    {"Amount Per Serving: " + amount + amountUnit}
                    </th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <th colspan="2">
                    <b>Calories</b> {calories != null && calories.toFixed(2)}
                    </th>
                    <td>
                    Calories from Fat {(totalfats * 9).toFixed(2)}
                    </td>
                </tr>
                <tr className="thick-row">
                    <td colspan="3" className="small-info">
                    <b>% Daily Value*</b>
                    </td>
                </tr>
                <tr>
                    <th colspan="2">
                        <b>Total Fat</b> {totalfats != null && totalfats}g
                    </th>
                    <td>
                    { //TODO - display fat daily value (USDA recommended)
                        //<b>22%</b>
                    }
                    </td>
                </tr>
                <tr>
                    <td className="blank-cell">
                    </td>
                    <th>
                    Saturated Fat {saturatedfat != null && saturatedfat}g
                    </th>
                    <td>
                    <b>22%</b>
                    </td>
                </tr>
                <tr>
                    <td className="blank-cell"></td>
                    <th>
                    Trans Fat
                    0g
                    </th>
                    <td></td>
                </tr>
                <tr>
                    <th colspan="2">
                    <b>Cholesterol</b> {cholesterol != null && cholesterol}mg
                    </th>
                    <td>
                    <b>18%</b>
                    </td>
                </tr>
                <tr>
                    <th colspan="2">
                    <b>Sodium</b> {sodium != null && sodium}mg
                    </th>
                    <td>
                    <b>2%</b>
                    </td>
                </tr>
                <tr>
                    <th colspan="2">
                    <b>Total Carbohydrate</b> {carbohydrates != null && carbohydrates}g
                    </th>
                    <td>
                    <b>6%</b>
                    </td>
                </tr>
                <tr>
                    <td className="blank-cell">
                    </td>
                    <th>
                    Dietary Fiber {dietaryfiber != null && dietaryfiber}g
                    </th>
                    <td>
                    <b>4%</b>
                    </td>
                </tr>
                <tr>
                    <td className="blank-cell">
                    </td>
                    <th>
                    Sugars {sugars != null && sugars}g
                    </th>
                    <td>
                    </td>
                </tr>
                <tr className="thick-end">
                    <th colspan="2">
                    <b>Protein</b> {protein != null && protein}g
                    </th>
                    <td>
                    </td>
                </tr>
                </tbody>
            </table>

            <table className="performance-facts__table--grid">
                <tbody>
                <tr>
                    <td colspan="2">
                    Vitamin A
                    10%
                    </td>
                    <td>
                    Vitamin C
                    0%
                    </td>
                </tr>
                <tr className="thin-end">
                    <td colspan="2">
                    Calcium
                    10%
                    </td>
                    <td>
                    Iron
                    6%
                    </td>
                </tr>
                </tbody>
            </table>

            <p className="small-info">* Percent Daily Values are based on a 2,000 calorie diet. Your daily values may be higher or lower depending on your calorie needs:</p>

            <table className="performance-facts__table--small small-info">
                <thead>
                <tr>
                    <td colspan="2"></td>
                    <th>Calories:</th>
                    <th>2,000</th>
                    <th>2,500</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <th colspan="2">Total Fat</th>
                    <td>Less than</td>
                    <td>65g</td>
                    <td>80g</td>
                </tr>
                <tr>
                    <td className="blank-cell"></td>
                    <th>Saturated Fat</th>
                    <td>Less than</td>
                    <td>20g</td>
                    <td>25g</td>
                </tr>
                <tr>
                    <th colspan="2">Cholesterol</th>
                    <td>Less than</td>
                    <td>300mg</td>
                    <td>300 mg</td>
                </tr>
                <tr>
                    <th colspan="2">Sodium</th>
                    <td>Less than</td>
                    <td>2,400mg</td>
                    <td>2,400mg</td>
                </tr>
                <tr>
                    <th colspan="3">Total Carbohydrate</th>
                    <td>300g</td>
                    <td>375g</td>
                </tr>
                <tr>
                    <td className="blank-cell"></td>
                    <th colspan="2">Dietary Fiber</th>
                    <td>25g</td>
                    <td>30g</td>
                </tr>
                </tbody>
            </table>

            <p className="small-info">
                Calories per gram:
            </p>
            <p className="small-info text-center">
                Fat 9
                &bull;
                Carbohydrate 4
                &bull;
                Protein 4
            </p>

            </section>
        </>
    )
}