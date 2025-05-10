import { useParams } from 'react-router-dom';
import { Sidebar, SkeletonCard, CharacterCard } from '~/components';
import { Box, Typography, Avatar, Skeleton } from '@mui/material';
import { GetUserCreatedCharacters } from '@functions/index';

export default function ProfilePage() {
  const { uuid } = useParams();

  const safeUuid = uuid && uuid.trim() !== '' ? uuid : undefined;

  const { characters, userData, loading } = GetUserCreatedCharacters(safeUuid);

  return (
    <div className="flex">
      <Sidebar className="flex-shrink-0" />
      <main className="flex-1 p-4 overflow-auto">
        <Box display="flex" flexDirection="column" alignItems="center" mb={4}>
          {loading ? (
            <Box display="flex" alignItems="center" mb={2}>
              <Skeleton variant="circular" width={60} height={60} sx={{ marginRight: 2 }} />
              <Skeleton variant="text" width={120} height={30} />
            </Box>
          ) : userData ? (
            <Box display="flex" alignItems="center" mb={2}>
              {userData.avatar_url && (
                <Avatar
                  alt={userData.full_name}
                  src={userData.avatar_url}
                  sx={{ width: 60, height: 60, marginRight: 2 }}
                />
              )}
              <Typography variant="h6">{userData.full_name}</Typography>
            </Box>
          ) : (
            <Typography variant="h6">No user found by that UUID.</Typography>
          )}
        </Box>
        <div className="grid w-full gap-x-6 gap-y-4 pb-4 min-h-[50vh] grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 md:pl-20">
          {loading ? (
            Array.from(new Array(6)).map((_, index) => (
              <div key={index}>
                <SkeletonCard />
              </div>
            ))
          ) : characters.length > 0 ? (
            characters.map(character => (
              <div key={character.id}>
                <CharacterCard
                  id={character.id.toString()}
                  char_uuid={character.char_uuid}
                  name={character.name}
                  description={character.description}
                  creator={character.creator}
                  chat_messages_count={character.chat_messages_count}
                  profile_image={character.profile_image}
                  tags={character.tags}
                  is_public={character.is_public}
                  token_total={character.token_total}
                  isLoading={loading}
                />
              </div>
            ))
          ) : (
            <Typography variant="h6" style={{ gridColumn: '1 / -1', textAlign: 'center' }}>
              No characters have been created by this user.
            </Typography>
          )}
        </div>
      </main>
    </div>
  );
}
