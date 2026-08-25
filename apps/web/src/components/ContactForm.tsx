import { CONTACT_STATUSES, CONTACT_STATUS_LABELS } from "@minicrm/shared";
import type { Company, ContactInput } from "@minicrm/shared";
import { useState } from "react";

import { fromDateTimeInput, toDateTimeInput } from "../utils/date";

interface ContactFormProps {
  companies: Company[];
  initial?: ContactInput;
  submitLabel: string;
  onSubmit: (input: ContactInput) => Promise<void>;
}

const emptyContact: ContactInput = {
  firstName: "",
  lastName: "",
  email: "",
  phone: null,
  companyId: null,
  status: "NEW",
  nextContactAt: null,
};

export function ContactForm({
  companies,
  initial = emptyContact,
  submitLabel,
  onSubmit,
}: ContactFormProps) {
  const [form, setForm] = useState({
    ...initial,
    phone: initial.phone ?? "",
    companyId: initial.companyId ?? "",
    nextContactAt: toDateTimeInput(initial.nextContactAt ?? null),
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const update = (field: string, value: string) =>
    setForm((current) => ({ ...current, [field]: value }));

  return (
    <form
      className="form-card"
      onSubmit={async (event) => {
        event.preventDefault();
        setError("");
        setSaving(true);
        try {
          await onSubmit({
            firstName: form.firstName.trim(),
            lastName: form.lastName.trim(),
            email: form.email.trim(),
            phone: form.phone.trim() || null,
            companyId: form.companyId || null,
            status: form.status,
            nextContactAt: fromDateTimeInput(form.nextContactAt),
          });
        } catch (submitError) {
          setError(submitError instanceof Error ? submitError.message : "Uložení se nezdařilo.");
        } finally {
          setSaving(false);
        }
      }}
    >
      {error && (
        <div className="alert alert--error" role="alert">
          {error}
        </div>
      )}
      <div className="form-grid">
        <label>
          Jméno<span aria-hidden="true"> *</span>
          <input
            required
            autoComplete="given-name"
            value={form.firstName}
            onChange={(e) => update("firstName", e.target.value)}
          />
        </label>
        <label>
          Příjmení<span aria-hidden="true"> *</span>
          <input
            required
            autoComplete="family-name"
            value={form.lastName}
            onChange={(e) => update("lastName", e.target.value)}
          />
        </label>
        <label>
          E-mail<span aria-hidden="true"> *</span>
          <input
            required
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
          />
        </label>
        <label>
          Telefon
          <input
            type="tel"
            autoComplete="tel"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
          />
        </label>
        <label>
          Firma
          <select value={form.companyId} onChange={(e) => update("companyId", e.target.value)}>
            <option value="">Bez firmy</option>
            {companies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Obchodní stav<span aria-hidden="true"> *</span>
          <select required value={form.status} onChange={(e) => update("status", e.target.value)}>
            {CONTACT_STATUSES.map((status) => (
              <option key={status} value={status}>
                {CONTACT_STATUS_LABELS[status]}
              </option>
            ))}
          </select>
        </label>
        <label>
          Další kontakt
          <input
            type="datetime-local"
            value={form.nextContactAt}
            onChange={(e) => update("nextContactAt", e.target.value)}
          />
        </label>
      </div>
      <div className="form-actions">
        <button className="button button--primary" type="submit" disabled={saving}>
          {saving ? "Ukládám…" : submitLabel}
        </button>
      </div>
    </form>
  );
}
