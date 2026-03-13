import { createBrowserRouter, Navigate } from 'react-router';
import { LoginPage } from './pages/LoginPage';
import { AppLayout } from './components/layout/AppLayout';
import { CitizenDashboard } from './pages/citizen/CitizenDashboard';
import { SubmitComplaint } from './pages/citizen/SubmitComplaint';
import { TrackComplaint } from './pages/citizen/TrackComplaint';
import { MyComplaints } from './pages/citizen/MyComplaints';
import { OfficialDashboard } from './pages/official/OfficialDashboard';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { ManageUsers } from './pages/admin/ManageUsers';
import { Reports } from './pages/admin/Reports';
import { Departments } from './pages/admin/Departments';
import { NotificationsConfig } from './pages/admin/NotificationsConfig';
import { NotFound } from './pages/NotFound';
import { GenericPage } from './pages/GenericPage';

export const router = createBrowserRouter([
  { path: '/', element: <LoginPage /> },

  // Citizen routes
  {
    path: '/citizen',
    element: <AppLayout />,
    children: [
      { index: true, element: <CitizenDashboard /> },
      { path: 'submit', element: <SubmitComplaint /> },
      { path: 'track', element: <TrackComplaint /> },
      { path: 'complaints', element: <MyComplaints /> },
      { path: 'history', element: <GenericPage title="Complaint History" description="View your complete complaint history with detailed logs and resolution timelines." /> },
      { path: 'notifications', element: <GenericPage title="Notifications" description="View all your notifications and alert preferences." /> },
      { path: 'profile', element: <GenericPage title="My Profile" description="Update your personal information, contact details, and account settings." /> },
    ],
  },

  // Official routes
  {
    path: '/official',
    element: <AppLayout />,
    children: [
      { index: true, element: <OfficialDashboard /> },
      { path: 'complaints', element: <OfficialDashboard /> },
      { path: 'verify', element: <GenericPage title="Verify Complaints" description="Review and verify incoming complaints before assigning to your team." /> },
      { path: 'update', element: <GenericPage title="Update Ticket Status" description="Bulk update complaint ticket statuses and add resolution notes." /> },
      { path: 'close', element: <GenericPage title="Close Complaint" description="Mark complaints as resolved and provide closure feedback." /> },
      { path: 'feedback', element: <GenericPage title="Provide Feedback" description="Rate resolution quality and provide official remarks." /> },
      { path: 'request-info', element: <GenericPage title="Request Additional Info" description="Send information requests to citizens for pending complaints." /> },
      { path: 'reports', element: <GenericPage title="My Reports" description="View your personal performance reports and resolution statistics." /> },
      { path: 'profile', element: <GenericPage title="Profile" description="Manage your official profile and department preferences." /> },
    ],
  },

  // Admin routes
  {
    path: '/admin',
    element: <AppLayout />,
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: 'users', element: <ManageUsers /> },
      { path: 'roles', element: <GenericPage title="Assign Roles" description="Manage role assignments and permissions for users across all departments." /> },
      { path: 'reports', element: <Reports /> },
      { path: 'export', element: <Reports /> },
      { path: 'activity', element: <GenericPage title="Monitor Activity" description="Real-time activity monitoring for all system events and user actions." /> },
      { path: 'notifications', element: <NotificationsConfig /> },
      { path: 'departments', element: <Departments /> },
      { path: 'settings', element: <GenericPage title="System Settings" description="Configure global system parameters, branding and security policies." /> },
      { path: 'security', element: <GenericPage title="Security & 2FA" description="Configure two-factor authentication and security policies for all roles." /> },
    ],
  },

  { path: '*', element: <NotFound /> },
]);
