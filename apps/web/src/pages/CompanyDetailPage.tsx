import type { CompanyDetail } from "@minicrm/shared";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { api } from "../api/client";
import { ErrorState, LoadingState } from "../components/PageState";
import { StatusBadge } from "../components/StatusBadge";

export function CompanyDetailPage() {
  const { id = "" } = useParams();
  const [company, setCompany] = useState<CompanyDetail | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .getCompany(id)
      .then(setCompany)
      .catch((loadError: Error) => setError(loadError.message));
  }, [id]);

  if (error) return <ErrorState message={error} />;
  if (!company) return <LoadingState />;

  return (
    <>
      <Link className="back-link" to="/firmy">
        ← Všechny firmy
      </Link>
      <div className="page-heading page-heading--compact">
        <div>
          <p className="eyebrow">Detail firmy</p>
          <h1>{company.name}</h1>
          <p className="subtitle">{company.industry ?? "Obor není uveden"}</p>
        </div>
        <Link className="button button--secondary" to={`/firmy/${company.id}/upravit`}>
          Upravit firmu
        </Link>
      </div>
      <section className="panel detail-card company-summary">
        <dl>
          <div>
            <dt>Web</dt>
            <dd>
              {company.website ? (
                <a href={company.website} target="_blank" rel="noreferrer">
                  {company.website}
                </a>
              ) : (
                "—"
              )}
            </dd>
          </div>
          <div>
            <dt>Počet kontaktů</dt>
            <dd>{company.contacts.length}</dd>
          </div>
        </dl>
      </section>
      <section className="panel panel--flush">
        <div className="panel__heading panel__heading--padded">
          <div>
            <h2>Kontakty ve firmě</h2>
            <p>Lidé aktuálně přiřazení k této firmě.</p>
          </div>
        </div>
        {company.contacts.length === 0 ? (
          <p className="empty-state">K firmě zatím není přiřazen žádný kontakt.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Jméno</th>
                  <th>E-mail</th>
                  <th>Stav</th>
                </tr>
              </thead>
              <tbody>
                {company.contacts.map((contact) => (
                  <tr key={contact.id}>
                    <td>
                      <Link className="table-link" to={`/kontakty/${contact.id}`}>
                        {contact.firstName} {contact.lastName}
                      </Link>
                    </td>
                    <td>{contact.email}</td>
                    <td>
                      <StatusBadge status={contact.status} />
                    </td>
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
