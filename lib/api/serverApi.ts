import { api } from './api';
import { cookies } from 'next/headers';
import { User } from '@/types/user';
import { Note } from '@/types/note';

async function getHeaders() {
  const cookieStore = await cookies();
  return {
    Cookie: cookieStore.toString(),
  };
}

export async function fetchNotes(params: {
  page: number;
  perPage: number;
  search?: string;
  tag?: string;
}) {
  const headers = await getHeaders();
  const { data } = await api.get('/notes', { params, headers });
  return data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const headers = await getHeaders();
  const { data } = await api.get<Note>(`/notes/${id}`, { headers });
  return data;
}

export async function getMe(): Promise<User> {
  const headers = await getHeaders();
  const { data } = await api.get<User>('/users/me', { headers });
  return data;
}

export async function checkSession(): Promise<{ success: boolean }> {
  try {
    const headers = await getHeaders();
    const { data } = await api.get<{ success: boolean }>('/auth/session', {
      headers,
    });
    return data;
  } catch {
    return { success: false };
  }
}
