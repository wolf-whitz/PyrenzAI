import { useState, useCallback } from 'react';
import { supabase } from '~/Utility/supabaseClient';
import { GetUserUUID } from '@components';

interface PersonaCard {
  id: string;
  persona_name: string;
  persona_description: string;
  is_selected?: boolean;
  persona_profile?: string;
}

export const usePersonaAPI = () => {
  const [personaData, setPersonaData] = useState<PersonaCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [creating, setCreating] = useState(false);
  const [userUuid, setUserUuid] = useState<string | null>(null);

  const fetchUserUuid = useCallback(async () => {
    const uuid = await GetUserUUID();
    setUserUuid(uuid);
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
    } finally {
      setLoading(false);
    }
  }, [userUuid]);

  const checkAdminStatus = useCallback(async () => {
    if (!userUuid) return;

    try {
      const { data, error } = await supabase
        .from('admins')
        .select('is_admin')
        .eq('user_uuid', userUuid)
        .single();

      if (error) {
        throw error;
      }

      setIsAdmin(data.is_admin);
    } catch (error) {
      console.error('Failed to check admin status', error);
    }
  }, [userUuid]);

  const uploadImageToStorage = useCallback(async (imageData: string) => {
    const fileName = `persona-image-${Date.now()}.png`;

    const blob = await fetch(imageData).then((res) => res.blob());

    const { data, error } = await supabase.storage
      .from('persona-image')
      .upload(fileName, blob, {
        contentType: 'image/png',
      });

    if (error) throw error;

    const { data: publicData } = supabase.storage
      .from('persona-image')
      .getPublicUrl(data.path);

    return publicData.publicUrl;
  }, []);

  const handleCreatePersona = useCallback(
    async (
      newPersonaName: string,
      newPersonaDescription: string,
      selectedImage: string,
      setNewPersonaName: React.Dispatch<React.SetStateAction<string>>,
      setNewPersonaDescription: React.Dispatch<React.SetStateAction<string>>,
      setSelectedImage: React.Dispatch<React.SetStateAction<string>>,
      setModalOpen: React.Dispatch<React.SetStateAction<boolean>>
    ) => {
      if (
        !newPersonaName ||
        !newPersonaDescription ||
        !userUuid ||
        !selectedImage
      )
        return;

      setCreating(true);
      try {
        const imageUrl = await uploadImageToStorage(selectedImage);

        const { data, error } = await supabase
          .from('personas')
          .insert([
            {
              persona_name: newPersonaName,
              persona_description: newPersonaDescription,
              user_uuid: userUuid,
              persona_profile: imageUrl,
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
          setSelectedImage('');
          setModalOpen(false);
        }
      } catch (error) {
        console.error('Failed to create persona', error);
      } finally {
        setCreating(false);
      }
    },
    [userUuid, uploadImageToStorage]
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
      }
    },
    [fetchPersona]
  );

  const handleEditPersona = useCallback(
    async (
      id: string,
      newPersonaName: string,
      newPersonaDescription: string,
      selectedImage: string,
      setNewPersonaName: React.Dispatch<React.SetStateAction<string>>,
      setNewPersonaDescription: React.Dispatch<React.SetStateAction<string>>,
      setSelectedImage: React.Dispatch<React.SetStateAction<string>>,
      setModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
      setEditingPersona: React.Dispatch<
        React.SetStateAction<PersonaCard | null>
      >
    ) => {
      if (!newPersonaName || !newPersonaDescription || !userUuid) return;

      setCreating(true);
      try {
        let imageUrl = selectedImage;
        if (selectedImage && !selectedImage.startsWith('http')) {
          imageUrl = await uploadImageToStorage(selectedImage);
        }

        const { error } = await supabase
          .from('personas')
          .update({
            persona_name: newPersonaName,
            persona_description: newPersonaDescription,
            persona_profile: imageUrl,
          })
          .eq('id', id);

        if (error) {
          throw error;
        }

        await fetchPersona();
        setNewPersonaName('');
        setNewPersonaDescription('');
        setSelectedImage('');
        setModalOpen(false);
        setEditingPersona(null);
      } catch (error) {
        console.error('Failed to edit persona', error);
      } finally {
        setCreating(false);
      }
    },
    [userUuid, uploadImageToStorage, fetchPersona]
  );

  return {
    personaData,
    loading,
    isAdmin,
    creating,
    userUuid,
    fetchUserUuid,
    fetchPersona,
    checkAdminStatus,
    handleCreatePersona,
    handleSelectPersona,
    handleDeletePersona,
    handleEditPersona,
  };
};
