import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function Settings() {
  const [profile, setProfile] = useState({ username: '', email: '' });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('jwt');
        if (!token) {
          navigate('/login');
          return;
        }

        const res = await api.get('/api/v1/users/me');
        setProfile(res.data);
      } catch (err) {
        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.removeItem('jwt');
          navigate('/login');
        } else {
          console.error("Failed to fetch profile", err);
        }
      } finally {
        // FIX: Guaranteed to stop the spinner no matter what!
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });

    if (passwords.newPassword !== passwords.confirmPassword) {
      return setStatus({ type: 'error', message: 'New passwords do not match!' });
    }

    try {
      const response = await api.put('/api/v1/users/password', {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword
      });
      setStatus({ type: 'success', message: response.data.message });
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' }); 
    } catch (error) {
      setStatus({ type: 'error', message: error.response?.data?.message || 'Failed to update password.' });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('jwt'); // FIX: Matched exactly to 'jwt'
    navigate('/login');
  };

  if (isLoading) return <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center font-bold">Loading Profile...</div>;

  return (
    <div className="flex min-h-screen bg-[#0f172a] font-sans">
      
      {/* Sidebar */}
      <div className="w-64 bg-[#1e293b] border-r border-gray-800 hidden md:flex flex-col justify-between">
        <div>
          <div className="p-6">
            <h2 className="text-2xl font-extrabold text-white">Synapse<span className="text-blue-500">Flow</span></h2>
          </div>
          <nav className="flex-1 px-4 space-y-2 mt-4">
            <button onClick={() => navigate('/dashboard')} className="w-full text-left px-4 py-3 text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg transition">Dashboard</button>
            <button onClick={() => navigate('/tasks')} className="w-full text-left px-4 py-3 text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg transition">My Tasks</button>
            <button className="w-full text-left px-4 py-3 bg-blue-600 text-white rounded-lg font-bold shadow-lg">Settings</button>
          </nav>
        </div>
        <div className="p-4">
          <button onClick={handleLogout} className="w-full bg-red-600/10 text-red-500 font-bold py-3 rounded-lg hover:bg-red-600 hover:text-white transition">Logout</button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 lg:p-12 overflow-auto">
        <div className="max-w-2xl mx-auto space-y-8">
          
          <div>
            <h1 className="text-3xl font-extrabold text-white mb-2">Account Settings</h1>
            <p className="text-gray-400">Manage your profile and security preferences.</p>
          </div>

          <div className="bg-[#1e293b] rounded-2xl border border-gray-800 p-8 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
            
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-gray-800 flex items-center justify-center text-3xl font-extrabold text-white shadow-inner border border-gray-700">
                {profile.username ? profile.username.charAt(0).toUpperCase() : 'U'}
              </div>
              
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-1">{profile.username}</h2>
                <p className="text-gray-400 text-sm">{profile.email}</p>
              </div>
            </div>
          </div>

          <div className="bg-[#1e293b] rounded-2xl border border-gray-800 p-8 shadow-xl">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
              Change Password
            </h3>
            
            {status.message && (
              <div className={`p-4 rounded-lg mb-6 text-sm font-bold border ${status.type === 'error' ? 'bg-red-900/10 text-red-400 border-red-900/50' : 'bg-green-900/10 text-green-400 border-green-900/50'}`}>
                {status.message}
              </div>
            )}

            <form onSubmit={handlePasswordUpdate} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Current Password</label>
                <input type="password" required value={passwords.currentPassword} onChange={e => setPasswords({...passwords, currentPassword: e.target.value})} className="w-full bg-[#0f172a] border border-gray-700 rounded-lg p-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">New Password</label>
                <input type="password" required value={passwords.newPassword} onChange={e => setPasswords({...passwords, newPassword: e.target.value})} className="w-full bg-[#0f172a] border border-gray-700 rounded-lg p-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Confirm New Password</label>
                <input type="password" required value={passwords.confirmPassword} onChange={e => setPasswords({...passwords, confirmPassword: e.target.value})} className="w-full bg-[#0f172a] border border-gray-700 rounded-lg p-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition" />
              </div>
              
              <div className="pt-2 flex justify-end">
                <button type="submit" className="px-8 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition shadow-lg hover:shadow-blue-500/20">
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}