const LIBRARY_KEY = "vernacular_classroom_library";
const CACHE_KEY = "vernacular_classroom_cache";

const DEFAULT_LIBRARY = [];

function safeRead(key, fallback) {
  try {
    const value = localStorage.getItem(key);

    if (!value) {
      return fallback;
    }

    const parsed = JSON.parse(value);

    return parsed ?? fallback;
  } catch (error) {
    console.error(`Storage read error for ${key}:`, error);
    return fallback;
  }
}

function safeWrite(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));

    return true;
  } catch (error) {
    console.error(`Storage write error for ${key}:`, error);
    return false;
  }
}

/* =========================
   NETWORK
========================= */

export function isOnline() {
  return navigator.onLine;
}

export function subscribeToNetworkStatus(callback) {
  const handleOnline = () => callback(true);
  const handleOffline = () => callback(false);

  window.addEventListener("online", handleOnline);
  window.addEventListener("offline", handleOffline);

  return () => {
    window.removeEventListener("online", handleOnline);
    window.removeEventListener("offline", handleOffline);
  };
}

/* =========================
   CACHE
========================= */

export function saveCache(key, data) {
  const cache = safeRead(CACHE_KEY, {});

  cache[key] = {
    data,
    savedAt: new Date().toISOString(),
  };

  return safeWrite(CACHE_KEY, cache);
}

export function getCache(key) {
  const cache = safeRead(CACHE_KEY, {});

  return cache[key]?.data ?? null;
}

export function clearCache(key) {
  const cache = safeRead(CACHE_KEY, {});

  delete cache[key];

  return safeWrite(CACHE_KEY, cache);
}

/* =========================
   LIBRARY
========================= */

export function getLibrary() {
  return safeRead(LIBRARY_KEY, DEFAULT_LIBRARY);
}

export function saveToLibrary({ type, title, subtitle = "", content }) {
  const library = getLibrary();

  const item = {
    id: `${type}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,

    type,
    title,
    subtitle,
    content,

    createdAt: new Date().toISOString(),
  };

  library.unshift(item);

  const limitedLibrary = library.slice(0, 50);

  const saved = safeWrite(LIBRARY_KEY, limitedLibrary);

  if (saved) {
    window.dispatchEvent(new Event("libraryUpdated"));
  }

  return item;
}

export function getLibraryItem(id) {
  if (!id) return null;

  const library = getLibrary();

  return library.find((item) => item.id === id) || null;
}

export function deleteFromLibrary(id) {
  const library = getLibrary();

  const updated = library.filter((item) => item.id !== id);

  safeWrite(LIBRARY_KEY, updated);

  window.dispatchEvent(new Event("libraryUpdated"));
}

export function clearLibrary() {
  safeWrite(LIBRARY_KEY, []);

  window.dispatchEvent(new Event("libraryUpdated"));
}

/* =========================
   STATS
========================= */

export function getLibraryStats() {
  const library = getLibrary();

  return {
    total: library.length,

    translations: library.filter((item) => item.type === "translation").length,

    worksheets: library.filter((item) => item.type === "worksheet").length,

    flashcards: library.filter((item) => item.type === "flashcard").length,
  };
}
