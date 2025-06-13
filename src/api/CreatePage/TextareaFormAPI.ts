import { useState, useEffect, useRef, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '~/Utility/supabaseClient';
import { useCharacterStore } from '~/store';

export const useTextareaFormAPI = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [imageBlobUrl, setImageBlobUrl] = useState<string | null>(null);
  const isUploading = useRef(false);

  const character = useCharacterStore((state) => state);
  const setCharacter = useCharacterStore((state) => state.setCharacter);

  useEffect(() => {
    if (!isUploading.current && character.profile_image) {
      setImageBlobUrl(character.profile_image);
    }
  }, [character.profile_image]);

  const handleOpenDropdown = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleCloseDropdown = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleTagClick = useCallback((tag: string) => {
    const tagsArray = character.tags ? JSON.parse(character.tags) : [];
    const newTags = [...tagsArray, tag];
    setCharacter({ tags: JSON.stringify(newTags) });
    handleCloseDropdown();
  }, [character.tags, setCharacter]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      const { name, value, type } = e.target;
      const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;

      if (name === 'tags') {
        const tagsArray = value.split(',').map((tag) => tag.trim());
        setCharacter({ [name]: JSON.stringify(tagsArray) });
      } else {
        setCharacter({ [name]: type === 'checkbox' ? checked : value });
      }
    },
    [setCharacter]
  );

  const handleImageSelect = useCallback(async (file: File | null) => {
    if (file) {
      const blobUrl = URL.createObjectURL(file);
      setImageBlobUrl(blobUrl);
      isUploading.current = true;

      const fileName = `character-image/${uuidv4()}-${file.name}`;
      const { error } = await supabase.storage
        .from('character-image')
        .upload(fileName, file);

      if (error) {
        console.error('Error uploading image:', error);
        isUploading.current = false;
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from('character-image')
        .getPublicUrl(fileName);

      if (publicUrlData) {
        setCharacter({ profile_image: publicUrlData.publicUrl });
      }
      isUploading.current = false;
    }
  }, [setCharacter]);

  return {
    anchorEl,
    imageBlobUrl,
    handleOpenDropdown,
    handleCloseDropdown,
    handleTagClick,
    handleChange,
    handleImageSelect,
  };
};
