import React from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Login from './pages/login'
import Index from './pages/index'
import NewPost from './pages/newpost'
import NavBar from './assets/components/navbar'

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/newpost" element={<NewPost />} />
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App