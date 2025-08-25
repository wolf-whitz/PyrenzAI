import { useState, useCallback } from 'react';
import { Utils as utils } from '~/utility';
import { GetUserUUID, GetUserData } from '@components';
import { usePyrenzAlert } from '~/provider';

interface PersonaCard {
  id: string;
  persona_name: string;
  persona_description: string;
  is_selected?: boolean;
  persona_profile?: string | null;
  user_uuid: string;
}

export const usePersonaAPI = () => {
  const [personaData, setPersonaData] = useState<PersonaCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [userUuid, setUserUuid] = useState<string | null>(null);
  const showAlert = usePyrenzAlert();

  const fetchUserUuid = useCallback(async () => {
    try {
      const uuid = await GetUserUUID();
      if (!uuid) throw new Error('User UUID not found');
      setUserUuid(uuid);
      const userData = await GetUserData();
      if ('error' in userData) throw new Error(userData.error);
    } catch (error) {
      console.error('Failed to fetch user UUID or data', error);
      showAlert('Failed to fetch user UUID or data.', 'alert');
    }
  }, [showAlert]);

  const fetchPersona = useCallback(async () => {
    if (!userUuid) return;
    setLoading(true);
    try {
      const result = await utils.db.select<PersonaCard>({
        tables: 'personas',
        columns:
          'id, persona_name, persona_description, persona_profile, is_selected, user_uuid',
        match: { user_uuid: userUuid },
      });
      const data = result?.data ?? [];
      setPersonaData(data);
    } catch (error) {
      console.error('Failed to fetch persona data', error);
      showAlert('Failed to fetch persona data.', 'alert');
    } finally {
      setLoading(false);
    }
  }, [userUuid, showAlert]);

  const handleCreatePersona = useCallback(
    async (
      newPersonaName: string,
      newPersonaDescription: string,
      selectedImage: string | null,
      setNewPersonaName: React.Dispatch<React.SetStateAction<string>>,
      setNewPersonaDescription: React.Dispatch<React.SetStateAction<string>>,
      setSelectedImage: React.Dispatch<React.SetStateAction<string | null>>,
      setModalOpen: React.Dispatch<React.SetStateAction<boolean>>
    ) => {
      if (!newPersonaName || !newPersonaDescription || !userUuid) return;
      try {
        const result = await utils.db.insert({
          tables: 'personas',
          data: {
            persona_name: newPersonaName,
            persona_description: newPersonaDescription,
            user_uuid: userUuid,
            persona_profile: selectedImage,
          },
        });
        if (result && result.length > 0) {
          const newPersona = result[0] as PersonaCard;
          setPersonaData((prevData) => [...prevData, newPersona]);
          setNewPersonaName('');
          setNewPersonaDescription('');
          setSelectedImage(null);
          setModalOpen(false);
        }
      } catch (error) {
        console.error('Failed to create persona', error);
        showAlert('Failed to create persona.', 'alert');
      }
    },
    [userUuid, showAlert]
  );

  const handleSelectPersona = useCallback(
    async (id: string) => {
      if (!userUuid) return;
      try {
        await utils.db.update({
          tables: 'personas',
          values: { is_selected: false },
          match: { user_uuid: userUuid },
        });
        await utils.db.update({
          tables: 'personas',
          values: { is_selected: true },
          match: { id },
        });
        await fetchPersona();
      } catch (error) {
        console.error('Failed to update persona selection', error);
        showAlert('Failed to update persona selection.', 'alert');
      }
    },
    [userUuid, fetchPersona, showAlert]
  );

  const handleDeletePersona = useCallback(
    async (id: string) => {
      try {
        await utils.db.remove({
          tables: 'personas',
          match: { id },
        });
        await fetchPersona();
      } catch (error) {
        console.error('Failed to delete persona', error);
        showAlert('Failed to delete persona.', 'alert');
      }
    },
    [fetchPersona, showAlert]
  );

  const handleEditPersona = useCallback(
    async (
      id: string,
      newPersonaName: string,
      newPersonaDescription: string,
      selectedImage: string | null,
      setNewPersonaName: React.Dispatch<React.SetStateAction<string>>,
      setNewPersonaDescription: React.Dispatch<React.SetStateAction<string>>,
      setSelectedImage: React.Dispatch<React.SetStateAction<string | null>>,
      setModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
      setEditingPersona: React.Dispatch<
        React.SetStateAction<PersonaCard | null>
      >
    ) => {
      if (!newPersonaName || !newPersonaDescription || !userUuid) return;
      try {
        await utils.db.update({
          tables: 'personas',
          values: {
            persona_name: newPersonaName,
            persona_description: newPersonaDescription,
            persona_profile: selectedImage,
          },
          match: { id },
        });
        await fetchPersona();
        setNewPersonaName('');
        setNewPersonaDescription('');
        setSelectedImage(null);
        setModalOpen(false);
        setEditingPersona(null);
      } catch (error) {
        console.error('Failed to edit persona', error);
        showAlert('Failed to edit persona.', 'alert');
      }
    },
    [userUuid, fetchPersona, showAlert]
  );

  return {
    personaData,
    loading,
    userUuid,
    fetchUserUuid,
    fetchPersona,
    handleCreatePersona,
    handleSelectPersona,
    handleDeletePersona,
    handleEditPersona,
  };
};
