import { useState } from 'react'
import { Routes,Route } from 'react-router-dom'
import './App.css'
import Home from './components/pages/Home'
import SignUp from './components/pages/SignUp'
import Login from './components/pages/Login'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Routes>
      <Route path='/' element={<Home/>} />
      <Route path = '/signup' element={<SignUp/>}/>
      <Route path = '/login' element={<Login/>}/>
      {/* <Route path ='/chats' element={<Chats/>}/> */}
    </Routes>
  )
}

export default App
