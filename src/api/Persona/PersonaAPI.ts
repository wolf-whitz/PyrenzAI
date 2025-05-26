import { useState, useCallback } from 'react';
import { supabase } from '~/Utility/supabaseClient';
import { GetUserUUID } from '@components';

interface PersonaCard {
  id: string;
  name: string;
  description: string;
  selected?: boolean;
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
        .select('persona_name, persona_description, persona_profile, selected')
        .eq('user_uuid', userUuid);

      if (error) {
        throw error;
      }

      const mappedData = data.map((item) => ({
        id: item.persona_profile || Math.random().toString(36).substr(2, 9),
        name: item.persona_name,
        description: item.persona_description,
        selected: item.selected,
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

    // Convert base64 to Blob
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

  const handleCreatePersona = useCallback(async (
    newPersonaName: string,
    newPersonaDescription: string,
    selectedImage: string,
    setNewPersonaName: React.Dispatch<React.SetStateAction<string>>,
    setNewPersonaDescription: React.Dispatch<React.SetStateAction<string>>,
    setSelectedImage: React.Dispatch<React.SetStateAction<string>>,
    setModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    if (!newPersonaName || !newPersonaDescription || !userUuid || !selectedImage) return;

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
          id: data[0].persona_profile || Math.random().toString(36).substr(2, 9),
          name: data[0].persona_name,
          description: data[0].persona_description,
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
  }, [userUuid, uploadImageToStorage]);

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
  };
};
