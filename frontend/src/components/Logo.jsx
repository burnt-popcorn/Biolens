function Logo({ size = 'md' }) {
  const isSmall = size === 'sm';
  
  return (
    <div className="flex items-center select-none">
      {/* Capital "H" DNA Double-Helix Icon styled in Solid Orange */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        fill="none"
        className={`${isSmall ? 'h-7 w-7' : 'h-9 w-9'} text-orange-500`}
      >
        {/* Left DNA Strand (backbone of H) */}
        <path
          d="M 8 4 C 11 10, 5 16, 8 22 C 10 26, 7 28, 8 28"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        
        {/* Right DNA Strand (backbone of H) */}
        <path
          d="M 24 4 C 21 10, 27 16, 24 22 C 22 26, 25 28, 24 28"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        
        {/* Top Base Pair Rung */}
        <line 
          x1="9.5" 
          y1="8" 
          x2="22.5" 
          y2="8" 
          stroke="currentColor" 
          strokeWidth="1.5" 
          strokeDasharray="2 2"
          opacity="0.5"
        />
        
        {/* Central DNA Rung / Horizontal H Crossbar */}
        <line
          x1="6.5"
          y1="15"
          x2="25.5"
          y2="15"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        
        {/* Bottom Base Pair Rung */}
        <line 
          x1="9.5" 
          y1="22" 
          x2="22.5" 
          y2="22" 
          stroke="currentColor" 
          strokeWidth="1.5" 
          strokeDasharray="2 2"
          opacity="0.5"
        />
        
        {/* Base Pair Nodes / Atom Highlights */}
        <circle cx="9.5" cy="8" r="2.5" fill="currentColor" />
        <circle cx="22.5" cy="8" r="2.5" fill="currentColor" />
        
        <circle cx="6.5" cy="15" r="2.5" fill="currentColor" />
        <circle cx="25.5" cy="15" r="2.5" fill="currentColor" />
        
        <circle cx="9.5" cy="22" r="2.5" fill="currentColor" />
        <circle cx="22.5" cy="22" r="2.5" fill="currentColor" />
      </svg>
      
      {/* Rest of the name "elix" */}
      <span className={`${isSmall ? 'text-lg' : 'text-2xl'} font-black tracking-tight text-slate-900`}>
        elix
      </span>
    </div>
  );
}

export default Logo;