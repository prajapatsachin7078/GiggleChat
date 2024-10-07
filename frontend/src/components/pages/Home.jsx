import React from 'react'
import { Button } from '../ui/button'
import { useNavigate } from 'react-router-dom'

function Home() {
    const navigate = useNavigate();
  return (
    <div>Home
        <Button onClick={()=>{navigate('/signup')}}>
            SignUp
        </Button>
        <Button onClick={()=>{navigate('/login')}}>
            Login
        </Button>
    </div>
  )
}

export default Home