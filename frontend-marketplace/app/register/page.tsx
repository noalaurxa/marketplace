// app/register/page.tsx
'use client';
import { useState, useContext } from 'react';
import { AuthContext } from '../../components/AuthProvider';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const { register, login } = useContext(AuthContext);
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirm) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    setLoading(true);
    try {
      await register({ name, email, password });
      await login(email, password); // Auto-login after register
      window.location.href = '/';
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Error al registrar. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f9f9f8] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-[360px] fade-up">

        {/* Logo centrado */}
        <Link href="/" className="logo justify-center mb-10">
          <div className="logo-mark" style={{ width: 32, height: 32, borderRadius: 9 }}>
            <span style={{ fontSize: '0.8rem' }}>PS</span>
          </div>
          <span className="logo-name" style={{ fontSize: '1.1rem' }}>ProductStore</span>
        </Link>

        {/* Card */}
        <div className="bg-white border border-[#eeeeed] rounded-2xl p-8 shadow-sm">
          <h1 className="text-[1.35rem] font-semibold text-[#1a1a1a] mb-1 tracking-tight">
            Crear una cuenta
          </h1>
          <p className="text-sm text-[#9b9a96] mb-6">
            Únete al marketplace
          </p>

          {error && (
            <div className="mb-5 px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="register-name" className="block text-xs font-medium text-[#6b6a66] mb-1.5 uppercase tracking-wider">
                Nombre
              </label>
              <input
                id="register-name"
                type="text"
                placeholder="Tu nombre completo"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                className="input-field"
              />
            </div>

            <div>
              <label htmlFor="register-email" className="block text-xs font-medium text-[#6b6a66] mb-1.5 uppercase tracking-wider">
                Email
              </label>
              <input
                id="register-email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="input-field"
              />
            </div>

            <div>
              <label htmlFor="register-password" className="block text-xs font-medium text-[#6b6a66] mb-1.5 uppercase tracking-wider">
                Contraseña
              </label>
              <input
                id="register-password"
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={6}
                className="input-field"
              />
            </div>

            <div>
              <label htmlFor="register-confirm" className="block text-xs font-medium text-[#6b6a66] mb-1.5 uppercase tracking-wider">
                Confirmar contraseña
              </label>
              <input
                id="register-confirm"
                type="password"
                placeholder="Repite tu contraseña"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                required
                className="input-field"
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary mt-2">
              {loading ? 'Creando cuenta...' : 'Crear cuenta'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#9b9a96]">
            ¿Ya tienes cuenta?{' '}
            <Link href="/login" className="text-[#1a1a1a] font-medium hover:underline">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
