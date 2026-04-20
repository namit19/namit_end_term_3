import React from 'react';
import Navbar from '../components/Navbar';
import { useTasks } from '../context/TaskContext';
import { useSmartSchedule } from '../hooks/useSmartSchedule';
import { Clock, CheckSquare } from 'lucide-react';

export default function Calendar() {
  const { tasks, toggleTaskStatus } = useTasks();
  const schedule = useSmartSchedule(tasks);

  const hours = Array.from({ length: 14 }, (_, i) => i + 8); // 8 AM to 9 PM

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 flex flex-col">
        <div className="mb-6 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Smart Daily Timeline</h1>
            <p className="text-slate-500 mt-1">AI-generated schedule based on real-time priorities.</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex-1 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 pb-20 relative">
            
            {schedule.length === 0 ? (
               <div className="h-full flex flex-col items-center justify-center text-slate-400">
                 <CheckSquare size={48} className="mb-4 opacity-50" />
                 <p className="text-lg">No incomplete tasks to schedule today.</p>
               </div>
            ) : (
               <div className="relative border-l-2 border-slate-100 ml-16 sm:ml-24">
                 
                 {/* Hourly Grid Lines */}
                 <div className="absolute inset-0 pointer-events-none">
                    {hours.map(hour => (
                      <div key={hour} className="relative h-24 border-b border-slate-50 border-dashed">
                        <div className="absolute -left-16 sm:-left-24 top-0 w-12 sm:w-20 text-right pr-4 text-xs font-semibold text-slate-400 -translate-y-1/2 bg-white z-10">
                          {hour > 12 ? `${hour - 12}:00 PM` : `${hour}:00 AM`}
                        </div>
                      </div>
                    ))}
                 </div>

                 {/* Task Blocks */}
                 <div className="relative mt-12 w-full pt-4">
                   {schedule.map((task, i) => {
                      // Using a simple stacking approach for visualization to avoid complex absolute positioning in a simplified timeline
                      return (
                         <div key={task.id} className="mb-6 relative w-full sm:w-[80%] max-w-2xl transform transition-transform hover:scale-[1.01]">
                           <div className="absolute -left-2 w-4 h-4 rounded-full bg-blue-500 border-4 border-white shadow-sm z-20"></div>
                           
                           <div className="ml-6 sm:ml-8 bg-white border border-slate-200 shadow-sm rounded-xl p-4 cursor-pointer hover:border-blue-300 transition-colors group" onClick={() => toggleTaskStatus(task.id)}>
                             <div className="flex justify-between items-start mb-2">
                               <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                                 <Clock size={12} />
                                 {task.suggestedStart.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {task.suggestedEnd.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                               </div>
                               <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded
                                  ${task.priority === 'High' ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-500'}`}>
                                  {task.priority}
                               </span>
                             </div>
                             
                             <h3 className="font-bold text-slate-800 text-lg">{task.title}</h3>
                             {task.description && <p className="text-sm text-slate-500 mt-1 line-clamp-1">{task.description}</p>}
                             
                             <div className="mt-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-xs font-medium text-slate-400">Click to mark as done</span>
                             </div>
                           </div>
                         </div>
                      );
                   })}
                 </div>

               </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
