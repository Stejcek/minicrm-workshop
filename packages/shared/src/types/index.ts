import type { ACTIVITY_TYPES, CONTACT_STATUSES } from "../constants.js";

export type ContactStatus = (typeof CONTACT_STATUSES)[number];
export type ActivityType = (typeof ACTIVITY_TYPES)[number];

export interface Company {
  id: string;
  name: string;
  website: string | null;
  industry: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ContactSummary {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  companyId: string | null;
  company: Pick<Company, "id" | "name"> | null;
  status: ContactStatus;
  nextContactAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Activity {
  id: string;
  contactId: string;
  type: ActivityType;
  text: string;
  occurredAt: string;
  createdAt: string;
}

export interface ContactDetail extends ContactSummary {
  activities: Activity[];
}

export interface CompanyDetail extends Company {
  contacts: ContactSummary[];
}

export interface DashboardData {
  counts: {
    total: number;
    new: number;
    qualified: number;
    won: number;
  };
  upcoming: ContactSummary[];
}
