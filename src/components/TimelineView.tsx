import React, { useState } from 'react';
import {
  CheckSquare,
  PlusCircle,
  Search,
  Filter,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle2,
  Trash2,
  Edit2,
  X,
  User,
  Tag
} from 'lucide-react';
import { AppEvent, TimelineTask } from '../types';
import { formatDate } from '../lib/formatters';

interface TimelineViewProps {
  activeEvent: AppEvent;
  tasks: TimelineTask[];
  onAddTask: (task: TimelineTask) => void;
  onUpdateTask: (task: TimelineTask) => void;
  onDeleteTask: (id: string) => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  activeEvent,
  tasks,
  onAddTask,
  onUpdateTask,
  onDeleteTask
}) => {
  const [viewMode, setViewMode] = useState<'list' | 'milestones'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TimelineTask | null>(null);
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [category, setCategory] = useState('Planning');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [status, setStatus] = useState<'todo' | 'in_progress' | 'completed'>('todo');
  const [owner, setOwner] = useState('Host');
  const [notes, setNotes] = useState('');

  // Statistics
  const completedCount = tasks.filter((t) => t.status === 'completed').length;
  const inProgressCount = tasks.filter((t) => t.status === 'in_progress').length;
  const todoCount = tasks.filter((t) => t.status === 'todo').length;
  const totalCount = tasks.length;
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    if (searchQuery.trim() && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (filterPriority !== 'All' && task.priority !== filterPriority) return false;
    if (filterStatus !== 'All' && task.status !== filterStatus) return false;
    return true;
  });

  const handleToggleComplete = (task: TimelineTask) => {
    onUpdateTask({
      ...task,
      status: task.status === 'completed' ? 'todo' : 'completed'
    });
  };

  const handleOpenAddModal = () => {
    setEditingTask(null);
    setTitle('');
    setDueDate(activeEvent.date);
    setCategory('Coordination');
    setPriority('medium');
    setStatus('todo');
    setOwner('Host');
    setNotes('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (task: TimelineTask) => {
    setEditingTask(task);
    setTitle(task.title);
    setDueDate(task.dueDate);
    setCategory(task.category);
    setPriority(task.priority);
    setStatus(task.status);
    setOwner(task.owner);
    setNotes(task.notes || '');
    setIsModalOpen(true);
  };

  const handleSaveTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingTask) {
      onUpdateTask({
        ...editingTask,
        title,
        dueDate,
        category,
        priority,
        status,
        owner,
        notes
      });
    } else {
      const newTask: TimelineTask = {
        id: `t-${Date.now()}`,
        eventId: activeEvent.id,
        title,
        dueDate,
        category,
        priority,
        status,
        owner,
        notes
      };
      onAddTask(newTask);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#5B5CF0] bg-indigo-50 px-2.5 py-0.5 rounded-full">
              Milestone Manager
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-semibold text-slate-600">Event Date: {formatDate(activeEvent.date)}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#14213D] font-heading">
            Timeline & Tasks
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Track deadlines, task owners, and critical milestones leading up to {activeEvent.title}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                viewMode === 'list' ? 'bg-white text-[#5B5CF0] shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              List View
            </button>
            <button
              onClick={() => setViewMode('milestones')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                viewMode === 'milestones' ? 'bg-white text-[#5B5CF0] shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Milestone Flow
            </button>
          </div>

          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-1.5 bg-[#5B5CF0] hover:bg-[#494ACF] text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-indigo-500/20 transition cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Progress Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Tasks</span>
          <span className="text-2xl font-black text-[#14213D] font-heading">{totalCount}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider block">Completed</span>
          <span className="text-2xl font-black text-emerald-600 font-heading">{completedCount}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider block">In Progress</span>
          <span className="text-2xl font-black text-amber-600 font-heading">{inProgressCount}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-bold text-[#5B5CF0] uppercase tracking-wider block">Progress</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-[#5B5CF0] font-heading">{progressPct}%</span>
            <span className="text-xs text-slate-400">{todoCount} pending</span>
          </div>
        </div>
      </div>

      {/* Task Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks..."
            className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#5B5CF0]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white"
          >
            <option value="All">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white"
          >
            <option value="All">All Statuses</option>
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* LIST VIEW */}
      {viewMode === 'list' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs divide-y divide-slate-100 overflow-hidden">
          {filteredTasks.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              No tasks match your filters. Click "+ Add Task" to create one.
            </div>
          ) : (
            filteredTasks.map((task) => {
              const isCompleted = task.status === 'completed';
              return (
                <div
                  key={task.id}
                  className={`p-4 sm:p-5 flex items-start justify-between gap-4 transition hover:bg-slate-50/70 ${
                    isCompleted ? 'bg-slate-50/40 opacity-70' : ''
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <button
                      onClick={() => handleToggleComplete(task)}
                      className={`mt-0.5 w-5 h-5 rounded-lg flex items-center justify-center transition cursor-pointer ${
                        isCompleted
                          ? 'bg-emerald-500 text-white'
                          : 'border-2 border-slate-300 hover:border-indigo-500'
                      }`}
                    >
                      {isCompleted && <CheckCircle2 className="w-4 h-4 text-white" />}
                    </button>

                    <div>
                      <h4 className={`text-sm font-bold ${isCompleted ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                        {task.title}
                      </h4>
                      <div className="flex flex-wrap items-center gap-2.5 mt-1.5 text-[11px] text-slate-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>Due: {task.dueDate}</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          <span>Owner: {task.owner}</span>
                        </span>
                        <span>•</span>
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.2 rounded-md font-medium">
                          {task.category}
                        </span>
                      </div>
                      {task.notes && (
                        <p className="text-xs text-slate-500 mt-2 bg-slate-50 p-2 rounded-lg border border-slate-100 max-w-xl">
                          {task.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      task.priority === 'high'
                        ? 'bg-rose-100 text-rose-700'
                        : task.priority === 'medium'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {task.priority}
                    </span>

                    <button
                      onClick={() => handleOpenEditModal(task)}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                      title="Edit task"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteTask(task.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                      title="Delete task"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* MILESTONE FLOW VIEW */}
      {viewMode === 'milestones' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
          <h3 className="text-base font-bold text-slate-900 font-heading">
            Chronological Milestone Sequence
          </h3>
          <div className="relative border-l-2 border-indigo-200 ml-4 space-y-6 pl-6">
            {filteredTasks.map((task, idx) => (
              <div key={task.id} className="relative">
                <div className={`absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 border-white ${
                  task.status === 'completed' ? 'bg-emerald-500' : 'bg-[#5B5CF0]'
                }`} />
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-indigo-600 tracking-wider">
                      Phase {idx + 1} • {task.dueDate}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 mt-0.5">{task.title}</h4>
                    <p className="text-xs text-slate-500">Lead Owner: {task.owner} ({task.category})</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    task.status === 'completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {task.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add / Edit Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900 font-heading">
                {editingTask ? 'Edit Task' : 'Add Planning Task'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTask} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Task Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Confirm photographer drone coverage agreement"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#5B5CF0]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Due Date</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#5B5CF0]"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Task Owner</label>
                  <input
                    type="text"
                    value={owner}
                    onChange={(e) => setOwner(e.target.value)}
                    placeholder="Host, Meera (Planner), etc."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#5B5CF0]"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#5B5CF0] bg-white"
                  >
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low Priority</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#5B5CF0] bg-white"
                  >
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Category</label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Venue, Catering, Florist, Logistics..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#5B5CF0]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Notes & Checkpoints</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Dependencies, contact numbers, instructions..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#5B5CF0] resize-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#5B5CF0] hover:bg-[#494ACF] text-white rounded-xl font-bold shadow-md shadow-indigo-500/20"
                >
                  {editingTask ? 'Save Changes' : 'Add Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
