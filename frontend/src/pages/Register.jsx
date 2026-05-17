import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

export default function Register() {
  // CORRECTED: State now exactly matches your Postman JSON
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // Make sure this URL matches your backend setup!
      await api.post('/api/v1/auth/register', formData);
      alert("Registration successful! Welcome to SynapseFlow.");
      navigate('/login'); 
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-xl shadow-xl p-8 border border-gray-100">
        
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-gray-900 text-white rounded flex items-center justify-center font-bold text-2xl mx-auto mb-4 shadow-lg">
            S
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">Join Synapse<span className="text-blue-600">Flow</span></h2>
          <p className="text-gray-500 mt-2">Start optimizing your engineering workflow.</p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-r text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
          {/* CORRECTED: Single Username Field */}
          <input
            type="text"
            placeholder="Username (e.g., ajay_v10000)"
            required
            className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
            onChange={(e) => setFormData({...formData, username: e.target.value})}
          />
          <input
            type="email"
            placeholder="Email Address"
            required
            className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
          <input
            type="password"
            placeholder="Password"
            required
            className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition duration-200 shadow-md disabled:bg-blue-400"
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-500 text-sm font-medium">
          Already have an account? <Link to="/login" className="text-blue-600 hover:underline hover:text-blue-700">Login here</Link>
        </p>
      </div>
    </div>
  );
}