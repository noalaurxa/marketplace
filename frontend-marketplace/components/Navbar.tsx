'use client';

import Link from 'next/link';
import { useContext } from 'react';
import { AuthContext } from './AuthProvider';
import { useRouter, usePathname } from 'next/navigation';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  if (pathname === '/login' || pathname === '/register') {
    return null;
  }

  return (
    <nav className="bg-white border-b border-[#eeeeed] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between h-14 items-center">

          {/* Logo */}
          <Link href="/" className="logo">
            <div className="logo-mark">
              <span>PS</span>
            </div>
            <span className="logo-name">ProductStore</span>
          </Link>

          {/* Nav links */}
          <div className="flex items-center gap-7">
            <Link
              href="/"
              className={`text-sm transition-colors link-underline ${
                pathname === '/' ? 'text-[#1a1a1a] font-medium' : 'text-[#6b6a66] hover:text-[#1a1a1a]'
              }`}
            >
              Catálogo
            </Link>

            {user?.role === 'ADMIN' && (
              <Link
                href="/admin"
                className={`text-sm transition-colors link-underline ${
                  pathname === '/admin' ? 'text-[#1a1a1a] font-medium' : 'text-[#6b6a66] hover:text-[#1a1a1a]'
                }`}
              >
                Admin
              </Link>
            )}

            {user ? (
              <>
                <span className="text-xs text-[#9b9a96] hidden sm:block">{user.email}</span>
                <button
                  onClick={handleLogout}
                  className="text-sm text-[#6b6a66] hover:text-[#1a1a1a] transition-colors link-underline"
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm text-[#6b6a66] hover:text-[#1a1a1a] transition-colors link-underline"
                >
                  Iniciar sesión
                </Link>
                <Link
                  href="/register"
                  className="text-sm bg-[#1a1a1a] text-white px-4 py-1.5 rounded-lg hover:bg-[#2d2d2d] transition-colors"
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
