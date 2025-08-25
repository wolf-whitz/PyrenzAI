import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { Textarea } from '@components';
import { Character } from '@shared-types';
import { PyrenzBlueButton } from '~/theme';
import { Utils } from '~/utility';

interface CharacterDetailsProps {
  char: Character;
  onSubmit: (characterDetails: Character) => void;
}

export function CharacterDetails({ char, onSubmit }: CharacterDetailsProps) {
  const [characterDetails, setCharacterDetails] = useState<Character>(char);
  const [showDetails, setShowDetails] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchCharacterDetails = async () => {
      try {
        const { data } = await Utils.db.select<Character>({
          tables: ['public_characters', 'private_characters'],
          columns:
            'char_uuid, name, title, attribute, persona, scenario, model_instructions, is_details_private',
          match: { char_uuid: char.char_uuid },
        });

        const character = data?.find((c) => c.char_uuid === char.char_uuid);
        if (character) {
          const isPrivate = character.is_details_private;
          if (!isPrivate) {
            setCharacterDetails(character);
            setShowDetails(true);
            return;
          }
        }
        setShowDetails(false);
      } catch (error) {
        console.error('Error fetching character details:', error);
        setShowDetails(false);
      }
    };

    fetchCharacterDetails();
  }, [char.char_uuid]);

  const handleChange =
    (field: keyof Character) => (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCharacterDetails({
        ...characterDetails,
        [field]: e.target.value,
      });
    };

  const handleSubmit = () => {
    onSubmit(characterDetails);
  };

  const textareaFields = [
    { label: 'Name', field: 'name', maxLength: 50 },
    { label: 'Title', field: 'title', maxLength: 50 },
    { label: 'Attribute', field: 'attribute', maxLength: 50 },
    { label: 'Persona', field: 'persona' },
    { label: 'Scenario', field: 'scenario' },
    { label: 'Model Instructions', field: 'model_instructions' },
  ];

  if (showDetails === null) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100%"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!showDetails) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        height="100%"
      >
        <Typography variant="h6" align="center">
          Details Have Been Hidden
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {textareaFields.map((textarea) => {
        const value = characterDetails[textarea.field as keyof Character];
        const textValue = typeof value === 'string' ? value : String(value);
        return (
          <Textarea
            key={textarea.field}
            label={textarea.label}
            value={textValue}
            onChange={handleChange(textarea.field as keyof Character)}
            maxLength={textarea.maxLength}
          />
        );
      })}
      <PyrenzBlueButton onClick={handleSubmit} variant="contained" fullWidth>
        Submit
      </PyrenzBlueButton>
    </Box>
  );
}
