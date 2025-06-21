import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { Textarea } from '@components';
import { Character } from '@shared-types';
import { PyrenzBlueButton } from '~/theme';
import { supabase } from '~/Utility/supabaseClient';

interface CharacterDetailsProps {
  char: Character;
  onSubmit: (characterDetails: Character) => void;
}

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

  if (showDetails === null) {
    return <Typography>Loading...</Typography>;
  }

  if (!showDetails) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100%"
      >
        <Typography variant="h6">Details Have Been Hidden</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Textarea
        label="Name"
        value={characterDetails.name}
        onChange={handleChange('name')}
        maxLength={50}
      />
      <Textarea
        label="Persona"
        value={characterDetails.persona}
        onChange={handleChange('persona')}
      />
      <Textarea
        label="Model Instructions"
        value={characterDetails.model_instructions}
        onChange={handleChange('model_instructions')}
      />
      <PyrenzBlueButton onClick={handleSubmit} variant="contained" fullWidth>
        Submit
      </PyrenzBlueButton>
    </Box>
  );
}
