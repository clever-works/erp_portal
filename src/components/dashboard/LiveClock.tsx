"use client";

import { useEffect, useState } from "react";

/** Large live clock (hours:minutes with ticking seconds) for the hero tile. */
export default function LiveClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => { const timer = window.setInterval(() => setNow(new Date()), 1000); return () => window.clearInterval(timer); }, []);
  const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
  return <div className="live-clock" aria-label={`Current time ${time}`}>
    <span className="live-clock-time">{time}<small>{String(now.getSeconds()).padStart(2, "0")}</small></span>
  </div>;
}
