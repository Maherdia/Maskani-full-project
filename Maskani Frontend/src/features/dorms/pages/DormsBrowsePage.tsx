import { useCallback, useEffect, useState } from "react";
import { searchDorms } from "../api/dormApi";
import DormCard from "../components/DormCard";
import DormsMap from "../components/DormsMap";
import type { DormData, SearchDormParams } from "../types/dorm.types";

export default function DormsBrowsePage() {
  const [dorms, setDorms] = useState<DormData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<"list" | "map">("list");

  const [university, setUniversity] = useState("");
  const [dormName, setDormName] = useState("");
  const [address, setAddress] = useState("");
  const [furnishedOnly, setFurnishedOnly] = useState(false);
  const [maxDistance, setMaxDistance] = useState("");

  const runSearch = useCallback(async (params: SearchDormParams) => {
    setLoading(true);
    setError(null);
    try {
      const data = await searchDorms(params);
      setDorms(data);
    } catch (err) {
      setError("Failed to load dorms.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void runSearch({});
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [runSearch]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    runSearch({
      university: university || undefined,
      dormName: dormName || undefined,
      address: address || undefined,
      furnished: furnishedOnly ? true : undefined,
      maxDistance: maxDistance ? Number(maxDistance) : undefined,
    });
  }

  function handleReset() {
    setUniversity("");
    setDormName("");
    setAddress("");
    setFurnishedOnly(false);
    setMaxDistance("");
    runSearch({});
  }

  return (
    <div style={{ padding: "24px" }}>
      <h1>Browse Dorms</h1>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          gap: "12px",
          flexWrap: "wrap",
          marginBottom: "16px",
          alignItems: "flex-end",
        }}
      >
        <div>
          <label style={{ display: "block", fontSize: "14px" }}>University</label>
          <input value={university} onChange={(e) => setUniversity(e.target.value)} />
        </div>

        <div>
          <label style={{ display: "block", fontSize: "14px" }}>Dorm name</label>
          <input value={dormName} onChange={(e) => setDormName(e.target.value)} />
        </div>

        <div>
          <label style={{ display: "block", fontSize: "14px" }}>Address</label>
          <input value={address} onChange={(e) => setAddress(e.target.value)} />
        </div>

        <div>
          <label style={{ display: "block", fontSize: "14px" }}>Max distance (km)</label>
          <input
            type="number"
            value={maxDistance}
            onChange={(e) => setMaxDistance(e.target.value)}
          />
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={furnishedOnly}
              onChange={(e) => setFurnishedOnly(e.target.checked)}
            />{" "}
            Furnished only
          </label>
        </div>

        <button type="submit">Search</button>
        <button type="button" onClick={handleReset}>
          Reset
        </button>
      </form>

      <div style={{ marginBottom: "16px" }}>
        <button onClick={() => setView("list")} disabled={view === "list"}>
          List view
        </button>{" "}
        <button onClick={() => setView("map")} disabled={view === "map"}>
          Map view
        </button>
      </div>

      {loading && <p>Loading dorms...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && (
        <>
          <p>{dorms.length} dorm(s) found.</p>

          {dorms.length === 0 ? (
            <p>No dorms match your search.</p>
          ) : view === "list" ? (
            <div>
              {dorms.map((dorm) => (
                <DormCard key={dorm.dormID} dorm={dorm} />
              ))}
            </div>
          ) : (
            <DormsMap dorms={dorms} />
          )}
        </>
      )}
    </div>
  );
}