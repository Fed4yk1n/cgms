import { supabase, supabaseConfigured } from '../lib/supabase';
import { mockUsers, type AppUser } from '../data/mockData';

export async function getUsers(): Promise<AppUser[]> {
  if (!supabaseConfigured) return mockUsers;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error || !data) return [];

  return data.map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    department: u.department || undefined,
    phone: u.phone || undefined,
    status: u.status,
    createdAt: new Date(u.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
  }));
}

export async function updateUser(
  userId: string,
  updates: { name?: string; email?: string; phone?: string; role?: AppUser['role']; department?: string; status?: AppUser['status'] },
): Promise<boolean> {
  if (!supabaseConfigured) return true;

  const { error } = await supabase
    .from('profiles')
    .update({
      name: updates.name,
      email: updates.email,
      phone: updates.phone,
      role: updates.role,
      department: updates.department || null,
      status: updates.status,
    })
    .eq('id', userId);

  return !error;
}

export async function deleteUser(userId: string): Promise<boolean> {
  if (!supabaseConfigured) return true;

  const { error } = await supabase
    .from('profiles')
    .delete()
    .eq('id', userId);

  return !error;
}

export async function toggleUserStatus(userId: string, currentStatus: string): Promise<AppUser['status']> {
  const newStatus: AppUser['status'] = currentStatus === 'Active' ? 'Suspended' : 'Active';
  if (!supabaseConfigured) return newStatus;

  await supabase
    .from('profiles')
    .update({ status: newStatus })
    .eq('id', userId);

  return newStatus;
}
