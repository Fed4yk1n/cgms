import { useState } from 'react';
import { FileText, Download, BarChart2, TrendingUp } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line,
} from 'recharts';
import { chartBarData, chartLineData } from '../../data/mockData';

const reportTypes = [
  { id: 'summary', label: 'Complaints Summary' },
  { id: 'dept', label: 'Department Performance' },
  { id: 'resolution', label: 'Resolution Time' },
  { id: 'category', label: 'Category Breakdown' },
];

const formats = [
  { id: 'pdf', label: 'PDF', icon: FileText },
  { id: 'excel', label: 'Excel', icon: BarChart2 },
  { id: 'csv', label: 'CSV', icon: TrendingUp },
];

const departments = ['All Departments', 'Public Works', 'Water Supply Board', 'Electricity Board', 'Municipal Corporation'];
const statuses = ['All', 'Pending', 'In Progress', 'Resolved', 'Closed'];

const previewData = [
  { department: 'Municipal Corp.', total: 45, pending: 12, resolved: 28, avgDays: 4.2 },
  { department: 'Electricity Board', total: 31, pending: 8, resolved: 20, avgDays: 3.1 },
  { department: 'Public Works', total: 23, pending: 6, resolved: 14, avgDays: 5.8 },
  { department: 'Water Supply', total: 17, pending: 4, resolved: 12, avgDays: 2.9 },
  { department: 'Town Planning', total: 9, pending: 2, resolved: 6, avgDays: 7.0 },
];

export function Reports() {
  const [reportType, setReportType] = useState('summary');
  const [format, setFormat] = useState('pdf');
  const [fromDate, setFromDate] = useState('2024-11-01');
  const [toDate, setToDate] = useState('2024-12-15');
  const [selectedDepts, setSelectedDepts] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [generated, setGenerated] = useState(false);

  const toggleDept = (d: string) => setSelectedDepts(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]);
  const toggleStatus = (s: string) => setSelectedStatuses(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-gray-900">Generate & Export Reports</h1>
        <p className="text-sm text-gray-500 mt-0.5">Build custom reports with filters and export in multiple formats</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Builder */}
        <div className="xl:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-5">
            <h3 className="text-gray-900">Report Builder</h3>

            {/* Date range */}
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-wide mb-2">Date Range</label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">From</label>
                  <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} className="w-full h-9 px-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-red-500" />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">To</label>
                  <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} className="w-full h-9 px-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-red-500" />
                </div>
              </div>
            </div>

            {/* Report type */}
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-wide mb-2">Report Type</label>
              <div className="space-y-1.5">
                {reportTypes.map(rt => (
                  <label key={rt.id} className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50">
                    <input type="radio" name="reportType" value={rt.id} checked={reportType === rt.id} onChange={() => setReportType(rt.id)} className="accent-red-600" />
                    <span className="text-sm text-gray-700">{rt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Format */}
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-wide mb-2">Export Format</label>
              <div className="flex gap-2">
                {formats.map(f => (
                  <label key={f.id} className={`flex-1 flex flex-col items-center gap-1 py-2.5 rounded-lg border-2 cursor-pointer transition-colors ${format === f.id ? 'border-[#DC2626] bg-red-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <input type="radio" name="format" value={f.id} checked={format === f.id} onChange={() => setFormat(f.id)} className="sr-only" />
                    <f.icon className={`w-4 h-4 ${format === f.id ? 'text-[#DC2626]' : 'text-gray-400'}`} />
                    <span className={`text-xs font-medium ${format === f.id ? 'text-[#DC2626]' : 'text-gray-500'}`}>{f.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Department filter */}
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-wide mb-2">Department Filter</label>
              <div className="flex flex-wrap gap-1.5">
                {departments.slice(1).map(d => (
                  <button
                    key={d}
                    onClick={() => toggleDept(d)}
                    className={`px-2 py-1 rounded-full text-xs transition-colors ${selectedDepts.includes(d) ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  >
                    {d}
                    {selectedDepts.includes(d) && ' ×'}
                  </button>
                ))}
              </div>
            </div>

            {/* Status filter */}
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-wide mb-2">Status Filter</label>
              <div className="flex flex-wrap gap-1.5">
                {statuses.slice(1).map(s => (
                  <button
                    key={s}
                    onClick={() => toggleStatus(s)}
                    className={`px-2 py-1 rounded-full text-xs transition-colors ${selectedStatuses.includes(s) ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  >
                    {s}
                    {selectedStatuses.includes(s) && ' ×'}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setGenerated(true)}
              className="w-full py-2.5 bg-[#DC2626] text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
            >
              Generate Report
            </button>
          </div>
        </div>

        {/* Preview */}
        <div className="xl:col-span-2 space-y-4">
          {generated ? (
            <>
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-gray-900">Report Preview</h3>
                    <p className="text-xs text-gray-400 mt-0.5">{fromDate} to {toDate} · {reportTypes.find(r => r.id === reportType)?.label}</p>
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 bg-[#DC2626] text-white rounded-lg text-sm font-medium hover:bg-red-700">
                    <Download className="w-4 h-4" /> Export Now
                  </button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto mb-5">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100">
                        {['Department', 'Total', 'Pending', 'Resolved', 'Avg Days'].map(h => (
                          <th key={h} className="text-left px-3 py-2.5 text-xs font-medium text-gray-500 uppercase">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {previewData.map(row => (
                        <tr key={row.department} className="hover:bg-gray-50/50">
                          <td className="px-3 py-2.5 text-sm text-gray-900">{row.department}</td>
                          <td className="px-3 py-2.5 text-sm font-semibold text-gray-900">{row.total}</td>
                          <td className="px-3 py-2.5 text-sm text-amber-600">{row.pending}</td>
                          <td className="px-3 py-2.5 text-sm text-green-600">{row.resolved}</td>
                          <td className="px-3 py-2.5 text-sm text-gray-600">{row.avgDays}d</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-2 font-medium">By Category</p>
                    <ResponsiveContainer width="100%" height={150}>
                      <BarChart data={chartBarData} barSize={20}>
                        <XAxis dataKey="category" tick={{ fontSize: 9, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 9, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '6px' }} />
                        <Bar dataKey="count" fill="#DC2626" radius={[3, 3, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-2 font-medium">Weekly Trend</p>
                    <ResponsiveContainer width="100%" height={150}>
                      <LineChart data={chartLineData}>
                        <XAxis dataKey="week" tick={{ fontSize: 9, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 9, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '6px' }} />
                        <Line type="monotone" dataKey="resolved" stroke="#16A34A" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-10 text-center">
              <BarChart2 className="w-12 h-12 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-500">Configure the report settings and click "Generate Report" to preview</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
