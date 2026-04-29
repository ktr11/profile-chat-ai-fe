"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const navItems = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="navbar bg-base-100/90 backdrop-blur sticky top-0 z-50 border-b border-base-200 px-4 lg:px-8">
      <div className="navbar-start">
        <Link href="/" className="text-xl font-bold tracking-tight text-base-content">
          Kentaro.T
        </Link>
      </div>

      {/* Desktop nav */}
      <nav className="navbar-end hidden md:flex gap-1">
        {navItems.map((item) => (
          <a key={item.label} href={item.href} className="btn btn-ghost btn-sm">
            {item.label}
          </a>
        ))}
      </nav>

      {/* Mobile hamburger */}
      <div className="navbar-end md:hidden">
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-base-100 border-b border-base-200 flex flex-col md:hidden">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="px-6 py-3 hover:bg-base-200 text-base-content"
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
