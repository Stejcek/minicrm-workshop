import type { Company, ContactDetail, ContactInput } from "@minicrm/shared";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { api } from "../api/client";
import { ContactForm } from "../components/ContactForm";
import { ErrorState, LoadingState } from "../components/PageState";

export function ContactFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<Company[] | null>(null);
  const [contact, setContact] = useState<ContactDetail | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([api.listCompanies(), id ? api.getContact(id) : Promise.resolve(null)])
      .then(([companyList, current]) => {
        setCompanies(companyList);
        setContact(current);
      })
      .catch((loadError: Error) => setError(loadError.message));
  }, [id]);

  if (error) return <ErrorState message={error} />;
  if (!companies || (id && !contact)) return <LoadingState />;

  const initial: ContactInput | undefined = contact
    ? {
        firstName: contact.firstName,
        lastName: contact.lastName,
        email: contact.email,
        phone: contact.phone,
        companyId: contact.companyId,
        status: contact.status,
        nextContactAt: contact.nextContactAt,
      }
    : undefined;

  return (
    <>
      <Link className="back-link" to={id ? `/kontakty/${id}` : "/kontakty"}>
        ← Zpět
      </Link>
      <div className="page-heading page-heading--compact">
        <div>
          <p className="eyebrow">{id ? "Úprava záznamu" : "Nový záznam"}</p>
          <h1>{id ? "Upravit kontakt" : "Nový kontakt"}</h1>
          <p className="subtitle">Povinná pole jsou označena hvězdičkou.</p>
        </div>
      </div>
      <ContactForm
        companies={companies}
        initial={initial}
        submitLabel={id ? "Uložit změny" : "Vytvořit kontakt"}
        onSubmit={async (input) => {
          const saved = id ? await api.updateContact(id, input) : await api.createContact(input);
          navigate(`/kontakty/${saved.id}`);
        }}
      />
    </>
  );
}
