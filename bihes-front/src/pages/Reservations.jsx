import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { ApiError } from "../api/client";
import {
  cancelReservation,
  createReservation,
  fetchReservations,
  fetchTableAvailability,
  RESERVATION_STATUS_LABELS,
} from "../api/reservations";
import Navbar from "../components/Navbar";
import { colors } from "../theme/colors";
import "./Reservations.css";

const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M3 10h18M8 3v4M16 3v4" />
  </svg>
);

const UsersIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="9" cy="8" r="3" />
    <path d="M3 19a6 6 0 0 1 12 0" />
    <path d="M16 6a3 3 0 0 1 0 6" />
    <path d="M17.5 14.5A5.5 5.5 0 0 1 21 19" />
  </svg>
);

const NoteIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 4h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H9l-5 4V6a2 2 0 0 1 2-2Z" />
  </svg>
);

const RefreshIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 7v5h-5" />
    <path d="M4 17v-5h5" />
    <path d="M6.1 9a7 7 0 0 1 11.7-2.6L20 9" />
    <path d="M17.9 15a7 7 0 0 1-11.7 2.6L4 15" />
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m5 12 4 4L19 6" />
  </svg>
);

const errorText = (error) => {
  if (error instanceof ApiError) {
    return error.messages?.filter(Boolean).join(" ") || error.message;
  }
  return error?.message || "Something went wrong. Please try again.";
};

const formatCreatedAt = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
};

function TableChoice({ table, selected, onSelect }) {
  const available = table.is_available === true;

  return (
    <button
      type="button"
      className={`reserve-table ${selected ? "is-selected" : ""} ${available ? "is-available" : "is-taken"}`}
      onClick={() => available && onSelect(table.id)}
      disabled={!available}
      aria-pressed={selected}
      aria-label={`Table ${table.number}${table.label ? `, ${table.label}` : ""}. ${available ? "Available" : "Reserved"}`}
    >
      <span className="reserve-table-status" aria-hidden="true">
        <span className="reserve-status-dot" />
        {available ? "Available" : "Reserved"}
      </span>

      <span className="reserve-table-visual" aria-hidden="true">
        <span className="reserve-chair reserve-chair-top" />
        <span className="reserve-chair reserve-chair-right" />
        <span className="reserve-chair reserve-chair-bottom" />
        <span className="reserve-chair reserve-chair-left" />
        <span className="reserve-table-top">
          <small>TABLE</small>
          <strong>{table.number}</strong>
        </span>
      </span>

      <span className="reserve-table-name">
        {table.label || `Table ${table.number}`}
      </span>

      {selected && (
        <span className="reserve-selected-mark" aria-hidden="true">
          <CheckIcon />
        </span>
      )}
    </button>
  );
}

function ReservationCard({ reservation, cancelling, onCancel }) {
  const isActive = reservation.status === "active";

  return (
    <article className={`reservation-history-card status-${reservation.status}`}>
      <div className="reservation-history-head">
        <div>
          <p className="reservation-history-kicker">TABLE</p>
          <h3>{reservation.table_label || `Table ${reservation.table_number}`}</h3>
        </div>
        <span className={`reservation-status-pill status-${reservation.status}`}>
          {RESERVATION_STATUS_LABELS[reservation.status] || reservation.status}
        </span>
      </div>

      <div className="reservation-history-meta">
        <span><UsersIcon /> {reservation.party_size} {reservation.party_size === 1 ? "guest" : "guests"}</span>
        <span><CalendarIcon /> {formatCreatedAt(reservation.created_at)}</span>
      </div>

      {reservation.note && (
        <p className="reservation-history-note">
          <NoteIcon />
          <span>{reservation.note}</span>
        </p>
      )}

      {isActive && (
        <button
          type="button"
          className="reservation-cancel-btn"
          onClick={() => onCancel(reservation.id)}
          disabled={cancelling}
        >
          {cancelling ? "Cancelling…" : "Cancel reservation"}
        </button>
      )}
    </article>
  );
}

export default function Reservations() {
  const [tables, setTables] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [selectedTableId, setSelectedTableId] = useState(null);
  const [partySize, setPartySize] = useState(2);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [cancellingId, setCancellingId] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadReservationData = useCallback(async ({ quiet = false } = {}) => {
    if (quiet) setRefreshing(true);
    else setLoading(true);

    try {
      const [tableData, reservationData] = await Promise.all([
        fetchTableAvailability(),
        fetchReservations(),
      ]);

      setTables(tableData);
      setReservations(reservationData);
      setSelectedTableId((current) => {
        if (current == null) return current;
        const stillFree = tableData.some(
          (table) => table.id === current && table.is_available === true,
        );
        return stillFree ? current : null;
      });
      setError("");
    } catch (requestError) {
      setError(errorText(requestError));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadReservationData();
  }, [loadReservationData]);

  const selectedTable = useMemo(
    () => tables.find((table) => table.id === selectedTableId) || null,
    [tables, selectedTableId],
  );

  const availableCount = useMemo(
    () => tables.filter((table) => table.is_available === true).length,
    [tables],
  );

  const activeReservations = useMemo(
    () => reservations.filter((reservation) => reservation.status === "active"),
    [reservations],
  );

  const handlePartyChange = (nextValue) => {
    const parsed = Number.parseInt(nextValue, 10);
    setPartySize(Number.isFinite(parsed) ? Math.max(1, parsed) : 1);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedTable || submitting) return;

    setSubmitting(true);
    setError("");
    setNotice("");

    try {
      const created = await createReservation({
        tableId: selectedTable.id,
        partySize,
        note: note.trim(),
      });

      setSelectedTableId(null);
      setPartySize(2);
      setNote("");
      setNotice(
        `Table ${created.table_number} is reserved for ${created.party_size} ${created.party_size === 1 ? "guest" : "guests"}.`,
      );
      await loadReservationData({ quiet: true });
    } catch (requestError) {
      setError(errorText(requestError));
      await loadReservationData({ quiet: true });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async (reservationId) => {
    if (cancellingId != null) return;

    setCancellingId(reservationId);
    setError("");
    setNotice("");

    try {
      const cancelled = await cancelReservation(reservationId);
      setNotice(`Table ${cancelled.table_number} has been released.`);
      await loadReservationData({ quiet: true });
    } catch (requestError) {
      setError(errorText(requestError));
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div
      className="reservations-page"
      style={{
        "--bg": colors.background,
        "--surface": colors.surface,
        "--card": colors.card,
        "--primary": colors.primary,
        "--primary-dark": colors.primaryDark,
        "--text": colors.text,
        "--text-2": colors.textSecondary,
        "--accent": colors.accent,
      }}
    >
      <Navbar />

      <main className="reservations-main">
        <section className="reservations-hero">
          <div className="reservations-hero-copy">
            <p className="reservations-eyebrow">
              <span className="reservations-live-dot" />
              LIVE DINING ROOM
            </p>
            <h1>
              Find your <span>perfect table.</span>
            </h1>
            <p className="reservations-lead">
              Pick any available table, tell us your party size, and we’ll hold it for you right away.
            </p>
          </div>

          <div className="reservations-hero-stats" aria-label="Dining room availability">
            <div>
              <strong>{loading ? "—" : availableCount}</strong>
              <span>Available now</span>
            </div>
            <span className="reservations-stat-divider" />
            <div>
              <strong>{loading ? "—" : tables.length}</strong>
              <span>Tables in room</span>
            </div>
            <span className="reservations-stat-divider" />
            <div>
              <strong>{loading ? "—" : activeReservations.length}</strong>
              <span>Your active</span>
            </div>
          </div>
        </section>

        {notice && (
          <div className="reservation-alert reservation-alert-success" role="status">
            <span className="reservation-alert-icon"><CheckIcon /></span>
            <div>
              <strong>Reservation updated</strong>
              <p>{notice}</p>
            </div>
          </div>
        )}

        {error && (
          <div className="reservation-alert reservation-alert-error" role="alert">
            <span className="reservation-alert-icon">!</span>
            <div>
              <strong>We couldn’t complete that request</strong>
              <p>{error}</p>
            </div>
          </div>
        )}

        <section className="reservation-booking-grid">
          <div className="reservation-floor-card">
            <div className="reservation-panel-head">
              <div>
                <p className="reservation-panel-kicker">STEP 01</p>
                <h2>Choose your table</h2>
                <p>Gold tables are available. Dimmed tables are currently reserved.</p>
              </div>

              <button
                type="button"
                className="reservation-refresh-btn"
                onClick={() => loadReservationData({ quiet: true })}
                disabled={refreshing}
              >
                <RefreshIcon />
                {refreshing ? "Refreshing…" : "Refresh"}
              </button>
            </div>

            <div className="reservation-legend" aria-label="Table availability legend">
              <span><i className="legend-dot legend-available" /> Available</span>
              <span><i className="legend-dot legend-selected" /> Selected</span>
              <span><i className="legend-dot legend-taken" /> Reserved</span>
            </div>

            <div className="reservation-floor">
              <div className="reservation-floor-window" aria-hidden="true">
                <span /> <span /> <span />
                <small>WINDOW</small>
              </div>

              {loading ? (
                <div className="reservation-table-grid" aria-label="Loading tables">
                  {Array.from({ length: 8 }, (_, index) => (
                    <div className="reserve-table-skeleton" key={index} />
                  ))}
                </div>
              ) : tables.length > 0 ? (
                <div className="reservation-table-grid">
                  {tables.map((table) => (
                    <TableChoice
                      key={table.id}
                      table={table}
                      selected={table.id === selectedTableId}
                      onSelect={setSelectedTableId}
                    />
                  ))}
                </div>
              ) : (
                <div className="reservation-empty-floor">
                  <span>☕</span>
                  <h3>No tables are configured yet</h3>
                  <p>Ask an admin to add active tables in the reservation backend.</p>
                </div>
              )}

              <div className="reservation-floor-service" aria-hidden="true">
                <span>CAFÉ BAR</span>
              </div>
            </div>
          </div>

          <aside className="reservation-form-card">
            <div className="reservation-form-step">
              <span>02</span>
              <div>
                <p>YOUR BOOKING</p>
                <h2>Reservation details</h2>
              </div>
            </div>

            <div className={`reservation-selected-summary ${selectedTable ? "has-table" : ""}`}>
              <div className="reservation-mini-table" aria-hidden="true">
                <span>{selectedTable ? selectedTable.number : "—"}</span>
              </div>
              <div>
                <small>SELECTED TABLE</small>
                <strong>
                  {selectedTable
                    ? selectedTable.label || `Table ${selectedTable.number}`
                    : "Choose a table from the floor"}
                </strong>
              </div>
            </div>

            <form className="reservation-form" onSubmit={handleSubmit}>
              <label className="reservation-field">
                <span><UsersIcon /> Party size</span>
                <div className="reservation-party-control">
                  <button
                    type="button"
                    onClick={() => handlePartyChange(partySize - 1)}
                    disabled={partySize <= 1}
                    aria-label="Decrease party size"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min="1"
                    inputMode="numeric"
                    value={partySize}
                    onChange={(event) => handlePartyChange(event.target.value)}
                    aria-label="Party size"
                  />
                  <button
                    type="button"
                    onClick={() => handlePartyChange(partySize + 1)}
                    aria-label="Increase party size"
                  >
                    +
                  </button>
                </div>
              </label>

              <label className="reservation-field">
                <span><NoteIcon /> Note <em>optional</em></span>
                <textarea
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  maxLength="500"
                  placeholder="Window preference, celebration, accessibility needs…"
                  rows="4"
                />
                <small>{note.length}/500</small>
              </label>

              <button
                type="submit"
                className="reservation-submit-btn"
                disabled={!selectedTable || submitting}
              >
                <CalendarIcon />
                {submitting ? "Reserving your table…" : "Reserve this table"}
              </button>

              <p className="reservation-form-note">
                Availability is live. Your table is held immediately after confirmation.
              </p>
            </form>
          </aside>
        </section>

        <section className="reservation-history-section">
          <div className="reservation-section-heading">
            <div>
              <p className="reservation-panel-kicker">YOUR VISITS</p>
              <h2>My reservations</h2>
              <p>Review active bookings and release a table when your plans change.</p>
            </div>
            <Link to="/menu" className="reservation-menu-link">Browse the menu →</Link>
          </div>

          {loading ? (
            <div className="reservation-history-grid">
              <div className="reservation-history-skeleton" />
              <div className="reservation-history-skeleton" />
            </div>
          ) : reservations.length > 0 ? (
            <div className="reservation-history-grid">
              {reservations.map((reservation) => (
                <ReservationCard
                  key={reservation.id}
                  reservation={reservation}
                  cancelling={cancellingId === reservation.id}
                  onCancel={handleCancel}
                />
              ))}
            </div>
          ) : (
            <div className="reservation-history-empty">
              <div className="reservation-empty-icon"><CalendarIcon /></div>
              <div>
                <h3>No reservations yet</h3>
                <p>Select an available table above to make your first booking.</p>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
