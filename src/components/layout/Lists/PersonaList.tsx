import React from 'react';
import { Typography, CircularProgress } from '@mui/material';
import { PersonaCard } from '@components';

interface PersonaCardProps {
  id: string;
  name: string;
  description: string;
  selected?: boolean;
}

interface PersonaListProps {
  personaData: PersonaCardProps[];
  loading: boolean;
}

export function PersonaList({ personaData, loading }: PersonaListProps) {
  return (
    <div className="mt-4 space-y-4">
      {loading ? (
        <div className="flex justify-center items-center mt-4">
          <CircularProgress />
        </div>
      ) : personaData.length > 0 ? (
        personaData.map((persona) => (
          <PersonaCard
            key={persona.id}
            id={persona.id}
            name={persona.name}
            description={persona.description}
            selected={persona.selected}
          />
        ))
      ) : (
        <Typography variant="body1" className="text-center text-white">
          No persona data available. Perhaps create a few?
        </Typography>
      )}
    </div>
  );
}
