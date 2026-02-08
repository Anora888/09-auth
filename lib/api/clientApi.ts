import axios from 'axios';
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

const axiosInstance = axios.create({
  
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://notehub-public.goit.study/api',
});

function getAuthHeaders() {
  const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;
  return token ? { Authorization: `Bearer ${token}` } : {};
}



export async function register(params: RegisterParams): Promise<User> {

  const { data } = await axiosInstance.post<User>('/auth/register', params);
  return data;
}

export async function login(params: LoginParams): Promise<User> {
  const { data } = await axiosInstance.post<User>('/auth/login', params);
  return data;
}

export async function logout(): Promise<void> {
  await axiosInstance.post('/auth/logout', {}, { headers: getAuthHeaders() });
}

export async function checkSession(): Promise<{ success: boolean }> {
  try {
    
    await axiosInstance.get('/users/me', { headers: getAuthHeaders() });
    return { success: true };
  } catch {
    return { success: false };
  }
}

export async function getMe(): Promise<User> {
  const { data } = await axiosInstance.get<User>('/users/me', {
    headers: getAuthHeaders(),
  });
  return data;
}

export async function updateMe(payload: Partial<User>): Promise<User> {
  const { data } = await axiosInstance.patch<User>('/users/me', payload, {
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

  const { data } = await axiosInstance.get<FetchNotesResponse>('/notes', {
    params,
    headers: getAuthHeaders(),
  });
  return data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const { data } = await axiosInstance.get<Note>(`/notes/${id}`, {
    headers: getAuthHeaders(),
  });
  return data;
}

export async function createNote(payload: CreateNoteParams): Promise<Note> {
  const { data } = await axiosInstance.post<Note>('/notes', payload, {
    headers: getAuthHeaders(),
  });
  return data;
}

export async function deleteNote(id: string): Promise<Note> {
  const { data } = await axiosInstance.delete<Note>(`/notes/${id}`, {
    headers: getAuthHeaders(),
  });
  return data;
}