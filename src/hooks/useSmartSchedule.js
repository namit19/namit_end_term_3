import { useMemo } from 'react';
import { isToday, isPast, parseISO } from 'date-fns';

/**
 * useSmartSchedule Hook
 *
 * This hook acts as the AI/brain of the smart scheduling system.
 * It uses `useMemo` to optimally sort and organize tasks without unnecessary recalculations.
 *
 * Sorting Algorithm:
 * 1. Filtering: Takes only incomplete tasks.
 * 2. Priorities: High > Medium > Low.
 * 3. Deadlines: Tasks closer to their deadline are scheduled earlier.
 * 4. Placement: Assigns specific time blocks starting from 9:00 AM (or current time if later).
 */
export function useSmartSchedule(tasks) {
  return useMemo(() => {
    if (!tasks || tasks.length === 0) return [];

    const pendingTasks = tasks.filter(t => !t.completed);

    const priorityWeights = { 'High': 3, 'Medium': 2, 'Low': 1 };

    // Sort heavily utilizing heuristic priority and deadlines
    const sorted = [...pendingTasks].sort((a, b) => {
      // 1. Guard against missing priority
      const weightA = priorityWeights[a.priority] || 0;
      const weightB = priorityWeights[b.priority] || 0;

      // 2. Primary sort: Priority
      if (weightA !== weightB) {
        return weightB - weightA;
      }

      // 3. Secondary sort: Deadline closeness
      if (a.deadline && b.deadline) {
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      }

      // 4. Fallback: Shortest duration first (quick wins)
      return (Number(a.duration) || 1) - (Number(b.duration) || 1);
    });

    // Smart Time Block Allocator
    const now = new Date();
    let currentHour = Math.max(9, now.getHours() + 1); // Start scheduling at 9AM or next hour
    let currentMinute = 0;

    const scheduledTimeline = sorted.map(task => {
      const durationHours = Number(task.duration) || 1;

      // Ensure we don't schedule arbitrarily late; carry over to next day if exceeded 6PM
      if (currentHour + durationHours > 18) {
        currentHour = 9; // Reset to morning (implies next day visually, simplified here)
      }

      const scheduledStart = new Date(now);
      scheduledStart.setHours(currentHour, currentMinute, 0, 0);

      const scheduledEnd = new Date(scheduledStart);
      scheduledEnd.setHours(scheduledStart.getHours() + durationHours);

      // Advance clock + Add 15 min break between tasks ideally
      currentHour += durationHours;
      currentMinute += 15;
      
      if (currentMinute >= 60) {
        currentHour += 1;
        currentMinute -= 60;
      }

      return {
        ...task,
        suggestedStart: scheduledStart,
        suggestedEnd: scheduledEnd
      };
    });

    return scheduledTimeline;
  }, [tasks]);
}
