import React, { useState, useEffect, useRef } from 'react';
import { Menu, MenuItem, Typography, TextField } from '@mui/material';
import { supabase } from '~/Utility/supabaseClient';
import { Tag } from '@shared-types';
import { ImageUploader, Textarea } from '@components';
import { v4 as uuidv4 } from 'uuid';
import { useCharacterStore } from '~/store';

export function TextareaForm() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [tags, setTags] = useState<Tag[]>([]);
  const [filteredTags, setFilteredTags] = useState<Tag[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [imageBlobUrl, setImageBlobUrl] = useState<string | null>(null);
  const isUploading = useRef(false);

  const character = useCharacterStore((state) => state);
  const setCharacter = useCharacterStore((state) => state.setCharacter);

  useEffect(() => {
    if (!isUploading.current && character.profile_image) {
      setImageBlobUrl(character.profile_image);
    }
  }, [character.profile_image]);

  const handleOpenDropdown = async (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    const { data, error } = await supabase.from('tags').select('*');
    if (data) {
      setTags(data);
      setFilteredTags(data);
    }
    if (error) {
      console.error('Error fetching tags:', error);
    }
  };

  const handleCloseDropdown = () => {
    setAnchorEl(null);
  };

  const handleTagClick = (tag: string) => {
    const newTags = character.tags ? [...character.tags, tag] : [tag];
    setCharacter({ tags: newTags });
    handleCloseDropdown();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const { name, value, type } = e.target;
    const checked =
      type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;

    if (name === 'tags') {
      const tagsArray = value.split(',').map((tag) => tag.trim());
      setCharacter({ [name]: tagsArray });
    } else {
      setCharacter({ [name]: type === 'checkbox' ? checked : value });
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
    setFilteredTags(
      tags.filter((tag) => tag.name.toLowerCase().includes(query.toLowerCase()))
    );
  };

  const handleImageSelect = async (file: File | null) => {
    if (file) {
      const blobUrl = URL.createObjectURL(file);
      setImageBlobUrl(blobUrl);
      isUploading.current = true;

      const fileName = `character-image/${uuidv4()}-${file.name}`;
      const { data, error } = await supabase.storage
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

      setCharacter({ profile_image: publicUrlData.publicUrl });
      isUploading.current = false;
    }
  };

  return (
    <>
      <Textarea
        name="name"
        value={character.name}
        onChange={handleChange}
        label="Name"
        aria-label="Name"
        placeholder="Enter character name e.g., John Doe"
        maxLength={50}
      />

      <ImageUploader
        onImageSelect={handleImageSelect}
        initialImage={imageBlobUrl}
      />

      <Textarea
        name="description"
        value={character.description}
        onChange={handleChange}
        label="Description"
        aria-label="Description"
        placeholder="Describe the character e.g., A brave knight with a mysterious past"
        showTokenizer
      />
      <Textarea
        name="persona"
        value={character.persona}
        onChange={handleChange}
        label="Persona"
        aria-label="Persona"
        placeholder="Define the character's persona e.g., Adventurous and wise"
        showTokenizer
      />
      <Textarea
        name="scenario"
        value={character.scenario}
        onChange={handleChange}
        label="Scenario"
        aria-label="Scenario"
        placeholder="Describe a scenario involving the character e.g., Saving a village from a dragon"
        showTokenizer
      />
      <Textarea
        name="model_instructions"
        value={character.model_instructions}
        onChange={handleChange}
        label="Model Instructions"
        aria-label="Model Instructions"
        placeholder="Provide instructions for the model e.g., The character should always seek justice"
        showTokenizer
      />
      <Textarea
        name="first_message"
        value={character.first_message}
        onChange={handleChange}
        label="First Message"
        aria-label="First Message"
        placeholder="What is the first message the character says? e.g., Hello, traveler! What brings you here?"
        showTokenizer
      />
      <Textarea
        name="tags"
        value={Array.isArray(character.tags) ? character.tags.join(', ') : ''}
        onChange={handleChange}
        label="Tags"
        aria-label="Tags"
        placeholder="Add tags separated by commas e.g., hero, knight, adventure"
        is_tag
        onTagPressed={handleOpenDropdown}
      />

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseDropdown}
        PaperProps={{
          style: {
            maxHeight: 400,
            width: '20ch',
          },
        }}
      >
        <div className="p-2">
          <TextField
            label="Search Tags"
            variant="outlined"
            fullWidth
            value={searchQuery}
            onChange={handleSearchChange}
            className="mb-2"
            placeholder="Search for tags e.g., fantasy"
          />
          <div className="max-h-96 overflow-y-auto">
            {filteredTags.map((tag) => (
              <MenuItem
                key={tag.id}
                onClick={() => handleTagClick(tag.name)}
                className="rounded-md hover:bg-blue-500 hover:text-white"
              >
                <Typography variant="body1">{tag.name}</Typography>
              </MenuItem>
            ))}
          </div>
        </div>
      </Menu>
    </>
  );
}
