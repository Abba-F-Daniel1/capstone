import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckSquare, 
  Target, 
  TrendingUp, 
  Calendar,
  Clock,
  Award,
  Plus
} from 'lucide-react';
import { useAnalyticsStore } from '../store/analyticsStore';
import { useTaskStore } from '../store/taskStore';
import { useHabitStore } from '../store/habitStore';
import LoadingSpinner from '../components/LoadingSpinner';

const Dashboard: React.FC = () => {
  const { dashboardData, fetchDashboard, isLoading } = useAnalyticsStore();
  const { fetchStats: fetchTaskStats } = useTaskStore();
  const { fetchStats: fetchHabitStats } = useHabitStore();

  useEffect(() => {
    fetchDashboard();
    fetchTaskStats();
    fetchHabitStats();
  }, [fetchDashboard, fetchTaskStats, fetchHabitStats]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const stats = [
    {
      name: 'Today\'s Tasks',
      value: dashboardData?.today.tasksCompleted || 0,
      icon: CheckSquare,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      href: '/tasks',
    },
    {
      name: 'Today\'s Habits',
      value: dashboardData?.today.habitsCompleted || 0,
      icon: Target,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      href: '/habits',
    },
    {
      name: 'Task Streak',
      value: dashboardData?.streaks.taskStreak || 0,
      icon: Award,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      name: 'Habit Streak',
      value: dashboardData?.streaks.habitStreak || 0,
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  const weeklyStats = [
    {
      name: 'This Week',
      tasks: dashboardData?.thisWeek.tasksCompleted || 0,
      habits: dashboardData?.thisWeek.habitsCompleted || 0,
    },
    {
      name: 'This Month',
      tasks: dashboardData?.thisMonth.tasksCompleted || 0,
      habits: dashboardData?.thisMonth.habitsCompleted || 0,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's your productivity overview.</p>
        </div>
        <div className="flex space-x-3">
          <Link
            to="/tasks/new"
            className="btn btn-primary btn-md"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Task
          </Link>
          <Link
            to="/habits/new"
            className="btn btn-secondary btn-md"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Habit
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="card">
              <div className="card-content">
                <div className="flex items-center">
                  <div className={`flex-shrink-0 p-3 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                    <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                  </div>
                </div>
                {stat.href && (
                  <div className="mt-4">
                    <Link
                      to={stat.href}
                      className="text-sm text-primary-600 hover:text-primary-500"
                    >
                      View details →
                    </Link>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Weekly and Monthly Stats */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {weeklyStats.map((period) => (
          <div key={period.name} className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900">{period.name}</h3>
            </div>
            <div className="card-content">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{period.tasks}</div>
                  <div className="text-sm text-gray-600">Tasks Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{period.habits}</div>
                  <div className="text-sm text-gray-600">Habits Tracked</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Recent Tasks */}
        <div className="card">
          <div className="card-header">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Recent Tasks</h3>
              <Link
                to="/tasks"
                className="text-sm text-primary-600 hover:text-primary-500"
              >
                View all
              </Link>
            </div>
          </div>
          <div className="card-content">
            {dashboardData?.recent.tasks && dashboardData.recent.tasks.length > 0 ? (
              <div className="space-y-3">
                {dashboardData.recent.tasks.slice(0, 5).map((task) => (
                  <div key={task.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-3 ${
                        task.status === 'COMPLETED' ? 'bg-green-500' :
                        task.status === 'IN_PROGRESS' ? 'bg-blue-500' :
                        'bg-gray-300'
                      }`} />
                      <span className="text-sm text-gray-900 truncate">{task.title}</span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      task.priority === 'HIGH' || task.priority === 'URGENT' ? 'bg-red-100 text-red-800' :
                      task.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <CheckSquare className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No tasks yet</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating your first task.</p>
                <div className="mt-6">
                  <Link
                    to="/tasks/new"
                    className="btn btn-primary btn-sm"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    New Task
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Recent Habits */}
        <div className="card">
          <div className="card-header">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Recent Habits</h3>
              <Link
                to="/habits"
                className="text-sm text-primary-600 hover:text-primary-500"
              >
                View all
              </Link>
            </div>
          </div>
          <div className="card-content">
            {dashboardData?.recent.habits && dashboardData.recent.habits.length > 0 ? (
              <div className="space-y-3">
                {dashboardData.recent.habits.slice(0, 5).map((habit) => (
                  <div key={habit.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-3 ${
                        habit.status === 'ACTIVE' ? 'bg-green-500' :
                        habit.status === 'PAUSED' ? 'bg-yellow-500' :
                        'bg-gray-300'
                      }`} />
                      <span className="text-sm text-gray-900 truncate">{habit.name}</span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      habit.frequency === 'DAILY' ? 'bg-blue-100 text-blue-800' :
                      habit.frequency === 'WEEKLY' ? 'bg-purple-100 text-purple-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {habit.frequency}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <Target className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No habits yet</h3>
                <p className="mt-1 text-sm text-gray-500">Start building good habits today.</p>
                <div className="mt-6">
                  <Link
                    to="/habits/new"
                    className="btn btn-primary btn-sm"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    New Habit
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
        </div>
        <div className="card-content">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              to="/tasks/new"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <CheckSquare className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <div className="font-medium text-gray-900">Add Task</div>
                <div className="text-sm text-gray-500">Create a new task</div>
              </div>
            </Link>
            <Link
              to="/habits/new"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Target className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <div className="font-medium text-gray-900">Add Habit</div>
                <div className="text-sm text-gray-500">Track a new habit</div>
              </div>
            </Link>
            <Link
              to="/analytics"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <TrendingUp className="h-8 w-8 text-purple-600 mr-3" />
              <div>
                <div className="font-medium text-gray-900">View Analytics</div>
                <div className="text-sm text-gray-500">See your progress</div>
              </div>
            </Link>
            <Link
              to="/profile"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Calendar className="h-8 w-8 text-orange-600 mr-3" />
              <div>
                <div className="font-medium text-gray-900">Profile</div>
                <div className="text-sm text-gray-500">Manage your account</div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
