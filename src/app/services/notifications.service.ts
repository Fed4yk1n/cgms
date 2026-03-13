import { supabase, supabaseConfigured } from '../lib/supabase';
import { mockNotifications, type NotificationItem } from '../data/mockData';

export async function getNotifications(userId: string): Promise<NotificationItem[]> {
  if (!supabaseConfigured) return mockNotifications;

  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(20);

  if (error || !data) return [];

  return data.map(n => ({
    id: n.id,
    type: n.type as NotificationItem['type'],
    message: n.message,
    timestamp: formatTimestamp(n.created_at),
    read: n.read,
  }));
}

export async function markNotificationRead(notificationId: string): Promise<boolean> {
  if (!supabaseConfigured) return true;

  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', notificationId);

  return !error;
}

export async function markAllNotificationsRead(userId: string): Promise<boolean> {
  if (!supabaseConfigured) return true;

  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('user_id', userId)
    .eq('read', false);

  return !error;
}

export async function createNotification(
  userId: string,
  type: 'complaint' | 'system' | 'info',
  message: string,
): Promise<boolean> {
  if (!supabaseConfigured) return true;

  const { error } = await supabase
    .from('notifications')
    .insert({ user_id: userId, type, message });

  return !error;
}

function formatTimestamp(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
