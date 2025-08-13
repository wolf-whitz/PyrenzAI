import { useState, useEffect, useCallback, useMemo } from 'react';
import { useCharacterStore } from '~/store';
import debounce from 'lodash.debounce';
import { uploadImage, applyTokenizer } from '~/Utility';
import { usePyrenzAlert } from '~/provider';
import { textareasByCategory } from '@components';
import { Character } from '@shared-types';

export const useTextareaFormAPI = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [imageBlobUrl, setImageBlobUrl] = useState<string | null>(null);
  const character = useCharacterStore((state) => state) as Character;
  const setCharacter = useCharacterStore((state) => state.setCharacter);
  const setTokenTotal = useCharacterStore((state) => state.setTokenTotal);
  const showAlert = usePyrenzAlert();

  useEffect(() => {
    if (character.profile_image) {
      setImageBlobUrl(character.profile_image);
    }
  }, [character.profile_image]);

  const debouncedSetTags = useMemo(
    () =>
      debounce((tagsArray: string[]) => {
        setCharacter({ tags: tagsArray });
      }, 500),
    [setCharacter]
  );

  useEffect(() => {
    return () => {
      debouncedSetTags.cancel();
    };
  }, [debouncedSetTags]);

  const handleOpenDropdown = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
    },
    []
  );

  const handleCloseDropdown = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleTagClick = useCallback(
    (tag: string) => {
      try {
        const tagsArray = Array.isArray(character.tags) ? character.tags : [];
        const newTags = [...tagsArray, tag];
        setCharacter({ tags: newTags });
      } catch (error) {
        console.error('Error handling tag click:', error);
      }
      handleCloseDropdown();
    },
    [character.tags, setCharacter, handleCloseDropdown]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      const { name, value, type } = e.target;
      const checked =
        type === 'checkbox'
          ? (e.target as HTMLInputElement).checked
          : undefined;
      if (name === 'tags') {
        const tagsArray = value
          .split(/[\s,]+/)
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0);
        debouncedSetTags(tagsArray);
      } else {
        setCharacter({ [name]: type === 'checkbox' ? checked : value });
      }
    },
    [setCharacter, debouncedSetTags]
  );

  const handleImageSelect = useCallback(
    async (input: File | Blob | string | null) => {
      if (!input) return;
      if (typeof input === 'string') {
        setCharacter({ profile_image: input });
        return;
      }
      const { url, error } = await uploadImage('character-image', input);
      if (error) {
        showAlert(error, 'alert');
      } else if (url) {
        setCharacter({ profile_image: url });
      }
    },
    [setCharacter, showAlert]
  );

  const tokenCountFields: (keyof Character)[] = [
    'name',
    'persona',
    'model_instructions',
    'scenario',
    'lorebook',
    'attribute',
  ];

  useEffect(() => {
    let totalTokens = tokenCountFields.reduce((sum, key) => {
      const field = character[key];
      if (!field || typeof field !== 'string') return sum;
      const tokens = applyTokenizer(field);
      return sum + tokens.length;
    }, 0);
    if (character.first_message && Array.isArray(character.first_message)) {
      character.first_message.forEach((message) => {
        const tokens = applyTokenizer(message);
        totalTokens += tokens.length;
      });
    }
    setTokenTotal(totalTokens);
  }, [...tokenCountFields.map((key) => character[key]), character.first_message, setTokenTotal]);

  const firstMessageField = textareasByCategory
    .flatMap((cat) => cat.fields)
    .find((f) => f.name === 'first_message');
  const maxAlternatives = firstMessageField?.max_alternatives ?? 1;
  const isAlternatives = firstMessageField?.is_alternatives ?? false;
  const [alternativeMessages, setAlternativeMessages] = useState<string[]>(() => {
    const existing = character.first_message;
    if (Array.isArray(existing) && existing.length > 0) return existing;
    return [''];
  });
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (isAlternatives) {
      setCharacter({
        first_message: alternativeMessages,
      });
    }
  }, [alternativeMessages, isAlternatives, setCharacter]);

  return {
    anchorEl,
    imageBlobUrl,
    handleOpenDropdown,
    handleCloseDropdown,
    handleTagClick,
    handleChange,
    handleImageSelect,
    alternativeMessages,
    setAlternativeMessages,
    currentIndex,
    setCurrentIndex,
    maxAlternatives,
    isAlternatives,
  };
};
