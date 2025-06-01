import React, { useState, DragEvent, useEffect } from 'react';
import { TextField, Typography, Box, Avatar } from '@mui/material';
import { supabase } from '~/Utility/supabaseClient';
import { GetUserUUID } from '@components';
import { PyrenzBlueButton, PyrenzFormControl } from '~/theme';
import { usePyrenzAlert } from '~/provider';
import { useNavigate } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export function Profile() {
  const [username, setUsername] = useState('');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [userUUID, setUserUUID] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const showAlert = usePyrenzAlert();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const uuid = await GetUserUUID();
      setUserUUID(uuid);

      if (uuid) {
        const { data, error } = await supabase
          .from('user_data')
          .select('username, avatar_url')
          .eq('user_uuid', uuid)
          .single();

        if (error) {
          console.error('Error fetching user data:', error);
        } else {
          setUsername(data.username || '');
          if (data.avatar_url) {
            setImagePreview(data.avatar_url);
          }
        }
      }
    };

    fetchUserData();
  }, []);

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];

      if (!file.type.match('image.*')) {
        showAlert('Only image files are accepted', 'alert');
        return;
      }

      if (file.size > 1024 * 1024) {
        showAlert('Profile image size should be within or below 1MB', 'alert');
        return;
      }

      const img = new Image();
      const objectURL = URL.createObjectURL(file);
      img.src = objectURL;

      img.onload = () => {
        if (img.width !== 400 || img.height !== 400) {
          showAlert(
            'Profile image dimensions should be 400x400 pixels',
            'alert'
          );
          URL.revokeObjectURL(objectURL);
          return;
        }

        setProfileImage(file);
        setImagePreview(objectURL);
      };
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];

      if (!file.type.match('image.*')) {
        showAlert('Only image files are accepted', 'alert');
        return;
      }

      setProfileImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!userUUID) {
      showAlert('User UUID is not available', 'alert');
      return;
    }

    setIsLoading(true);

    try {
      const updateData: any = { username };

      if (profileImage) {
        const filePath = `user-profile/${userUUID}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('user-profile')
          .upload(filePath, profileImage);

        if (uploadError) {
          showAlert(
            `Error uploading profile image: ${uploadError.message}`,
            'alert'
          );
          setIsLoading(false);
          return;
        }

        const { data: urlData } = supabase.storage
          .from('user-profile')
          .getPublicUrl(filePath);

        updateData.avatar_url = urlData.publicUrl;
      }

      const { data, error } = await supabase
        .from('user_data')
        .update(updateData)
        .eq('user_uuid', userUUID);

      if (error) {
        showAlert(`Error updating profile: ${error.message}`, 'alert');
      } else {
        showAlert('Profile updated successfully', 'success');
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
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: 'bold', marginBottom: '8px' }}
        >
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
        {imagePreview && (
          <Box sx={{ marginTop: '10px' }}>
            <Avatar
              src={imagePreview}
              alt="Profile Preview"
              sx={{ width: 100, height: 100 }}
            />
          </Box>
        )}
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
      <PyrenzBlueButton
        sx={{
          backgroundColor: '#add8e6',
          borderRadius: '20px',
          color: 'black',
          marginRight: '10px',
        }}
        onClick={handleSubmit}
        dataState={isLoading ? 'loading' : undefined}
      >
        Submit
      </PyrenzBlueButton>
      <PyrenzBlueButton
        sx={{
          backgroundColor: '#add8e6',
          borderRadius: '20px',
          color: 'black',
        }}
        onClick={() => navigate('/Profile')}
      >
        View Profile <ArrowForwardIcon />
      </PyrenzBlueButton>
    </Box>
  );
}
