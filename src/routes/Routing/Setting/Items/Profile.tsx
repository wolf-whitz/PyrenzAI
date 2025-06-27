import React, { useState, useEffect } from 'react';
import { TextField, Typography, Box } from '@mui/material';
import { supabase } from '~/Utility/supabaseClient';
import { GetUserUUID, Textarea, ImageUploader } from '@components';
import { PyrenzBlueButton } from '~/theme';
import { usePyrenzAlert } from '~/provider';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '~/store';
import { v4 as uuidv4 } from 'uuid';

export function Profile() {
  const [username, setUsername] = useState<string>('');
  const [userUUID, setUserUUID] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [tagsInput, setTagsInput] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const showAlert = usePyrenzAlert();
  const navigate = useNavigate();
  const { setBlockedTags } = useUserStore();

  useEffect(() => {
    const fetchUserData = async () => {
      const uuid = await GetUserUUID();
      setUserUUID(uuid);

      if (uuid) {
        const { data, error } = await supabase
          .from('user_data')
          .select('username, avatar_url, blocked_tags')
          .eq('user_uuid', uuid)
          .single();

        if (error) {
          console.error('Error fetching user data:', error);
        } else {
          setUsername(data.username || '');
          if (data.avatar_url) {
            setImageUrl(data.avatar_url);
          }
          if (data.blocked_tags) {
            setTagsInput(data.blocked_tags.join(', '));
          }
        }
      }
    };

    fetchUserData();
  }, []);

  const handleImageSelect = (file: File | null) => {
    if (!file) {
      showAlert('No file was selected', 'alert');
      return;
    }

    if (!file.type.match('image.*')) {
      showAlert(
        'Only image files are accepted. Please upload an image.',
        'alert'
      );
      return;
    }

    setSelectedImage(file);
    setImageUrl(URL.createObjectURL(file));
  };

  const uploadImage = async (file: File) => {
    try {
      const uniqueFileName = uuidv4();
      const filePath = `user-profile/${uniqueFileName}`;

      const { error: uploadError } = await supabase.storage
        .from('user-profile')
        .upload(filePath, file);

      if (uploadError) {
        throw new Error(
          `Error uploading profile image: ${uploadError.message}`
        );
      }

      const { data: urlData } = supabase.storage
        .from('user-profile')
        .getPublicUrl(filePath);

      return urlData.publicUrl;
    } catch (error) {
      showAlert(
        `Error during image upload: ${error instanceof Error ? error.message : String(error)}`,
        'alert'
      );
      throw error;
    }
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const updateData: {
        username: string;
        avatar_url?: string;
        blocked_tags?: string[];
      } = {
        username,
      };

      if (selectedImage) {
        const uploadedImageUrl = await uploadImage(selectedImage);
        updateData.avatar_url = uploadedImageUrl;
      }

      const tagsArray = tagsInput
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag);
      updateData.blocked_tags = tagsArray;

      if (userUUID) {
        const { error } = await supabase
          .from('user_data')
          .update(updateData)
          .eq('user_uuid', userUUID);

        if (error) {
          showAlert(`Error updating profile: ${error.message}`, 'alert');
        } else {
          setBlockedTags(tagsArray);
          showAlert('Profile and tags updated successfully', 'success');
          navigate('/Profile');
        }
      }
    } catch (error) {
      showAlert(
        `Error during submission: ${error instanceof Error ? error.message : String(error)}`,
        'alert'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <Box sx={{ marginBottom: '20px' }}>
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: 'bold', marginBottom: '8px' }}
        >
          Profile Image
        </Typography>
        <ImageUploader
          onImageSelect={handleImageSelect}
          initialImage={imageUrl}
        />
      </Box>

      <Box sx={{ marginBottom: '20px' }}>
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: 'bold', marginBottom: '8px' }}
        >
          Username
        </Typography>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </Box>

      <Box sx={{ marginBottom: '20px' }}>
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: 'bold', marginBottom: '8px' }}
        >
          Blocked Tags
        </Typography>
        <Textarea
          placeholder="Enter tags separated by commas"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
        />
      </Box>

      <PyrenzBlueButton
        sx={{
          backgroundColor: '#add8e6',
          borderRadius: '20px',
          color: 'black',
          marginRight: '10px',
        }}
        onClick={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? 'Loading...' : 'Submit'}
      </PyrenzBlueButton>
      <PyrenzBlueButton
        sx={{
          backgroundColor: '#add8e6',
          borderRadius: '20px',
          color: 'black',
        }}
        onClick={() => navigate('/Profile')}
      >
        View Profile
      </PyrenzBlueButton>
    </Box>
  );
}
