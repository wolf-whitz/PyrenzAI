import React, { useState, useEffect, ChangeEvent } from 'react';
import { ImageUploader, Textarea, TagsMenu } from '@components';
import { useTextareaFormAPI } from '@api';
import { useCharacterStore } from '~/store';
import { Character } from '@shared-types';
import llamaTokenizer from 'llama-tokenizer-js';
import { Box, Typography } from '@mui/material';

const MemoizedTextarea = React.memo(Textarea);
const MemoizedImageUploader = React.memo(ImageUploader);
const MemoizedTagsMenu = React.memo(TagsMenu);

export function TextareaForm() {
  const character = useCharacterStore((state) => state) as Character;
  const setCharacter = useCharacterStore((state) => state.setCharacter);
  const setTokenTotal = useCharacterStore((state) => state.setTokenTotal);

  const {
    anchorEl,
    imageBlobUrl,
    handleOpenDropdown,
    handleCloseDropdown,
    handleTagClick,
    handleChange,
    handleImageSelect,
  } = useTextareaFormAPI();

  const initialTags = Array.isArray(character.tags)
    ? character.tags.join(', ')
    : typeof character.tags === 'string'
      ? character.tags
      : '';

  const [tagsInput, setTagsInput] = useState<string>(initialTags);

  const handleTagsChange = (
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const value = e.target.value;
    setTagsInput(value);

    const tagsArray = value
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    setCharacter({ tags: tagsArray });
  };

  useEffect(() => {
    const fieldsToCount = [
      character.name,
      character.description,
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
    character.description,
    character.persona,
    character.model_instructions,
    character.scenario,
    character.first_message,
    character.lorebook,
    setTokenTotal,
  ]);

  return (
    <>
      <Box sx={{ marginBottom: 4 }}>
        <Typography variant="h5" gutterBottom>
          Basic Information
        </Typography>
        <MemoizedTextarea
          name="name"
          value={character.name}
          onChange={handleChange}
          label="Name"
          aria-label="Name"
          placeholder="Enter character name e.g., John Doe"
          maxLength={50}
        />
        <MemoizedImageUploader
          onImageSelect={handleImageSelect}
          initialImage={imageBlobUrl}
        />
      </Box>

      <Box sx={{ marginBottom: 4 }}>
        <Typography variant="h5" gutterBottom>
          Character Details
        </Typography>
        <MemoizedTextarea
          name="description"
          value={character.description}
          onChange={handleChange}
          label="Description"
          aria-label="Description"
          placeholder="Describe the character e.g., A brave knight with a mysterious past"
          showTokenizer
        />
        <MemoizedTextarea
          name="persona"
          value={character.persona}
          onChange={handleChange}
          label="Persona"
          aria-label="Persona"
          placeholder="Define the character's persona e.g., Adventurous and wise"
          showTokenizer
        />
        <MemoizedTextarea
          name="scenario"
          value={character.scenario}
          onChange={handleChange}
          label="Scenario"
          aria-label="Scenario"
          placeholder="Describe a scenario involving the character e.g., Saving a village from a dragon"
          showTokenizer
        />
      </Box>

      <Box sx={{ marginBottom: 4 }}>
        <Typography variant="h5" gutterBottom>
          Interaction Settings
        </Typography>
        <MemoizedTextarea
          name="model_instructions"
          value={character.model_instructions}
          onChange={handleChange}
          label="Model Instructions"
          aria-label="Model Instructions"
          placeholder="Provide instructions for the model e.g., The character should always seek justice"
          showTokenizer
        />
        <MemoizedTextarea
          name="first_message"
          value={character.first_message}
          onChange={handleChange}
          label="First Message"
          aria-label="First Message"
          placeholder="What is the first message the character says? e.g., Hello, traveler! What brings you here?"
          showTokenizer
        />
      </Box>

      <Box sx={{ marginBottom: 4 }}>
        <Typography variant="h5" gutterBottom>
          Additional Information
        </Typography>
        <MemoizedTextarea
          name="lorebook"
          value={character.lorebook}
          onChange={handleChange}
          label="Lorebook"
          aria-label="Lorebook"
          placeholder="Enter lorebook details for the character e.g., Background story, world details, etc."
          showTokenizer
        />
        <MemoizedTextarea
          name="tags"
          value={tagsInput}
          onChange={handleTagsChange}
          label="Tags"
          aria-label="Tags"
          placeholder="Add tags separated by commas e.g., hero, knight, adventure"
          is_tag
          maxLength={150}
          onTagPressed={handleOpenDropdown}
        />
      </Box>

      <MemoizedTagsMenu
        anchorEl={anchorEl}
        onClose={handleCloseDropdown}
        onTagClick={handleTagClick}
      />
    </>
  );
}
``