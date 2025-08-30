import { createTheme } from '@mui/material/styles';
import { componentOverrides } from '../overrides/componentOverrides';
import { useUserStore } from '~/store';

let worker: Worker | null = null;
let workerReady = false;

function initWorker() {
  if (!worker) {
    worker = new Worker('/worker/ThemeWorker.js');
    worker.onmessage = (event: MessageEvent) => {
      if (event.data.type === 'themes-initialized') {
        workerReady = true;
      }
    };
  }
  return worker;
}

export async function GetTheme(themeId?: string) {
  const currentThemeId = useUserStore.getState().currentThemeId;
  const themeAttr = document.documentElement.getAttribute('data-mui-theme');
  const selectedThemeId =
    themeId || currentThemeId || themeAttr || 'theme-dark';

  const worker = initWorker();

  await new Promise<void>((resolve) => {
    if (workerReady) return resolve();
    const checkReady = (event: MessageEvent) => {
      if (event.data.type === 'themes-initialized') {
        resolve();
        worker.removeEventListener('message', checkReady);
      }
    };
    worker.addEventListener('message', checkReady);
  });

  return new Promise((resolve, reject) => {
    const handler = (event: MessageEvent) => {
      const { type, theme, error } = event.data;

      if (type === 'theme-loaded') {
        if (theme?.cssFiles && Array.isArray(theme.cssFiles)) {
          theme.cssFiles.forEach((href: string) => injectCSS(href));
        }

        if (theme) theme.is_theme_selected = true;

        resolve(
          createTheme({
            ...theme?.themeData,
            components: {
              ...componentOverrides,
            },
          })
        );
        worker.removeEventListener('message', handler);
      }

      if (type === 'error') {
        reject(error);
        worker.removeEventListener('message', handler);
      }
    };

    worker.addEventListener('message', handler);
    worker.postMessage({ type: 'load-theme', themeId: selectedThemeId });
  });
}

function injectCSS(href: string) {
  if (!document.querySelector(`link[href="${href}"]`)) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  }
}
