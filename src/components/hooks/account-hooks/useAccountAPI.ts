import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '~/Utility';
import { User } from '@supabase/supabase-js';
import { useUserStore } from '~/store';

export const useAccountAPI = () => {
  const [languages, setLanguages] = useState<{ code: string; name: string }[]>(
    []
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();
  const setIsLogin = useUserStore((state) => state.setIsLogin);

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await fetch('/Languages/Languages.json');
        const data = await response.json();
        setLanguages(data.languages || []);
      } catch (error) {
        console.error('Error fetching languages:', error);
      }
    };

    const fetchUser = async () => {
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();
      if (sessionError || !sessionData.session) {
        console.error('Error fetching session:', sessionError);
      } else {
        const { data: userData, error: userError } =
          await supabase.auth.getUser();
        if (userError) {
          console.error('Error fetching user:', userError);
        } else {
          setUser(userData.user);
        }
      }
    };

    fetchLanguages();
    fetchUser();
  }, []);

  const toggleModal = () => {
    setIsModalOpen((prev) => !prev);
  };

  const clearCookies = () => {
    const cookies = document.cookie.split(';');

    for (const cookie of cookies) {
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
    }
  };

  const confirmLogOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error);
    } else {
      console.log('Logged out successfully');
      localStorage.clear();
      clearCookies();
      setUser(null);
      setIsLogin(false);
      navigate('/');
    }
  };

  const confirmDeleteAccount = async () => {
    try {
      const { error: updateError } = await supabase
        .from('user_data')
        .update({ is_deleted: true })
        .eq('user_uuid', user?.id);

      if (updateError) {
        console.error('Error updating user:', updateError);
        return;
      }

      await confirmLogOut();
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };

  return {
    languages,
    isModalOpen,
    user,
    openDialog,
    toggleModal,
    confirmLogOut,
    confirmDeleteAccount,
    setOpenDialog,
  };
};
