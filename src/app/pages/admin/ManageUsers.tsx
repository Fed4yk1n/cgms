import { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Clock, Filter } from 'lucide-react';
import { mockUsers } from '../../data/mockData';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import type { AppUser } from '../../data/mockData';

type RoleFilter = 'All' | 'Citizen' | 'Official' | 'Admin';
type StatusFilter = 'All' | 'Active' | 'Inactive' | 'Suspended';

const roleBadge: Record<string, string> = {
  Citizen: 'bg-blue-100 text-blue-700',
  Official: 'bg-teal-100 text-teal-700',
  Admin: 'bg-red-100 text-red-700',
};

const statusBadge: Record<string, string> = {
  Active: 'bg-green-100 text-green-700',
  Inactive: 'bg-gray-100 text-gray-600',
  Suspended: 'bg-red-100 text-red-700',
};

export function ManageUsers() {
  const [users, setUsers] = useState<AppUser[]>(mockUsers);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('All');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState<AppUser | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Form
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formRole, setFormRole] = useState<'Citizen' | 'Official' | 'Admin'>('Citizen');
  const [formDept, setFormDept] = useState('');
  const [formActive, setFormActive] = useState(true);

  const filtered = users.filter(u => {
    const matchSearch = !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'All' || u.role === roleFilter;
    const matchStatus = statusFilter === 'All' || u.status === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  const openAdd = () => {
    setEditUser(null);
    setFormName(''); setFormEmail(''); setFormPhone('');
    setFormRole('Citizen'); setFormDept(''); setFormActive(true);
    setShowModal(true);
  };

  const openEdit = (u: AppUser) => {
    setEditUser(u);
    setFormName(u.name); setFormEmail(u.email); setFormPhone(u.phone || '');
    setFormRole(u.role); setFormDept(u.department || ''); setFormActive(u.status === 'Active');
    setShowModal(true);
  };

  const handleSave = () => {
    if (editUser) {
      setUsers(prev => prev.map(u => u.id === editUser.id ? {
        ...u, name: formName, email: formEmail, phone: formPhone,
        role: formRole, department: formDept, status: formActive ? 'Active' : 'Inactive',
      } : u));
    } else {
      setUsers(prev => [...prev, {
        id: Date.now().toString(), name: formName, email: formEmail, phone: formPhone,
        role: formRole, department: formDept, status: formActive ? 'Active' : 'Inactive',
        createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      }]);
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    setDeleteConfirm(null);
  };

  const toggleStatus = (id: string) => {
    setUsers(prev => prev.map(u => u.id === id ? {
      ...u, status: u.status === 'Active' ? 'Suspended' : 'Active',
    } as AppUser : u));
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-gray-900">User Management</h1>
          <p className="text-sm text-gray-500 mt-0.5">{users.length} total users</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 bg-[#DC2626] text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add User
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-4">
        <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full pl-10 pr-3 h-9 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <select value={roleFilter} onChange={e => setRoleFilter(e.target.value as RoleFilter)} className="h-9 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-white">
              <option value="All">All Roles</option>
              <option value="Citizen">Citizen</option>
              <option value="Official">Official</option>
              <option value="Admin">Admin</option>
            </select>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as StatusFilter)} className="h-9 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-white">
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Role</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">Department</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">Created</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(u => (
                <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{u.name}</div>
                        <div className="text-xs text-gray-400">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${roleBadge[u.role]}`}>{u.role}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500 hidden lg:table-cell">{u.department || '—'}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleStatus(u.id)}
                      title="Click to toggle status"
                      className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${statusBadge[u.status]} hover:opacity-80 transition-opacity cursor-pointer`}
                    >
                      {u.status}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500 hidden lg:table-cell">{u.createdAt}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(u)} className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600" title="Edit">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600" title="Activity">
                        <Clock className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => setDeleteConfirm(u.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600" title="Delete">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-sm text-gray-400">No users found</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-gray-100">
          <span className="text-xs text-gray-500">Showing {filtered.length} of {users.length} users</span>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4">
            <h3 className="text-gray-900 mb-5">{editUser ? 'Edit User' : 'Add New User'}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Full Name</label>
                <input value={formName} onChange={e => setFormName(e.target.value)} className="w-full h-10 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="Full name" />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Email</label>
                <input type="email" value={formEmail} onChange={e => setFormEmail(e.target.value)} className="w-full h-10 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="email@example.com" />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Phone</label>
                <input type="tel" value={formPhone} onChange={e => setFormPhone(e.target.value)} className="w-full h-10 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="+91 99999 99999" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Role</label>
                  <select value={formRole} onChange={e => setFormRole(e.target.value as typeof formRole)} className="w-full h-10 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-white">
                    <option>Citizen</option><option>Official</option><option>Admin</option>
                  </select>
                </div>
                {formRole === 'Official' && (
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Department</label>
                    <select value={formDept} onChange={e => setFormDept(e.target.value)} className="w-full h-10 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-white">
                      <option value="">Select...</option>
                      <option>Public Works</option>
                      <option>Water Supply Board</option>
                      <option>Electricity Board</option>
                      <option>Municipal Corporation</option>
                    </select>
                  </div>
                )}
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={formActive} onChange={e => setFormActive(e.target.checked)} className="accent-red-600" />
                <span className="text-sm text-gray-700">Active account</span>
              </label>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50">Cancel</button>
              <button onClick={handleSave} className="flex-1 py-2 bg-[#DC2626] text-white rounded-lg text-sm font-medium hover:bg-red-700">Save</button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteConfirm}
        title="Delete User"
        message="Are you sure you want to delete this user? This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={() => deleteConfirm && handleDelete(deleteConfirm)}
        onCancel={() => setDeleteConfirm(null)}
      />
    </div>
  );
}
