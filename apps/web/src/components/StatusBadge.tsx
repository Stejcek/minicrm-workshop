import { CONTACT_STATUS_LABELS } from "@minicrm/shared";
import type { ContactStatus } from "@minicrm/shared";

export function StatusBadge({ status }: { status: ContactStatus }) {
  return (
    <span className={`status status--${status.toLowerCase()}`}>
      {CONTACT_STATUS_LABELS[status]}
    </span>
  );
}
