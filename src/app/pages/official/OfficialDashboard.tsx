import { useState, useEffect } from 'react';
import { ClipboardList, CheckCircle, Clock, TrendingUp, Eye, Check, Edit2, Info, Star, X, ChevronRight } from 'lucide-react';
import { StatusBadge, PriorityBadge } from '../../components/common/StatusBadge';
import { useAuth } from '../../contexts/AuthContext';
import { getAllComplaints, updateComplaintStatus, addComment } from '../../services/complaints.service';
import { toast } from 'sonner';
import type { Complaint, ComplaintStatus } from '../../data/mockData';

const filters: (ComplaintStatus | 'All')[] = ['All', 'Pending', 'In Progress', 'Needs Info', 'Resolved'];

export function OfficialDashboard() {
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState<ComplaintStatus | 'All'>('All');
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [note, setNote] = useState('');
  const [statusUpdate, setStatusUpdate] = useState<ComplaintStatus>('In Progress');
  const [rating, setRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await getAllComplaints();
      setComplaints(data);
      setLoading(false);
    }
    load();
  }, []);

  const assigned = complaints.filter(c => c.assignedTo === user?.name || !c.assignedTo);
  const pending = complaints.filter(c => c.status === 'Pending').length;
  const resolved = complaints.filter(c => c.status === 'Resolved').length;

  const stats = [
    { label: 'Assigned to Me', value: assigned.length, icon: ClipboardList, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Pending Verification', value: pending, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Resolved This Week', value: resolved, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Avg. Resolution Time', value: '3.2d', icon: TrendingUp, color: 'text-teal-600', bg: 'bg-teal-50' },
  ];

  const filtered = complaints.filter(c => activeFilter === 'All' || c.status === activeFilter);

  const handleUpdateStatus = async () => {
    if (!selectedComplaint || !user) return;
    const success = await updateComplaintStatus(selectedComplaint.id, statusUpdate, user.name);
    if (success) {
      setComplaints(prev => prev.map(c => c.id === selectedComplaint.id ? { ...c, status: statusUpdate } : c));
      setSelectedComplaint(prev => prev ? { ...prev, status: statusUpdate } : null);
      if (note.trim()) {
        await addComment(selectedComplaint._dbId || selectedComplaint.id, user.name, 'Official', note);
        setNote('');
      }
      toast.success(`Status updated to "${statusUpdate}"`);
    } else {
      toast.error('Failed to update status');
    }
  };

  const handleRequestInfo = async () => {
    if (!selectedComplaint || !user) return;
    const success = await updateComplaintStatus(selectedComplaint.id, 'Needs Info');
    if (success) {
      setComplaints(prev => prev.map(c => c.id === selectedComplaint.id ? { ...c, status: 'Needs Info' as ComplaintStatus } : c));
      setSelectedComplaint(prev => prev ? { ...prev, status: 'Needs Info' as ComplaintStatus } : null);
      toast.success('Requested additional information from citizen');
    }
  };

  const handleCloseComplaint = async () => {
    if (!selectedComplaint || !user) return;
    const success = await updateComplaintStatus(selectedComplaint.id, 'Closed');
    if (success) {
      setComplaints(prev => prev.map(c => c.id === selectedComplaint.id ? { ...c, status: 'Closed' as ComplaintStatus } : c));
      setSelectedComplaint(null);
      toast.success('Complaint closed');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-gray-900">Official Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">Manage and resolve citizen complaints — {user?.department}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map(s => (
          <div key={s.label} className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-gray-500 font-medium">{s.label}</span>
              <div className={`w-8 h-8 rounded-lg ${s.bg} flex items-center justify-center`}>
                <s.icon className={`w-4 h-4 ${s.color}`} />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              activeFilter === f ? 'bg-[#0D9488] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Complaints Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Citizen / Title</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Category</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">Priority</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">Assigned To</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(c => (
                <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3 text-xs font-mono text-gray-500">{c.id}</td>
                  <td className="px-4 py-3">
                    <div className="text-sm font-medium text-gray-900 truncate max-w-[180px]">{c.title}</div>
                    <div className="text-xs text-gray-400">{c.citizenName}</div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">{c.category}</span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell"><PriorityBadge priority={c.priority} /></td>
                  <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                  <td className="px-4 py-3 text-xs text-gray-500 hidden lg:table-cell">{c.assignedTo || '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => setSelectedComplaint(c)} className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600" title="View"><Eye className="w-3.5 h-3.5" /></button>
                      <button className="p-1.5 rounded-lg hover:bg-green-50 text-gray-400 hover:text-green-600" title="Verify"><Check className="w-3.5 h-3.5" /></button>
                      <button onClick={() => { setSelectedComplaint(c); }} className="p-1.5 rounded-lg hover:bg-amber-50 text-gray-400 hover:text-amber-600" title="Update"><Edit2 className="w-3.5 h-3.5" /></button>
                      <button className="p-1.5 rounded-lg hover:bg-orange-50 text-gray-400 hover:text-orange-600" title="Request Info"><Info className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Complaint Detail Drawer */}
      {selectedComplaint && (
        <>
          <div className="fixed inset-0 bg-black/30 z-40" onClick={() => setSelectedComplaint(null)} />
          <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div>
                <span className="text-xs font-mono text-gray-500">{selectedComplaint.id}</span>
                <h3 className="text-gray-900 mt-0.5">{selectedComplaint.title}</h3>
              </div>
              <button onClick={() => setSelectedComplaint(null)} className="p-2 rounded-lg hover:bg-gray-100">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {/* Info */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <StatusBadge status={selectedComplaint.status} />
                  <PriorityBadge priority={selectedComplaint.priority} />
                  <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{selectedComplaint.category}</span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{selectedComplaint.description}</p>
                <p className="text-xs text-gray-400">📍 {selectedComplaint.location}</p>
                <p className="text-xs text-gray-400">👤 Citizen: {selectedComplaint.citizenName}</p>
                <p className="text-xs text-gray-400">📅 Submitted: {selectedComplaint.date}</p>
              </div>

              {/* Evidence */}
              <div>
                <h4 className="text-gray-900 mb-2 text-sm">Evidence Gallery</h4>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2].map(i => (
                    <div key={i} className="aspect-square bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center text-xs text-gray-400">
                      Photo {i}
                    </div>
                  ))}
                  <div className="aspect-square bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center text-xs text-gray-300">
                    No more
                  </div>
                </div>
              </div>

              {/* Status update */}
              <div>
                <h4 className="text-gray-900 mb-2 text-sm">Update Status</h4>
                <select
                  value={statusUpdate}
                  onChange={e => setStatusUpdate(e.target.value as ComplaintStatus)}
                  className="w-full h-9 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                >
                  {(['Pending', 'Verified', 'In Progress', 'Needs Info', 'Resolved', 'Closed'] as ComplaintStatus[]).map(s => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Note */}
              <div>
                <h4 className="text-gray-900 mb-2 text-sm">Official Note</h4>
                <textarea
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  rows={3}
                  placeholder="Add official note or instructions..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                />
              </div>

              {/* Feedback */}
              {showFeedback && (
                <div className="bg-teal-50 rounded-xl p-4 border border-teal-200">
                  <h4 className="text-teal-900 mb-3 text-sm">Resolution Feedback</h4>
                  <div className="flex gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map(s => (
                      <button key={s} onClick={() => setRating(s)}>
                        <Star className={`w-5 h-5 ${s <= rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} />
                      </button>
                    ))}
                  </div>
                  <textarea
                    value={feedbackText}
                    onChange={e => setFeedbackText(e.target.value)}
                    rows={2}
                    placeholder="Official remarks on resolution..."
                    className="w-full px-3 py-2 border border-teal-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none bg-white"
                  />
                  <button className="mt-2 px-4 py-2 bg-teal-600 text-white rounded-lg text-sm hover:bg-teal-700">
                    Submit Feedback
                  </button>
                </div>
              )}
            </div>

            <div className="p-5 border-t border-gray-100 space-y-2">
              <div className="flex gap-2">
                <button
                  onClick={handleRequestInfo}
                  className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 flex items-center justify-center gap-1"
                >
                  <Info className="w-3.5 h-3.5" /> Request Info
                </button>
                <button
                  onClick={handleUpdateStatus}
                  className="flex-1 py-2 bg-[#0D9488] text-white rounded-lg text-sm font-medium hover:bg-teal-700 flex items-center justify-center gap-1"
                >
                  <ChevronRight className="w-3.5 h-3.5" /> Update Status
                </button>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowFeedback(!showFeedback)}
                  className="flex-1 py-2 border border-teal-300 text-teal-700 rounded-lg text-sm hover:bg-teal-50 flex items-center justify-center gap-1"
                >
                  <Star className="w-3.5 h-3.5" /> Feedback
                </button>
                <button onClick={handleCloseComplaint} className="flex-1 py-2 border border-red-300 text-red-600 rounded-lg text-sm hover:bg-red-50 flex items-center justify-center gap-1">
                  <X className="w-3.5 h-3.5" /> Close Complaint
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
