import React, { useState, useEffect, ChangeEvent } from 'react';
import { ImageUploader, Textarea, TagsMenu } from '@components';
import { useTextareaFormAPI } from '@api';
import { useCharacterStore } from '~/store';
import { Character } from '@shared-types';

const MemoizedTextarea = React.memo(Textarea);
const MemoizedImageUploader = React.memo(ImageUploader);
const MemoizedTagsMenu = React.memo(TagsMenu);

function useDebounce(value: string, delay: number): string {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function TextareaForm() {
  const character = useCharacterStore((state) => state) as Character;
  const setCharacter = useCharacterStore((state) => state.setCharacter);

  const {
    anchorEl,
    imageBlobUrl,
    handleOpenDropdown,
    handleCloseDropdown,
    handleTagClick,
    handleChange,
    handleImageSelect,
  } = useTextareaFormAPI();

  const [tagsInput, setTagsInput] = useState<string>(character.tags || '');

  const debouncedTagsInput = useDebounce(tagsInput, 2000);

  useEffect(() => {
    setCharacter({ tags: debouncedTagsInput });
  }, [debouncedTagsInput, setCharacter]);

  const handleTagsChange = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setTagsInput(e.target.value);
  };

  return (
    <>
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
        onTagPressed={handleOpenDropdown}
      />

      <MemoizedTagsMenu
        anchorEl={anchorEl}
        onClose={handleCloseDropdown}
        onTagClick={handleTagClick}
      />
    </>
  );
}
