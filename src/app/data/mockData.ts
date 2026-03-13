export type ComplaintStatus = 'Pending' | 'In Progress' | 'Resolved' | 'Closed' | 'Needs Info' | 'Verified';
export type ComplaintPriority = 'Low' | 'Medium' | 'High' | 'Urgent';
export type ComplaintCategory = 'Road' | 'Water' | 'Electricity' | 'Sanitation' | 'Other';

export interface Complaint {
  id: string;
  title: string;
  category: ComplaintCategory;
  department: string;
  priority: ComplaintPriority;
  status: ComplaintStatus;
  date: string;
  description: string;
  location: string;
  citizenName: string;
  citizenId: string;
  assignedTo?: string;
  comments: Comment[];
}

export interface Comment {
  id: string;
  author: string;
  role: string;
  message: string;
  timestamp: string;
}

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: 'Citizen' | 'Official' | 'Admin';
  department?: string;
  status: 'Active' | 'Inactive' | 'Suspended';
  createdAt: string;
  phone?: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  head: string;
  complaintsThisMonth: number;
  officials: number;
  description: string;
}

export interface NotificationItem {
  id: string;
  type: 'complaint' | 'system' | 'info';
  message: string;
  timestamp: string;
  read: boolean;
}

export const mockComplaints: Complaint[] = [
  {
    id: 'CMP-2024-00847',
    title: 'Broken streetlight near Market Road',
    category: 'Electricity',
    department: 'Electricity Board',
    priority: 'High',
    status: 'In Progress',
    date: 'Dec 15, 2024',
    description: 'The streetlight at Market Road junction has been broken for over 2 weeks causing safety issues at night.',
    location: 'Market Road Junction, Sector 4',
    citizenName: 'Rahul Sharma',
    citizenId: '1',
    assignedTo: 'Priya Singh',
    comments: [
      { id: 'c1', author: 'Priya Singh', role: 'Official', message: 'Complaint received and verified. Maintenance team dispatched.', timestamp: 'Dec 16, 9:00 AM' },
      { id: 'c2', author: 'Rahul Sharma', role: 'Citizen', message: 'Thank you, please expedite as it is a safety hazard.', timestamp: 'Dec 16, 10:15 AM' },
    ],
  },
  {
    id: 'CMP-2024-00846',
    title: 'Potholes on NH-48 causing accidents',
    category: 'Road',
    department: 'Public Works',
    priority: 'Urgent',
    status: 'Pending',
    date: 'Dec 14, 2024',
    description: 'Multiple large potholes on NH-48 between km 23 and 26. Two minor accidents reported.',
    location: 'NH-48, Km 23-26',
    citizenName: 'Rahul Sharma',
    citizenId: '1',
    assignedTo: undefined,
    comments: [],
  },
  {
    id: 'CMP-2024-00841',
    title: 'No water supply for 5 days',
    category: 'Water',
    department: 'Water Supply Board',
    priority: 'Urgent',
    status: 'Resolved',
    date: 'Dec 10, 2024',
    description: 'Colony residents have not received water supply for 5 days. Water tankers also not dispatched.',
    location: 'Green Valley Colony, Block C',
    citizenName: 'Rahul Sharma',
    citizenId: '1',
    assignedTo: 'Deepak Verma',
    comments: [
      { id: 'c3', author: 'Deepak Verma', role: 'Official', message: 'Pipeline repair completed. Water supply restored.', timestamp: 'Dec 13, 4:00 PM' },
    ],
  },
  {
    id: 'CMP-2024-00839',
    title: 'Garbage not collected for 2 weeks',
    category: 'Sanitation',
    department: 'Municipal Corporation',
    priority: 'Medium',
    status: 'Closed',
    date: 'Dec 8, 2024',
    description: 'Garbage collection has been stopped in our area. Huge pile-up causing health hazard.',
    location: 'Sunflower Apartments, Main Gate',
    citizenName: 'Rahul Sharma',
    citizenId: '1',
    assignedTo: 'Sunita Rao',
    comments: [],
  },
  {
    id: 'CMP-2024-00835',
    title: 'Sewage overflow on main street',
    category: 'Sanitation',
    department: 'Municipal Corporation',
    priority: 'High',
    status: 'Needs Info',
    date: 'Dec 6, 2024',
    description: 'Sewage is overflowing on the main street, making it impassable.',
    location: 'Main Street, Ward 12',
    citizenName: 'Rahul Sharma',
    citizenId: '1',
    assignedTo: 'Ravi Kumar',
    comments: [
      { id: 'c4', author: 'Ravi Kumar', role: 'Official', message: 'Please provide exact GPS coordinates or a landmark near the overflow.', timestamp: 'Dec 7, 11:00 AM' },
    ],
  },
  {
    id: 'CMP-2024-00830',
    title: 'Illegal construction blocking road',
    category: 'Other',
    department: 'Town Planning',
    priority: 'Medium',
    status: 'Verified',
    date: 'Dec 3, 2024',
    description: 'Unauthorized construction material stored on public road, blocking vehicle movement.',
    location: 'Ring Road, Plot 45',
    citizenName: 'Rahul Sharma',
    citizenId: '1',
    assignedTo: 'Anita Joshi',
    comments: [],
  },
];

export const mockAllComplaints: Complaint[] = [
  ...mockComplaints,
  {
    id: 'CMP-2024-00820',
    title: 'Damaged playground equipment',
    category: 'Other',
    department: 'Parks Department',
    priority: 'Low',
    status: 'Pending',
    date: 'Nov 28, 2024',
    description: 'Playground equipment in Central Park is damaged and poses safety risk to children.',
    location: 'Central Park, Sector 12',
    citizenName: 'Anjali Mehta',
    citizenId: '5',
    assignedTo: undefined,
    comments: [],
  },
  {
    id: 'CMP-2024-00815',
    title: 'Water logging near school',
    category: 'Water',
    department: 'Public Works',
    priority: 'High',
    status: 'In Progress',
    date: 'Nov 25, 2024',
    description: 'Severe water logging near Government School No. 5 every time it rains.',
    location: 'Government School No. 5, Sector 8',
    citizenName: 'Vikas Gupta',
    citizenId: '6',
    assignedTo: 'Priya Singh',
    comments: [],
  },
];

export const mockUsers: AppUser[] = [
  { id: '1', name: 'Rahul Sharma', email: 'citizen@demo.com', role: 'Citizen', status: 'Active', createdAt: 'Jan 10, 2024', phone: '+91 98765 43210' },
  { id: '2', name: 'Priya Singh', email: 'official@demo.com', role: 'Official', department: 'Public Works', status: 'Active', createdAt: 'Feb 5, 2024', phone: '+91 87654 32109' },
  { id: '3', name: 'Admin Kumar', email: 'admin@demo.com', role: 'Admin', status: 'Active', createdAt: 'Jan 1, 2024', phone: '+91 76543 21098' },
  { id: '4', name: 'Deepak Verma', email: 'deepak@gov.in', role: 'Official', department: 'Water Supply Board', status: 'Active', createdAt: 'Mar 12, 2024', phone: '+91 65432 10987' },
  { id: '5', name: 'Anjali Mehta', email: 'anjali@gmail.com', role: 'Citizen', status: 'Active', createdAt: 'Apr 20, 2024', phone: '+91 54321 09876' },
  { id: '6', name: 'Vikas Gupta', email: 'vikas@gmail.com', role: 'Citizen', status: 'Inactive', createdAt: 'May 15, 2024', phone: '+91 43210 98765' },
  { id: '7', name: 'Sunita Rao', email: 'sunita@gov.in', role: 'Official', department: 'Municipal Corporation', status: 'Active', createdAt: 'Jun 8, 2024', phone: '+91 32109 87654' },
  { id: '8', name: 'Ravi Kumar', email: 'ravi@gov.in', role: 'Official', department: 'Municipal Corporation', status: 'Suspended', createdAt: 'Jul 22, 2024', phone: '+91 21098 76543' },
  { id: '9', name: 'Meena Patel', email: 'meena@gmail.com', role: 'Citizen', status: 'Active', createdAt: 'Aug 3, 2024', phone: '+91 10987 65432' },
  { id: '10', name: 'Anita Joshi', email: 'anita@gov.in', role: 'Official', department: 'Town Planning', status: 'Active', createdAt: 'Sep 14, 2024', phone: '+91 09876 54321' },
];

export const mockDepartments: Department[] = [
  { id: '1', name: 'Public Works Department', code: 'PWD', head: 'Priya Singh', complaintsThisMonth: 23, officials: 8, description: 'Responsible for road maintenance, drainage and public infrastructure.' },
  { id: '2', name: 'Water Supply Board', code: 'WSB', head: 'Deepak Verma', complaintsThisMonth: 17, officials: 6, description: 'Manages water supply, pipelines and sewage systems.' },
  { id: '3', name: 'Electricity Board', code: 'EB', head: 'Ramesh Nair', complaintsThisMonth: 31, officials: 12, description: 'Handles power distribution, streetlights and electrical infrastructure.' },
  { id: '4', name: 'Municipal Corporation', code: 'MC', head: 'Sunita Rao', complaintsThisMonth: 45, officials: 15, description: 'Manages sanitation, garbage collection and civic amenities.' },
  { id: '5', name: 'Town Planning', code: 'TP', head: 'Anita Joshi', complaintsThisMonth: 9, officials: 4, description: 'Oversees urban development, zoning and construction permits.' },
  { id: '6', name: 'Parks Department', code: 'PD', head: 'Suresh Pillai', complaintsThisMonth: 5, officials: 3, description: 'Maintains public parks, gardens and recreational facilities.' },
];

export const mockNotifications: NotificationItem[] = [
  { id: 'n1', type: 'complaint', message: 'Your complaint #CMP-2024-00847 status updated to "In Progress"', timestamp: '2 hours ago', read: false },
  { id: 'n2', type: 'system', message: 'Official Priya Singh added a comment on your complaint', timestamp: '5 hours ago', read: false },
  { id: 'n3', type: 'info', message: 'Your complaint #CMP-2024-00841 has been resolved', timestamp: 'Yesterday', read: true },
  { id: 'n4', type: 'complaint', message: 'Request for additional info on complaint #CMP-2024-00835', timestamp: '2 days ago', read: true },
  { id: 'n5', type: 'system', message: 'System maintenance scheduled for Dec 20, 2024', timestamp: '3 days ago', read: true },
];

export const chartBarData = [
  { category: 'Road', count: 45 },
  { category: 'Water', count: 32 },
  { category: 'Electricity', count: 58 },
  { category: 'Sanitation', count: 71 },
  { category: 'Other', count: 19 },
];

export const chartLineData = [
  { week: 'Week 1', submitted: 30, resolved: 22 },
  { week: 'Week 2', submitted: 45, resolved: 38 },
  { week: 'Week 3', submitted: 38, resolved: 41 },
  { week: 'Week 4', submitted: 52, resolved: 45 },
];

export const chartPieData = [
  { name: 'Pending', value: 87, color: '#D97706' },
  { name: 'In Progress', value: 63, color: '#1A56DB' },
  { name: 'Resolved', value: 142, color: '#16A34A' },
  { name: 'Closed', value: 55, color: '#64748B' },
];

export const activityFeed = [
  { id: 'a1', user: 'Rahul Sharma', action: 'submitted a new complaint', type: 'submit', time: '2 min ago' },
  { id: 'a2', user: 'Priya Singh', action: 'updated status of CMP-2024-00847 to In Progress', type: 'update', time: '15 min ago' },
  { id: 'a3', user: 'Deepak Verma', action: 'closed complaint CMP-2024-00841', type: 'close', time: '1 hour ago' },
  { id: 'a4', user: 'Anjali Mehta', action: 'registered as a new citizen', type: 'register', time: '2 hours ago' },
  { id: 'a5', user: 'Ravi Kumar', action: 'requested additional info for CMP-2024-00835', type: 'info', time: '3 hours ago' },
  { id: 'a6', user: 'Admin Kumar', action: 'added new department: Parks Department', type: 'admin', time: '5 hours ago' },
];
