"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, MessageCircle } from "lucide-react";

interface NavLink {
  href: string;
  label: string;
  isHash?: boolean;
}

interface MobileNavMenuProps {
  links: NavLink[];
  ctaHref: string;
  ctaLabel: string;
}

export default function MobileNavMenu({ links, ctaHref, ctaLabel }: MobileNavMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Hamburger Button */}
      <div className="flex items-center gap-3 md:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 transition-colors"
          aria-label={isOpen ? "Tutup menu" : "Buka menu"}
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="mobile-menu-enter md:hidden absolute top-20 left-0 w-full bg-white/95 backdrop-blur-lg border-b border-slate-200 shadow-xl py-6 px-6 flex flex-col gap-4 z-50">
          {links.map((link) =>
            link.isHash ? (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-slate-800 font-bold py-2 border-b border-slate-200"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-slate-800 font-bold py-2 border-b border-slate-200"
              >
                {link.label}
              </Link>
            )
          )}
          <a
            href={ctaHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 w-full py-3 rounded-xl bg-primary hover:bg-blue-600 text-white font-bold text-center shadow-lg shadow-primary/25 transition-all flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            {ctaLabel}
          </a>
        </div>
      )}
    </>
  );
}
