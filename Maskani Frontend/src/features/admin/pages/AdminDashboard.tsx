import { useCallback, useEffect, useState } from "react";
import { getPendingDorms, updateDormStatus } from "../../dorms/api/dormApi";
import type { DormData } from "../../dorms/types/dorm.types";

export default function AdminDashboard() {
  const [dorms, setDorms] = useState<DormData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const loadPending = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getPendingDorms();
      setDorms(data);
    } catch (err) {
      setError("Failed to load pending dorms.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadPending();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadPending]);

  async function handleDecision(dormId: string, status: "Approved" | "Rejected") {
    setActionError(null);
    try {
      await updateDormStatus(dormId, status);
      await loadPending();
    } catch (err) {
      setActionError(`Failed to ${status.toLowerCase()} dorm.`);
      console.error(err);
    }
  }

  if (loading) return <p style={{ padding: "24px" }}>Loading...</p>;
  if (error) return <p style={{ padding: "24px", color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "24px" }}>
      <h1>Admin Dashboard</h1>
      <h2 style={{ marginTop: "24px" }}>Pending Dorms</h2>
      {actionError && <p style={{ color: "red" }}>{actionError}</p>}
      {dorms.length === 0 ? (
        <p>No dorms waiting for approval.</p>
      ) : (
        <ul>
          {dorms.map((dorm) => (
            <li key={dorm.dormID} style={{ marginBottom: "12px" }}>
              <strong>{dorm.dormName}</strong> — {dorm.address} — Owner: {dorm.ownerName}
              <br />
              <button onClick={() => handleDecision(dorm.dormID, "Approved")}>
                Approve
              </button>{" "}
              <button onClick={() => handleDecision(dorm.dormID, "Rejected")}>
                Reject
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}