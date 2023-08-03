import { Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Rating from './Rating'

const Product = ({ product }) => {
  return (
    <Card className='my-3 p-3 rounded'>
      <Link to={`/products/${product._id}`}>
        <Card.Img variant='top' src={product.image} />
      </Link>
      <Card.Body>
        <Link to={`/products/${product._id}`}>
          <Card.Title as='div' className='product-title'>
            {product.name}
          </Card.Title>
        </Link>
        <Card.Text as='div'>
          <Rating
            value={product.rating}
            text={`from ${product.numReviews} Reviews`}
          />
        </Card.Text>
        <Card.Text as='h5'>${product.price}</Card.Text>
      </Card.Body>
    </Card>
  )
}

export default Product
