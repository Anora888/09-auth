import { api } from './api';
import { User } from '@/types/user';
import { Note } from '@/types/note';
import { FetchNotesParams, FetchNotesResponse } from './clientApi';
import { cookies } from 'next/headers';

async function getHeaders() {
  const cookieStore = await cookies();
  return {
    Cookie: cookieStore.toString(),
  };
}

export async function fetchNotes(
  params: FetchNotesParams
): Promise<FetchNotesResponse> {
  const headers = await getHeaders();
  const { data } = await api.get<FetchNotesResponse>('/notes', {
    params,
    headers,
  });
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
  } catch (error) {
    return { success: false };
  }
}
