const STORAGE_KEY = "player:track";

export const loadTrackState = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const saveTrackState = (state) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {err => 
    console.log('something wrong in storing track state');
    console.dir(err);
  }
};
