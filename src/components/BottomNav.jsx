import { Link, usePage } from '@inertiajs/react';
import '../pages/Home.css';

export default function BottomNav({ active }) {
  const { url } = usePage();

  const currentPath = active || url;

  const isActive = (path) => {
    if (path === '/') {
      return currentPath === '/';
    }
    return currentPath.startsWith(path);
  };

  return (
    <nav className="home-global-nav">
      <Link
        href="/"
        className={`home-bottom-nav__item ${isActive('/') ? 'is-active' : ''}`}
      >
        Home
      </Link>
      <Link
        href="/account/"
        className={`home-bottom-nav__item ${isActive('/account/') ? 'is-active' : ''}`}
      >
        Account
      </Link>
      <Link
        href="/rate/"
        className={`home-bottom-nav__item ${isActive('/rate/') ? 'is-active' : ''}`}
      >
        Rate
      </Link>
      <Link
        href="/verify/"
        className={`home-bottom-nav__item ${isActive('/verify/') ? 'is-active' : ''}`}
      >
        Verify
      </Link>
      <button
        className="home-bottom-nav__item home-bottom-nav__item--sos"
        onClick={() => {
          const event = new CustomEvent('sos-open');
          window.dispatchEvent(event);
        }}
      >
        SOS
      </button>
    </nav>
  );
}
