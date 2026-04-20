import React, { createContext, useContext, useState, useEffect } from 'react';

const TaskContext = createContext();

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([]);

  // Load from local storage for persistence if Supabase isn't connected
  useEffect(() => {
    const saved = localStorage.getItem('smartPlannerTasks');
    if (saved) {
      setTasks(JSON.parse(saved));
    } else {
      // Default mockup task to show the schedule capabilities
      setTasks([
        {
          id: '1',
          title: 'Review System Design Document',
          description: 'Read over the new microservices architecture and leave comments.',
          priority: 'High',
          duration: 2, // hours
          deadline: new Date(Date.now() + 86400000).toISOString(),
          completed: false,
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          title: 'Sync with Product Team',
          description: 'Weekly sync regarding Q3 roadmap planning.',
          priority: 'Medium',
          duration: 1, // hours
          deadline: new Date(Date.now() + 86400000 * 2).toISOString(),
          completed: false,
          createdAt: new Date().toISOString()
        }
      ]);
    }
  }, []);

  // Save to local storage on changes
  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem('smartPlannerTasks', JSON.stringify(tasks));
    }
  }, [tasks]);

  const addTask = (taskData) => {
    const newTask = {
      id: crypto.randomUUID(),
      ...taskData,
      completed: false,
      createdAt: new Date().toISOString()
    };
    setTasks(prev => [...prev, newTask]);
  };

  const updateTask = (id, updates) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const toggleTaskStatus = (id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  return (
    <TaskContext.Provider value={{ tasks, addTask, updateTask, deleteTask, toggleTaskStatus }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  return useContext(TaskContext);
}
