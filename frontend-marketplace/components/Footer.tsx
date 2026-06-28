'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();

  if (pathname === '/login' || pathname === '/register') {
    return null;
  }

  return (
    <footer className="bg-white border-t border-[#eeeeed] mt-auto">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <Link href="/" className="logo">
            <div className="logo-mark">
              <span>PS</span>
            </div>
            <span className="logo-name">ProductStore</span>
          </Link>
          <p className="text-xs text-[#9b9a96]">
            © {new Date().getFullYear()} ProductStore. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
