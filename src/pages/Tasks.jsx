import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { useTasks } from '../context/TaskContext';
import { CheckCircle2, Circle, Clock, Trash2, Plus, AlertCircle, CheckSquare } from 'lucide-react';

export default function Tasks() {
  const { tasks, addTask, toggleTaskStatus, deleteTask } = useTasks();
  const [isAdding, setIsAdding] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    duration: 1,
    deadline: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title) return;
    
    // Default deadline to today if none specified
    const finalDeadline = formData.deadline || new Date().toISOString().split('T')[0];
    
    addTask({ ...formData, deadline: new Date(finalDeadline).toISOString() });
    setFormData({ title: '', description: '', priority: 'Medium', duration: 1, deadline: '' });
    setIsAdding(false);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Task Management</h1>
            <p className="text-slate-500 mt-1">Manage your pipeline for smart scheduling</p>
          </div>
          <button 
            onClick={() => setIsAdding(!isAdding)}
            className="bg-blue-600 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition flex items-center gap-2 shadow-sm"
          >
            <Plus size={20} />
            New Task
          </button>
        </div>

        {isAdding && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8 animate-in fade-in slide-in-from-top-4">
            <h2 className="text-lg font-semibold mb-4 text-slate-800">Add New Task</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Task Title <span className="text-red-500">*</span></label>
                <input 
                  type="text" required autoFocus
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                  value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea 
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 h-24"
                  value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
                <select 
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 bg-white"
                  value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})}
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Duration (Hours)</label>
                <input 
                  type="number" min="0.5" step="0.5" required
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                  value={formData.duration} onChange={e => setFormData({...formData, duration: parseFloat(e.target.value)})}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Deadline</label>
                <input 
                  type="date"
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                  value={formData.deadline} onChange={e => setFormData({...formData, deadline: e.target.value})}
                />
              </div>

              <div className="md:col-span-2 flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition">
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition shadow-sm">
                  Save Task
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {tasks.length === 0 ? (
            <div className="p-12 text-center text-slate-500 flex flex-col items-center">
              <CheckSquare className="w-16 h-16 text-slate-200 mb-4" />
              <p className="text-lg font-medium">No tasks found</p>
              <p className="text-sm mt-1">Add a task to start letting AI schedule your day.</p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {tasks.map(task => (
                <li key={task.id} className={`p-4 sm:p-6 hover:bg-slate-50 transition group flex items-start gap-4 ${task.completed ? 'opacity-60' : ''}`}>
                  <button onClick={() => toggleTaskStatus(task.id)} className="mt-1 flex-shrink-0 text-slate-400 hover:text-blue-600 transition">
                    {task.completed ? <CheckCircle2 className="text-green-500" size={24} /> : <Circle size={24} />}
                  </button>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className={`text-lg font-semibold text-slate-900 truncate ${task.completed ? 'line-through text-slate-500' : ''}`}>
                        {task.title}
                      </h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border
                        ${task.priority === 'High' ? 'bg-red-50 text-red-700 border-red-200' : 
                          task.priority === 'Medium' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 
                          'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
                        {task.priority}
                      </span>
                    </div>
                    {task.description && <p className="text-slate-600 sm:text-sm line-clamp-2 mb-3 leading-relaxed">{task.description}</p>}
                    
                    <div className="flex flex-wrap gap-4 text-xs font-medium text-slate-500">
                      <span className="flex items-center gap-1.5"><Clock size={14} className="text-slate-400"/> {task.duration} hr{task.duration > 1 ? 's' : ''}</span>
                      <span className="flex items-center gap-1.5"><AlertCircle size={14} className="text-slate-400"/> Due {new Date(task.deadline).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => deleteTask(task.id)}
                    className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition"
                  >
                    <Trash2 size={20} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}
