import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await api.get('/api/v1/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      // Find the task we are updating to keep other fields intact
      const taskToUpdate = tasks.find(t => t.id === taskId);
      
      // Send the update to Spring Boot
      await api.put(`/api/v1/tasks/${taskId}`, { 
        ...taskToUpdate, 
        status: newStatus 
      });
      
      // Update the React UI instantly
      setTasks(tasks.map(task => 
        task.id === taskId ? { ...task, status: newStatus } : task
      ));
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Could not update task status.");
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await api.delete(`/api/v1/tasks/${taskId}`);
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  // Apply the selected filter
  const filteredTasks = tasks.filter(task => 
    filter === 'ALL' ? true : task.status === filter
  );

  return (
    <div className="flex min-h-screen bg-[#0f172a] font-sans">
      
      {/* Sidebar Placeholder (To match your Dashboard) */}
      <div className="w-64 bg-[#1e293b] border-r border-gray-800 flex flex-col hidden md:flex">
        <div className="p-6">
          <h2 className="text-2xl font-extrabold text-white">Synapse<span className="text-blue-500">Flow</span></h2>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <button onClick={() => navigate('/dashboard')} className="w-full text-left px-4 py-3 text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg transition">Dashboard</button>
          <button className="w-full text-left px-4 py-3 bg-blue-600 text-white rounded-lg font-bold shadow-lg">My Tasks</button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 lg:p-12 overflow-auto">
        <div className="max-w-6xl mx-auto">
          
          {/* Header & Filters */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-white mb-1">Task Management</h1>
              <p className="text-gray-400">View, filter, and organize your engineering workload.</p>
            </div>
            
            <div className="flex bg-[#1e293b] p-1 rounded-lg border border-gray-700">
              {['ALL', 'TODO', 'IN_PROGRESS', 'COMPLETED'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-md text-sm font-bold transition ${
                    filter === status 
                      ? 'bg-blue-600 text-white shadow' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {status.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-[#1e293b] rounded-xl border border-gray-700 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-gray-300">
                <thead className="bg-[#0f172a] text-gray-400 text-xs uppercase font-bold border-b border-gray-700">
                  <tr>
                    <th className="px-6 py-4">Task Name</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Due Date</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/50">
                  {isLoading ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-8 text-center text-gray-500">Loading your tasks...</td>
                    </tr>
                  ) : filteredTasks.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-8 text-center text-gray-500">No tasks found for this filter.</td>
                    </tr>
                  ) : (
                    filteredTasks.map((task) => (
                      <tr key={task.id} className="hover:bg-gray-800/50 transition">
                        <td className="px-6 py-4">
                          <div className="font-bold text-white mb-1">{task.title}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">{task.description}</div>
                        </td>
                        
                        {/* --- DYNAMIC STATUS DROPDOWN --- */}
                        <td className="px-6 py-4">
                          <select
                            value={task.status}
                            onChange={(e) => handleStatusChange(task.id, e.target.value)}
                            className={`text-xs font-bold px-3 py-1.5 rounded-full cursor-pointer outline-none appearance-none border transition-colors ${
                              task.status === 'COMPLETED' ? 'bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20' :
                              task.status === 'IN_PROGRESS' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20' :
                              'bg-gray-600/20 text-gray-400 border-gray-600/30 hover:bg-gray-600/40'
                            }`}
                          >
                            <option value="TODO" className="bg-gray-800 text-gray-300">TODO</option>
                            <option value="IN_PROGRESS" className="bg-gray-800 text-blue-400">IN PROGRESS</option>
                            <option value="COMPLETED" className="bg-gray-800 text-green-400">COMPLETED</option>
                          </select>
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-400">
                          {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No Date Set'}
                        </td>
                        
                        {/* --- ACTIONS --- */}
                        <td className="px-6 py-4 text-right space-x-3">
                          <button 
                            onClick={() => handleDeleteTask(task.id)}
                            className="text-red-400 hover:text-red-300 font-semibold text-sm transition"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}