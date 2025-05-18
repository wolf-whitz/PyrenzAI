import { Typography } from '@mui/material';

interface PersonaCardProps {
  id: string;
  name: string;
  description: string;
  selected?: boolean;
}

export function PersonaCard({
  id,
  name,
  description,
  selected,
}: PersonaCardProps) {
  const truncateDescription = (description: string, limit: number = 100) => {
    return description.length > limit
      ? `${description.slice(0, limit)}...`
      : description;
  };

  return (
    <div
      className={`bg-gray-700 rounded-lg p-4 flex flex-col cursor-pointer border-2 ${
        selected ? 'border-blue-500' : 'border-transparent'
      }`}
    >
      <Typography variant="h6" className="text-white">
        {name}
      </Typography>
      <Typography variant="body2" className="text-gray-300">
        {truncateDescription(description)}
      </Typography>
      {selected && (
        <Typography variant="body2" className="text-gray-400 mt-2">
          Default Persona
        </Typography>
      )}
    </div>
  );
}
