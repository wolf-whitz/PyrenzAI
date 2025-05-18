import { useParams } from 'react-router-dom';
import {
  Sidebar,
  SkeletonCard,
  CharacterCard,
  UserProfileHeader,
} from '~/components';
import { Box, Typography } from '@mui/material';
import { GetUserCreatedCharacters } from '@functions';

export function ProfilePage() {
  const { uuid } = useParams();

  const safeUuid = uuid && uuid.trim() !== '' ? uuid : undefined;

  const { characters, userData, loading } = GetUserCreatedCharacters(safeUuid);

  return (
    <div className="flex">
      <Sidebar className="flex-shrink-0" />
      <main className="flex-1 p-4 overflow-auto">
        <UserProfileHeader loading={loading} userData={userData} />
        <div className="grid w-full gap-x-6 gap-y-4 pb-4 min-h-[50vh] grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 md:pl-20">
          {loading ? (
            Array.from(new Array(6)).map((_, index) => (
              <div key={index}>
                <SkeletonCard />
              </div>
            ))
          ) : !userData ? (
            <Typography
              variant="h6"
              style={{ gridColumn: '1 / -1', textAlign: 'center' }}
            >
              This user does not exist (·•᷄‎ࡇ•᷅ )
            </Typography>
          ) : characters.length > 0 ? (
            characters.map((character) => (
              <div key={character.id}>
                <CharacterCard
                  id={character.id.toString()}
                  char_uuid={character.char_uuid}
                  name={character.name}
                  description={character.description}
                  creator={character.creator}
                  creator_uuid={character.creator_uuid}
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
            <Typography
              variant="h6"
              style={{ gridColumn: '1 / -1', textAlign: 'center' }}
            >
              This user has not created any characters yet. (๑-﹏-๑)
            </Typography>
          )}
        </div>
      </main>
    </div>
  );
}
