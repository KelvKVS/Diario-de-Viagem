import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import MyTravels from './pages/MyTravels';
import PublicTravels from './pages/PublicTravels';
import CreateTravel from './pages/CreateTravel';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<PublicTravels />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/my-travels" element={<MyTravels />} />
        <Route path="/create" element={<CreateTravel />} />
      </Routes>
    </Router>
  );
}

export default App;
