import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage'; // Import the new entry point
import Login from './pages/Login';
import Register from './pages/Register'; 
import Dashboard from './pages/Dashboard';
import Tasks from "./pages/Tasks";
import Settings from './pages/Settings';

function App() {
  return (
    <Router>
      <Routes>
        {/* The root URL now points to your Public Portfolio! */}
        <Route path="/" element={<LandingPage />} /> 
        
        {/* The Auth & App Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} /> 
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Router>
  );
}

export default App;