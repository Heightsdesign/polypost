import { useEffect, useState } from "react";
import api from "../api";

type Slot = {
  platform: string;
  time: string; // "18:00"
  datetime: string; // ISO in user's tz
  engagement_score: number;
  saved: boolean;
};

type DaySug = {
  date: string;
  slots: Slot[];
};

export default function Scheduler() {
  const [days, setDays] = useState<DaySug[]>([]);
  const [mySlots, setMySlots] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // load suggestions and planned slots
  useEffect(() => {
    (async () => {
      const sug = await api.get("/scheduler/suggestions/?platform=instagram&days=3");
      setDays(sug.data.days || []);

      const mine = await api.get("/scheduler/my/");
      setMySlots(mine.data || []);
    })();
  }, []);

  async function handleSave(slot: Slot) {
    setLoading(true);
    try {
      await api.post("/scheduler/plan/", {
        platform: slot.platform,
        scheduled_at: slot.datetime,
        title: "Planned from UI",
        notify: true,
      });
      // reload saved slots
      const mine = await api.get("/scheduler/my/");
      setMySlots(mine.data || []);

      // also update local suggestions to mark it saved
      setDays((prev) =>
        prev.map((d) => ({
          ...d,
          slots: d.slots.map((s) =>
            s.datetime === slot.datetime && s.platform === slot.platform
              ? { ...s, saved: true }
              : s
          ),
        }))
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1>Scheduler</h1>
      <p>Best times for the next days (from backend):</p>

      {days.map((day) => (
        <div key={day.date} style={{ marginBottom: "1rem" }}>
          <h3>{day.date}</h3>
          {day.slots.length === 0 && <p>No suggestions for this day.</p>}
          <ul>
            {day.slots.map((slot) => (
              <li key={slot.datetime} style={{ marginBottom: "0.35rem" }}>
                {slot.time} – {slot.platform} (score {slot.engagement_score})
                {slot.saved ? (
                    <span style={{ marginLeft: "0.5rem" }}>✅ saved</span>
                ) : (
                  <button
                    style={{ marginLeft: "0.5rem" }}
                    onClick={() => handleSave(slot)}
                    disabled={loading}
                  >
                    Save
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}

      <h2>My planned slots</h2>
      <ul>
        {mySlots.map((s: any) => (
          <li key={s.id}>
            {s.platform} – {s.scheduled_at} {s.notify ? "🔔" : ""}
          </li>
        ))}
      </ul>
    </div>
  );
}
