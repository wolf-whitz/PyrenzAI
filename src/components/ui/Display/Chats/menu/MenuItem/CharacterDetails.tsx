import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, keyframes } from '@mui/material';
import { Textarea } from '@components';
import { Character } from '@shared-types';
import { PyrenzBlueButton } from '~/theme';
import { supabase } from '~/Utility';
import { styled } from '@mui/system';

interface CharacterDetailsProps {
  char: Character;
  onSubmit: (characterDetails: Character) => void;
}

const bounceAnimation = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
`;

const BouncingImage = styled('img')({
  animation: `${bounceAnimation} 2s infinite`,
  width: '50px',
  height: 'auto',
  marginBottom: '10px',
});

export function CharacterDetails({ char, onSubmit }: CharacterDetailsProps) {
  const [characterDetails, setCharacterDetails] = useState<Character>(char);
  const [showDetails, setShowDetails] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchCharacterDetails = async () => {
      const tables = ['public_characters', 'private_characters'];
      for (const table of tables) {
        try {
          const { data, error } = await supabase
            .from(table)
            .select('is_details_private')
            .eq('char_uuid', char.char_uuid)
            .single();

          if (!error) {
            setShowDetails(!data.is_details_private);
            return;
          } else {
            throw error;
          }
        } catch (error) {
          console.error(
            `Error fetching character details from ${table}:`,
            error
          );
        }
      }
      setShowDetails(false);
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
        <BouncingImage
          src="https://cqtbishpefnfvaxheyqu.supabase.co/storage/v1/object/public/character-image/CDN/MascotCrying.avif"
          alt="Mascot"
        />
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
