import Link from 'next/link';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-8 mt-12">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
        <div className="flex items-center gap-3">
          <Link href="/" className="hover:opacity-90">
            <Logo size="sm" />
          </Link>
          <span>&copy; {new Date().getFullYear()} Helix. All rights reserved.</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/" className="hover:text-slate-600">Run New Analysis</Link>
          <a href="#" className="hover:text-slate-600">Documentation</a>
          <a href="#" className="hover:text-slate-600">Support</a>
        </div>
      </div>
    </footer>
  );
}
