import { Users, ClipboardList, Clock, Server, UserCheck, CheckCircle } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend,
} from 'recharts';
import { chartBarData, chartLineData, chartPieData, activityFeed } from '../../data/mockData';

const stats = [
  { label: 'Total Users', value: '1,247', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', trend: '+12%' },
  { label: 'Active Officials', value: '38', icon: UserCheck, color: 'text-teal-600', bg: 'bg-teal-50', trend: '+2' },
  { label: 'Total Complaints', value: '347', icon: ClipboardList, color: 'text-indigo-600', bg: 'bg-indigo-50', trend: '+23' },
  { label: 'Pending Complaints', value: '87', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', trend: '-5' },
  { label: 'Resolved This Month', value: '142', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', trend: '+18%' },
  { label: 'System Uptime', value: '99.9%', icon: Server, color: 'text-purple-600', bg: 'bg-purple-50', trend: 'Stable' },
];

const activityColor: Record<string, string> = {
  submit: 'bg-blue-100 text-blue-700',
  update: 'bg-teal-100 text-teal-700',
  close: 'bg-green-100 text-green-700',
  register: 'bg-purple-100 text-purple-700',
  info: 'bg-amber-100 text-amber-700',
  admin: 'bg-red-100 text-red-700',
};

export function AdminDashboard() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-gray-900">Admin Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">System overview and analytics</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {stats.map(s => (
          <div key={s.label} className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-gray-500 font-medium">{s.label}</span>
              <div className={`w-8 h-8 rounded-lg ${s.bg} flex items-center justify-center`}>
                <s.icon className={`w-4 h-4 ${s.color}`} />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900">{s.value}</div>
            <div className={`text-xs mt-0.5 font-medium ${s.trend.startsWith('+') ? 'text-green-600' : s.trend.startsWith('-') ? 'text-red-500' : 'text-gray-400'}`}>
              {s.trend} this month
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          {/* Bar Chart */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h3 className="text-gray-900 mb-4">Complaints by Category (Last 30 Days)</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartBarData} barSize={36}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="category" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '12px' }} />
                <Bar dataKey="count" fill="#1A56DB" radius={[4, 4, 0, 0]} name="Complaints" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Line Chart */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h3 className="text-gray-900 mb-4">Complaint Resolution Trend (Weekly)</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={chartLineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Line type="monotone" dataKey="submitted" stroke="#1A56DB" strokeWidth={2} dot={{ r: 4 }} name="Submitted" />
                <Line type="monotone" dataKey="resolved" stroke="#16A34A" strokeWidth={2} dot={{ r: 4 }} name="Resolved" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h3 className="text-gray-900 mb-4">Status Distribution</h3>
            <div className="flex items-center gap-8">
              <ResponsiveContainer width="50%" height={180}>
                <PieChart>
                  <Pie data={chartPieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                    {chartPieData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2">
                {chartPieData.map(d => (
                  <div key={d.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                      <span className="text-sm text-gray-700">{d.name}</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-4 border-b border-gray-100">
            <h3 className="text-gray-900">Live Activity Feed</h3>
            <p className="text-xs text-gray-400 mt-0.5">Real-time system events</p>
          </div>
          <div className="divide-y divide-gray-50 overflow-y-auto max-h-[600px]">
            {activityFeed.map(a => (
              <div key={a.id} className="p-4 hover:bg-gray-50/50 transition-colors">
                <div className="flex items-start gap-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${activityColor[a.type] || 'bg-gray-100 text-gray-600'}`}>
                    {a.type}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-800 leading-relaxed">
                      <span className="font-medium">{a.user}</span> {a.action}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{a.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
