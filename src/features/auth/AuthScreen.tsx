import { useState, type FormEvent } from 'react';
import { Landmark, LoaderCircle, LockKeyhole } from 'lucide-react';
import { useSession, type Credentials } from '../../context/SessionContext';
import { useToast } from '../../context/ToastContext';
import { errorMessage } from '../../lib/api';

export function AuthScreen() {
  const { needsSetup, authenticate } = useSession();
  const { notify } = useToast();
  const [form, setForm] = useState<Credentials>({ name: '', email: '', password: '' });
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      await authenticate(form);
    } catch (error) {
      notify(errorMessage(error));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth-screen">
      <div className="auth-panel">
        <div className="auth-brand">
          <div className="brand-mark">
            <Landmark size={21} />
          </div>
          <span>
            ROOSEVELT <span className="brand-soft">· TESORERÍA</span>
          </span>
        </div>
        <div className="auth-copy">
          <span className="eyebrow">ADMINISTRACIÓN DEL CONDOMINIO</span>
          <h1>{needsSetup ? 'Comienza por crear la cuenta del tesorero.' : 'Bienvenido de vuelta.'}</h1>
          <p>
            {needsSetup
              ? 'Tus cartolas y respaldos se guardan localmente en este equipo.'
              : 'Ingresa a la administración del Edificio Roosevelt 1760.'}
          </p>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          {needsSetup && (
            <label>
              Nombre
              <input
                required
                placeholder="Tu nombre"
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
              />
            </label>
          )}
          <label>
            Correo electrónico
            <input
              type="email"
              autoComplete="username"
              required
              placeholder="nombre@condominio.cl"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
            />
          </label>
          <label>
            Contraseña
            <input
              type="password"
              autoComplete={needsSetup ? 'new-password' : 'current-password'}
              minLength={10}
              required
              placeholder={needsSetup ? 'Al menos 10 caracteres' : 'Tu contraseña'}
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
            />
          </label>
          <button className="primary full" disabled={busy}>
            {busy ? <LoaderCircle className="spin" size={17} /> : <LockKeyhole size={17} />}{' '}
            {needsSetup ? 'Crear cuenta del tesorero' : 'Ingresar'}
          </button>
        </form>
        <div className="auth-foot">
          <LockKeyhole size={14} /> Datos guardados en este equipo · Solo accesible en esta computadora
        </div>
      </div>
      <div className="auth-art">
        <div className="art-glow" />
        <div className="art-quote">
          <div className="art-symbol">R.</div>
          <span className="eyebrow">EDIFICIO ROOSEVELT 1760</span>
          <h2>
            Una administración
            <br />
            clara para todos.
          </h2>
          <p>Cuentas al día. Documentos a mano. Cada decisión, registrada.</p>
          <span className="art-bottom">CONCEPCIÓN · CHILE</span>
        </div>
      </div>
    </div>
  );
}
