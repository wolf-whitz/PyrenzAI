import { useState, useCallback, useMemo, useEffect } from 'react';
import { useCharacterStore } from '~/store';
import { createDebouncedTokenizer, countTokens, uploadImage } from '~/Utility';
import { usePyrenzAlert } from '~/provider';
import { textareasByCategory } from '@components';
import type { CharacterPayload } from '@shared-types';

export const useTextareaFormAPI = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [imageBlobUrl, setImageBlobUrl] = useState<string | null>(null);

  const character = useCharacterStore((s) => s as CharacterPayload);
  const setCharacter = useCharacterStore((s) => s.setCharacter);
  const setTokenTotal = useCharacterStore((s) => s.setTokenTotal);
  const setPermanentTokens = useCharacterStore((s) => s.setPermanentTokens);
  const setTemporaryTokens = useCharacterStore((s) => s.setTemporaryTokens);
  const setIsCounting = useCharacterStore((s) => s.setIsCounting);

  const showAlert = usePyrenzAlert();

  useEffect(() => {
    if (character.profile_image && !imageBlobUrl) setImageBlobUrl(character.profile_image);
  }, [character.profile_image, imageBlobUrl]);

  const handleOpenDropdown = useCallback((e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget), []);
  const handleCloseDropdown = useCallback(() => setAnchorEl(null), []);

  const handleTagClick = useCallback(
    (tag: string) => {
      const tagsArray = Array.isArray(character.tags) ? character.tags : [];
      setCharacter({ tags: [...tagsArray, tag] });
      handleCloseDropdown();
    },
    [character.tags, setCharacter, handleCloseDropdown]
  );

  const { max_alternatives: maxAlternatives = 1, is_alternatives: isAlternatives = false } =
    textareasByCategory.flatMap((cat) => cat.fields).find((f) => f.name === 'first_message') ?? {};

  const [alternativeMessages, setAlternativeMessages] = useState<string[]>(() =>
    Array.isArray(character.first_message) && character.first_message.length > 0 ? character.first_message : ['']
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const currentMessage = alternativeMessages[currentIndex] ?? '';
  const currentTokenCount = countTokens(currentMessage);

  const updateTokenCounts = useCallback(
    (updatedCharacter: CharacterPayload, updatedAlternatives: string[]) => {
      const altTokens = updatedAlternatives.reduce((sum, msg) => sum + countTokens(msg), 0);
      let permanent = 0;
      let temporary = altTokens;

      textareasByCategory.flatMap((cat) => cat.fields).forEach((field) => {
        if (!field.showTokenizer) return;
        const value = (updatedCharacter as any)[field.name];
        const values = Array.isArray(value) ? value : [value];
        const fieldCount = values.reduce(
          (sum, v) => (typeof v === 'string' ? sum + countTokens(v) : sum),
          0
        );
        if (field.is_permanent) permanent += fieldCount;
        else temporary += fieldCount;
      });

      const total = permanent + temporary;
      setPermanentTokens(permanent);
      setTemporaryTokens(temporary);
      setTokenTotal(total);
      setIsCounting(false);
    },
    [setTokenTotal, setPermanentTokens, setTemporaryTokens, setIsCounting]
  );

  const debouncedUpdateTokenCounts = useMemo(
    () => createDebouncedTokenizer((count) => updateTokenCounts(character, alternativeMessages), 500),
    [updateTokenCounts, character, alternativeMessages]
  );

  const updateAlternativeMessage = useCallback(
    (newValue: string, index = currentIndex) => {
      setAlternativeMessages((prev) => {
        const updated = [...prev];
        updated[index] = newValue;
        setCharacter({ first_message: updated });
        setIsCounting(true);
        debouncedUpdateTokenCounts.cancel();
        debouncedUpdateTokenCounts(newValue);
        return updated;
      });
    },
    [currentIndex, setCharacter, debouncedUpdateTokenCounts, setIsCounting]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      const { name, value: rawValue, type, checked } = e.target as HTMLInputElement;
      const value = type === 'checkbox' ? checked : rawValue;

      if (name === 'tags') {
        const tagsArray = (value as string)
          .split(/[\s,]+/)
          .map((t) => t.trim())
          .filter(Boolean);
        setCharacter({ tags: tagsArray });
      } else if (name === 'first_message') {
        updateAlternativeMessage(value as string, 0);
      } else {
        const updatedCharacter = { ...character, [name]: value };
        setCharacter(updatedCharacter);
        setIsCounting(true);
        debouncedUpdateTokenCounts.cancel();
        debouncedUpdateTokenCounts(value as string);
      }
    },
    [updateAlternativeMessage, setCharacter, character, debouncedUpdateTokenCounts, setIsCounting]
  );

  const handleImageSelect = useCallback(
    async (input: File | Blob | string | null) => {
      if (!input) return;
      if (typeof input === 'string') return setCharacter({ profile_image: input });
      const { url, error } = await uploadImage('character-image', input);
      if (error) showAlert(error, 'alert');
      else if (url) setCharacter({ profile_image: url });
    },
    [setCharacter, showAlert]
  );

  const clearAllCategories = useCallback(() => {
    setAlternativeMessages(['']);
    setCharacter({} as CharacterPayload);
    setIsCounting(true);
    debouncedUpdateTokenCounts.cancel();
    debouncedUpdateTokenCounts('');
  }, [setCharacter, setIsCounting, debouncedUpdateTokenCounts]);

  useEffect(() => {
    setIsCounting(true);
    debouncedUpdateTokenCounts(currentMessage);
  }, []);

  return {
    anchorEl,
    imageBlobUrl,
    handleOpenDropdown,
    handleCloseDropdown,
    handleTagClick,
    handleChange,
    handleImageSelect,
    alternativeMessages,
    updateAlternativeMessage,
    currentIndex,
    setCurrentIndex,
    maxAlternatives,
    isAlternatives,
    currentMessage,
    currentTokenCount,
    clearAllCategories,
  };
};
