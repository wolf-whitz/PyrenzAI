import { useState, useCallback } from 'react';
import { supabase } from '~/Utility/supabaseClient';
import { GetUserUUID, GetUserData } from '@components';
import { usePyrenzAlert } from '~/provider';

interface PersonaCard {
  id: string;
  persona_name: string;
  persona_description: string;
  is_selected?: boolean;
  persona_profile?: string | null;
}

export const usePersonaAPI = () => {
  const [personaData, setPersonaData] = useState<PersonaCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [userUuid, setUserUuid] = useState<string | null>(null);

  const fetchUserUuid = useCallback(async () => {
    try {
      const uuid = await GetUserUUID();
      if (!uuid) {
        throw new Error('User UUID not found');
      }
      setUserUuid(uuid);

      const userData = await GetUserData();
      if ('error' in userData) {
        throw new Error(userData.error);
      }
    } catch (error) {
      console.error('Failed to fetch user UUID or data', error);
      usePyrenzAlert()('Failed to fetch user UUID or data.', 'alert');
    }
  }, []);

  const fetchPersona = useCallback(async () => {
    if (!userUuid) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('personas')
        .select(
          'id, persona_name, persona_description, persona_profile, is_selected'
        )
        .eq('user_uuid', userUuid);

      if (error) {
        throw error;
      }

      const mappedData = data.map((item) => ({
        id: item.id,
        persona_name: item.persona_name,
        persona_description: item.persona_description,
        is_selected: item.is_selected,
        persona_profile: item.persona_profile,
      }));

      setPersonaData(mappedData);
    } catch (error) {
      console.error('Failed to fetch persona data', error);
      usePyrenzAlert()('Failed to fetch persona data.', 'alert');
    } finally {
      setLoading(false);
    }
  }, [userUuid]);

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
        const { data, error } = await supabase
          .from('personas')
          .insert([
            {
              persona_name: newPersonaName,
              persona_description: newPersonaDescription,
              user_uuid: userUuid,
              persona_profile: selectedImage,
            },
          ])
          .select();

        if (error) {
          throw error;
        }

        if (data && data.length > 0) {
          const newPersona: PersonaCard = {
            id: data[0].id,
            persona_name: data[0].persona_name,
            persona_description: data[0].persona_description,
            persona_profile: data[0].persona_profile,
          };

          setPersonaData((prevData) => [...prevData, newPersona]);
          setNewPersonaName('');
          setNewPersonaDescription('');
          setSelectedImage(null);
          setModalOpen(false);
        }
      } catch (error) {
        console.error('Failed to create persona', error);
        usePyrenzAlert()('Failed to create persona.', 'alert');
      }
    },
    [userUuid]
  );

  const handleSelectPersona = useCallback(
    async (id: string) => {
      if (!userUuid) return;

      try {
        await supabase
          .from('personas')
          .update({ is_selected: false })
          .eq('user_uuid', userUuid);
        await supabase
          .from('personas')
          .update({ is_selected: true })
          .eq('id', id);

        await fetchPersona();
      } catch (error) {
        console.error('Failed to update persona selection', error);
        usePyrenzAlert()('Failed to update persona selection.', 'alert');
      }
    },
    [userUuid, fetchPersona]
  );

  const handleDeletePersona = useCallback(
    async (id: string) => {
      try {
        await supabase.from('personas').delete().eq('id', id);
        await fetchPersona();
      } catch (error) {
        console.error('Failed to delete persona', error);
        usePyrenzAlert()('Failed to delete persona.', 'alert');
      }
    },
    [fetchPersona]
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
        const { error } = await supabase
          .from('personas')
          .update({
            persona_name: newPersonaName,
            persona_description: newPersonaDescription,
            persona_profile: selectedImage,
          })
          .eq('id', id);

        if (error) {
          throw error;
        }

        await fetchPersona();
        setNewPersonaName('');
        setNewPersonaDescription('');
        setSelectedImage(null);
        setModalOpen(false);
        setEditingPersona(null);
      } catch (error) {
        console.error('Failed to edit persona', error);
        usePyrenzAlert()('Failed to edit persona.', 'alert');
      }
    },
    [userUuid, fetchPersona]
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
