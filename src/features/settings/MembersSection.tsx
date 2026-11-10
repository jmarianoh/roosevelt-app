import { useState, type FormEvent } from 'react';
import { Plus } from 'lucide-react';
import { SectionHeader } from '../../components/ui/SectionHeader';
import type { Credentials } from '../../context/SessionContext';
import { initials } from '../../lib/format';
import { useTeamMembers } from './useTeamMembers';

const EMPTY_FORM: Credentials = { name: '', email: '', password: '' };

export function MembersSection() {
  const { members, busy, addMember } = useTeamMembers();
  const [form, setForm] = useState(EMPTY_FORM);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (await addMember(form)) setForm(EMPTY_FORM);
  }

  return (
    <section className="section-card content-card">
      <SectionHeader
        title="Miembros del equipo"
        description="Agrega accesos individuales para el comité. Las decisiones quedan a nombre de cada persona."
      />
      <form className="invite-row" onSubmit={handleSubmit}>
        <input
          required
          placeholder="Nombre"
          value={form.name}
          onChange={(event) => setForm({ ...form, name: event.target.value })}
        />
        <input
          required
          type="email"
          placeholder="Correo"
          value={form.email}
          onChange={(event) => setForm({ ...form, email: event.target.value })}
        />
        <input
          required
          minLength={10}
          type="password"
          placeholder="Contraseña (10+ caracteres)"
          value={form.password}
          onChange={(event) => setForm({ ...form, password: event.target.value })}
        />
        <button className="primary" disabled={busy}>
          <Plus size={15} /> Agregar
        </button>
      </form>
      {members.map((member) => (
        <div className="member-row" key={member.id}>
          <div className="avatar">{initials(member.name)}</div>
          <div className="member-info">
            <strong>{member.name}</strong>
            <span>{member.email}</span>
          </div>
          <span className={`role-pill ${member.role}`}>
            Comité
          </span>
        </div>
      ))}
    </section>
  );
}
