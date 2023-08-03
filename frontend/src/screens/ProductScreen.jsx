import React from 'react'
import { useParams, Link } from 'react-router-dom'
import products from '../products'
import { Row, Col, Card, Image, ListGroup, Button } from 'react-bootstrap'
import Rating from '../components/Rating'

const ProductScreen = () => {
  const { id: productId } = useParams()
  const product = products.find((p) => p._id === productId)

  return (
    <>
      <Link className='btn btn-light my-3' to='/'>
        Go Back
      </Link>
      <Row>
        <Col md={5}>
          <Image src={product.image} alt={product.name} fluid></Image>
        </Col>
        <Col md={4}>
          <ListGroup>
            <ListGroup.Item>
              <h3>{product.name}</h3>
            </ListGroup.Item>
            <ListGroup.Item>
              <Rating
                value={product.rating}
                text={`from ${product.numReviews} Reviews`}
              />
            </ListGroup.Item>
            <ListGroup.Item>Pricce : ${product.price}</ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={3}>
          <Card>
            <ListGroup>
              <ListGroup.Item>
                Price: <strong>${product.price}</strong>
              </ListGroup.Item>
              <ListGroup.Item>
                Status: {product.countInStock > 0 ? 'In Stock' : 'Out Of Stock'}
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default ProductScreen
