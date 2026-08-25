import { CONTACT_STATUSES, CONTACT_STATUS_LABELS } from "@minicrm/shared";
import type { Company, ContactStatus, ContactSummary } from "@minicrm/shared";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { api } from "../api/client";
import { ErrorState, LoadingState } from "../components/PageState";
import { StatusBadge } from "../components/StatusBadge";
import { formatDateTime } from "../utils/date";

export function ContactsPage() {
  const [contacts, setContacts] = useState<ContactSummary[] | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ContactStatus | "">("");
  const [companyId, setCompanyId] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .listCompanies()
      .then(setCompanies)
      .catch((loadError: Error) => setError(loadError.message));
  }, []);

  useEffect(() => {
    setContacts(null);
    setError("");
    api
      .listContacts({
        q: search || undefined,
        status: status || undefined,
        companyId: companyId || undefined,
      })
      .then(setContacts)
      .catch((loadError: Error) => setError(loadError.message));
  }, [search, status, companyId]);

  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">Adresář</p>
          <h1>Kontakty</h1>
          <p className="subtitle">Správa lidí, obchodních stavů a dalších kroků.</p>
        </div>
        <Link className="button button--primary" to="/kontakty/novy">
          Nový kontakt
        </Link>
      </div>

      <form
        className="filters"
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
          setSearch(query.trim());
        }}
      >
        <label className="search-field">
          <span className="sr-only">Hledat podle jména nebo e-mailu</span>
          <input
            type="search"
            placeholder="Hledat jméno nebo e-mail…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <label>
          <span className="sr-only">Filtrovat podle stavu</span>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value as ContactStatus | "")}
          >
            <option value="">Všechny stavy</option>
            {CONTACT_STATUSES.map((item) => (
              <option key={item} value={item}>
                {CONTACT_STATUS_LABELS[item]}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="sr-only">Filtrovat podle firmy</span>
          <select value={companyId} onChange={(event) => setCompanyId(event.target.value)}>
            <option value="">Všechny firmy</option>
            {companies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>
        </label>
        <button className="button button--secondary" type="submit">
          Hledat
        </button>
      </form>

      {error ? (
        <ErrorState message={error} />
      ) : contacts === null ? (
        <LoadingState />
      ) : (
        <section className="panel panel--flush">
          {contacts.length === 0 ? (
            <p className="empty-state">Filtrům neodpovídá žádný kontakt.</p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Jméno</th>
                    <th>E-mail</th>
                    <th>Firma</th>
                    <th>Stav</th>
                    <th>Další kontakt</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map((contact) => (
                    <tr key={contact.id}>
                      <td>
                        <Link className="table-link" to={`/kontakty/${contact.id}`}>
                          {contact.firstName} {contact.lastName}
                        </Link>
                      </td>
                      <td>
                        <a href={`mailto:${contact.email}`}>{contact.email}</a>
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
      )}
    </>
  );
}
