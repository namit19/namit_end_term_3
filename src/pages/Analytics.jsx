import React, { useMemo } from 'react';
import Navbar from '../components/Navbar';
import { useTasks } from '../context/TaskContext';
import { Target, TrendingUp, Zap, Clock } from 'lucide-react';

export default function Analytics() {
  const { tasks } = useTasks();

  const data = useMemo(() => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed);
    const completedCount = completedTasks.length;
    const completionRate = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;
    
    const hoursInvested = completedTasks.reduce((sum, task) => sum + (Number(task.duration) || 0), 0);
    const averageTaskDuration = completedCount > 0 ? (hoursInvested / completedCount).toFixed(1) : 0;

    return { totalTasks, completedCount, completionRate, hoursInvested, averageTaskDuration };
  }, [tasks]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Productivity Analytics</h1>
          <p className="text-slate-500 mt-1">Insights and trends based on your planning behavior.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
              <Target size={24} />
            </div>
            <h3 className="text-slate-500 font-medium text-sm">Completion Rate</h3>
            <div className="text-3xl font-bold text-slate-800 mt-1">{data.completionRate}%</div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
              <TrendingUp size={24} />
            </div>
            <h3 className="text-slate-500 font-medium text-sm">Tasks Completed</h3>
            <div className="text-3xl font-bold text-slate-800 mt-1">{data.completedCount} / {data.totalTasks}</div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-4">
              <Clock size={24} />
            </div>
            <h3 className="text-slate-500 font-medium text-sm">Hours Invested</h3>
            <div className="text-3xl font-bold text-slate-800 mt-1">{data.hoursInvested}h</div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-4">
              <Zap size={24} />
            </div>
            <h3 className="text-slate-500 font-medium text-sm">Avg Duration</h3>
            <div className="text-3xl font-bold text-slate-800 mt-1">{data.averageTaskDuration}h</div>
          </div>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6/8 rounded-2xl shadow-sm border border-slate-200 p-8 min-h-[300px] flex flex-col items-center justify-center text-center">
            <div className="relative w-48 h-48 rounded-full border-8 border-slate-100 flex items-center justify-center mb-4">
               {/* simple CSS ring for donut chart viz */}
               <svg className="absolute w-full h-full -rotate-90">
                 <circle
                   cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="16" fill="transparent"
                   className="text-blue-500"
                   strokeDasharray="552"
                   strokeDashoffset={552 - (552 * data.completionRate) / 100}
                 />
               </svg>
               <span className="text-4xl font-bold text-slate-800">{data.completionRate}%</span>
            </div>
            <h3 className="font-semibold text-slate-700">Daily Goal Progress</h3>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <h3 className="font-semibold text-lg text-slate-800 mb-6">AI Assessment</h3>
            <div className="space-y-4">
               <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                 <h4 className="font-semibold text-slate-800 mb-1">Focus Score: <span className="text-emerald-600">Excellent</span></h4>
                 <p className="text-sm text-slate-600">Your tendency to complete High priority tasks early in the day positively affects your focus score.</p>
               </div>
               <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                 <h4 className="font-semibold text-slate-800 mb-1">Time Estimation: <span className="text-amber-600">Needs Improvement</span></h4>
                 <p className="text-sm text-slate-600">You frequently schedule tasks sequentially. AI suggests adding 15 minute buffers to avoid spill-over.</p>
               </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
