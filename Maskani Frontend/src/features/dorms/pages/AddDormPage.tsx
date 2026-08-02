import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/hooks/useAuth";
import { addDorm } from "../api/dormApi";
import { uploadDormImage } from "../api/dormImageApi";
import { getAllUniversities } from "../../universities/api/universityApi";
import LocationPicker from "../components/LocationPicker";
import type { UniversityData } from "../../universities/types/university.types";

const MAX_PHOTOS = 15;

export default function AddDormPage() {
  const auth = useAuth();
  const navigate = useNavigate();

  const [universities, setUniversities] = useState<UniversityData[]>([]);
  const [dormName, setDormName] = useState("");
  const [address, setAddress] = useState("");
  const [universityID, setUniversityID] = useState<number | "">("");
  const [furnishedOrNot, setFurnishedOrNot] = useState(false);
  const [distance, setDistance] = useState("");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [photos, setPhotos] = useState<File[]>([]);

  const [error, setError] = useState<string | null>(null);
  const [photoWarnings, setPhotoWarnings] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [createdDormId, setCreatedDormId] = useState<string | null>(null);

  useEffect(() => {
    getAllUniversities().then(setUniversities).catch(console.error);
  }, []);

  function handlePhotoSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setPhotos((prev) => {
      const combined = [...prev, ...files];
      if (combined.length > MAX_PHOTOS) {
        setError(`You can only add up to ${MAX_PHOTOS} photos.`);
        return combined.slice(0, MAX_PHOTOS);
      }
      return combined;
    });
    e.target.value = "";
  }

  function removePhoto(index: number) {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPhotoWarnings([]);

    if (!coords) {
      setError("Please drop a pin on the map for the dorm's location.");
      return;
    }
    if (!universityID) {
      setError("Please select a university.");
      return;
    }
    if (!auth.user?.ownerID) {
      setError("Only Owner accounts can add dorms.");
      return;
    }

    setLoading(true);
    try {
      const dormID = crypto.randomUUID();

      await addDorm({
        dormID,
        ownerID: auth.user.ownerID,
        universityID: Number(universityID),
        dormName,
        address,
        furnishedOrNot,
        distance: Number(distance),
        latitude: coords.lat,
        longitude: coords.lng,
      });

      setCreatedDormId(dormID);

      const warnings: string[] = [];
      for (const photo of photos) {
        try {
          await uploadDormImage(dormID, photo);
        } catch (err: unknown) {
          const message =
            axios.isAxiosError<{ message?: string }>(err) &&
            err.response?.data?.message
              ? err.response.data.message
              : `Failed to upload ${photo.name}.`;

          warnings.push(message);
        }
      }

      if (warnings.length > 0) {
        setPhotoWarnings(warnings);
      } else {
        navigate("/owner");
      }
    } catch (err) {
      setError("Failed to create dorm. Check your details and try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // Dorm was created successfully, but some photos failed — let the owner
  // see what went wrong before leaving, instead of silently redirecting.
  if (createdDormId && photoWarnings.length > 0) {
    return (
      <div style={{ padding: "24px", maxWidth: "600px" }}>
        <h1>Dorm Created</h1>
        <p>Your dorm was submitted for review. Some photos didn't upload though:</p>
        <ul style={{ color: "orange" }}>
          {photoWarnings.map((w, i) => (
            <li key={i}>{w}</li>
          ))}
        </ul>
        <button onClick={() => navigate("/owner")}>Go to Dashboard</button>
      </div>
    );
  }

  return (
    <div style={{ padding: "24px", maxWidth: "600px" }}>
      <h1>Add a Dorm</h1>
      <p>New listings are reviewed by an admin before appearing publicly.</p>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="dormName">Dorm name</label>
          <br />
          <input
            id="dormName"
            type="text"
            value={dormName}
            onChange={(e) => setDormName(e.target.value)}
            required
          />
        </div>

        <div style={{ marginTop: "12px" }}>
          <label htmlFor="address">Address (shown to students)</label>
          <br />
          <input
            id="address"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            style={{ width: "100%" }}
          />
        </div>

        <div style={{ marginTop: "12px" }}>
          <label htmlFor="university">University</label>
          <br />
          <select
            id="university"
            value={universityID}
            onChange={(e) => setUniversityID(e.target.value ? Number(e.target.value) : "")}
            required
          >
            <option value="">Select a university</option>
            {universities.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginTop: "12px" }}>
          <label htmlFor="distance">Distance from university (km)</label>
          <br />
          <input
            id="distance"
            type="number"
            step="0.1"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
            required
          />
        </div>

        <div style={{ marginTop: "12px" }}>
          <label>
            <input
              type="checkbox"
              checked={furnishedOrNot}
              onChange={(e) => setFurnishedOrNot(e.target.checked)}
            />{" "}
            Furnished
          </label>
        </div>

        <div style={{ marginTop: "16px" }}>
          <LocationPicker onChange={(lat, lng) => setCoords({ lat, lng })} />
        </div>

        <div style={{ marginTop: "16px" }}>
          <label>Photos ({photos.length}/{MAX_PHOTOS})</label>
          <br />
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            disabled={photos.length >= MAX_PHOTOS}
            onChange={handlePhotoSelect}
          />

          {photos.length > 0 && (
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "8px" }}>
              {photos.map((photo, index) => (
                <div key={index} style={{ position: "relative" }}>
                  <img
                    src={URL.createObjectURL(photo)}
                    alt={photo.name}
                    style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "4px" }}
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    style={{
                      position: "absolute",
                      top: "2px",
                      right: "2px",
                      background: "rgba(0,0,0,0.6)",
                      color: "white",
                      border: "none",
                      borderRadius: "50%",
                      width: "20px",
                      height: "20px",
                      cursor: "pointer",
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit" disabled={loading} style={{ marginTop: "16px" }}>
          {loading ? "Creating..." : "Create Dorm"}
        </button>
      </form>
    </div>
  );
}