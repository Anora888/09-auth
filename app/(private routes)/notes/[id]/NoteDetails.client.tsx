'use client';

import { useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';

import { fetchNotes } from '@/lib/api/clientApi';
import type { Note, NoteTag } from '@/types/note';
import { TAGS } from '@/types/note';

import SearchBox from '@/components/SearchBox/SearchBox';
import Pagination from '@/components/Pagination/Pagination';
import NoteList from '@/components/NoteList/NoteList';
import Modal from '@/components/Modal/Modal';
import NoteForm from '@/components/NoteForm/NoteForm';

interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

interface NotesClientProps {
  searchQuery?: string;
  tag?: NoteTag;
}

const PER_PAGE = 12;

export default function NotesClient({
  searchQuery = '',
  tag,
}: NotesClientProps) {
  const [search, setSearch] = useState(searchQuery);
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [debouncedSearch] = useDebounce(search, 500);

  const { data, isLoading, isError } = useQuery<FetchNotesResponse>({
    queryKey: ['notes', { page, search: debouncedSearch, tag }],
    queryFn: () =>
      fetchNotes({
        page,
        perPage: PER_PAGE,
        search: debouncedSearch,
        tag,
      }),
    placeholderData: keepPreviousData,
  });

  if (isLoading) return <p>Loading…</p>;
  if (isError || !data) return <p>Error</p>;

  return (
    <div>
      <SearchBox value={search} onChange={setSearch} />

      {data.totalPages > 1 && (
        <Pagination
          page={page}
          totalPages={data.totalPages}
          onPageChange={setPage}
        />
      )}

      <button onClick={() => setIsModalOpen(true)}>Add note</button>

      <NoteList notes={data.notes} />

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm
            categories={TAGS}
            onCancel={() => setIsModalOpen(false)}
            onCreated={() => {
              setPage(1);
              setIsModalOpen(false);
            }}
          />
        </Modal>
      )}
    </div>
  );
}
