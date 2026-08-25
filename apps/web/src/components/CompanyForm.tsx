import type { CompanyInput } from "@minicrm/shared";
import { useState } from "react";

interface CompanyFormProps {
  initial?: CompanyInput;
  submitLabel: string;
  onSubmit: (input: CompanyInput) => Promise<void>;
}

export function CompanyForm({ initial, submitLabel, onSubmit }: CompanyFormProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [website, setWebsite] = useState(initial?.website ?? "");
  const [industry, setIndustry] = useState(initial?.industry ?? "");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  return (
    <form
      className="form-card"
      onSubmit={async (event) => {
        event.preventDefault();
        setError("");
        setSaving(true);
        try {
          await onSubmit({
            name: name.trim(),
            website: website.trim() || null,
            industry: industry.trim() || null,
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
          Název firmy<span aria-hidden="true"> *</span>
          <input required value={name} onChange={(event) => setName(event.target.value)} />
        </label>
        <label>
          Web
          <input
            type="url"
            placeholder="https://example.test"
            value={website}
            onChange={(event) => setWebsite(event.target.value)}
          />
        </label>
        <label>
          Obor
          <input value={industry} onChange={(event) => setIndustry(event.target.value)} />
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
