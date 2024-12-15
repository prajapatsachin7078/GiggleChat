
import { Routes,Route } from 'react-router-dom'
import './App.css'
import Home from './components/pages/Home'
import SignUp from './components/pages/SignUp'
import Login from './components/pages/Login'
import ChatBox from './components/pages/ChatBox'
import { useContext } from 'react'
import {UserContext} from './context/userContext'

import VerifyUserEmail from './components/pages/VerifyUserEmail'

function App() {
const {user} = useContext(UserContext);
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/verify-email"
        element={user ? <ChatBox /> : <VerifyUserEmail />}
      />
      <Route path="/signup" element={user ? <ChatBox /> : <SignUp />} />
      <Route path="/login" element={user ? <ChatBox /> : <Login />} />
      <Route path="/chats" element={user ? <ChatBox /> : <Login />} />
    </Routes>
  );
}

export default App
