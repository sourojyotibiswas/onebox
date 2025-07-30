import fs from "fs";
import path from "path";

const TRACKER_FILE = path.join(__dirname, "../../uid_tracker.json");

type UIDMap = {
  [account: string]: {
    [folder: string]: number;
  };
};

// Load UID tracking data from JSON file
function loadTracker(): UIDMap {
  try {
    const data = fs.readFileSync(TRACKER_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return {};
  }
}

// Save UID tracking data to JSON file
function saveTracker(map: UIDMap) {
  fs.writeFileSync(TRACKER_FILE, JSON.stringify(map, null, 2));
}

// Get the last processed UID for an account/folder combination
export function getLastUID(account: string, folder: string): number {
  const map = loadTracker();
  return map[account]?.[folder] || 0;
}

// Set the last processed UID for an account/folder combination
export function setLastUID(account: string, folder: string, uid: number) {
  const map = loadTracker();
  if (!map[account]) map[account] = {};
  map[account][folder] = uid;
  saveTracker(map);
}
