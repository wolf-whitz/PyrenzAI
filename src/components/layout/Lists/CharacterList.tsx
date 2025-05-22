import { SkeletonCard, CharacterCard } from '~/components';
import { Typography, Box } from '@mui/material';
import { CharacterCardProps } from '@shared-types/CharacterProp';

interface CharacterListProps {
  characters: CharacterCardProps[];
  loading: boolean;
  itemsPerPage: number;
  t: (key: string, options?: Record<string, any>) => string;
  isOwner: boolean;
}

export function CharacterList({
  characters,
  loading,
  itemsPerPage,
  t,
  isOwner,
}: CharacterListProps) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: 'repeat(2, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
          lg: 'repeat(4, 1fr)',
          xl: 'repeat(5, 1fr)',
          xxl: 'repeat(6, 1fr)',
        },
        minHeight: '50vh',
        justifyContent: { xs: 'center', sm: 'flex-start' },
      }}
    >
      {loading ? (
        Array.from({ length: itemsPerPage }).map((_, i) => (
          <Box
            key={i}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <SkeletonCard />
          </Box>
        ))
      ) : characters.length > 0 ? (
        characters.map((char) => (
          <Box
            key={char.id}
            sx={{
              transition: 'transform 0.3s ease-in-out',
              '&:hover': {
                transform: 'scale(1.05)',
              },
              p: 1,
            }}
            aria-labelledby={`character-${char.name}`}
          >
            <CharacterCard character={char} isOwner={isOwner} />
          </Box>
        ))
      ) : (
        <Box
          sx={{
            color: 'text.secondary',
            textAlign: 'center',
            width: '100%',
            gridColumn: '1 / -1',
          }}
          aria-live="polite"
        >
          <Typography variant="body1">
            {t('messages.noCharactersFound')}
          </Typography>
        </Box>
      )}
    </Box>
  );
}
