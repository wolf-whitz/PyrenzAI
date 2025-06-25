import React, { useState, useEffect, ChangeEvent } from 'react';
import { TextField, Typography, Box, Avatar, CircularProgress } from '@mui/material';
import { supabase } from '~/Utility/supabaseClient';
import { GetUserUUID, Textarea } from '@components';
import { PyrenzBlueButton, PyrenzFormControl } from '~/theme';
import { usePyrenzAlert } from '~/provider';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '~/store';
import { v4 as uuidv4 } from 'uuid';

export function Profile() {
  const [username, setUsername] = useState<string>('');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [userUUID, setUserUUID] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isImageUploading, setIsImageUploading] = useState<boolean>(false);
  const [tagsInput, setTagsInput] = useState<string>('');
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
            setImagePreview(data.avatar_url);
          }
          if (data.blocked_tags) {
            setTagsInput(data.blocked_tags.join(', '));
          }
        }
      }
    };

    fetchUserData();
  }, []);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];

      if (!file.type.match('image.*')) {
        showAlert('Only image files are accepted', 'alert');
        return;
      }

      setIsImageUploading(true);
      setImagePreview(null);

      try {
        const uniqueFileName = uuidv4();
        const filePath = `user-profile/${uniqueFileName}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('user-profile')
          .upload(filePath, file);

        if (uploadError) {
          showAlert(`Error uploading profile image: ${uploadError.message}`, 'alert');
          return;
        }

        const { data: urlData } = supabase.storage
          .from('user-profile')
          .getPublicUrl(filePath);

        setImagePreview(urlData.publicUrl);
        setProfileImage(file);
      } catch (error) {
        showAlert(
          `Error during image upload: ${error instanceof Error ? error.message : String(error)}`,
          'alert'
        );
      } finally {
        setIsImageUploading(false);
      }
    }
  };

  const handleSubmit = async () => {
    if (!userUUID) {
      showAlert('User UUID is not available', 'alert');
      return;
    }

    setIsLoading(true);

    try {
      const updateData: { username: string; blocked_tags?: string[] } = { username };

      const tagsArray = tagsInput
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag);
      updateData.blocked_tags = tagsArray;

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
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', marginBottom: '8px' }}>
          Profile Image
        </Typography>
        <PyrenzFormControl>
          <input
            type="file"
            onChange={handleFileChange}
            style={{ display: 'none' }}
            id="file-upload"
            accept="image/*"
          />
          <label htmlFor="file-upload">
            <PyrenzBlueButton
              component="span"
              sx={{
                backgroundColor: '#add8e6',
                borderRadius: '20px',
                color: 'black',
              }}
            >
              Upload Image
            </PyrenzBlueButton>
          </label>
        </PyrenzFormControl>
        <Box sx={{ marginTop: '10px', display: 'flex', alignItems: 'flex-start' }}>
          {isImageUploading ? (
            <CircularProgress size={24} />
          ) : (
            imagePreview && <Avatar src={imagePreview} alt="Profile Preview" sx={{ width: 100, height: 100, marginTop: '10px' }} />
          )}
        </Box>
      </Box>

      <Box sx={{ marginBottom: '20px' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', marginBottom: '8px' }}>
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
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', marginBottom: '8px' }}>
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
