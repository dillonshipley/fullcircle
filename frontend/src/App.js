import logo from './logo.svg';
import './App.css';

import React from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';

function MyForm() {
  return (
    <Container>
      <Row>
        <Col>
          <Form>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" placeholder="Enter email" />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" />
            </Form.Group>

            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

function App() {
  return (
    <div className="App">
      Full Circle Nutrition
      <MyForm />
    </div>

    
  );
}

export default App;
