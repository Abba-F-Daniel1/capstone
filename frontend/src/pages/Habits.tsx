import { useEffect, useState } from 'react';
import { Plus, Search, Filter, Target, CheckCircle, Pause, Play } from 'lucide-react';
import { useHabitStore } from '../store/habitStore';
import { Habit } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';

const Habits: React.FC = () => {
  const { habits, isLoading, fetchHabits, deleteHabit, updateHabit, createHabitEntry } = useHabitStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    fetchHabits();
  }, [fetchHabits]);

  const handleStatusChange = async (habitId: string, newStatus: Habit['status']) => {
    try {
      await updateHabit(habitId, { status: newStatus });
    } catch (error) {
      // Error handled by store
    }
  };

  const handleDelete = async (habitId: string) => {
    if (window.confirm('Are you sure you want to delete this habit?')) {
      try {
        await deleteHabit(habitId);
      } catch (error) {
        // Error handled by store
      }
    }
  };

  const handleTodayEntry = async (habitId: string) => {
    const today = new Date().toISOString().split('T')[0];
    try {
      await createHabitEntry(habitId, { date: today, value: 1 });
    } catch (error) {
      // Error handled by store
    }
  };

  const filteredHabits = habits.filter(habit => {
    const matchesSearch = habit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         habit.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || habit.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getFrequencyColor = (frequency: Habit['frequency']) => {
    switch (frequency) {
      case 'DAILY': return 'text-blue-600 bg-blue-100';
      case 'WEEKLY': return 'text-purple-600 bg-purple-100';
      case 'MONTHLY': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: Habit['status']) => {
    switch (status) {
      case 'ACTIVE': return <Play className="h-5 w-5 text-green-600" />;
      case 'PAUSED': return <Pause className="h-5 w-5 text-yellow-600" />;
      case 'COMPLETED': return <CheckCircle className="h-5 w-5 text-blue-600" />;
      default: return <Target className="h-5 w-5 text-gray-400" />;
    }
  };

  const isTodayCompleted = (habit: Habit) => {
    const today = new Date().toISOString().split('T')[0];
    return habit.entries?.some(entry => entry.date === today);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Habits</h1>
          <p className="text-gray-600">Track your daily habits and build consistency.</p>
        </div>
        <button className="btn btn-primary btn-md">
          <Plus className="h-4 w-4 mr-2" />
          New Habit
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="card-content">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search habits..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input pl-10"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input"
              >
                <option value="all">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="PAUSED">Paused</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Habits List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <LoadingSpinner size="lg" />
          </div>
        ) : filteredHabits.length > 0 ? (
          filteredHabits.map((habit) => (
            <div key={habit.id} className="card">
              <div className="card-content">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <button
                      onClick={() => getStatusIcon(habit.status)}
                      className="mt-1"
                    >
                      {getStatusIcon(habit.status)}
                    </button>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium text-gray-900">{habit.name}</h3>
                      {habit.description && (
                        <p className="text-gray-600 mt-1">{habit.description}</p>
                      )}
                      <div className="flex items-center space-x-4 mt-2">
                        <span className={`badge ${getFrequencyColor(habit.frequency)}`}>
                          {habit.frequency}
                        </span>
                        {habit.targetValue && habit.unit && (
                          <span className="text-sm text-gray-500">
                            Target: {habit.targetValue} {habit.unit}
                          </span>
                        )}
                        <span className="text-sm text-gray-500">
                          {habit._count?.entries || 0} entries
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {habit.status === 'ACTIVE' && (
                      <button
                        onClick={() => handleTodayEntry(habit.id)}
                        disabled={isTodayCompleted(habit)}
                        className={`btn btn-sm ${
                          isTodayCompleted(habit) 
                            ? 'btn-success' 
                            : 'btn-secondary'
                        }`}
                      >
                        {isTodayCompleted(habit) ? 'Done' : 'Mark Done'}
                      </button>
                    )}
                    <select
                      value={habit.status}
                      onChange={(e) => handleStatusChange(habit.id, e.target.value as Habit['status'])}
                      className="text-sm border border-gray-300 rounded px-2 py-1"
                    >
                      <option value="ACTIVE">Active</option>
                      <option value="PAUSED">Paused</option>
                      <option value="COMPLETED">Completed</option>
                    </select>
                    <button
                      onClick={() => handleDelete(habit.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <Target className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No habits found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filters.' 
                : 'Get started by creating your first habit.'
              }
            </p>
            {!searchTerm && statusFilter === 'all' && (
              <div className="mt-6">
                <button className="btn btn-primary btn-md">
                  <Plus className="h-4 w-4 mr-2" />
                  New Habit
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Habits;
