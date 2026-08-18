import Logo from './Logo';
function NavBar(){
    return (
        <nav className="w-full border-b border-gray-200 bg-white">
      <div className="mx-auto grid h-20 max-w-7.5xl grid-cols-2 items-center px-10">



        <div className="flex justify-start">
          <Logo/>
        </div>

        {/* Right section */}
        <div className="flex justify-end space-x-4">
          <button className="rounded-lg px-4 py-2 text-black hover:bg-gray-100">
            Sign In
          </button>

          <button className="rounded-lg bg-orange-500 px-4 py-2 text-white hover:bg-orange-600">
            Login
          </button>
          <icon>sidebar</icon>
        </div>

      </div>
    </nav>
    );
}

export default NavBar;