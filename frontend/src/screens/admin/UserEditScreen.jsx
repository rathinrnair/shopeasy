import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import FormContainer from '../../components/FormContainer'
import Loader from '../../components/Loader'
import Message from '../../components/Message'
import {
  useUpdateUserMutation,
  useGetUsersByIdQuery,
} from '../../slices/usersApiSlice'
import { toast } from 'react-toastify'

const UserEditScreen = () => {
  const navigate = useNavigate()
  const { id: userId } = useParams()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [isAdmin, setIsAdmin] = useState('')

  const { data: user, isLoading, error, refetch } = useGetUsersByIdQuery(userId)

  const [updateuser, { isLoading: loadingUpdate }] = useUpdateUserMutation()

  useEffect(() => {
    if (user) {
      setName(user.name)
      setEmail(user.email)
      setIsAdmin(user.isAdmin)
    }
  }, [user])

  const submitHandler = async (e) => {
    e.preventDefault()
    const updatedUser = {
      userId,
      name,
      email,
      isAdmin,
    }
    const result = await updateuser(updatedUser)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('User Updated')
      navigate('/admin/userlist')
      refetch()
    }
  }

  return (
    <>
      <Link className='btn btn-light' to={`/admin/userlist`}>
        Go Back
      </Link>
      <FormContainer>
        <h2>Edit Product</h2>
        {loadingUpdate && <Loader />}
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>{error}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId='name' className='my-2'>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type='name'
                placeholder='Enter your name'
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId='email' className='my-2'>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type='email'
                placeholder='Enter your email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId='isadmin' className='my-2'>
              <Form.Label>User Role</Form.Label>
              <Form.Select
                value={isAdmin ? 'true' : 'false'}
                onChange={(e) => setIsAdmin(e.target.value === 'true')}
              >
                <option value='true'>Admin</option>
                <option value='false'>User</option>
              </Form.Select>
            </Form.Group>

            <Button type='submit' variant='primary' className='my-2'>
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  )
}

export default UserEditScreen
