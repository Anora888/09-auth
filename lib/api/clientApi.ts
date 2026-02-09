import { api } from './api';
import type { User } from '@/types/user';
import type { Note, NoteTag, CreateNoteParams } from '@/types/note';

export interface RegisterParams {
  email: string;
  password: string;
}

export interface LoginParams {
  email: string;
  password: string;
}

export interface FetchNotesParams {
  page: number;
  perPage: number;
  search?: string;
  tag?: NoteTag;
  sortBy?: 'created' | 'updated';
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

function getAuthHeaders() {
  const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function register(params: RegisterParams): Promise<User> {
  const { data } = await api.post<User>('/auth/register', params);
  return data;
}

export async function login(params: LoginParams): Promise<User> {
  const { data } = await api.post<User>('/auth/login', params);
  return data;
}

export async function logout(): Promise<void> {
  await api.post('/auth/logout', {}, { headers: getAuthHeaders() });
}

export async function checkSession(): Promise<{ success: boolean }> {
  try {
    await api.get('/users/me', { headers: getAuthHeaders() });
    return { success: true };
  } catch {
    return { success: false };
  }
}

export async function getMe(): Promise<User> {
  const { data } = await api.get<User>('/users/me', {
    headers: getAuthHeaders(),
  });
  return data;
}

export async function updateMe(payload: Partial<User>): Promise<User> {
  const { data } = await api.patch<User>('/users/me', payload, {
    headers: getAuthHeaders(),
  });
  return data;
}

export async function fetchNotes({
  page,
  perPage,
  search,
  tag,
  sortBy = 'created',
}: FetchNotesParams): Promise<FetchNotesResponse> {
  const params = {
    page,
    perPage,
    ...(search?.trim() ? { search: search.trim() } : {}),
    ...(tag ? { tag } : {}),
    ...(sortBy ? { sortBy } : {}),
  };

  const { data } = await api.get<FetchNotesResponse>('/notes', {
    params,
    headers: getAuthHeaders(),
  });
  return data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const { data } = await api.get<Note>(`/notes/${id}`, {
    headers: getAuthHeaders(),
  });
  return data;
}

export async function createNote(payload: CreateNoteParams): Promise<Note> {
  const { data } = await api.post<Note>('/notes', payload, {
    headers: getAuthHeaders(),
  });
  return data;
}

export async function deleteNote(id: string): Promise<Note> {
  const { data } = await api.delete<Note>(`/notes/${id}`, {
    headers: getAuthHeaders(),
  });
  return data;
}
