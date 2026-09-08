const STORAGE_KEY = "teacher_analytics";

const DEFAULT_ANALYTICS = {
  totalTranslations: 0,
  worksheetsGenerated: 0,
  flashcardsGenerated: 0,
  totalActivities: 0,
  recentActivities: [],
};

export function getAnalytics() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return { ...DEFAULT_ANALYTICS };
    }

    const data = JSON.parse(saved);

    return {
      ...DEFAULT_ANALYTICS,
      ...data,
      recentActivities: Array.isArray(data.recentActivities)
        ? data.recentActivities
        : [],
    };
  } catch (error) {
    console.error("Analytics read error:", error);
    return { ...DEFAULT_ANALYTICS };
  }
}

function saveAnalytics(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function recordActivity({ type, title, details = "" }) {
  const analytics = getAnalytics();

  if (type === "translation") {
    analytics.totalTranslations += 1;
  }

  if (type === "worksheet") {
    analytics.worksheetsGenerated += 1;
  }

  if (type === "flashcard") {
    analytics.flashcardsGenerated += 1;
  }

  analytics.totalActivities += 1;

  const activity = {
    id: Date.now(),
    type,
    title,
    details,
    timestamp: new Date().toISOString(),
  };

  analytics.recentActivities.unshift(activity);

  analytics.recentActivities = analytics.recentActivities.slice(0, 10);

  saveAnalytics(analytics);

  window.dispatchEvent(new Event("analyticsUpdated"));

  return analytics;
}

export function clearAnalytics() {
  localStorage.removeItem(STORAGE_KEY);
}

export function formatActivityTime(timestamp) {
  return new Date(timestamp).toLocaleString();
}
