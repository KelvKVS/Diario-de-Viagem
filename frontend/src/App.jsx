import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import Index from './pages/index';
import NewPost from './pages/newpost';
import UserProfile from './pages/userprofile';
import CreateTrip from './pages/createtrip';
import Register from './pages/register';
import Sidebar from './assets/components/Sidebar';

function App() {
  return (
    <BrowserRouter>
    <div className="flex">
      <Sidebar />
      <div className="ml-60 p-6 w-full">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/newpost" element={<NewPost />} />
          <Route path="/userprofile" element={<UserProfile />} />
          <Route path="/nova-viagem" element={<CreateTrip />} />
          <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>
  </div>
</div>

    </BrowserRouter>
  );
}

export default App;
