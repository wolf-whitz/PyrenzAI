import React, { useState, useEffect, ChangeEvent } from 'react';
import { ImageUploader, Textarea, TagsMenu } from '@components';
import { useTextareaFormAPI } from '@api';
import { useCharacterStore } from '~/store';
import { Character } from '@shared-types';
import llamaTokenizer from 'llama-tokenizer-js';
import { Box, Typography } from '@mui/material';
import { supabase } from '~/Utility/supabaseClient';
import { v4 as uuidv4 } from 'uuid';
import * as Sentry from '@sentry/react';
import { textareasByCategory } from '@components';

const MemoizedTextarea = React.memo(Textarea);
const MemoizedTagsMenu = React.memo(TagsMenu);

async function uploadImage(file: File): Promise<string | null> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `character-image/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('character-image')
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data: urlData } = supabase
      .storage
      .from('character-image')
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    Sentry.captureException(error);
    return null;
  }
}

export function TextareaForm() {
  const character = useCharacterStore((state) => state) as Character;
  const setCharacter = useCharacterStore((state) => state.setCharacter);
  const setTokenTotal = useCharacterStore((state) => state.setTokenTotal);

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
    const publicUrl = await uploadImage(file);
    if (publicUrl) {
      setCharacter({ profile_image: publicUrl });
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
