import React, {useState} from 'react';
import {Container, Col, Form, Button} from 'react-bootstrap'


export default function Login({login}){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    const [signUpEmail, setSignUpEmail] = useState("");
    const [signUpPassword, setSignUpPassword] = useState("");
    
    const handleLogin = async (event) => {
        event.preventDefault();
        console.log("LOGGING IN...")
        const response = await fetch(process.env.REACT_APP_API_URL + "user/login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({"email": email, "password": password})
        });

        const x = await response.json();
        console.log(x);
        if(x.message === "Success")
            login(x.userKey);
    }

    const handleSignUp = async (event) => {
        event.preventDefault();
        console.log("works");
        const response = await fetch(process.env.REACT_APP_API_URL + "user/user", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({"email": email, "password": password})
        });
        const x = await response.text();
        console.log(x);
    }


    return (
        <Container>
            <Col>
                <Form onSubmit ={(e) => handleLogin(e)}>
                    <h1>Log In</h1>
                    <Form.Group>
                        <Form.Label>Email</Form.Label>
                        <Form.Control 
                            type = "text"
                            placeholder = ""
                            onChange = {(e) => setEmail(e.target.value)}
                            autoComplete = "off" />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Password</Form.Label>
                        <Form.Control 
                            type = "password"
                            placeholder = ""
                            onChange = {(e) => setPassword(e.target.value)}
                            autoComplete = "off" />
                    </Form.Group>
                    <Button type = "submit">Submit</Button>
                </Form>

                <Form onSubmit = {(e) => handleSignUp(e)}>
                    <h1>Sign Up</h1>
                    <Form.Group>
                        <Form.Label>Email</Form.Label>
                        <Form.Control 
                            type = "text"
                            placeholder = ""
                            onChange = {(e) => setSignUpEmail(e.target.value)}
                            autoComplete = "off" />

                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Password</Form.Label>
                        <Form.Control 
                            type = "text"
                            placeholder = ""
                            onChange = {(e) => setSignUpPassword(e.target.value)}
                            autoComplete = "off" />

                    </Form.Group>
                    <Button type = "submit">Submit</Button>
                </Form>
            </Col>
        </Container>
    )
}