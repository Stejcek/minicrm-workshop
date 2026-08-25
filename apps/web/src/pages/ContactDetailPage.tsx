import { ACTIVITY_TYPES, ACTIVITY_TYPE_LABELS } from "@minicrm/shared";
import type { ActivityInput, ActivityType, ContactDetail } from "@minicrm/shared";
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { api } from "../api/client";
import { ErrorState, LoadingState } from "../components/PageState";
import { StatusBadge } from "../components/StatusBadge";
import { formatDateTime, toDateTimeInput } from "../utils/date";

export function ContactDetailPage() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const [contact, setContact] = useState<ContactDetail | null>(null);
  const [error, setError] = useState("");
  const [activityType, setActivityType] = useState<ActivityType>("NOTE");
  const [activityText, setActivityText] = useState("");
  const [occurredAt, setOccurredAt] = useState(() => toDateTimeInput(new Date().toISOString()));
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    api
      .getContact(id)
      .then(setContact)
      .catch((loadError: Error) => setError(loadError.message));
  }, [id]);

  useEffect(load, [load]);

  if (error && !contact) return <ErrorState message={error} />;
  if (!contact) return <LoadingState />;

  return (
    <>
      <Link className="back-link" to="/kontakty">
        ← Všechny kontakty
      </Link>
      <div className="page-heading page-heading--compact">
        <div>
          <p className="eyebrow">Detail kontaktu</p>
          <h1>
            {contact.firstName} {contact.lastName}
          </h1>
          <div className="heading-meta">
            <StatusBadge status={contact.status} />
            <span>{contact.company?.name ?? "Bez firmy"}</span>
          </div>
        </div>
        <div className="button-group">
          <Link className="button button--secondary" to={`/kontakty/${contact.id}/upravit`}>
            Upravit
          </Link>
          <button
            className="button button--danger"
            type="button"
            onClick={async () => {
              if (
                !window.confirm(
                  `Opravdu chcete odstranit kontakt ${contact.firstName} ${contact.lastName}?`,
                )
              )
                return;
              try {
                await api.deleteContact(contact.id);
                navigate("/kontakty");
              } catch (deleteError) {
                setError(
                  deleteError instanceof Error ? deleteError.message : "Odstranění se nezdařilo.",
                );
              }
            }}
          >
            Odstranit
          </button>
        </div>
      </div>
      {error && <ErrorState message={error} />}

      <div className="detail-grid">
        <section className="panel detail-card">
          <h2>Kontaktní údaje</h2>
          <dl>
            <div>
              <dt>E-mail</dt>
              <dd>
                <a href={`mailto:${contact.email}`}>{contact.email}</a>
              </dd>
            </div>
            <div>
              <dt>Telefon</dt>
              <dd>{contact.phone ? <a href={`tel:${contact.phone}`}>{contact.phone}</a> : "—"}</dd>
            </div>
            <div>
              <dt>Firma</dt>
              <dd>
                {contact.company ? (
                  <Link to={`/firmy/${contact.company.id}`}>{contact.company.name}</Link>
                ) : (
                  "—"
                )}
              </dd>
            </div>
            <div>
              <dt>Další kontakt</dt>
              <dd>{formatDateTime(contact.nextContactAt)}</dd>
            </div>
            <div>
              <dt>Vytvořeno</dt>
              <dd>{formatDateTime(contact.createdAt)}</dd>
            </div>
          </dl>
        </section>

        <section className="panel">
          <h2>Přidat aktivitu</h2>
          <form
            className="activity-form"
            onSubmit={async (event) => {
              event.preventDefault();
              setError("");
              setSaving(true);
              try {
                const input: ActivityInput = {
                  type: activityType,
                  text: activityText.trim(),
                  occurredAt: new Date(occurredAt).toISOString(),
                };
                await api.addActivity(contact.id, input);
                setActivityText("");
                load();
              } catch (submitError) {
                setError(
                  submitError instanceof Error
                    ? submitError.message
                    : "Aktivitu se nepodařilo uložit.",
                );
              } finally {
                setSaving(false);
              }
            }}
          >
            <label>
              Typ aktivity
              <select
                value={activityType}
                onChange={(event) => setActivityType(event.target.value as ActivityType)}
              >
                {ACTIVITY_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {ACTIVITY_TYPE_LABELS[type]}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Datum a čas
              <input
                required
                type="datetime-local"
                value={occurredAt}
                onChange={(event) => setOccurredAt(event.target.value)}
              />
            </label>
            <label>
              Text aktivity<span aria-hidden="true"> *</span>
              <textarea
                required
                rows={4}
                value={activityText}
                onChange={(event) => setActivityText(event.target.value)}
                placeholder="Stručně popište, co se stalo…"
              />
            </label>
            <button className="button button--primary" type="submit" disabled={saving}>
              {saving ? "Ukládám…" : "Přidat aktivitu"}
            </button>
          </form>
        </section>
      </div>

      <section className="panel timeline-panel">
        <div className="panel__heading">
          <div>
            <h2>Historie aktivit</h2>
            <p>Nejnovější události jsou nahoře.</p>
          </div>
        </div>
        {contact.activities.length === 0 ? (
          <p className="empty-state">U kontaktu zatím není žádná aktivita.</p>
        ) : (
          <ol className="timeline">
            {contact.activities.map((activity) => (
              <li key={activity.id}>
                <div className="timeline__marker" aria-hidden="true" />
                <div className="timeline__content">
                  <div className="timeline__meta">
                    <strong>{ACTIVITY_TYPE_LABELS[activity.type]}</strong>
                    <time dateTime={activity.occurredAt}>
                      {formatDateTime(activity.occurredAt)}
                    </time>
                  </div>
                  <p>{activity.text}</p>
                </div>
              </li>
            ))}
          </ol>
        )}
      </section>
    </>
  );
}
