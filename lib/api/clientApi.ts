import { api } from './api';
import { User } from '@/types/user';
import { Note, CreateNoteParams } from '@/types/note';

export interface AuthResponse {
  user: User;
}

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
  tag?: string;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
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
  await api.post('/auth/logout');
}

export async function checkSession(): Promise<{ success: boolean }> {
  try {
    const { data } = await api.get<{ success: boolean }>('/auth/session');
    return data;
  } catch (error) {
    return { success: false };
  }
}

export async function getMe(): Promise<User> {
  const { data } = await api.get<User>('/users/me');
  return data;
}

export async function updateMe(params: Partial<User>): Promise<User> {
  const { data } = await api.patch<User>('/users/me', params);
  return data;
}

export async function fetchNotes(
  params: FetchNotesParams
): Promise<FetchNotesResponse> {
  const { data } = await api.get<FetchNotesResponse>('/notes', { params });
  return data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const { data } = await api.get<Note>(`/notes/${id}`);
  return data;
}

export async function createNote(params: CreateNoteParams): Promise<Note> {
  const { data } = await api.post<Note>('/notes', params);
  return data;
}

export async function deleteNote(id: string): Promise<Note> {
  const { data } = await api.delete<Note>(`/notes/${id}`);
  return data;
}
