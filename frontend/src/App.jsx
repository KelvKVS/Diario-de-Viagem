import React from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Login from './pages/login'
import Index from './pages/index'
import NewPost from './pages/newpost'
import UserProfile from './pages/userprofile'
import NavBar from './assets/components/navbar'
import Register from './pages/register'

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/newpost" element={<NewPost />} />
        <Route path="/userprofile" element={<UserProfile />} />
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App