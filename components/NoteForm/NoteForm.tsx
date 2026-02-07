'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as Yup from 'yup';

import { createNote } from '@/lib/api';
import useDraftStore from '@/lib/store/noteStore';
import css from './NoteForm.module.css';
import type { CreateNoteParams, NoteTag } from '@/types/note';

interface NoteFormProps {
  categories: NoteTag[];
  onCancel: () => void;
  onCreated: () => void;
}

export default function NoteForm({
  categories,
  onCancel,
  onCreated,
}: NoteFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const queryClient = useQueryClient();

  const schema = Yup.object({
    title: Yup.string()
      .trim()
      .min(3, 'Title must be at least 3 characters')
      .max(50, 'Title must be at most 50 characters')
      .required('Title is required'),
    content: Yup.string()
      .trim()
      .max(500, 'Content must be at most 500 characters')
      .required('Content is required'),
    tag: Yup.mixed<NoteTag>()
      .oneOf(categories)
      .required('Category is required'),
  });

  const {
    draft: { title, content, tag },
    setDraft,
    clearDraft,
  } = useDraftStore();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setDraft({
      title,
      content,
      tag,
      [e.target.name]: e.target.value,
    });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      clearDraft();
      onCreated();
    },
  });

  const handleSubmit = async (formData: FormData) => {
    const payload: CreateNoteParams = {
      title: String(formData.get('title') ?? ''),
      content: String(formData.get('content') ?? ''),
      tag: formData.get('tag') as NoteTag,
    };

    try {
      await schema.validate(payload, { abortEarly: false });
      setErrors({});
      mutate(payload);
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const map: Record<string, string> = {};
        err.inner.forEach((e) => {
          if (e.path) map[e.path] = e.message;
        });
        setErrors(map);
      }
    }
  };

  return (
    <form className={css.form} action={handleSubmit}>
      <div className={css.formGroup}>
        <label>Title</label>
        <input name="title" defaultValue={title} onChange={handleChange} />
        <span className={css.error}>{errors.title}</span>
      </div>

      <div className={css.formGroup}>
        <label>Content</label>
        <textarea
          name="content"
          rows={8}
          defaultValue={content}
          onChange={handleChange}
        />
        <span className={css.error}>{errors.content}</span>
      </div>

      <div className={css.formGroup}>
        <label>Tag</label>
        <select name="tag" defaultValue={tag} onChange={handleChange}>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <span className={css.error}>{errors.tag}</span>
      </div>

      <div className={css.actions}>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" disabled={isPending}>
          {isPending ? 'Creating...' : 'Create note'}
        </button>
      </div>
    </form>
  );
}
