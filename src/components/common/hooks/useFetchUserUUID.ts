import { useState, useEffect } from 'react';
import { GetUserUUID } from '~/functions';

const useFetchUserUUID = (): string | null => {
  const [userUUID, setUserUUID] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserUUID = async () => {
      try {
        const uuid = await GetUserUUID();
        setUserUUID(uuid);
      } catch (error) {
        console.error('Failed to fetch user UUID:', error);
      }
    };

    fetchUserUUID();
  }, []);

  return userUUID;
};

export default useFetchUserUUID;
