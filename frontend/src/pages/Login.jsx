import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api'; // Import our new Axios configuration

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // State to hold error messages
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // Clear any old errors

    try {
      // 1. Send the POST request to Spring Boot
      const response = await api.post('/api/v1/auth/login', {
        email: username,
        password: password
      });

      // 2. Extract the JWT token from the response
      // (Adjust 'response.data.token' if your backend JSON key is named differently)
      const token = response.data.token; 

      // 3. Save the token to Local Storage
      localStorage.setItem('jwt', token);

      // 4. Redirect the user to the Dashboard
      navigate('/dashboard');

    } catch (err) {
      console.error("Login Error:", err);
      setError("Invalid username or password, or server is unreachable.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md border border-gray-700">
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-white">
            Synapse<span className="text-blue-500">Flow</span>
          </h2>
          <p className="text-gray-400 mt-2">Sign in to your AI Dashboard</p>
        </div>
        
        {/* If there is an error, display it in a red box */}
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-gray-900 text-white border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-900 text-white border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}