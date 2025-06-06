import React, { useState } from 'react';
import { Box } from '@mui/material';
import { Textarea } from '@components';
import { Character } from '@shared-types';
import { PyrenzBlueButton } from '~/theme';

interface CharacterDetailsProps {
  char: Character;
  onSubmit: (characterDetails: Character) => void;
}

export function CharacterDetails({ char, onSubmit }: CharacterDetailsProps) {
  const [characterDetails, setCharacterDetails] = useState<Character>(char);

  const handleChange = (field: keyof Character) => (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCharacterDetails({
      ...characterDetails,
      [field]: e.target.value,
    });
  };

  const handleSubmit = () => {
    onSubmit(characterDetails);
  };

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
        label="Model instructions"
        value={characterDetails.model_instructions}
        onChange={handleChange('model_instructions')}
      />
      <PyrenzBlueButton
        onClick={handleSubmit}
        variant="contained"
        fullWidth
      >
        Submit
      </PyrenzBlueButton>
    </Box>
  );
}
