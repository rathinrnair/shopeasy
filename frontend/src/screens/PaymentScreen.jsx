import { Form, Button, FormGroup, ListGroup } from 'react-bootstrap'
import FormContainer from '../components/FormContainer'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { savePaymentMethod } from '../slices/cartSlice'
import CheckoutSteps from '../components/CheckoutSteps'

const PaymentScreen = () => {
  const [paymentMethod, setPaymentMethod] = useState('PayPal')

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const cart = useSelector((state) => state.cart)
  const { shippingAddress } = cart

  useEffect(() => {
    console.log(shippingAddress)
    if (!shippingAddress || Object.keys(shippingAddress).length === 0) {
      navigate('/shipping')
    }
  }, [shippingAddress, navigate])

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(savePaymentMethod(paymentMethod))
    navigate('/placeorder')
    console.log('submit')
  }

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 step3 />
      <h1>Payment Method</h1>
      <Form onSubmit={submitHandler}>
        <FormGroup>
          <Form.Label as='legend'>Select Method</Form.Label>
          <ListGroup className='mb-2'>
            <ListGroup.Item>
              <Form.Check
                type='radio'
                id='paypal'
                label='PayPal or Credit Card'
                className='my-2'
                name='paymentMethod'
                checked
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
            </ListGroup.Item>
          </ListGroup>
        </FormGroup>
        <Button type='submit' variant='primary'>
          Continue
        </Button>
      </Form>
    </FormContainer>
  )
}

export default PaymentScreen
