import { useEffect, useState } from "react";
import { getAllDorms } from "../../dorms/api/dormApi";
import DormsMap from "../../dorms/components/DormsMap";
import type { DormData } from "../../dorms/types/dorm.types";

export default function HomePage() {
  const [dorms, setDorms] = useState<DormData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDorms() {
      try {
        const data = await getAllDorms();
        setDorms(data);
      } catch (err) {
        setError("Failed to load dorms.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchDorms();
  }, []);

  return (
    <div style={{ padding: "24px" }}>
      <h1>Maskani</h1>

      {loading && <p>Loading dorms...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && (
        <>
          <p>{dorms.length} dorm(s) loaded from the API.</p>
          <DormsMap dorms={dorms} />
        </>
      )}
    </div>
  );
}