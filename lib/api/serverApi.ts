import axios from 'axios';
import { cookies } from 'next/headers';
import type { User } from '@/types/user';
import type { Note } from '@/types/note';

const serverApi = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: true,
});

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
  const { data } = await serverApi.get('/notes', { params, headers });
  return data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const headers = await getHeaders();
  const { data } = await serverApi.get<Note>(`/notes/${id}`, { headers });
  return data;
}

export async function getMe(): Promise<User> {
  const headers = await getHeaders();
  const { data } = await serverApi.get<User>('/users/me', { headers });
  return data;
}

export async function checkSession() {
  const headers = await getHeaders();
  return serverApi.get('/auth/session', { headers });
}