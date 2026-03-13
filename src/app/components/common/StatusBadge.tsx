import type { ComplaintStatus, ComplaintPriority } from '../../data/mockData';

interface StatusBadgeProps {
  status: ComplaintStatus;
}

interface PriorityBadgeProps {
  priority: ComplaintPriority;
}

const statusConfig: Record<ComplaintStatus, { bg: string; text: string; dot: string }> = {
  'Pending': { bg: 'bg-amber-100', text: 'text-amber-800', dot: 'bg-amber-500' },
  'In Progress': { bg: 'bg-blue-100', text: 'text-blue-800', dot: 'bg-blue-500' },
  'Resolved': { bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500' },
  'Closed': { bg: 'bg-gray-100', text: 'text-gray-700', dot: 'bg-gray-400' },
  'Needs Info': { bg: 'bg-orange-100', text: 'text-orange-800', dot: 'bg-orange-500' },
  'Verified': { bg: 'bg-teal-100', text: 'text-teal-800', dot: 'bg-teal-500' },
};

const priorityConfig: Record<ComplaintPriority, { bg: string; text: string }> = {
  'Low': { bg: 'bg-gray-100', text: 'text-gray-700' },
  'Medium': { bg: 'bg-blue-100', text: 'text-blue-700' },
  'High': { bg: 'bg-orange-100', text: 'text-orange-800' },
  'Urgent': { bg: 'bg-red-100', text: 'text-red-800' },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const cfg = statusConfig[status] ?? { bg: 'bg-gray-100', text: 'text-gray-700', dot: 'bg-gray-400' };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${cfg.bg} ${cfg.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {status}
    </span>
  );
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const cfg = priorityConfig[priority] ?? { bg: 'bg-gray-100', text: 'text-gray-700' };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${cfg.bg} ${cfg.text}`}>
      {priority}
    </span>
  );
}
