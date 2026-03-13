import { useState } from 'react';
import { Plus, Edit2, Eye, Building2 } from 'lucide-react';
import { mockDepartments } from '../../data/mockData';
import type { Department } from '../../data/mockData';

const deptIcons: Record<string, string> = {
  'Public Works Department': '🏗️',
  'Water Supply Board': '💧',
  'Electricity Board': '⚡',
  'Municipal Corporation': '🏛️',
  'Town Planning': '📐',
  'Parks Department': '🌳',
};

export function Departments() {
  const [departments, setDepartments] = useState<Department[]>(mockDepartments);
  const [showModal, setShowModal] = useState(false);
  const [editDept, setEditDept] = useState<Department | null>(null);

  const [formName, setFormName] = useState('');
  const [formCode, setFormCode] = useState('');
  const [formHead, setFormHead] = useState('');
  const [formDesc, setFormDesc] = useState('');

  const openAdd = () => {
    setEditDept(null);
    setFormName(''); setFormCode(''); setFormHead(''); setFormDesc('');
    setShowModal(true);
  };

  const openEdit = (d: Department) => {
    setEditDept(d);
    setFormName(d.name); setFormCode(d.code); setFormHead(d.head); setFormDesc(d.description);
    setShowModal(true);
  };

  const handleSave = () => {
    if (editDept) {
      setDepartments(prev => prev.map(d => d.id === editDept.id ? { ...d, name: formName, code: formCode, head: formHead, description: formDesc } : d));
    } else {
      setDepartments(prev => [...prev, {
        id: Date.now().toString(), name: formName, code: formCode,
        head: formHead, complaintsThisMonth: 0, officials: 0, description: formDesc,
      }]);
    }
    setShowModal(false);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-gray-900">Manage Departments</h1>
          <p className="text-sm text-gray-500 mt-0.5">{departments.length} departments configured</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 bg-[#DC2626] text-white rounded-lg text-sm font-medium hover:bg-red-700"
        >
          <Plus className="w-4 h-4" /> Add Department
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {departments.map(d => (
          <div key={d.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center text-xl">
                  {deptIcons[d.name] || '🏢'}
                </div>
                <div>
                  <h4 className="text-gray-900 text-sm">{d.name}</h4>
                  <span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-mono">{d.code}</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-gray-500 mb-4 leading-relaxed">{d.description}</p>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-amber-50 rounded-lg p-3 text-center">
                <div className="text-xl font-bold text-amber-700">{d.complaintsThisMonth}</div>
                <div className="text-xs text-amber-600">This Month</div>
              </div>
              <div className="bg-blue-50 rounded-lg p-3 text-center">
                <div className="text-xl font-bold text-blue-700">{d.officials}</div>
                <div className="text-xs text-blue-600">Officials</div>
              </div>
            </div>

            <div className="flex items-center gap-1 text-xs text-gray-500 mb-4">
              <span>Head:</span>
              <span className="font-medium text-gray-700">{d.head}</span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => openEdit(d)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 border border-gray-200 text-gray-600 rounded-lg text-xs hover:bg-gray-50"
              >
                <Edit2 className="w-3 h-3" /> Edit
              </button>
              <button className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-blue-50 text-blue-600 rounded-lg text-xs hover:bg-blue-100">
                <Eye className="w-3 h-3" /> View
              </button>
            </div>
          </div>
        ))}

        {/* Add new card */}
        <button
          onClick={openAdd}
          className="bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 p-5 flex flex-col items-center justify-center gap-3 hover:border-red-300 hover:bg-red-50/30 transition-colors min-h-[240px]"
        >
          <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
            <Building2 className="w-5 h-5 text-gray-400" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Add Department</p>
            <p className="text-xs text-gray-400">Create a new department</p>
          </div>
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4">
            <h3 className="text-gray-900 mb-5">{editDept ? 'Edit Department' : 'Add Department'}</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Department Name</label>
                  <input value={formName} onChange={e => setFormName(e.target.value)} className="w-full h-10 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="e.g. Public Works" />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Code</label>
                  <input value={formCode} onChange={e => setFormCode(e.target.value)} className="w-full h-10 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="e.g. PWD" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Head Official</label>
                <select value={formHead} onChange={e => setFormHead(e.target.value)} className="w-full h-10 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-white">
                  <option value="">Select official...</option>
                  <option>Priya Singh</option>
                  <option>Deepak Verma</option>
                  <option>Sunita Rao</option>
                  <option>Anita Joshi</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Description</label>
                <textarea value={formDesc} onChange={e => setFormDesc(e.target.value)} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none" placeholder="Department description and responsibilities..." />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50">Cancel</button>
              <button onClick={handleSave} className="flex-1 py-2 bg-[#DC2626] text-white rounded-lg text-sm font-medium hover:bg-red-700">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
