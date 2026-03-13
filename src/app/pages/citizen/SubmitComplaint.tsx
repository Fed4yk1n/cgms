import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ChevronRight, ChevronLeft, MapPin, Upload, X, CheckCircle, CloudUpload, FileText, Image } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { createComplaint } from '../../services/complaints.service';
import { toast } from 'sonner';
import type { ComplaintCategory, ComplaintPriority } from '../../data/mockData';

type Step = 1 | 2 | 3;

const categories = ['Road', 'Water', 'Electricity', 'Sanitation', 'Other'];
const deptByCategory: Record<string, string> = {
  Road: 'Public Works Department',
  Water: 'Water Supply Board',
  Electricity: 'Electricity Board',
  Sanitation: 'Municipal Corporation',
  Other: 'Town Planning',
};

interface UploadedFile { name: string; size: string; type: string; preview?: string }

export function SubmitComplaint() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState<Step>(1);
  const [submitted, setSubmitted] = useState(false);
  const [submittedId, setSubmittedId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Step 1
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [department, setDepartment] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');

  // Step 2
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [dragging, setDragging] = useState(false);

  // Step 3
  const [confirmed, setConfirmed] = useState(false);

  const handleCategoryChange = (cat: string) => {
    setCategory(cat);
    setDepartment(deptByCategory[cat] || '');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const dropped = Array.from(e.dataTransfer.files);
    addFiles(dropped);
  };

  const addFiles = (dropped: File[]) => {
    if (files.length >= 5) return;
    const newFiles = dropped.slice(0, 5 - files.length).map(f => ({
      name: f.name,
      size: (f.size / 1024 / 1024).toFixed(1) + ' MB',
      type: f.type,
      preview: f.type.startsWith('image/') ? URL.createObjectURL(f) : undefined,
    }));
    setFiles(prev => [...prev, ...newFiles]);
  };

  const handleSubmit = async () => {
    if (!confirmed || !user) return;
    setSubmitting(true);
    try {
      const result = await createComplaint({
        title,
        category: category as ComplaintCategory,
        department,
        priority: priority as ComplaintPriority,
        description,
        location,
        citizenId: user.id,
        citizenName: user.name,
      });
      if (result) {
        setSubmittedId(result.id);
        setSubmitted(true);
        toast.success('Complaint submitted successfully!');
      } else {
        toast.error('Failed to submit complaint. Please try again.');
      }
    } catch {
      toast.error('An error occurred. Please try again.');
    }
    setSubmitting(false);
  };

  const stepLabels = ['Basic Info', 'Upload Evidence', 'Review & Submit'];

  if (submitted) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-gray-900 mb-2">Complaint Submitted!</h2>
          <p className="text-sm text-gray-500 mb-4">Your complaint has been successfully submitted and assigned an ID.</p>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <p className="text-xs text-gray-500 mb-1">Complaint ID</p>
            <p className="text-xl font-bold text-[#1A56DB] font-mono">#{submittedId}</p>
          </div>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => navigate('/citizen/track')}
              className="w-full py-2 bg-[#1A56DB] text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Track Your Complaint
            </button>
            <button
              onClick={() => navigate('/citizen')}
              className="w-full py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
          <button onClick={() => navigate('/citizen')} className="hover:text-blue-600">Home</button>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-900">Submit Complaint</span>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-gray-900 mb-4">Submit a New Complaint</h2>

            {/* Step progress */}
            <div className="flex items-center gap-0">
              {stepLabels.map((label, i) => {
                const n = (i + 1) as Step;
                const done = step > n;
                const active = step === n;
                return (
                  <div key={label} className="flex items-center flex-1 last:flex-none">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                        done ? 'bg-green-500 text-white' : active ? 'bg-[#1A56DB] text-white' : 'bg-gray-100 text-gray-400'
                      }`}>
                        {done ? <CheckCircle className="w-4 h-4" /> : n}
                      </div>
                      <span className={`text-xs mt-1 whitespace-nowrap ${active ? 'text-[#1A56DB] font-medium' : 'text-gray-400'}`}>{label}</span>
                    </div>
                    {i < 2 && <div className={`flex-1 h-0.5 mx-2 mb-4 ${done ? 'bg-green-500' : 'bg-gray-200'}`} />}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-6">
            {/* Step 1 */}
            {step === 1 && (
              <div className="space-y-5">
                <div>
                  <label className="block text-sm text-gray-700 mb-1.5">Complaint Title *</label>
                  <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="Briefly describe the issue"
                    className="w-full h-10 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1.5">Category *</label>
                    <select
                      value={category}
                      onChange={e => handleCategoryChange(e.target.value)}
                      className="w-full h-10 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      <option value="">Select category</option>
                      {categories.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1.5">Department</label>
                    <select
                      value={department}
                      onChange={e => setDepartment(e.target.value)}
                      className="w-full h-10 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      <option value="">Auto-populated</option>
                      {Object.values(deptByCategory).map(d => <option key={d}>{d}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-1.5">Priority *</label>
                  <div className="flex gap-3">
                    {['Low', 'Medium', 'High', 'Urgent'].map(p => (
                      <label key={p} className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="priority"
                          value={p}
                          checked={priority === p}
                          onChange={() => setPriority(p)}
                          className="accent-blue-600"
                        />
                        <span className="text-sm text-gray-700">{p}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-1.5">Description *</label>
                  <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value.slice(0, 1000))}
                    rows={5}
                    placeholder="Provide detailed description of the issue..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                  <div className="text-right text-xs text-gray-400 mt-0.5">{description.length}/1000</div>
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-1.5">Location *</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={location}
                        onChange={e => setLocation(e.target.value)}
                        placeholder="Enter address or landmark"
                        className="w-full pl-10 pr-3 h-10 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setLocation('Current Location (GPS)')}
                      className="flex items-center gap-1.5 px-3 h-10 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 whitespace-nowrap"
                    >
                      <MapPin className="w-3.5 h-3.5" /> Use my location
                    </button>
                  </div>
                </div>

                {/* Mini Map Placeholder */}
                <div className="h-32 bg-gradient-to-br from-green-100 to-blue-100 rounded-lg border border-gray-200 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-6 h-6 text-red-500 mx-auto mb-1" />
                    <p className="text-xs text-gray-500">Click to drop pin on map (optional)</p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <div className="space-y-4">
                <div
                  onDragOver={e => { e.preventDefault(); setDragging(true); }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-10 text-center transition-colors ${
                    dragging ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <CloudUpload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm font-medium text-gray-700 mb-1">Drag files here or click to browse</p>
                  <p className="text-xs text-gray-400 mb-3">JPG, PNG, PDF, MP4 — Max 10MB each</p>
                  <label className="cursor-pointer px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 inline-block">
                    <input
                      type="file"
                      multiple
                      accept="image/*,.pdf,.mp4"
                      className="hidden"
                      onChange={e => addFiles(Array.from(e.target.files || []))}
                    />
                    Browse Files
                  </label>
                  <p className="text-xs text-gray-400 mt-2">Max 5 files — {files.length}/5 uploaded</p>
                </div>

                {files.length > 0 && (
                  <div className="space-y-2">
                    {files.map((f, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                        {f.preview ? (
                          <img src={f.preview} alt="" className="w-10 h-10 rounded object-cover flex-shrink-0" />
                        ) : (
                          <div className="w-10 h-10 bg-blue-100 rounded flex items-center justify-center flex-shrink-0">
                            {f.type.includes('pdf') ? <FileText className="w-5 h-5 text-blue-600" /> : <Image className="w-5 h-5 text-blue-600" />}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900 truncate">{f.name}</p>
                          <p className="text-xs text-gray-400">{f.size}</p>
                        </div>
                        <button onClick={() => setFiles(prev => prev.filter((_, j) => j !== i))} className="text-gray-400 hover:text-red-500">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-xl p-5 space-y-3 border border-gray-200">
                  <h4 className="text-gray-900 border-b border-gray-200 pb-2 mb-3">Complaint Summary</h4>
                  {[
                    { label: 'Title', value: title || 'Not provided' },
                    { label: 'Category', value: category || 'Not selected' },
                    { label: 'Department', value: department || 'Auto-assigned' },
                    { label: 'Priority', value: priority },
                    { label: 'Location', value: location || 'Not provided' },
                  ].map(r => (
                    <div key={r.label} className="flex gap-3">
                      <span className="text-xs text-gray-500 w-24 flex-shrink-0">{r.label}</span>
                      <span className="text-sm text-gray-900">{r.value}</span>
                    </div>
                  ))}
                  <div className="flex gap-3">
                    <span className="text-xs text-gray-500 w-24 flex-shrink-0">Description</span>
                    <span className="text-sm text-gray-900 line-clamp-3">{description || 'Not provided'}</span>
                  </div>
                  {files.length > 0 && (
                    <div className="flex gap-3">
                      <span className="text-xs text-gray-500 w-24 flex-shrink-0">Files</span>
                      <span className="text-sm text-gray-900">{files.length} file(s) attached</span>
                    </div>
                  )}
                </div>

                <label className="flex items-start gap-2 cursor-pointer">
                  <input type="checkbox" checked={confirmed} onChange={e => setConfirmed(e.target.checked)} className="mt-0.5 accent-blue-600" />
                  <span className="text-sm text-gray-700">I confirm the information above is accurate and true to the best of my knowledge.</span>
                </label>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-6 pt-5 border-t border-gray-100">
              <button
                onClick={() => step > 1 ? setStep((step - 1) as Step) : navigate('/citizen')}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50"
              >
                <ChevronLeft className="w-4 h-4" /> {step === 1 ? 'Cancel' : 'Back'}
              </button>
              {step < 3 ? (
                <button
                  onClick={() => setStep((step + 1) as Step)}
                  className="flex items-center gap-2 px-6 py-2 bg-[#1A56DB] text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={!confirmed || submitting}
                  className="flex items-center gap-2 px-6 py-2 bg-[#1A56DB] text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-60"
                >
                  <Upload className="w-4 h-4" /> {submitting ? 'Submitting...' : 'Submit Complaint'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
