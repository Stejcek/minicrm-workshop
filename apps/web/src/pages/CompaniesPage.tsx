import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { api } from "../api/client";
import type { CompanyListItem } from "../api/client";
import { ErrorState, LoadingState } from "../components/PageState";

export function CompaniesPage() {
  const [companies, setCompanies] = useState<CompanyListItem[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .listCompanies()
      .then(setCompanies)
      .catch((loadError: Error) => setError(loadError.message));
  }, []);

  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">Organizace</p>
          <h1>Firmy</h1>
          <p className="subtitle">Přehled firem a přiřazených kontaktů.</p>
        </div>
        <Link className="button button--primary" to="/firmy/nova">
          Nová firma
        </Link>
      </div>
      {error ? (
        <ErrorState message={error} />
      ) : companies === null ? (
        <LoadingState />
      ) : (
        <section className="panel panel--flush">
          {companies.length === 0 ? (
            <p className="empty-state">Zatím není vytvořena žádná firma.</p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Název</th>
                    <th>Obor</th>
                    <th>Web</th>
                    <th>Kontaktů</th>
                    <th>
                      <span className="sr-only">Akce</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {companies.map((company) => (
                    <tr key={company.id}>
                      <td>
                        <Link className="table-link" to={`/firmy/${company.id}`}>
                          {company.name}
                        </Link>
                      </td>
                      <td>{company.industry ?? "—"}</td>
                      <td>
                        {company.website ? (
                          <a href={company.website} target="_blank" rel="noreferrer">
                            Otevřít web
                          </a>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td>{company._count.contacts}</td>
                      <td>
                        <Link to={`/firmy/${company.id}/upravit`}>Upravit</Link>
                      </td>
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
