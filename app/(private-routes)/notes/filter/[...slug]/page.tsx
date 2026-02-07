import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import NotesPageClient from './Notes.client';
import type { NoteTag } from '@/types/note';
import { TAGS } from '@/types/note';

interface NotesByCategoryParams {
  slug: string[];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<NotesByCategoryParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const filter = slug[0];

  const title =
    filter === 'all'
      ? 'All notes | NoteHub'
      : `Notes with tag ${filter} | NoteHub`;

  const description =
    filter === 'all'
      ? 'Browse all notes in NoteHub.'
      : `Browse notes filtered by tag ${filter}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://08-zustand-d74w.vercel.app/notes/filter/${filter}`,
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          width: 1200,
          height: 630,
          alt: 'NoteHub notes list',
        },
      ],
      type: 'website',
    },
  };
}

const NotesByCategory = async ({
  params,
}: {
  params: Promise<NotesByCategoryParams>;
}) => {
  const { slug } = await params;
  const filter = slug[0];

  function isNoteTag(value: string): value is NoteTag {
    return TAGS.includes(value as NoteTag);
  }

  if (filter === 'all') {
    return <NotesPageClient />;
  }

  if (isNoteTag(filter)) {
    return <NotesPageClient tag={filter} />;
  }

  notFound();
};

export default NotesByCategory;
