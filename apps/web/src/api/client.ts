import type {
  Activity,
  ActivityInput,
  Company,
  CompanyDetail,
  CompanyInput,
  ContactDetail,
  ContactInput,
  ContactQuery,
  ContactSummary,
  DashboardData,
} from "@minicrm/shared";

const API_URL = import.meta.env.VITE_API_URL ?? "/api";

export class ApiError extends Error {}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: options?.body
      ? { "Content-Type": "application/json", ...options.headers }
      : options?.headers,
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { message?: string } | null;
    throw new ApiError(body?.message ?? "Požadavek se nepodařilo dokončit.");
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

export interface CompanyListItem extends Company {
  _count: { contacts: number };
}

export const api = {
  dashboard: () => request<DashboardData>("/dashboard"),
  listCompanies: () => request<CompanyListItem[]>("/companies"),
  getCompany: (id: string) => request<CompanyDetail>(`/companies/${id}`),
  createCompany: (input: CompanyInput) =>
    request<Company>("/companies", { method: "POST", body: JSON.stringify(input) }),
  updateCompany: (id: string, input: CompanyInput) =>
    request<Company>(`/companies/${id}`, { method: "PUT", body: JSON.stringify(input) }),
  listContacts: (query: ContactQuery = {}) => {
    const params = buildContactSearchParams(query);
    return request<ContactSummary[]>(`/contacts${params ? `?${params}` : ""}`);
  },
  getContact: (id: string) => request<ContactDetail>(`/contacts/${id}`),
  createContact: (input: ContactInput) =>
    request<ContactSummary>("/contacts", { method: "POST", body: JSON.stringify(input) }),
  updateContact: (id: string, input: ContactInput) =>
    request<ContactSummary>(`/contacts/${id}`, { method: "PUT", body: JSON.stringify(input) }),
  deleteContact: (id: string) => request<void>(`/contacts/${id}`, { method: "DELETE" }),
  addActivity: (contactId: string, input: ActivityInput) =>
    request<Activity>(`/contacts/${contactId}/activities`, {
      method: "POST",
      body: JSON.stringify(input),
    }),
};

export function buildContactSearchParams(query: ContactQuery): string {
  const params = new URLSearchParams();
  if (query.q) params.set("q", query.q);
  if (query.status) params.set("status", query.status);
  if (query.companyId) params.set("companyId", query.companyId);
  return params.toString();
}
