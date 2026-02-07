'use client';

import { useRouter } from 'next/navigation';
import NoteForm from '@/components/NoteForm/NoteForm';
import { NoteTag } from '@/types/note';

type Props = {
  categories: NoteTag[];
};

export default function CreateNoteClient({ categories }: Props) {
  const router = useRouter();

  const onCancel = () => {
    router.push('/notes/filter/all');
  };

  const onCreated = () => {
    router.push('/notes/filter/all');
  };

  return (
    <NoteForm
      categories={categories}
      onCancel={onCancel}
      onCreated={onCreated}
    />
  );
}
