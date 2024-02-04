import React, {Component} from 'react';
import {Button} from 'react-bootstrap';

export default class BrowseMeals extends React.Component{
    constructor(props){
        super(props);
        this.back = props.back;
    }
    
    async loadMeals() {
        const response = await fetch(process.env.REACT_APP_API_URL + "foods/mealList", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        let mealList = Array.from(await response.json());
        console.log(mealList);
        return mealList;
    }

    componentDidMount(){
        const res = this.loadMeals();
        for(let meal in res){
            
        }
    }

    render(){
        return(
            <>
                <Button onClick = {() => this.back("welcome")}>Back</Button>
                hello
            </>
        );
    } 
}