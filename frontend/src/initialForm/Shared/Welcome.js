import {Container, Row, Col} from 'react-bootstrap';

export default function Welcome({selection}){

    const RowStyle = {
        height: "60vh",
        marginTop: "10vh"
    }

    return (
        <Container fluid>
            <Row className = "d-flex justify-content-center" style = {RowStyle}>
                <Col xs={3} className = "text-center ml-5 mr-5 border border-dark">
                    <div style = {{width: "100%", height: "100%"}} onClick = {() => selection("full")}>
                        Help me build a plan!
                    </div>
                </Col>
                <Col xs={3} className = "text-center ml-5 mr-5 border border-dark">
                    <div style = {{width: "100%", height: "100%"}} onClick = {() => selection("custom")}>
                        I already know my macronutrient goals
                    </div>
                </Col>
            </Row>
        </Container>
    );
}