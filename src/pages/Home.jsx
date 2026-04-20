import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useTasks } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';
import { useSmartSchedule } from '../hooks/useSmartSchedule';
import { CheckCircle2, Clock, CalendarIcon, ArrowRight, Brain, BatteryMedium } from 'lucide-react';

export default function Home() {
  const { user } = useAuth();
  const { tasks, toggleTaskStatus } = useTasks();
  const schedule = useSmartSchedule(tasks);

  const stats = useMemo(() => {
    const completed = tasks.filter(t => t.completed).length;
    const pending = tasks.length - completed;
    return { total: tasks.length, completed, pending };
  }, [tasks]);

  // AI Insights
  const overloadWarning = schedule.length > 5;
  const nextTask = schedule[0];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Welcome back, {user?.display_name || 'Planner'}!
          </h1>
          <p className="text-slate-500 mt-2 text-lg">
            Here's what your intelligent schedule looks like for today.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Smart Schedule */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* AI Banner */}
            <div className={`p-4 rounded-xl flex items-start gap-4 shadow-sm border ${overloadWarning ? 'bg-orange-50 border-orange-200 text-orange-800' : 'bg-blue-50 border-blue-200 text-blue-800'}`}>
              <Brain className="flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-base mb-1">
                  {overloadWarning ? 'Schedule Overload Detected' : 'Smart Schedule Optimized'}
                </h3>
                <p className="text-sm opacity-90">
                  {overloadWarning 
                    ? "You have a lot mapped out today. Consider postponing some Low priority tasks to tomorrow to maintain productivity without burning out."
                    : "Your day is perfectly balanced. I've automatically prioritized your deadlines and high-priority items first."}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-800">Up Next</h2>
                <Link to="/calendar" className="text-sm text-blue-600 font-medium hover:text-blue-700 flex items-center gap-1">
                  Full Timeline <ArrowRight size={16} />
                </Link>
              </div>

              {schedule.length === 0 ? (
                <div className="text-center py-12 px-6 bg-emerald-50 rounded-2xl border border-emerald-100">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="text-emerald-800 text-xl font-bold mb-2">
                    Well done, {user?.display_name || 'there'}!
                  </h3>
                  <p className="text-emerald-600 font-medium">You have completed all your tasks for today.</p>
                  <Link to="/tasks" className="mt-6 inline-block px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium text-sm transition-colors shadow-sm">
                    Plan More Tasks
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {schedule.slice(0, 3).map((task, idx) => {
                    const isNext = idx === 0;
                    return (
                      <div key={task.id} className={`p-4 rounded-xl border flex gap-4 transition-all ${isNext ? 'bg-blue-50 border-blue-200 shadow-sm' : 'bg-white border-slate-100 hover:border-slate-300'}`}>
                        <div className="hidden sm:block flex-shrink-0 text-center w-16">
                          <div className={`text-sm font-bold ${isNext ? 'text-blue-700' : 'text-slate-500'}`}>
                            {task.suggestedStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                          <div className="text-xs text-slate-400 mt-1">{task.duration} hr</div>
                        </div>
                        
                        <div className="flex-1">
                          <h4 className={`font-semibold text-lg ${isNext ? 'text-blue-900' : 'text-slate-800'}`}>{task.title}</h4>
                          <div className="flex items-center gap-3 mt-2 text-xs font-medium">
                            <span className={`px-2 py-0.5 rounded-full ${task.priority === 'High' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'}`}>
                              {task.priority}
                            </span>
                            <span className="text-slate-500 flex items-center gap-1">
                              <BatteryMedium size={14} /> Energy needed
                            </span>
                          </div>
                        </div>

                        <button 
                          onClick={() => toggleTaskStatus(task.id)}
                          className="flex items-center justify-center h-10 w-10 shrink-0 text-slate-400 hover:text-green-500 hover:bg-green-50 rounded-full transition"
                        >
                          <CheckCircle2 size={24} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Mini Stats */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-bold text-slate-800 mb-4">Daily Overview</h2>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-1">{stats.pending}</div>
                  <div className="text-xs font-medium text-slate-500 uppercase tracking-widest">Pending</div>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                  <div className="text-3xl font-bold text-emerald-500 mb-1">{stats.completed}</div>
                  <div className="text-xs font-medium text-slate-500 uppercase tracking-widest">Done</div>
                </div>
              </div>

              <h3 className="font-semibold text-slate-700 text-sm mb-3">Today's Progress</h3>
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full transition-all duration-500" 
                  style={{ width: `${stats.total === 0 ? 0 : (stats.completed / stats.total) * 100}%` }}
                ></div>
              </div>
              <p className="text-right text-xs text-slate-400 mt-2 font-medium">
                {stats.total === 0 ? 0 : Math.round((stats.completed / stats.total) * 100)}% Completed
              </p>
            </div>
            
            <div className="bg-slate-800 text-white rounded-2xl shadow-sm p-6 overflow-hidden relative">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                 <Brain size={120} />
               </div>
               <h3 className="relative z-10 font-bold text-lg mb-2">Pro Tip</h3>
               <p className="relative z-10 text-slate-300 text-sm leading-relaxed">
                 AI finds that dedicating 90-minute periods of deep work followed by 15-minute breaks maximizes focus. Your schedule is optimized for this cadence.
               </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
