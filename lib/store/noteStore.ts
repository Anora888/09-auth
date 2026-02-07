'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CreateNoteParams } from '@/types/note';

type DraftStoreProps = {
  draft: CreateNoteParams;
  setDraft: (note: CreateNoteParams) => void;
  clearDraft: () => void;
};

const initialDraft: CreateNoteParams = {
  title: '',
  content: '',
  tag: 'Todo',
};

export const useDraftStore = create<DraftStoreProps>()(
  persist(
    (set) => ({
      draft: initialDraft,
      setDraft: (note) => set(() => ({ draft: note })),
      clearDraft: () => set(() => ({ draft: initialDraft })),
    }),
    {
      name: 'note-draft',
      partialize: (state) => ({ draft: state.draft }),
    }
  )
);

export default useDraftStore;
