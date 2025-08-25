import React, { useState } from 'react';
import {
  Box,
  Typography,
  MenuItem,
  Tooltip,
  IconButton,
  CardContent,
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { Textarea, useApiSettings } from '@components';
import {
  PyrenzBlueButton,
  PyrenzFormControl,
  PyrenzInputLabel,
  PyrenzDialog,
  PyrenzMenu,
  PyrenzCard,
  PyrenzSelect,
} from '~/theme';

interface Provider {
  provider_name: string;
  provider_description: string;
  provider_link: string;
}

interface UserModel {
  id: string;
  model_name: string;
  model_description: string;
  model_api_key: string;
  model_url: string;
}

export function Api() {
  const {
    modelApiKey,
    modelName,
    modelDescription,
    modelUrl,
    providers,
    selectedProvider,
    userModels,
    setModelApiKey,
    setModelName,
    setModelDescription,
    setModelUrl,
    setSelectedProvider,
    handleProviderChange,
    handleSubmit,
    handleDelete,
    clearForm,
  } = useApiSettings();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedModelIndex, setSelectedModelIndex] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [modelToDelete, setModelToDelete] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingModelId, setEditingModelId] = useState<string | null>(null);

  function handleMenuOpen(event: React.MouseEvent<HTMLElement>, index: number) {
    setAnchorEl(event.currentTarget);
    setSelectedModelIndex(index);
  }

  function handleMenuClose() {
    setAnchorEl(null);
    setSelectedModelIndex(null);
  }

  function handleEditClick() {
    if (selectedModelIndex !== null) {
      const model = userModels[selectedModelIndex];
      setModelName(model.model_name);
      setModelDescription(model.model_description);
      setModelApiKey(model.model_api_key || '');
      setModelUrl(model.model_url || '');
      setSelectedProvider(
        providers.find((p) => p.provider_link === model.model_url)?.provider_name || ''
      );
      setIsEditing(true);
      setEditingModelId(model.id);
    }
    handleMenuClose();
  }

  function handleDeleteClick() {
    if (selectedModelIndex !== null) {
      const model = userModels[selectedModelIndex];
      setModelToDelete(model.id);
      setDialogOpen(true);
    }
    handleMenuClose();
  }

  async function confirmDelete() {
    if (modelToDelete) {
      await handleDelete(modelToDelete);
      setModelToDelete(null);
    }
    setDialogOpen(false);
  }

  function cancelDelete() {
    setModelToDelete(null);
    setDialogOpen(false);
  }

  async function handleFormSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (isEditing && editingModelId) {
      await handleSubmit(event, editingModelId);
      setIsEditing(false);
      setEditingModelId(null);
    } else {
      await handleSubmit(event);
    }
    clearForm();
  }

  function truncate(text: string, max: number) {
    return text.length > max ? `${text.slice(0, max)}...` : text;
  }

  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        API Settings
      </Typography>
      <Box component="form" onSubmit={handleFormSubmit} sx={{ flex: 1, backgroundColor: 'transparent' }}>
        <Box mb={2}>
          <PyrenzFormControl fullWidth>
            <PyrenzInputLabel id="provider-select-label">Select Provider</PyrenzInputLabel>
            <PyrenzSelect
              labelId="provider-select-label"
              id="provider-select"
              value={selectedProvider}
              onChange={handleProviderChange}
            >
              {providers.map((provider, index) => (
                <MenuItem key={index} value={provider.provider_name}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
                    <Typography>{provider.provider_name}</Typography>
                    <Tooltip title={provider.provider_description} arrow>
                      <IconButton size="small" edge="end">
                        <InfoOutlinedIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </MenuItem>
              ))}
            </PyrenzSelect>
          </PyrenzFormControl>
        </Box>
        <Box mb={2}>
          <Typography variant="subtitle1">API URL</Typography>
          <Textarea value={modelUrl} onChange={(e) => setModelUrl(e.target.value)} placeholder="Enter the API URL" require_link />
        </Box>
        <Box mb={2}>
          <Typography variant="subtitle1">API Key</Typography>
          <Textarea value={modelApiKey} onChange={(e) => setModelApiKey(e.target.value)} placeholder="Enter your API Key" />
        </Box>
        <Box mb={2}>
          <Typography variant="subtitle1">Model Name</Typography>
          <Textarea value={modelName} onChange={(e) => setModelName(e.target.value)} placeholder="Enter the Model Name or slug name" />
        </Box>
        <Box mb={2}>
          <Typography variant="subtitle1">Model Description</Typography>
          <Textarea value={modelDescription} onChange={(e) => setModelDescription(e.target.value)} placeholder="Describe your model's vibes" />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <PyrenzBlueButton type="submit">
            {isEditing ? 'Update Model' : 'Save Settings'}
          </PyrenzBlueButton>
        </Box>
      </Box>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Your Models
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          {userModels.map((model, index) => (
            <PyrenzCard key={index} sx={{ minWidth: 275 }}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="h5">{model.model_name}</Typography>
                  <IconButton aria-label="more" aria-controls="pyrenz-model-menu" aria-haspopup="true" onClick={(event) => handleMenuOpen(event, index)}>
                    <MoreHorizIcon />
                  </IconButton>
                </Box>
                <Typography variant="body2">{truncate(model.model_description, 100)}</Typography>
              </CardContent>
              <PyrenzMenu anchorEl={anchorEl} open={Boolean(anchorEl) && selectedModelIndex === index} onClose={handleMenuClose}>
                <MenuItem onClick={handleEditClick}>Edit</MenuItem>
                <MenuItem onClick={handleDeleteClick}>Delete</MenuItem>
              </PyrenzMenu>
            </PyrenzCard>
          ))}
        </Box>
      </Box>
      <PyrenzDialog
        open={dialogOpen}
        onClose={cancelDelete}
        title="Confirm Delete"
        content="Are you sure you want to delete this model? This action cannot be undone."
        onConfirm={confirmDelete}
      />
    </Box>
  );
}
