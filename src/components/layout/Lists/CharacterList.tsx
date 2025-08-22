import { SkeletonCard, CharacterCard } from '~/components';
import {
  Typography,
  Box,
  useMediaQuery,
  useTheme,
  keyframes,
  styled,
} from '@mui/material';
import { Character } from '@shared-types';

const ellipsisAnimation = keyframes`
  0% { content: ''; }
  25% { content: '.'; }
  50% { content: '..'; }
  75% { content: '...'; }
  100% { content: ''; }
`;

const LoadingText = styled(Typography)`
  position: relative;
  padding-right: 1.5em;
  &::after {
    content: '';
    position: absolute;
    right: 0;
    width: 1.25em;
    overflow: hidden;
    animation: ${ellipsisAnimation} 1.5s steps(4, end) infinite;
  }
`;

interface CharacterListProps {
  characters: Character[];
  loading: boolean;
  itemsPerPage: number;
  t: (key: string, options?: Record<string, any>) => string;
}

export function CharacterList({
  characters,
  loading,
  itemsPerPage,
  t,
}: CharacterListProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: 'repeat(auto-fill, minmax(140px, 1fr))',
          sm: 'repeat(auto-fill, minmax(160px, 1fr))',
          md: 'repeat(auto-fill, minmax(200px, 1fr))',
          lg: 'repeat(auto-fill, minmax(220px, 1fr))',
        },
        gap: 2,
        minHeight: '50vh',
        width: '100%',
      }}
    >
      {loading ? (
        isMobile ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              gridColumn: '1 / -1',
            }}
          >
            <img
              src="https://cqtbishpefnfvaxheyqu.supabase.co/storage/v1/object/public/character-image/CDN/MascotHappy.avif"
              alt="Mascot"
              style={{
                width: '100px',
                height: '100px',
                animation: 'bounce 2s infinite',
              }}
            />
            <LoadingText variant="body1">Loading</LoadingText>
          </Box>
        ) : (
          Array.from({ length: itemsPerPage }).map((_, i) => (
            <SkeletonCard key={i} />
          ))
        )
      ) : characters.length > 0 ? (
        characters.map((char) => (
          <CharacterCard key={char.id} character={char} />
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
