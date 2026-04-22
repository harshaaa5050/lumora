import React from 'react'
import { useState } from 'react';

const Navbar = () => {
   return (
    <nav className="flex items-center justify-between px-10 h-20 bg-primary">
      {/* Logo */}
      <a href="/">
        <h1 className="font-bold text-4xl tracking-tight text-tertiary font-sans">
          Lumora </h1>
      </a>

      {/* Actions */}
      <div className="flex items-center gap-2.5">
        <button className="px-5 py-2 text-sm font-medium text-tertiary border border-pink-100 rounded-lg hover:text-tertiary hover:border-gray-300 hover:bg-gray-50 transition-all">
          Log in
        </button>
        <button className="px-5 py-2 text-sm font-medium text-white bg-secondary rounded-lg hover:bg-brand-dark active:scale-[0.97] transition-all flex items-center gap-1.5 group">
          Get started
          <span className="transition-transform group-hover:translate-x-0.5">→</span>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;