import type { DashboardData } from "@minicrm/shared";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { api } from "../api/client";
import { ErrorState, LoadingState } from "../components/PageState";
import { StatusBadge } from "../components/StatusBadge";
import { formatDateTime } from "../utils/date";

export function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .dashboard()
      .then(setData)
      .catch((loadError: Error) => setError(loadError.message));
  }, []);

  if (error) return <ErrorState message={error} />;
  if (!data) return <LoadingState />;

  const metrics = [
    ["Všechny kontakty", data.counts.total],
    ["Nové", data.counts.new],
    ["Kvalifikované", data.counts.qualified],
    ["Vyhrané", data.counts.won],
  ] as const;

  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">Dobrý den</p>
          <h1>Přehled</h1>
          <p className="subtitle">Rychlý pohled na stav vašich obchodních kontaktů.</p>
        </div>
        <Link className="button button--primary" to="/kontakty/novy">
          Přidat kontakt
        </Link>
      </div>

      <section className="metric-grid" aria-label="Souhrn kontaktů">
        {metrics.map(([label, value]) => (
          <article className="metric-card" key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </article>
        ))}
      </section>

      <section className="panel">
        <div className="panel__heading">
          <div>
            <h2>Nejbližší plánované kontakty</h2>
            <p>Co máte v následujících dnech na řadě.</p>
          </div>
          <Link to="/kontakty">Všechny kontakty</Link>
        </div>
        {data.upcoming.length === 0 ? (
          <p className="empty-state">Zatím nejsou naplánované žádné další kontakty.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Kontakt</th>
                  <th>Firma</th>
                  <th>Stav</th>
                  <th>Termín</th>
                </tr>
              </thead>
              <tbody>
                {data.upcoming.map((contact) => (
                  <tr key={contact.id}>
                    <td>
                      <Link className="table-link" to={`/kontakty/${contact.id}`}>
                        {contact.firstName} {contact.lastName}
                      </Link>
                    </td>
                    <td>{contact.company?.name ?? "—"}</td>
                    <td>
                      <StatusBadge status={contact.status} />
                    </td>
                    <td>{formatDateTime(contact.nextContactAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
