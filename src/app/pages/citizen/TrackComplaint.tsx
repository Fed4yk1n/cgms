import { useState, useEffect } from 'react';
import { Search, CheckCircle, Circle, Clock, Send, RefreshCw, Image as ImageIcon } from 'lucide-react';
import { StatusBadge, PriorityBadge } from '../../components/common/StatusBadge';
import { useAuth } from '../../contexts/AuthContext';
import { getComplaintsByUser, addComment as addCommentService } from '../../services/complaints.service';
import type { Complaint } from '../../data/mockData';

const statusSteps = ['Submitted', 'Verified', 'In Progress', 'Pending Review', 'Closed'];

export function TrackComplaint() {
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [selected, setSelected] = useState<Complaint | null>(null);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<Complaint['comments']>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    async function load() {
      setLoading(true);
      const data = await getComplaintsByUser(user!.id);
      setComplaints(data);
      if (data.length > 0) {
        setSelected(data[0]);
        setComments(data[0].comments);
      }
      setLoading(false);
    }
    load();
  }, [user]);

  const results = query
    ? complaints.filter(c => c.id.toLowerCase().includes(query.toLowerCase()) || c.title.toLowerCase().includes(query.toLowerCase()))
    : complaints;

  const getStepIndex = (complaint: Complaint) => {
    const map: Record<string, number> = {
      'Pending': 0,
      'Verified': 1,
      'In Progress': 2,
      'Needs Info': 2,
      'Resolved': 3,
      'Closed': 4,
    };
    return map[complaint.status] ?? 0;
  };

  const handleSelectComplaint = (c: Complaint) => {
    setSelected(c);
    setComments(c.comments);
    setComment('');
  };

  const handleSendComment = async () => {
    if (!comment.trim() || !selected || !user) return;
    const newComment = await addCommentService(
      selected._dbId || selected.id,
      user.name,
      'Citizen',
      comment,
    );
    if (newComment) {
      setComments(prev => [...prev, newComment]);
    }
    setComment('');
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-gray-900">Track Complaint</h1>
        <p className="text-sm text-gray-500 mt-0.5">Enter your complaint ID or keyword to track status</p>
      </div>

      {/* Search */}
      <div className="relative max-w-lg mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Enter complaint ID (e.g. CMP-2024-00847) or keyword..."
          className="w-full pl-10 pr-3 h-10 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left — list */}
        <div className="space-y-2">
          {results.map(c => (
            <button
              key={c.id}
              onClick={() => handleSelectComplaint(c)}
              className={`w-full text-left p-4 rounded-xl border transition-all ${
                selected?.id === c.id ? 'border-[#1A56DB] bg-blue-50 shadow-sm' : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <span className="text-xs font-mono text-gray-500">{c.id}</span>
                <StatusBadge status={c.status} />
              </div>
              <p className="text-sm text-gray-900 font-medium line-clamp-1">{c.title}</p>
              <p className="text-xs text-gray-400 mt-0.5">{c.date}</p>
            </button>
          ))}
          {results.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Search className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">No complaints found</p>
            </div>
          )}
        </div>

        {/* Right — detail */}
        {selected && (
          <div className="xl:col-span-2 space-y-4">
            {/* Header */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-sm text-gray-500">#{selected.id}</span>
                    <StatusBadge status={selected.status} />
                  </div>
                  <h3 className="text-gray-900">{selected.title}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Submitted on {selected.date}</p>
                </div>
                <PriorityBadge priority={selected.priority} />
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full">{selected.category}</span>
                <span className="text-xs bg-teal-50 text-teal-700 px-2.5 py-1 rounded-full">{selected.department}</span>
                {selected.assignedTo && (
                  <span className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full">👤 {selected.assignedTo}</span>
                )}
              </div>
              <p className="text-sm text-gray-600 mt-3 leading-relaxed">{selected.description}</p>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <h4 className="text-gray-900 mb-5">Status Timeline</h4>
              <div className="space-y-0">
                {statusSteps.map((s, i) => {
                  const currentIdx = getStepIndex(selected);
                  const done = i < currentIdx;
                  const active = i === currentIdx;
                  const pending = i > currentIdx;
                  return (
                    <div key={s} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          done ? 'bg-green-500' : active ? 'bg-[#1A56DB]' : 'bg-gray-100'
                        }`}>
                          {done ? (
                            <CheckCircle className="w-4 h-4 text-white" />
                          ) : active ? (
                            <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                          ) : (
                            <Circle className="w-4 h-4 text-gray-300" />
                          )}
                        </div>
                        {i < statusSteps.length - 1 && (
                          <div className={`w-0.5 h-8 ${done ? 'bg-green-400' : 'bg-gray-200'}`} />
                        )}
                      </div>
                      <div className="pb-6">
                        <p className={`text-sm font-medium ${done || active ? 'text-gray-900' : 'text-gray-400'}`}>{s}</p>
                        {done && <p className="text-xs text-gray-400">Completed</p>}
                        {active && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-blue-500" />
                            <p className="text-xs text-blue-600">Current step</p>
                          </div>
                        )}
                        {pending && <p className="text-xs text-gray-300">Upcoming</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Comments */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <h4 className="text-gray-900 mb-4">Comments & Updates</h4>
              <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                {comments.length === 0 && (
                  <p className="text-sm text-gray-400 text-center py-4">No comments yet</p>
                )}
                {comments.map(c => (
                  <div key={c.id} className={`flex gap-3 ${c.role === 'Citizen' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0 ${
                      c.role === 'Official' ? 'bg-teal-500' : 'bg-blue-500'
                    }`}>
                      {c.author.charAt(0)}
                    </div>
                    <div className={`flex-1 ${c.role === 'Citizen' ? 'items-end' : 'items-start'} flex flex-col`}>
                      <div className={`px-3 py-2 rounded-xl text-sm max-w-xs ${
                        c.role === 'Official' ? 'bg-gray-100 text-gray-800' : 'bg-blue-100 text-blue-900'
                      }`}>
                        {c.message}
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-xs text-gray-500">{c.author} ({c.role})</span>
                        <span className="text-xs text-gray-400">· {c.timestamp}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSendComment()}
                  placeholder="Add a comment..."
                  className="flex-1 h-9 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleSendComment}
                  className="px-3 h-9 bg-[#1A56DB] text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Evidence */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <h4 className="text-gray-900 mb-3">Evidence Uploads</h4>
              <div className="grid grid-cols-4 gap-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200 hover:border-blue-300 cursor-pointer transition-colors">
                    <ImageIcon className="w-5 h-5 text-gray-400" />
                  </div>
                ))}
                <div className="aspect-square border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center text-gray-300 hover:border-gray-300 cursor-pointer">
                  <span className="text-xs text-center text-gray-400">No more files</span>
                </div>
              </div>
            </div>

            <button className="w-full flex items-center justify-center gap-2 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition-colors">
              <RefreshCw className="w-4 h-4" /> Request Status Update
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
