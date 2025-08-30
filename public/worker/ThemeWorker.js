self.addEventListener('message', async (event) => {
  const { type, folder, themeId } = event.data;

  try {
    if (type === 'add-theme') {
      const theme = await loadThemeFromFolder(folder);
      await saveThemeToDB(theme);
      self.postMessage({ type: 'theme-added', theme });
    } else if (type === 'list-themes') {
      const allThemes = await getAllThemesFromDB();
      self.postMessage({ type: 'themes-list', allThemes });
    } else if (type === 'load-theme') {
      const theme = await getThemeFromDB(themeId);
      if (!theme) throw new Error(`Theme ${themeId} not found`);

      const allThemes = await getAllThemesFromDB();
      const db = await getDB();
      const tx = db.transaction('themes', 'readwrite');
      const store = tx.objectStore('themes');
      allThemes.forEach((t) => {
        t.is_theme_selected = t.id === themeId;
        store.put(t);
      });

      self.postMessage({
        type: 'theme-loaded',
        theme,
        themeData: theme.themeData,
        cssFiles: theme.cssFiles,
      });
    }
  } catch (err) {
    self.postMessage({ type: 'error', error: err.message });
  }
});

async function getDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('pyrenzai-themes', 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains('themes'))
        db.createObjectStore('themes', { keyPath: 'id' });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function saveThemeToDB(theme) {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('themes', 'readwrite');
    const store = tx.objectStore('themes');
    const request = store.put(theme);
    request.onsuccess = () => resolve(true);
    request.onerror = () => reject(request.error);
  });
}

async function getThemeFromDB(themeId) {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('themes', 'readonly');
    const store = tx.objectStore('themes');
    const request = store.get(themeId);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function getAllThemesFromDB() {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('themes', 'readonly');
    const store = tx.objectStore('themes');
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function loadThemeFromFolder(folder) {
  let registration;
  try {
    registration = await fetch(`/theme/${folder}/registration.json`).then(
      (r) => {
        if (!r.ok) throw new Error(`Missing registration.json in ${folder}`);
        return r.json();
      }
    );
  } catch (err) {
    throw new Error(
      `Failed to fetch registration.json for ${folder}: ${err.message}`
    );
  }

  const themeData = {};
  if (Array.isArray(registration.themePath)) {
    for (const file of registration.themePath) {
      try {
        const json = await fetch(`/theme/${folder}/${file}`).then((r) =>
          r.json()
        );
        Object.assign(themeData, json);
      } catch (err) {}
    }
  }

  const cssFiles = [];
  if (Array.isArray(registration.include)) {
    registration.include.forEach((file) => {
      cssFiles.push(`/theme/${folder}/${file}`);
    });
  }

  return {
    id: registration.id,
    name: registration.name,
    description: registration.description || '',
    creator: registration.creator || 'Unknown',
    folder,
    themeData,
    cssFiles,
    is_theme_selected: false,
  };
}

async function initializeThemes() {
  let registry;
  try {
    registry = await fetch('/theme/registration.json').then((r) => r.json());
  } catch (err) {
    self.postMessage({
      type: 'error',
      error: `Failed to load /theme/registration.json: ${err.message}`,
    });
    return;
  }

  if (!Array.isArray(registry.themes)) return;

  for (const t of registry.themes) {
    try {
      const theme = await loadThemeFromFolder(t.folder);
      await saveThemeToDB(theme);
    } catch (err) {
      self.postMessage({
        type: 'error',
        error: `Failed to initialize theme ${t.folder}: ${err.message}`,
      });
    }
  }

  self.postMessage({ type: 'themes-initialized' });
}

initializeThemes();
