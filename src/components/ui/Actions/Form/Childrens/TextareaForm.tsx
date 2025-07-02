import React, { useState, useEffect, ChangeEvent } from 'react';
import { ImageUploader, Textarea, TagsMenu } from '@components';
import { useTextareaFormAPI } from '@api';
import { useCharacterStore } from '~/store';
import { Character } from '@shared-types';
import llamaTokenizer from 'llama-tokenizer-js';
import { Box, Typography } from '@mui/material';
import { uploadImage } from '~/Utility/UploadImage';
import { textareasByCategory } from '@components';
import { usePyrenzAlert } from '~/provider';

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

  const [tagsInput, setTagsInput] = useState<string[]>(
    character.tags || []
  );

  const handleImageSelect = async (file: File | null) => {
    if (!file) return;
    const { url, error } = await uploadImage('character-image', file);
    if (error) {
      showAlert(error, 'alert');
    } else if (url) {
      setCharacter({ profile_image: url });
    }
  };

  const handleTagsChange = (
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const value = e.target.value;
    const tagsArray = value
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    setTagsInput(tagsArray);
    setCharacter({ tags: tagsArray });
  };

  useEffect(() => {
    const fieldsToCount = [
      character.name,
      character.persona,
      character.model_instructions,
      character.scenario,
      character.first_message,
      character.lorebook,
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
                ? tagsInput.join(', ')
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
