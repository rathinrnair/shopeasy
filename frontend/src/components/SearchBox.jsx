import { Form, Button } from 'react-bootstrap'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
const SearchBox = () => {
  const navigate = useNavigate()
  const { keyword: keywordParam } = useParams()
  const [keyword, setKeyword] = useState(keywordParam || '')

  const submitHandler = (e) => {
    e.preventDefault()
    if (keyword.trim()) {
      navigate(`/search/${keyword}`)
      setKeyword('')
    } else {
      navigate('/')
    }
  }

  return (
    <Form onSubmit={submitHandler} className='d-flex'>
      <Form.Control
        type='text'
        name='q'
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder='Search Products...'
        className='mr-sm-2 ml-sm-5'
      />
      <Button type='submit' variant='outline-light' className='p-2 mx-2'>
        Search
      </Button>
    </Form>
  )
}

export default SearchBox
