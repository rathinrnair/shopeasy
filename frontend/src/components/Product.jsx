import { Card } from 'react-bootstrap'

const Product = ({ product }) => {
  return (
    <Card className='my-3 p-3 rounded'>
      <a href={`/products/${product._id}`}>
        <Card.Img variant='top' src={product.image} />
      </a>
      <Card.Body>
        <a href={`/products/${product._id}`}>
          <Card.Title>{product.name}</Card.Title>
        </a>
        <Card.Text as='h5'>${product.price}</Card.Text>
      </Card.Body>
    </Card>
  )
}

export default Product
