import { useState } from 'react';
import { Mail, MessageSquare, Bell, Smartphone, Edit2, X, Check } from 'lucide-react';

interface Template {
  id: string;
  event: string;
  subject: string;
  body: string;
  enabled: boolean;
}

const initialTemplates: Template[] = [
  { id: '1', event: 'Complaint Submitted', subject: 'Complaint #{{complaint_id}} Received', body: 'Dear {{citizen_name}},\n\nYour complaint has been successfully submitted. Your complaint ID is {{complaint_id}}. Our team will review it shortly.\n\nRegards,\nCitizen Portal Team', enabled: true },
  { id: '2', event: 'Status Updated', subject: 'Status Update: Complaint #{{complaint_id}}', body: 'Dear {{citizen_name}},\n\nYour complaint #{{complaint_id}} status has been updated to {{new_status}}.\n\n{{official_note}}\n\nRegards,\nCitizen Portal Team', enabled: true },
  { id: '3', event: 'Complaint Closed', subject: 'Complaint #{{complaint_id}} Closed', body: 'Dear {{citizen_name}},\n\nYour complaint #{{complaint_id}} has been closed. Thank you for reporting.\n\nRegards,\nCitizen Portal Team', enabled: true },
  { id: '4', event: 'OTP Request', subject: 'Your OTP for Citizen Portal', body: 'Your one-time password is: {{otp_code}}\n\nThis OTP is valid for 5 minutes. Do not share it with anyone.', enabled: true },
  { id: '5', event: 'New Comment Added', subject: 'New Comment on Complaint #{{complaint_id}}', body: 'Dear {{citizen_name}},\n\nA new comment has been added to your complaint #{{complaint_id}} by {{commenter_name}}.\n\nComment: {{comment_text}}\n\nRegards,\nCitizen Portal Team', enabled: false },
  { id: '6', event: 'Needs More Information', subject: 'Action Required: Complaint #{{complaint_id}}', body: 'Dear {{citizen_name}},\n\nThe official handling your complaint #{{complaint_id}} needs additional information.\n\n{{requested_info}}\n\nPlease respond at your earliest convenience.', enabled: true },
];

const variables = ['{{citizen_name}}', '{{complaint_id}}', '{{new_status}}', '{{official_note}}', '{{otp_code}}', '{{commenter_name}}', '{{comment_text}}', '{{requested_info}}'];

export function NotificationsConfig() {
  const [templates, setTemplates] = useState<Template[]>(initialTemplates);
  const [editTemplate, setEditTemplate] = useState<Template | null>(null);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(true);

  const toggleTemplate = (id: string) => {
    setTemplates(prev => prev.map(t => t.id === id ? { ...t, enabled: !t.enabled } : t));
  };

  const handleEditSave = () => {
    if (!editTemplate) return;
    setTemplates(prev => prev.map(t => t.id === editTemplate.id ? editTemplate : t));
    setEditTemplate(null);
  };

  const highlightVars = (text: string) => {
    const parts = text.split(/({{[^}]+}})/g);
    return parts.map((part, i) =>
      part.startsWith('{{') ? (
        <span key={i} className="bg-blue-100 text-blue-700 rounded px-0.5 text-xs">{part}</span>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-gray-900">Configure Notifications</h1>
        <p className="text-sm text-gray-500 mt-0.5">Manage notification templates and delivery channels</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Templates */}
        <div className="xl:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h3 className="text-gray-900">Notification Templates</h3>
              <p className="text-xs text-gray-400 mt-0.5">Toggle and customize notification triggers</p>
            </div>
            <div className="divide-y divide-gray-50">
              {templates.map(t => (
                <div key={t.id} className="p-4 flex items-start gap-4 hover:bg-gray-50/50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Bell className={`w-4 h-4 ${t.enabled ? 'text-[#1A56DB]' : 'text-gray-300'}`} />
                      <span className="text-sm font-medium text-gray-900">{t.event}</span>
                    </div>
                    <p className="text-xs text-gray-500 truncate">{t.subject}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => setEditTemplate(t)}
                      className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors"
                      title="Edit template"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => toggleTemplate(t.id)}
                      className={`relative inline-flex w-10 h-5 rounded-full transition-colors focus:outline-none ${t.enabled ? 'bg-[#1A56DB]' : 'bg-gray-200'}`}
                    >
                      <span className={`inline-block w-4 h-4 bg-white rounded-full shadow transform transition-transform top-0.5 left-0.5 absolute ${t.enabled ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Channels */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h3 className="text-gray-900 mb-4">Delivery Channels</h3>
            <div className="space-y-4">
              {/* Email */}
              <div className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-gray-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Mail className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Email</p>
                    <button className="text-xs text-blue-600 hover:underline">SMTP config →</button>
                  </div>
                </div>
                <button
                  onClick={() => setEmailEnabled(!emailEnabled)}
                  className={`relative inline-flex w-10 h-5 rounded-full transition-colors ${emailEnabled ? 'bg-[#1A56DB]' : 'bg-gray-200'}`}
                >
                  <span className={`inline-block w-4 h-4 bg-white rounded-full shadow transform transition-transform top-0.5 left-0.5 absolute ${emailEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>

              {/* SMS */}
              <div className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-gray-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-4 h-4 text-teal-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">SMS</p>
                    <button className="text-xs text-blue-600 hover:underline">Provider config →</button>
                  </div>
                </div>
                <button
                  onClick={() => setSmsEnabled(!smsEnabled)}
                  className={`relative inline-flex w-10 h-5 rounded-full transition-colors ${smsEnabled ? 'bg-[#1A56DB]' : 'bg-gray-200'}`}
                >
                  <span className={`inline-block w-4 h-4 bg-white rounded-full shadow transform transition-transform top-0.5 left-0.5 absolute ${smsEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>

              {/* In-app */}
              <div className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-gray-50/50 opacity-70">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Bell className="w-4 h-4 text-gray-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">In-App</p>
                    <p className="text-xs text-gray-400">Always enabled</p>
                  </div>
                </div>
                <button className="relative inline-flex w-10 h-5 rounded-full bg-[#1A56DB] opacity-50 cursor-not-allowed" disabled>
                  <span className="inline-block w-4 h-4 bg-white rounded-full shadow transform translate-x-5 top-0.5 left-0.5 absolute" />
                </button>
              </div>

              {/* Push */}
              <div className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-gray-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Smartphone className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Push Notifications</p>
                    <p className="text-xs text-gray-400">Mobile & Browser</p>
                  </div>
                </div>
                <button
                  onClick={() => setPushEnabled(!pushEnabled)}
                  className={`relative inline-flex w-10 h-5 rounded-full transition-colors ${pushEnabled ? 'bg-[#1A56DB]' : 'bg-gray-200'}`}
                >
                  <span className={`inline-block w-4 h-4 bg-white rounded-full shadow transform transition-transform top-0.5 left-0.5 absolute ${pushEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Variables reference */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h4 className="text-gray-900 mb-3 text-sm">Available Variables</h4>
            <div className="flex flex-wrap gap-1.5">
              {variables.map(v => (
                <span key={v} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-mono">{v}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Template Modal */}
      {editTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg mx-4">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-gray-900">Edit Template: {editTemplate.event}</h3>
              <button onClick={() => setEditTemplate(null)} className="p-1.5 rounded-lg hover:bg-gray-100">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Subject Line</label>
                <input
                  value={editTemplate.subject}
                  onChange={e => setEditTemplate(prev => prev ? { ...prev, subject: e.target.value } : null)}
                  className="w-full h-10 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Email Body</label>
                <div className="bg-blue-50/30 rounded-lg border border-blue-100 p-3 mb-2 text-xs text-blue-600">
                  💡 Use variables like {'{{'}<span>citizen_name</span>{'}}'}  to personalize messages
                </div>
                <textarea
                  value={editTemplate.body}
                  onChange={e => setEditTemplate(prev => prev ? { ...prev, body: e.target.value } : null)}
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Preview</label>
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 text-xs text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {highlightVars(editTemplate.body)}
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setEditTemplate(null)} className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50">Cancel</button>
              <button onClick={handleEditSave} className="flex-1 py-2 bg-[#1A56DB] text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center justify-center gap-2">
                <Check className="w-4 h-4" /> Save Template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
