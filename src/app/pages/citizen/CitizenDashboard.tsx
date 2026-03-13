import { useNavigate } from 'react-router';
import { FileText, Clock, CheckCircle, AlertCircle, Plus, Search, Download, Eye, Edit2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { mockComplaints, mockNotifications } from '../../data/mockData';
import { StatusBadge, PriorityBadge } from '../../components/common/StatusBadge';

export function CitizenDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const total = mockComplaints.length;
  const pending = mockComplaints.filter(c => c.status === 'Pending').length;
  const inProgress = mockComplaints.filter(c => c.status === 'In Progress').length;
  const resolved = mockComplaints.filter(c => c.status === 'Resolved').length;

  const stats = [
    { label: 'Total Complaints', value: total, sub: 'submitted by you', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Pending', value: pending, sub: 'awaiting action', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'In Progress', value: inProgress, sub: 'being resolved', icon: AlertCircle, color: 'text-[#1A56DB]', bg: 'bg-blue-50' },
    { label: 'Resolved', value: resolved, sub: 'successfully closed', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Welcome */}
      <div className="mb-6">
        <h1 className="text-gray-900">Good morning, {user?.name?.split(' ')[0]} 👋</h1>
        <p className="text-sm text-gray-500 mt-0.5">Here's an overview of your complaints</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-gray-500 font-medium">{s.label}</span>
              <div className={`w-8 h-8 rounded-lg ${s.bg} flex items-center justify-center`}>
                <s.icon className={`w-4 h-4 ${s.color}`} />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900">{s.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={() => navigate('/citizen/submit')}
          className="flex items-center gap-2 px-4 py-2 bg-[#1A56DB] text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" /> Submit New Complaint
        </button>
        <button
          onClick={() => navigate('/citizen/track')}
          className="flex items-center gap-2 px-4 py-2 border border-[#1A56DB] text-[#1A56DB] rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors"
        >
          <Search className="w-4 h-4" /> Track Complaint
        </button>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
          <Download className="w-4 h-4" /> Download Report
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Table */}
        <div className="xl:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h3 className="text-gray-900">My Recent Complaints</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">ID</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Title</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide hidden md:table-cell">Category</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide hidden lg:table-cell">Date</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {mockComplaints.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3 text-xs font-mono text-gray-500">{c.id}</td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-900 max-w-[180px] truncate">{c.title}</div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">{c.category}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500 hidden lg:table-cell">{c.date}</td>
                    <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => navigate('/citizen/track')}
                          className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors"
                          title="View"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        {c.status === 'Pending' && (
                          <button
                            onClick={() => navigate('/citizen/submit')}
                            className="p-1.5 rounded-lg hover:bg-amber-50 text-gray-400 hover:text-amber-600 transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs text-gray-500">Showing 1–{mockComplaints.length} of {mockComplaints.length}</span>
            <div className="flex gap-1">
              <button className="px-2 py-1 text-xs border border-gray-200 rounded hover:bg-gray-50">Prev</button>
              <button className="px-2 py-1 text-xs border border-[#1A56DB] bg-blue-50 text-[#1A56DB] rounded">1</button>
              <button className="px-2 py-1 text-xs border border-gray-200 rounded hover:bg-gray-50">Next</button>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-gray-900">Recent Notifications</h3>
            <button className="text-xs text-blue-600 hover:underline">Mark all read</button>
          </div>
          <div className="divide-y divide-gray-50">
            {mockNotifications.map((n) => (
              <div key={n.id} className={`p-4 flex items-start gap-3 ${!n.read ? 'bg-blue-50/30' : ''}`}>
                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${n.read ? 'bg-gray-300' : 'bg-blue-500'}`} />
                <div>
                  <p className="text-xs text-gray-700 leading-relaxed">{n.message}</p>
                  <p className="text-xs text-gray-400 mt-1">{n.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
