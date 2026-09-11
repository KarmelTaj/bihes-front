

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

export function fetchTableAvailability() {
  return fetchAllPages("/reservations/availability/");
}

export function fetchReservations() {
  return fetchAllPages(RESERVATIONS_COLLECTION);
}

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
