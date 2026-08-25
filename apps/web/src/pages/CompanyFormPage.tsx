import type { Company, CompanyInput } from "@minicrm/shared";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { api } from "../api/client";
import { CompanyForm } from "../components/CompanyForm";
import { ErrorState, LoadingState } from "../components/PageState";

export function CompanyFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState<Company | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id)
      api
        .getCompany(id)
        .then(setCompany)
        .catch((loadError: Error) => setError(loadError.message));
  }, [id]);

  if (error) return <ErrorState message={error} />;
  if (id && !company) return <LoadingState />;

  const initial: CompanyInput | undefined = company
    ? {
        name: company.name,
        website: company.website,
        industry: company.industry,
      }
    : undefined;

  return (
    <>
      <Link className="back-link" to={id ? `/firmy/${id}` : "/firmy"}>
        ← Zpět
      </Link>
      <div className="page-heading page-heading--compact">
        <div>
          <p className="eyebrow">{id ? "Úprava záznamu" : "Nový záznam"}</p>
          <h1>{id ? "Upravit firmu" : "Nová firma"}</h1>
          <p className="subtitle">Povinná pole jsou označena hvězdičkou.</p>
        </div>
      </div>
      <CompanyForm
        initial={initial}
        submitLabel={id ? "Uložit změny" : "Vytvořit firmu"}
        onSubmit={async (input) => {
          const saved = id ? await api.updateCompany(id, input) : await api.createCompany(input);
          navigate(`/firmy/${saved.id}`);
        }}
      />
    </>
  );
}
