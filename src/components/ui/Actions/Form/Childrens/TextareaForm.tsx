import React, { useState, useEffect, ChangeEvent, useMemo } from 'react';
import {
  ImageUploader,
  Textarea,
  TagsMenu,
  useTextareaFormAPI,
  textareasByCategory,
} from '@components';
import { useCharacterStore } from '~/store';
import { Character } from '@shared-types';
import llamaTokenizer from 'llama-tokenizer-js';
import { Box, Typography } from '@mui/material';
import { uploadImage } from '~/Utility';
import { usePyrenzAlert } from '~/provider';
import debounce from 'lodash.debounce';

const MemoizedTextarea = React.memo(Textarea);
const MemoizedTagsMenu = React.memo(TagsMenu);

export function TextareaForm() {
  const character = useCharacterStore((state) => state) as Character;
  const setCharacter = useCharacterStore((state) => state.setCharacter);
  const setTokenTotal = useCharacterStore((state) => state.setTokenTotal);
  const showAlert = usePyrenzAlert();

  const {
    anchorEl,
    handleOpenDropdown,
    handleCloseDropdown,
    handleTagClick,
    handleChange,
  } = useTextareaFormAPI();

  const [tagsInputRaw, setTagsInputRaw] = useState<string>(
    (character.tags || []).join(', ')
  );

  const debouncedSetCharacter = useMemo(
    () =>
      debounce((tagsArray: string[]) => {
        setCharacter({ tags: tagsArray });
      }, 300),
    [setCharacter]
  );

  const handleTagsChange = (
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const raw = e.target.value;
    setTagsInputRaw(raw);

    const tagsArray = raw
      .split(/[\s,]+/)
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    debouncedSetCharacter(tagsArray);
  };

  const handleImageSelect = async (input: File | Blob | string | null) => {
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
  };

  useEffect(() => {
    const fieldsToCount = [
      character.name,
      character.persona,
      character.model_instructions,
      character.scenario,
      character.first_message,
      character.lorebook,
      character.attribute,
    ];

    const totalTokens = fieldsToCount.reduce((sum, field) => {
      if (!field || typeof field !== 'string') return sum;
      const tokens = llamaTokenizer.encode(field);
      return sum + tokens.length;
    }, 0);

    setTokenTotal(totalTokens);
  }, [
    character.name,
    character.persona,
    character.model_instructions,
    character.scenario,
    character.first_message,
    character.lorebook,
    setTokenTotal,
  ]);

  return (
    <>
      {textareasByCategory.map((section) => (
        <Box key={section.category} sx={{ marginBottom: 4 }}>
          <Typography variant="h5" gutterBottom>
            {section.category}
          </Typography>

          {section.fields.map((field) => {
            const value =
              field.name === 'tags'
                ? tagsInputRaw
                : (character as any)[field.name] || '';

            const onChange =
              field.name === 'tags' ? handleTagsChange : handleChange;

            return (
              <MemoizedTextarea
                key={field.name}
                name={field.name}
                value={value}
                onChange={onChange}
                label={field.label}
                aria-label={field.label}
                placeholder={field.placeholder}
                is_tag={field.is_tag}
                maxLength={field.maxLength}
                onTagPressed={
                  field.name === 'tags' ? handleOpenDropdown : undefined
                }
                showTokenizer={field.showTokenizer}
              />
            );
          })}

          {section.category === 'Basic Information' && (
            <ImageUploader
              onImageSelect={handleImageSelect}
              initialImage={character.profile_image}
            />
          )}
        </Box>
      ))}
      <MemoizedTagsMenu
        anchorEl={anchorEl}
        onClose={handleCloseDropdown}
        onTagClick={handleTagClick}
      />
    </>
  );
}
