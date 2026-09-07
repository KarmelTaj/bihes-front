/**
 * Table reservation endpoints under `/reservations/`.
 *
 * The backend models live availability: an ACTIVE reservation holds one table
 * until it is cancelled or completed. There is no date/time field yet, so the
 * frontend intentionally presents this as a "reserve a table now" flow.
 */

import { apiFetch, fetchAllPages } from "./client";

const RESERVATIONS_COLLECTION = "/reservations/reservations/";

export const RESERVATION_STATUS = {
  ACTIVE: "active",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

export const RESERVATION_STATUS_LABELS = {
  active: "Active",
  completed: "Completed",
  cancelled: "Cancelled",
};

/** Every active table, including occupied tables, with `is_available`. */
export function fetchTableAvailability() {
  return fetchAllPages("/reservations/availability/");
}

/** The signed-in customer's reservations (admins receive all reservations). */
export function fetchReservations() {
  return fetchAllPages(RESERVATIONS_COLLECTION);
}

/** Reserve one currently available table for the signed-in customer. */
export function createReservation({ tableId, partySize, note = "" }) {
  return apiFetch(RESERVATIONS_COLLECTION, {
    method: "POST",
    body: {
      table: tableId,
      party_size: partySize,
      note,
    },
  });
}

/** Release one of the signed-in customer's active reservations. */
export function cancelReservation(id) {
  return apiFetch(`${RESERVATIONS_COLLECTION}${id}/cancel/`, {
    method: "PATCH",
  });
}
