import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, Calendar, Target, CheckSquare } from 'lucide-react';
import { useAnalyticsStore } from '../store/analyticsStore';
import LoadingSpinner from '../components/LoadingSpinner';

const Analytics: React.FC = () => {
  const { productivityData, fetchProductivity, isLoading } = useAnalyticsStore();
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter' | 'year'>('month');

  useEffect(() => {
    fetchProductivity({ period: selectedPeriod });
  }, [fetchProductivity, selectedPeriod]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600">Track your productivity and progress over time.</p>
        </div>
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-gray-400" />
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as any)}
            className="input"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      {/* Summary Stats */}
      {productivityData && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="card">
            <div className="card-content">
              <div className="flex items-center">
                <div className="flex-shrink-0 p-3 rounded-lg bg-blue-100">
                  <CheckSquare className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Tasks Completed</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {productivityData.summary.tasksCompleted}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-content">
              <div className="flex items-center">
                <div className="flex-shrink-0 p-3 rounded-lg bg-green-100">
                  <Target className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Habits Tracked</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {productivityData.summary.habitsTracked}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-content">
              <div className="flex items-center">
                <div className="flex-shrink-0 p-3 rounded-lg bg-purple-100">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Productivity Score</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {productivityData.summary.productivityScore.toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-content">
              <div className="flex items-center">
                <div className="flex-shrink-0 p-3 rounded-lg bg-orange-100">
                  <Calendar className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {productivityData.summary.totalTasks}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Tasks Completed Chart */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Tasks Completed</h3>
          </div>
          <div className="card-content">
            {productivityData?.trends.tasksCompleted && productivityData.trends.tasksCompleted.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={productivityData.trends.tasksCompleted}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={formatDate}
                    fontSize={12}
                  />
                  <YAxis fontSize={12} />
                  <Tooltip 
                    labelFormatter={(value) => formatDate(value)}
                    formatter={(value) => [value, 'Tasks']}
                  />
                  <Bar dataKey="count" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                No data available for the selected period
              </div>
            )}
          </div>
        </div>

        {/* Habits Completed Chart */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Habits Tracked</h3>
          </div>
          <div className="card-content">
            {productivityData?.trends.habitsCompleted && productivityData.trends.habitsCompleted.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={productivityData.trends.habitsCompleted}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={formatDate}
                    fontSize={12}
                  />
                  <YAxis fontSize={12} />
                  <Tooltip 
                    labelFormatter={(value) => formatDate(value)}
                    formatter={(value) => [value, 'Habits']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#22c55e" 
                    strokeWidth={2}
                    dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                No data available for the selected period
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Productivity Score Trend */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium text-gray-900">Productivity Score Trend</h3>
        </div>
        <div className="card-content">
          {productivityData?.analyticsEntries && productivityData.analyticsEntries.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={productivityData.analyticsEntries}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={formatDate}
                  fontSize={12}
                />
                <YAxis 
                  domain={[0, 100]}
                  fontSize={12}
                />
                <Tooltip 
                  labelFormatter={(value) => formatDate(value)}
                  formatter={(value) => [`${value}%`, 'Productivity Score']}
                />
                <Line 
                  type="monotone" 
                  dataKey="productivityScore" 
                  stroke="#8b5cf6" 
                  strokeWidth={2}
                  dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              No productivity data available for the selected period
            </div>
          )}
        </div>
      </div>

      {/* Insights */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium text-gray-900">Insights</h3>
        </div>
        <div className="card-content">
          <div className="space-y-4">
            {productivityData && (
              <>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900">Task Completion Rate</h4>
                  <p className="text-blue-700 mt-1">
                    You've completed {productivityData.summary.tasksCompleted} out of {productivityData.summary.totalTasks} tasks 
                    ({((productivityData.summary.tasksCompleted / Math.max(1, productivityData.summary.totalTasks)) * 100).toFixed(1)}% completion rate).
                  </p>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-900">Habit Consistency</h4>
                  <p className="text-green-700 mt-1">
                    You've tracked {productivityData.summary.habitsTracked} habit entries this period. 
                    Keep up the great work building consistent habits!
                  </p>
                </div>
                
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-medium text-purple-900">Productivity Score</h4>
                  <p className="text-purple-700 mt-1">
                    Your current productivity score is {productivityData.summary.productivityScore.toFixed(1)}%. 
                    {productivityData.summary.productivityScore > 80 
                      ? " Excellent work! You're maintaining high productivity." 
                      : productivityData.summary.productivityScore > 60 
                      ? " Good progress! There's room for improvement." 
                      : " Consider focusing on completing more tasks and building consistent habits."
                    }
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
