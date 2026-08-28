export type ShopStatus = {
  isOpen: boolean;
  weekend: boolean;
  label: string;
};

const OPEN_MINS = 11 * 60 + 30; // 11:30 AM
const CLOSE_WEEKDAY = 4 * 60 + 30; // 4:30 AM next day
const CLOSE_WEEKEND = 4 * 60 + 45; // 4:45 AM next day

/**
 * Sun–Thu 11:30 AM – 4:30 AM, Fri–Sat 11:30 AM – 4:45 AM (Dubai time).
 * Pass a date to keep it deterministic in tests; defaults to now.
 */
export function shopStatus(now: Date = new Date()): ShopStatus {
  const day = now.getDay();
  const mins = now.getHours() * 60 + now.getMinutes();
  const weekend = day === 5 || day === 6;
  const close = weekend ? CLOSE_WEEKEND : CLOSE_WEEKDAY;
  const isOpen = mins >= OPEN_MINS || mins < close;
  const closeLabel = weekend ? "4:45 AM" : "4:30 AM";
  return {
    isOpen,
    weekend,
    label: isOpen ? "Open now · closes " + closeLabel : "Closed · opens 11:30 AM",
  };
}
