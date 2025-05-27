import React from 'react';
import { Typography, CircularProgress } from '@mui/material';
import { PersonaCard } from '@components';

interface PersonaCardProps {
  id: string;
  persona_name: string;
  persona_description: string;
  is_selected?: boolean;
  persona_profile?: string;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
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
            persona_name={persona.persona_name}
            persona_description={persona.persona_description}
            is_selected={persona.is_selected}
            persona_profile={persona.persona_profile}
            onSelect={persona.onSelect}
            onDelete={persona.onDelete}
            onEdit={persona.onEdit}
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
