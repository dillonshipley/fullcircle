import {Card, Form} from 'react-bootstrap';


function DayCard({dayTitle}){
    return (
        <Card>
            <p>{dayTitle}</p>
            {/*
                1. meals per day (limited to 5) - dropdown menu
                2. snacks per day (limited to like 5 idk) - dropdown menu
                3. do you want a breakfast? - checkbox

                there should probably be some restrictions, depending on the number of calories for the day
            */}
        </Card>
    );
}

export default function Schedule(){
    return (
        {/*
            //will every day be the same?
                //if not, do any of them follow the same pattern?
                    //if not, display all seven days as day cards
                    //if so, create a way to match days together - assign days "day A, day B, day C etc status"
                //if so, display a generic day card
        */}
    );
}