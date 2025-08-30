import { useState, useRef, useEffect } from 'react';
import { SelectChangeEvent } from '@mui/material';
import { Accept } from 'react-dropzone';
import { useUserStore } from '~/store';
import JSZip from 'jszip';

export type ThemeMeta = {
  id: string;
  name: string;
  description?: string;
  creator?: string;
  folder: string;
  is_selected_theme?: boolean;
};

export function useCustomizationAPI() {
  const [selectedTheme, setSelectedTheme] = useState<string>('');
  const [themeInfo, setThemeInfo] = useState<ThemeMeta | null>(null);
  const [themes, setThemes] = useState<ThemeMeta[]>([]);
  const [error, setError] = useState<string | null>(null);
  const workerRef = useRef<Worker | null>(null);
  const setUserTheme = useUserStore((state) => state.setTheme);

  useEffect(() => {
    workerRef.current = new Worker('/worker/RegistratorTheme.js');

    const handleWorkerMessage = (event: MessageEvent) => {
      const { type, registration, allThemes, error } = event.data;

      if (type === 'theme-checked') {
        setThemeInfo(registration || null);
        setThemes((prev) => {
          if (!registration) return prev;
          const exists = prev.find((t) => t.id === registration.id);
          if (exists)
            return prev.map((t) =>
              t.id === registration.id ? registration : t
            );
          return [...prev, registration];
        });
      } else if (type === 'themes-list') {
        setThemes(allThemes || []);
      } else if (type === 'error') {
        setThemeInfo(null);
        setError(error);
      }
    };

    workerRef.current.addEventListener('message', handleWorkerMessage);
    workerRef.current.postMessage({ type: 'list-themes' });

    return () => {
      workerRef.current?.removeEventListener('message', handleWorkerMessage);
      workerRef.current?.terminate();
    };
  }, []);

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const folder = event.target.value;
    setSelectedTheme(folder);
    const theme = themes.find((t) => t.folder === folder);
    if (theme && workerRef.current) {
      workerRef.current.postMessage({
        type: 'check-theme',
        folder,
        registration: theme,
      });
    }
  };

  const handleSubmit = () => {
    if (!selectedTheme) {
      setError('No theme selected');
      return;
    }
    const updatedThemes = themes.map((t) => ({
      ...t,
      is_selected_theme: t.folder === selectedTheme,
    }));
    setThemes(updatedThemes);
    const selected =
      updatedThemes.find((t) => t.folder === selectedTheme) || null;
    setThemeInfo(selected);
    if (selected) {
      setUserTheme(selected.id);
      window.location.reload();
    }
  };

  const processZip = async (file: File) => {
    const zip = await JSZip.loadAsync(file);
    let regFile: JSZip.JSZipObject | undefined;
    zip.forEach((relativePath, zipEntry) => {
      if (zipEntry.name.toLowerCase().endsWith('registration.json'))
        regFile = zipEntry;
    });
    if (!regFile) {
      setError('registration.json not found in zip');
      return;
    }
    const registrationText = await regFile.async('string');
    let registration;
    try {
      registration = JSON.parse(registrationText);
    } catch {
      setError('Failed to parse registration.json');
      return;
    }
    const folderName = regFile.name.split('/')[0];
    setSelectedTheme(folderName);
    if (workerRef.current) {
      workerRef.current.postMessage({
        type: 'check-theme',
        folder: folderName,
        registration,
      });
    }
  };

  const onDrop = async (acceptedFiles: File[]) => {
    const zipFile = acceptedFiles.find((f) =>
      f.name.toLowerCase().endsWith('.zip')
    );
    if (zipFile) {
      await processZip(zipFile);
    } else {
      setError('Only ZIP files are accepted.');
    }
  };

  const accept: Accept = {
    'application/zip': ['.zip'],
  };

  return {
    selectedTheme,
    themeInfo,
    themes,
    error,
    handleSelectChange,
    handleSubmit,
    onDrop,
    accept,
  };
}
