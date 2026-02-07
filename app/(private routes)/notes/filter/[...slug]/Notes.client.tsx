'use client';

import css from '@/app/(private-routes)/notes/filter/[...slug]/NotesPage.module.css';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDebounce } from 'use-debounce';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api/clientApi';
import SearchBox from '@/components/SearchBox/SearchBox';
import NoteList from '@/components/NoteList/NoteList';
import Pagination from '@/components/Pagination/Pagination';
import type { NoteTag } from '@/types/note';

interface NotesPageClientProps {
  tag?: NoteTag;
}

const PER_PAGE = 12;

export default function NotesPageClient({ tag }: NotesPageClientProps) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const [debouncedSearch] = useDebounce(search, 500);

  const router = useRouter();

  const { data, isLoading, isError } = useQuery({
    queryKey: [
      'notes',
      { page, perPage: PER_PAGE, tag, search: debouncedSearch },
    ],
    queryFn: () =>
      fetchNotes({
        page,
        perPage: PER_PAGE,
        tag,
        search: debouncedSearch,
      }),
    placeholderData: keepPreviousData,
  });

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  if (isLoading) {
    return <p>Loading, please wait...</p>;
  }

  if (isError || !data) {
    return <p>Something went wrong.</p>;
  }

  return (
    <div className={css.app}>
      <div className={css.toolbar}>
        <SearchBox value={search} onChange={handleSearchChange} />

        {data.totalPages > 1 && (
          <Pagination
            page={page}
            totalPages={data.totalPages}
            onPageChange={setPage}
          />
        )}

        <button
          type="button"
          className={css.button}
          onClick={() => router.push('/notes/action/create')}
        >
          Create note +
        </button>
      </div>

      {data.notes.length > 0 ? (
        <NoteList notes={data.notes} />
      ) : (
        <p>No notes found.</p>
      )}
    </div>
  );
}
