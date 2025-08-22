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
    if (character.profile_image && !imageBlobUrl) {
      setImageBlobUrl(character.profile_image);
    }
  }, [character.profile_image, imageBlobUrl]);

  const handleOpenDropdown = useCallback(
    (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget),
    []
  );
  const handleCloseDropdown = useCallback(() => setAnchorEl(null), []);

  const handleTagsUpdate = useCallback(
    (tags: string[]) => {
      setCharacter({ tags });
    },
    [setCharacter]
  );

  const handleTagClick = useCallback(
    (tag: string, syncRaw?: (tags: string[]) => void) => {
      const tagsArray = Array.isArray(character.tags) ? character.tags : [];
      const updated = [...tagsArray, tag];
      setCharacter({ tags: updated });
      if (syncRaw) syncRaw(updated);
      handleCloseDropdown();
    },
    [character.tags, setCharacter, handleCloseDropdown]
  );

  const {
    max_alternatives: maxAlternatives = 1,
    is_alternatives: isAlternatives = false,
  } =
    textareasByCategory
      .flatMap((cat) => cat.fields)
      .find((f) => f.name === 'first_message') ?? {};

  const [alternativeMessages, setAlternativeMessages] = useState<string[]>(() =>
    Array.isArray(character.first_message) && character.first_message.length > 0
      ? character.first_message
      : ['']
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const currentMessage = alternativeMessages[currentIndex] ?? '';
  const currentTokenCount = countTokens(currentMessage);

  const updateTokenCounts = useCallback(
    (updatedCharacter: CharacterPayload, updatedAlternatives: string[]) => {
      const altTokens = updatedAlternatives.reduce(
        (sum, msg) => sum + countTokens(msg),
        0
      );
      let permanent = 0;
      let temporary = altTokens;

      textareasByCategory
        .flatMap((cat) => cat.fields)
        .forEach((field) => {
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
    () =>
      createDebouncedTokenizer((total) => {
        updateTokenCounts(
          { ...character, first_message: alternativeMessages },
          alternativeMessages
        );
      }, 500),
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
        debouncedUpdateTokenCounts(updated);
        return updated;
      });
    },
    [currentIndex, setCharacter, debouncedUpdateTokenCounts, setIsCounting]
  );

  const removeAlternative = useCallback(
    (index: number) => {
      setAlternativeMessages((prev) => {
        if (prev.length <= 1) return prev;
        const updated = prev.filter((_, i) => i !== index);
        setCharacter({ first_message: updated });
        setIsCounting(true);
        debouncedUpdateTokenCounts.cancel();
        debouncedUpdateTokenCounts(updated);
        return updated;
      });
    },
    [setCharacter, debouncedUpdateTokenCounts, setIsCounting]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      const target = e.target;
      const { name, type } = target;

      if (name === 'first_message') {
        updateAlternativeMessage(target.value, currentIndex);
      } else {
        let value: string | boolean = target.value;
        if (type === 'checkbox') {
          value = (target as HTMLInputElement).checked;
        }

        const updatedCharacter = { ...character, [name]: value };
        setCharacter(updatedCharacter);
        setIsCounting(true);
        debouncedUpdateTokenCounts.cancel();
        debouncedUpdateTokenCounts(alternativeMessages);
      }
    },
    [
      updateAlternativeMessage,
      setCharacter,
      character,
      debouncedUpdateTokenCounts,
      setIsCounting,
      currentIndex,
      alternativeMessages,
    ]
  );

  const handleImageSelect = useCallback(
    async (input: File | Blob | string | null) => {
      if (!input) return;
      if (typeof input === 'string') {
        return setCharacter({ profile_image: input });
      }
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
    debouncedUpdateTokenCounts(['']);
  }, [setCharacter, setIsCounting, debouncedUpdateTokenCounts]);

  useEffect(() => {
    setIsCounting(true);
    debouncedUpdateTokenCounts(alternativeMessages);
  }, []);

  return {
    anchorEl,
    imageBlobUrl,
    handleOpenDropdown,
    handleCloseDropdown,
    handleTagClick,
    handleChange,
    handleTagsUpdate,
    handleImageSelect,
    alternativeMessages,
    updateAlternativeMessage,
    removeAlternative,
    currentIndex,
    setCurrentIndex,
    maxAlternatives,
    isAlternatives,
    currentMessage,
    currentTokenCount,
    clearAllCategories,
  };
};
