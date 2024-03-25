import React from 'react';
import './NutritionLabel.css';
import pluralize from 'pluralize';

export default function NutritionLabel({nutrients, amount, amountUnit, grams}) {

    let nutrientsInfo = {
        calories: null,
        totalfats: null,
        transfat: null,
        saturatedfat: null,
        cholesterol: null,
        sodium: null,
        carbohydrates: null,
        dietaryfiber: null,
        sugars: null,
        protein: null,
      };
      
      if (nutrients == null) {
        return (
          <div>Nutrients could not be found!</div>
        );
      }
      
      if (nutrients && Array.isArray(nutrients)) {
        const nutrientNames = ["calories", "totalfats", "transfat", "saturatedfat", "cholesterol", "sodium", "carbohydrates", "dietaryfiber", "sugars", "protein"];
        nutrientNames.forEach((nutrientName) => {
            let x = nutrients.find(element => element.name === nutrientName)?.amount ?? 0;
            if(x !== null && x !== undefined){
                x = grams * (x / 100);
                x = x.toFixed(2);
                nutrientsInfo[nutrientName] = x;
            }

        });
      }

      function removeFirstTwoCharacters(str) {
        if (str.startsWith('1 ')) {
            let newString = str.substring(2);
            if(amount !== 1)
                return pluralize(newString);
            else
                return newString; 
        } else {
            return pluralize(str);
        }
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
                    <th colSpan="3" className="small-info">
                    {amountUnit != null && "Amount Per Serving: " + amount + " " + removeFirstTwoCharacters(amountUnit) + " (" + grams + "g)"}
                    </th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <th colSpan="2">
                    <b>Calories </b>{nutrientsInfo.calories != null && nutrientsInfo.calories}
                    </th>
                    <td>
                    Calories from Fat {(nutrientsInfo.totalfats * 9).toFixed(2)}
                    </td>
                </tr>
                <tr className="thick-row">
                    <td colSpan="3" className="small-info">
                    <b>% Daily Value*</b>
                    </td>
                </tr>
                <tr>
                    <th colSpan="2">
                        <b>Total Fat</b> {nutrientsInfo.totalfats != null && nutrientsInfo.totalfats}g
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
                    Saturated Fat {nutrientsInfo.saturatedfat != null && nutrientsInfo.saturatedfat}g
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
                    <th colSpan="2">
                    <b>Cholesterol</b> {nutrientsInfo.cholesterol != null && nutrientsInfo.cholesterol}mg
                    </th>
                    <td>
                    <b>18%</b>
                    </td>
                </tr>
                <tr>
                    <th colSpan="2">
                    <b>Sodium</b> {nutrientsInfo.sodium != null && nutrientsInfo.sodium}mg
                    </th>
                    <td>
                    <b>2%</b>
                    </td>
                </tr>
                <tr>
                    <th colSpan="2">
                    <b>Total Carbohydrate</b> {nutrientsInfo.carbohydrates != null && nutrientsInfo.carbohydrates}g
                    </th>
                    <td>
                    <b>6%</b>
                    </td>
                </tr>
                <tr>
                    <td className="blank-cell">
                    </td>
                    <th>
                    Dietary Fiber {nutrientsInfo.dietaryfiber != null && nutrientsInfo.dietaryfiber}g
                    </th>
                    <td>
                    <b>4%</b>
                    </td>
                </tr>
                <tr>
                    <td className="blank-cell">
                    </td>
                    <th>
                    Sugars {nutrientsInfo.sugars != null && nutrientsInfo.sugars}g
                    </th>
                    <td>
                    </td>
                </tr>
                <tr className="thick-end">
                    <th colSpan="2">
                    <b>Protein</b> {nutrientsInfo.protein != null && nutrientsInfo.protein}g
                    </th>
                    <td>
                    </td>
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