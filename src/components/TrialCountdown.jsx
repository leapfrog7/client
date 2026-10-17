import { useEffect, useState } from "react";
import PropTypes from "prop-types";

export default function TrialCountdown({expiresAt}) {
  const [now,setNow] = useState(Date.now);
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(timer);
  }, []);
  const remaining = Math.max(0, new Date(expiresAt).getTime() - now);
  if (!Number.isFinite(remaining)) return null;
  const minutes = Math.ceil(remaining / 60000);
  return <span>{minutes > 0 ? Math.floor(minutes / 60) + "h " + (minutes % 60) + "m remaining" : "Trial ended"}</span>;
}
TrialCountdown.propTypes = {expiresAt:PropTypes.string.isRequired};
