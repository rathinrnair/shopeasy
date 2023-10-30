import { Row, Col, Button, Form, Table } from 'react-bootstrap'
import { useState, useEffect } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import { useProfileMutation } from '../slices/usersApiSlice'
import { useGetMyOrdersQuery } from '../slices/ordersApiSlice'
import { setCredentials } from '../slices/authSlice'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { toast } from 'react-toastify'
import { FaTimes } from 'react-icons/fa'
const ProfileScreen = () => {
  const dispatch = useDispatch()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const { userInfo } = useSelector((state) => state.auth)

  const [updateProfile, { isLoading: loadingUpdateProfile }] =
    useProfileMutation()
  const { data: orders, isLoading, error } = useGetMyOrdersQuery()

  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name)
      setEmail(userInfo.email)
    }
  }, [userInfo])

  const submitHandler = async (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
    } else {
      try {
        const res = await updateProfile({
          _id: userInfo._id,
          name,
          email,
          password,
        }).unwrap()
        dispatch(setCredentials(res))
        toast.success('Profile Upadted Sucessfully')
      } catch (err) {
        toast.error(err?.data?.Message || err.error)
      }
    }
  }

  return (
    <Row>
      <Col md={3}>
        <h2>User Profile</h2>
        <Form onSubmit={submitHandler}>
          <Form.Group className='my-2'>
            <Form.Label>Name</Form.Label>
            <Form.Control
              type='text'
              value={name}
              placeholder='Enter Name'
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>
          <Form.Group className='my-2'>
            <Form.Label>Email</Form.Label>
            <Form.Control
              type='email'
              value={email}
              placeholder='Enter Email'
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>
          <Form.Group className='my-2'>
            <Form.Label>Password</Form.Label>
            <Form.Control
              type='password'
              value={password}
              placeholder='Enter Password'
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          <Form.Group className='my-2'>
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type='password'
              value={confirmPassword}
              placeholder='Confirm Password'
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Form.Group>
          <Button className='my-2' type='submit' variant='primary'>
            Update
          </Button>
          {loadingUpdateProfile && <Loader />}
        </Form>
      </Col>
      <Col md={9}>
        <h2>My Orders</h2>
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>
            {error?.data?.message || error.error}
          </Message>
        ) : (
          <Table striped hover responsive className='table-sm'>
            <thead>
              <tr>
                <th>ID</th>
                <th>DATE</th>
                <th>TOTAL</th>
                <th>PAID</th>
                <th>DELIVERED</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <th>{order._id}</th>
                  <th>{order.createdAt.substring(0, 10)}</th>
                  <th>{order.totalPrice}</th>
                  <th>
                    {order.isPaid ? (
                      order.paidAt.substring(0, 10)
                    ) : (
                      <FaTimes style={{ color: 'red' }} />
                    )}
                  </th>
                  <th>
                    {order.isDelivered ? (
                      order.deliveredAt.substring(0, 10)
                    ) : (
                      <FaTimes style={{ color: 'red' }} />
                    )}
                  </th>
                  <th>
                    <LinkContainer to={`/order/${order._id}`}>
                      <Button className='btn-sm' variant='light'>
                        Details
                      </Button>
                    </LinkContainer>
                  </th>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Col>
    </Row>
  )
}

export default ProfileScreen
