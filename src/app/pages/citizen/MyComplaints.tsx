import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Plus, Eye, Edit2, Search, Filter } from 'lucide-react';
import { mockComplaints } from '../../data/mockData';
import { StatusBadge, PriorityBadge } from '../../components/common/StatusBadge';
import type { ComplaintStatus } from '../../data/mockData';

const filters: (ComplaintStatus | 'All')[] = ['All', 'Pending', 'In Progress', 'Needs Info', 'Resolved', 'Closed'];

export function MyComplaints() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<ComplaintStatus | 'All'>('All');
  const [search, setSearch] = useState('');

  const filtered = mockComplaints.filter(c => {
    const matchFilter = activeFilter === 'All' || c.status === activeFilter;
    const matchSearch = !search || c.title.toLowerCase().includes(search.toLowerCase()) || c.id.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-gray-900">My Complaints</h1>
          <p className="text-sm text-gray-500 mt-0.5">{mockComplaints.length} total complaints</p>
        </div>
        <button
          onClick={() => navigate('/citizen/submit')}
          className="flex items-center gap-2 px-4 py-2 bg-[#1A56DB] text-white rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" /> New Complaint
        </button>
      </div>

      {/* Search + Filter */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search complaints..."
              className="w-full pl-10 pr-3 h-9 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
            {filters.map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  activeFilter === f ? 'bg-[#1A56DB] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Complaint ID</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Title</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide hidden md:table-cell">Category</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide hidden lg:table-cell">Priority</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide hidden lg:table-cell">Date</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Status</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(c => (
                <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3 text-xs font-mono text-gray-500">{c.id}</td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-gray-900 max-w-[200px] truncate font-medium">{c.title}</div>
                    <div className="text-xs text-gray-400 truncate max-w-[200px]">{c.location}</div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">{c.category}</span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <PriorityBadge priority={c.priority} />
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
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center">
                    <Search className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">No complaints found</p>
                    <button onClick={() => { setSearch(''); setActiveFilter('All'); }} className="text-xs text-blue-600 hover:underline mt-1">
                      Clear filters
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs text-gray-500">Showing 1–{filtered.length} of {filtered.length}</span>
          <div className="flex gap-1">
            <button className="px-2 py-1 text-xs border border-gray-200 rounded hover:bg-gray-50">Prev</button>
            <button className="px-2 py-1 text-xs border border-[#1A56DB] bg-blue-50 text-[#1A56DB] rounded">1</button>
            <button className="px-2 py-1 text-xs border border-gray-200 rounded hover:bg-gray-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
