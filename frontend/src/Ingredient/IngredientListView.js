import {Col, ListGroup, Form, Pagination} from 'react-bootstrap'
import {useState} from 'react'

export default function IngredientListView({ingredients, changeIngredient}){
    
    let [ingredientFilter, setIngredientFilter] = useState("");
    
    const itemsPerPage = 10; // Number of items per page
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil((ingredients ?? 0).length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, (ingredients ?? 0).length)


    // Function to handle page change
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleFilterChange = (e) => {
        setIngredientFilter(e.target.value.toLowerCase());
      };

    return (
    <Col xs = {6}>
        <Form.Group controlId="filterInput">
            <Form.Control
            type="text"
            placeholder="Search for items..."
            value={ingredientFilter}
            onChange={handleFilterChange}
            />
        </Form.Group>

        {/*List of ingredients*/}
        <ListGroup>
            {ingredients != null && ingredients
                .slice(((currentPage - 1) * itemsPerPage), (currentPage * itemsPerPage))
                .filter(ingredient => ingredient.ingredientName.toLowerCase().includes(ingredientFilter))
                .map((ingredient) => (
                <ListGroup.Item style = {{height: "50px"}} onClick = {() => changeIngredient(ingredient.ingredientKey)}>{ingredient.ingredientName}</ListGroup.Item>
            ))}
        </ListGroup>

        {ingredients !== null && (
           <Pagination>
                <Pagination.Prev
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                />
                {Array.from({ length: totalPages }, (_, i) => (
                    <Pagination.Item
                        key={i + 1}
                        active={i + 1 === currentPage}
                        onClick={() => handlePageChange(i + 1)}
                    >
                        {i + 1}
                    </Pagination.Item>
                ))}
                <Pagination.Next
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                />
            </Pagination>
        )}
        
    </Col>
    )
}