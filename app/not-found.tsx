import { Metadata } from 'next';
import css from './Home.module.css';

export const metadata: Metadata = {
  title: 'Not found',
  description: 'Sorry, the page you are looking for does not exist.',
  openGraph: {
    title: 'Not found',
    description: 'Sorry, the page you are looking for does not exist.',
    url: '',
    images: [
      {
        url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
        width: 1200,
        height: 630,
        alt: 'NoteHub — a simple web-based note-taking application built with Next.js',
      },
    ],
    type: 'website',
  },
};

const NotFound = () => {
  return (
    <main className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>404 - Page not found</h1>
        <p className={css.description}>
          Sorry, the page you are looking for does not exist.
        </p>
      </div>
    </main>
  );
};

export default NotFound;
