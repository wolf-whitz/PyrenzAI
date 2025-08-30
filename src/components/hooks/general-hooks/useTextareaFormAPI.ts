import { useState, useCallback, useMemo, useEffect } from 'react';
import { useCharacterStore } from '~/store';
import { createDebouncedTokenizer, countTokens, uploadImage } from '~/utility';
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

  const [alternativeMessages, setAlternativeMessages] = useState<string[]>(
    () =>
      Array.isArray(character.first_message) &&
      character.first_message.length > 0
        ? character.first_message
        : ['']
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const currentMessage = alternativeMessages[currentIndex] ?? '';
  const currentTokenCount = countTokens(currentMessage);

  const updateTokenCounts = useCallback(
    (updatedCharacter: CharacterPayload, updatedAlternatives: string[]) => {
      let permanent = 0;
      let temporary = 0;

      textareasByCategory
        .flatMap((cat) => cat.fields)
        .forEach((field) => {
          if (!field.showTokenizer) return;

          let fieldCount = 0;

          if (field.name === 'first_message') {
            fieldCount = updatedAlternatives.reduce(
              (sum, msg) => sum + countTokens(msg || ''),
              0
            );
          } else {
            const value = (updatedCharacter as any)[field.name];

            if (value !== undefined && value !== null) {
              if (Array.isArray(value)) {
                fieldCount = value.reduce(
                  (sum, v) => sum + countTokens(String(v || '')),
                  0
                );
              } else {
                fieldCount = countTokens(String(value || ''));
              }
            }
          }

          if (field.is_permanent === true) {
            permanent += fieldCount;
          } else {
            temporary += fieldCount;
          }
        });

      const total = permanent + temporary;
      setPermanentTokens(permanent);
      setTemporaryTokens(temporary);
      setTokenTotal(total);
    },
    [setTokenTotal, setPermanentTokens, setTemporaryTokens]
  );

  const debouncedUpdateTokenCounts = useMemo(() => {
    let timeoutId: NodeJS.Timeout;
    return {
      call: (
        updatedAlternatives: string[],
        updatedCharacter?: CharacterPayload
      ) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          const charToUse = updatedCharacter || character;
          updateTokenCounts(
            { ...charToUse, first_message: updatedAlternatives },
            updatedAlternatives
          );
        }, 300);
      },
      cancel: () => clearTimeout(timeoutId),
    };
  }, [updateTokenCounts]);

  const updateAlternativeMessage = useCallback(
    (newValue: string, index = currentIndex) => {
      const updatedMessages = [...alternativeMessages];
      updatedMessages[index] = newValue;

      setAlternativeMessages(updatedMessages);
      setCharacter((prev) => ({
        ...prev,
        first_message: updatedMessages,
      }));

      debouncedUpdateTokenCounts.cancel();
      debouncedUpdateTokenCounts.call(updatedMessages);
    },
    [
      currentIndex,
      alternativeMessages,
      setCharacter,
      debouncedUpdateTokenCounts,
    ]
  );

  const removeAlternative = useCallback(
    (index: number) => {
      setAlternativeMessages((prev) => {
        if (prev.length <= 1) return prev;
        const updated = prev.filter((_, i) => i !== index);
        setCharacter({ first_message: updated });
        debouncedUpdateTokenCounts.cancel();
        debouncedUpdateTokenCounts.call(updated);
        return updated;
      });
    },
    [setCharacter, debouncedUpdateTokenCounts]
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

        setCharacter((prev) => {
          const updatedCharacter = { ...prev, [name]: value };

          const field = textareasByCategory
            .flatMap((cat) => cat.fields)
            .find((f) => f.name === name);

          if (field?.showTokenizer) {
            debouncedUpdateTokenCounts.cancel();
            debouncedUpdateTokenCounts.call(
              alternativeMessages,
              updatedCharacter
            );
          }

          return updatedCharacter;
        });
      }
    },
    [
      updateAlternativeMessage,
      setCharacter,
      debouncedUpdateTokenCounts,
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
    debouncedUpdateTokenCounts.cancel();
    debouncedUpdateTokenCounts.call(['']);
  }, [setCharacter, debouncedUpdateTokenCounts]);

  useEffect(() => {
    const timer = setTimeout(() => {
      updateTokenCounts(character, alternativeMessages);
    }, 100);

    return () => clearTimeout(timer);
  }, [updateTokenCounts, character, alternativeMessages]);

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
