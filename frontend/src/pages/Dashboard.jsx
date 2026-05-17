import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../api';

export default function Dashboard() {
  const navigate = useNavigate(); 
  
  const [tasks, setTasks] = useState([]); 
  const [aiSummary, setAiSummary] = useState("Analyzing your workload..."); 
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', status: 'TODO', dueDate: '' });

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (!token) return navigate('/login');

    const fetchTasks = async () => {
      try {
        const taskResponse = await api.get('/api/v1/tasks'); 
        setTasks(Array.isArray(taskResponse.data) ? taskResponse.data : []);
      } catch (error) {
        if (error.response?.status === 401 || error.response?.status === 403) {
          localStorage.removeItem('jwt');
          navigate('/login');
        }
      } finally {
        setIsLoading(false); 
      }
    };

    const fetchAiSummary = async () => {
      // --- THE CACHE CHECK ---
      // 1. Look in the browser's session memory first
      const cachedSummary = sessionStorage.getItem('aiSummaryCache');
      
      if (cachedSummary) {
        // 2. If it exists, use it instantly and skip the API call!
        setAiSummary(cachedSummary);
        return; 
      }

      // 3. If it doesn't exist, call the slow AI endpoint
      try {
        const aiResponse = await api.get('/api/v1/ai/summary');
        const newSummary = aiResponse.data.summary;
        
        setAiSummary(newSummary);
        // 4. Save the result to the cache so we don't have to fetch it again!
        sessionStorage.setItem('aiSummaryCache', newSummary);
        
      } catch (aiError) {
        setAiSummary("Your AI Coach is taking a quick coffee break. Keep up the great work!");
      }
    };

    fetchTasks();
    fetchAiSummary();
  }, [navigate]);

  // --- DATA AGGREGATION FOR THE CHART ---
  const taskStats = [
    { name: 'To Do', value: tasks.filter(t => t.status === 'TODO').length, color: '#64748b' },
    { name: 'In Progress', value: tasks.filter(t => t.status === 'IN_PROGRESS').length, color: '#3b82f6' },
    { name: 'Completed', value: tasks.filter(t => t.status === 'COMPLETED').length, color: '#22c55e' }
  ].filter(stat => stat.value > 0); 

   const handleCreateTask = async (e) => {
    e.preventDefault(); 
    try {
      const response = await api.post('/api/v1/tasks', { 
        title: newTask.title,
        description: newTask.description,
        status: newTask.status,
        // FIX: Reverted to ISOString so your Spring Boot backend can parse it!
        dueDate: newTask.dueDate ? new Date(newTask.dueDate).toISOString() : null 
      });
      
      setTasks([...tasks, response.data]);
      setIsModalOpen(false);
      setNewTask({ title: '', description: '', status: 'TODO', dueDate: '' });
    } catch (error) { 
      console.error(error);
      alert(error.response?.data?.message || "Error creating task."); 
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('jwt'); navigate('/login'); 
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const taskToUpdate = tasks.find(t => t.id === taskId);
      await api.put(`/api/v1/tasks/${taskId}`, { ...taskToUpdate, status: newStatus });
      setTasks(tasks.map(task => task.id === taskId ? { ...task, status: newStatus } : task));
    } catch (error) { alert("Could not update task."); }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await api.delete(`/api/v1/tasks/${taskId}`);
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (error) { alert("Could not delete task."); }
  };

  return (
    <div className="flex min-h-screen bg-[#0f172a] font-sans">
      
      {/* Sidebar */}
      <div className="w-64 bg-[#1e293b] border-r border-gray-800 hidden md:flex flex-col justify-between">
        <div>
          <div className="p-6">
            <h2 className="text-2xl font-extrabold text-white">Synapse<span className="text-blue-500">Flow</span></h2>
          </div>
          <nav className="flex-1 px-4 space-y-2 mt-4">
            <button className="w-full text-left px-4 py-3 bg-blue-600 text-white rounded-lg font-bold shadow-lg">Dashboard</button>
            <button onClick={() => navigate('/tasks')} className="w-full text-left px-4 py-3 text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg transition">My Tasks</button>
            <button onClick={() => navigate('/settings')} className="w-full text-left px-4 py-3 text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg transition">Settings</button>
          </nav>
        </div>
        <div className="p-4"><button onClick={handleLogout} className="w-full bg-red-600/10 text-red-500 font-bold py-3 rounded-lg hover:bg-red-600 hover:text-white transition">Logout</button></div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="bg-[#1e293b] border-b border-gray-800 p-6 flex justify-between items-center shrink-0">
          <h1 className="text-2xl font-bold text-white">Welcome back, Engineer</h1>
          <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-lg font-bold transition shadow-lg">+ Create Task</button>
        </header>

        <main className="p-8 lg:p-12 overflow-y-auto flex-1">
          <div className="max-w-6xl mx-auto">
            
            {/* Split Panel Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
              <div className="lg:col-span-2 bg-gradient-to-r from-blue-900/40 to-indigo-900/40 rounded-2xl p-8 shadow-xl border border-blue-500/20 relative overflow-hidden flex flex-col justify-center">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-indigo-500"></div>
                <h3 className="text-xl font-bold text-white mb-3 flex items-center">
                  <span className="mr-3 text-2xl">🧠</span> AI Productivity Coach
                </h3>
                <p className="text-gray-300 leading-relaxed font-medium">{aiSummary}</p>
              </div>

              <div className="bg-[#1e293b] rounded-2xl p-6 shadow-xl border border-gray-800 flex flex-col items-center justify-center min-h-[250px]">
                <h3 className="text-md font-bold text-gray-400 uppercase tracking-wider w-full text-center mb-2">Task Velocity</h3>
                {taskStats.length === 0 ? (
                  <p className="text-sm text-gray-500 mt-8">No data to display</p>
                ) : (
                  <div className="w-full h-[200px]">
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie data={taskStats} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                          {taskStats.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }} itemStyle={{ color: '#fff' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            </div>

            <h3 className="text-xl font-bold text-white mb-6">Your Active Tasks</h3>
            
            {isLoading ? (
              <div className="p-12 text-center border border-gray-800 rounded-2xl bg-[#1e293b]"><p className="text-gray-400 font-bold animate-pulse">Loading your workspace...</p></div>
            ) : tasks.length === 0 ? (
              <div className="p-12 text-center border border-gray-800 rounded-2xl bg-[#1e293b]"><p className="text-gray-400 font-medium">You don't have any tasks yet. Time to get to work!</p></div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {tasks.map((task) => (
                  <div key={task.id} className="bg-[#1e293b] rounded-2xl p-6 border border-gray-800 shadow-xl flex flex-col justify-between transition-all hover:border-gray-600 hover:shadow-2xl">
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="text-white font-bold text-lg leading-tight pr-4">{task.title}</h4>
                        <select
                            value={task.status}
                            onChange={(e) => handleStatusChange(task.id, e.target.value)}
                            className={`text-[10px] uppercase tracking-wider font-extrabold px-3 py-1.5 rounded-full cursor-pointer outline-none appearance-none border transition-colors shrink-0 ${
                              task.status === 'COMPLETED' ? 'bg-green-500/10 text-green-400 border-green-500/20' : task.status === 'IN_PROGRESS' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-gray-600/20 text-gray-400 border-gray-600/30'
                            }`}
                          >
                            <option value="TODO" className="bg-gray-800 text-gray-300">TODO</option>
                            <option value="IN_PROGRESS" className="bg-gray-800 text-blue-400">IN PROGRESS</option>
                            <option value="COMPLETED" className="bg-gray-800 text-green-400">COMPLETED</option>
                          </select>
                      </div>
                      <p className="text-gray-400 text-sm mb-6 leading-relaxed line-clamp-3">{task.description}</p>
                    </div>
                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-800/60">
                      <span className="text-xs font-medium text-gray-500">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No Deadline'}</span>
                      <button onClick={() => handleDeleteTask(task.id)} className="text-xs font-bold text-red-400 hover:text-red-300 bg-red-400/10 hover:bg-red-400/20 px-3 py-1.5 rounded-lg transition">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex justify-center items-center backdrop-blur-sm z-50 px-4">
          <div className="bg-[#1e293b] p-8 rounded-2xl border border-gray-700 shadow-2xl w-full max-w-md">
            <h2 className="text-2xl font-bold text-white mb-6">Create New Task</h2>
            <form onSubmit={handleCreateTask} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Task Title</label>
                <input type="text" required autoFocus className="w-full bg-[#0f172a] border border-gray-700 rounded-lg p-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition" value={newTask.title} onChange={(e) => setNewTask({...newTask, title: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                <textarea className="w-full bg-[#0f172a] border border-gray-700 rounded-lg p-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition resize-none" rows="3" value={newTask.description} onChange={(e) => setNewTask({...newTask, description: e.target.value})}></textarea>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
                  <select className="w-full bg-[#0f172a] border border-gray-700 rounded-lg p-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition" value={newTask.status} onChange={(e) => setNewTask({...newTask, status: e.target.value})}>
                    <option value="TODO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-300 mb-1">Due Date</label>
                  <input type="date" className="w-full bg-[#0f172a] border border-gray-700 rounded-lg p-3 text-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition cursor-pointer" value={newTask.dueDate} onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})} />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-800">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-lg font-bold text-gray-400 hover:text-white transition">Cancel</button>
                <button type="submit" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold transition shadow-lg hover:shadow-blue-500/20">Create Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}