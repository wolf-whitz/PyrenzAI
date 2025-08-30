import React, {
  useState,
  useEffect,
  ChangeEvent,
  useMemo,
  useCallback,
} from 'react';
import {
  ImageUploader,
  useTextareaFormAPI,
  textareasByCategory,
  FirstMessageAlternatives,
  MemoizedTextarea,
  MemoizedTagsMenu,
} from '@components';
import { useCharacterStore } from '~/store';
import { Character } from '@shared-types';
import { Box, Typography } from '@mui/material';

export const TextareaForm = React.memo(() => {
  const character = useCharacterStore((state) => state) as Character;

  const {
    anchorEl,
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
  } = useTextareaFormAPI();

  const [tagsInputRaw, setTagsInputRaw] = useState<string>(
    (character.tags || []).join('\n')
  );

  useEffect(() => {
    setTagsInputRaw((character.tags || []).join('\n'));
  }, [character.tags]);

  const handleTagsChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      const raw = e.target.value;
      setTagsInputRaw(raw);
      const parsedTags = raw
        .split(/\r?\n/)
        .map((t) => t.trim())
        .filter(Boolean);
      handleTagsUpdate(parsedTags);
    },
    [handleTagsUpdate]
  );

  return (
    <>
      {textareasByCategory.map((section) => (
        <Box key={section.category} sx={{ marginBottom: 4 }}>
          <Typography variant="h5" gutterBottom>
            {section.category}
          </Typography>
          {section.fields.map((field) => {
            if (field.name === 'first_message' && isAlternatives) {
              return (
                <FirstMessageAlternatives
                  key="first_message_pagination"
                  alternativeMessages={alternativeMessages}
                  currentIndex={currentIndex}
                  maxAlternatives={maxAlternatives}
                  placeholder={field.placeholder}
                  showTokenizer={field.showTokenizer}
                  maxLength={field.maxLength}
                  setCurrentIndex={setCurrentIndex}
                  updateAlternativeMessage={updateAlternativeMessage}
                  removeAlternative={removeAlternative}
                />
              );
            }

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
        onTagClick={(tag) =>
          handleTagClick(tag, (updated) => setTagsInputRaw(updated.join('\n')))
        }
      />
    </>
  );
});
