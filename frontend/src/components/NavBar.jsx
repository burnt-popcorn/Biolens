import Logo from './Logo';
import Link from 'next/link';

function NavBar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 sm:px-8">
        
        {/* Left Section: Brand */}
        <div className="flex items-center">
          <Link href="/" className="transition-opacity hover:opacity-90">
            <Logo />
          </Link>
        </div>

        {/* Right Section: Actions */}
        <div className="flex items-center space-x-4">
          <button className="text-sm font-semibold text-slate-600 hover:text-slate-900 px-3.5 py-2 rounded-lg hover:bg-slate-100/50 transition-all">
            Sign In
          </button>

          <button className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-600 transition-all hover:shadow hover:scale-[1.01] active:scale-[0.99]">
            Login
          </button>
        </div>

      </div>
    </header>
  );
}

export default NavBar;