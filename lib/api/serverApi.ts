import axios from 'axios';
import { cookies, headers } from 'next/headers';
import type { User } from '@/types/user';
import type { Note } from '@/types/note';

async function getBaseURL() {
  const host = (await headers()).get('host');
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  return `${protocol}://${host}/api`;
}

async function getHeaders() {
  const cookieStore = await cookies();

  const cookieHeader = cookieStore
    .getAll()
    .map(cookie => `${cookie.name}=${cookie.value}`)
    .join('; ');

  return {
    Cookie: cookieHeader,
  };
}

export async function getMe(): Promise<User> {
  const baseURL = await getBaseURL();
  const headersObj = await getHeaders();

  const { data } = await axios.get<User>(
    `${baseURL}/users/me`,
    { headers: headersObj }
  );

  return data;
}
export async function fetchNoteById(id: string): Promise<Note> {
  const baseURL = await getBaseURL();
  const headersObj = await getHeaders();

  const { data } = await axios.get<Note>(
    `${baseURL}/notes/${id}`,
    { headers: headersObj }
  );

  return data;
}
export async function fetchNotes(params: {
  page: number;
  perPage: number;
  search?: string;
  tag?: string;
}) {
  const baseURL = await getBaseURL();
  const headersObj = await getHeaders();

  const { data } = await axios.get(
    `${baseURL}/notes`,
    { params, headers: headersObj }
  );

  return data;
}