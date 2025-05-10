import React, { useState, DragEvent, useEffect } from 'react';
import { TextField, Typography, Button, Box } from '@mui/material';
import { Textarea } from '@components/index';
import { supabase } from '~/Utility/supabaseClient';
import { Utils } from '~/Utility/Utility';
import { GetUserUUID } from '@functions/General/GetUserUUID';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

interface ApiResponse {
  success: boolean;
  error?: string;
}

export default function Profile() {
  const [username, setUsername] = useState('');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [userUUID, setUserUUID] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserUUID = async () => {
      const uuid = await GetUserUUID();
      setUserUUID(uuid);
    };

    fetchUserUUID();
  }, []);

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      setProfileImage(files[0]);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setProfileImage(event.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!userUUID) {
      console.error('User UUID is not available');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_data')
        .update({ username })
        .eq('user_uuid', userUUID);

      if (error) {
        console.error('Error updating username:', error);
      } else {
        console.log('Username updated successfully:', data);
      }

      if (profileImage) {
        const formData = new FormData();
        formData.append('image', profileImage);

        const response: ApiResponse = await Utils.post('/api/ConvertAvif', formData);
        if (response.success) {
          console.log('Profile image uploaded successfully');
        } else {
          console.error('Error uploading profile image:', response.error);
        }
      }
    } catch (error) {
      console.error('Error during submission:', error);
    }
  };

  return (
    <Box sx={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <Box sx={{ marginBottom: '20px' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', marginBottom: '8px' }}>
          Profile Image
        </Typography>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <Button variant="outlined">Upload Image</Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item asChild>
              <label htmlFor="file-upload">
                <input
                  id="file-upload"
                  type="file"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
                Choose File
              </label>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
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
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        sx={{ marginTop: '20px' }}
      >
        Submit
      </Button>
    </Box>
  );
}
