import { useState, useEffect, useCallback } from 'react';
import { useCharacterStore } from '~/store';

export const useTextareaFormAPI = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [imageBlobUrl, setImageBlobUrl] = useState<string | null>(null);

  const character = useCharacterStore((state) => state);
  const setCharacter = useCharacterStore((state) => state.setCharacter);

  useEffect(() => {
    if (character.profile_image) {
      setImageBlobUrl(character.profile_image);
    }
  }, [character.profile_image]);

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
    [character.tags, setCharacter]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      const { name, value, type } = e.target;
      const checked =
        type === 'checkbox'
          ? (e.target as HTMLInputElement).checked
          : undefined;

      if (name === 'tags') {
        const tagsArray = value.split(',').map((tag) => tag.trim());
        setCharacter({ [name]: tagsArray });
      } else {
        setCharacter({ [name]: type === 'checkbox' ? checked : value });
      }
    },
    [setCharacter]
  );

  return {
    anchorEl,
    imageBlobUrl,
    handleOpenDropdown,
    handleCloseDropdown,
    handleTagClick,
    handleChange,
  };
};
