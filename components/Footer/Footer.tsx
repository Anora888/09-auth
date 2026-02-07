import css from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={css.footer}>
      <p>© 2026 NoteHub. All rights reserved.</p>
      <p>Developer: Anora</p>
      <p>
        Contact us:{' '}
        <a href="mailto:anoramaomao@gmail.com">anoramaomao@gmail.com</a>
      </p>
    </footer>
  );
}
