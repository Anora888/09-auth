import { api } from './api';
import { cookies } from 'next/headers';
import type { User } from '@/types/user';
import type { Note } from '@/types/note';
import type { AxiosResponse } from 'axios';

async function getCookieHeader() {
  const cookieStore = await cookies();

  return cookieStore
    .getAll()
    .map(cookie => `${cookie.name}=${cookie.value}`)
    .join('; ');
}

async function withAuth() {
  const cookieHeader = await getCookieHeader();

  return {
    headers: {
      Cookie: cookieHeader,
    },
  };
}

export async function getMe(): Promise<User> {
  const config = await withAuth();
  const { data } = await api.get<User>('/users/me', config);
  return data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const config = await withAuth();
  const { data } = await api.get<Note>(`/notes/${id}`, config);
  return data;
}

export async function fetchNotes(params: {
  page: number;
  perPage: number;
  search?: string;
  tag?: string;
}) {
  const config = await withAuth();
  const { data } = await api.get('/notes', {
    ...config,
    params,
  });
  return data;
}

export async function checkSession(): Promise<AxiosResponse> {
  const config = await withAuth();
  return api.get('/auth/session', config);
}