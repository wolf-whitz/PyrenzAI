import React, { useState } from 'react'
import {
  Box,
  Typography,
  MenuItem,
  Tooltip,
  IconButton,
  CardContent,
} from '@mui/material'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import { Textarea, useApiSettings } from '@components'
import {
  PyrenzBlueButton,
  PyrenzFormControl,
  PyrenzInputLabel,
  PyrenzDialog,
  PyrenzMenu,
  PyrenzCard,
  PyrenzSelect,
} from '~/theme'

export const Api = () => {
  const {
    apiKey,
    modelName,
    modelDescription,
    apiUrl,
    providers,
    selectedProvider,
    userModels,
    setApiKey,
    setModelName,
    setModelDescription,
    setApiUrl,
    handleProviderChange,
    handleSubmit,
    handleEdit,
    handleDelete,
  } = useApiSettings()

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedModelIndex, setSelectedModelIndex] = useState<number | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [modelToDelete, setModelToDelete] = useState<string | null>(null)

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, index: number) => {
    setAnchorEl(event.currentTarget)
    setSelectedModelIndex(index)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedModelIndex(null)
  }

  const handleEditClick = () => {
    if (selectedModelIndex !== null) {
      const model = userModels[selectedModelIndex]
      setModelName(model.model_name)
      setModelDescription(model.model_description)
      handleEdit(model.id)
    }
    handleMenuClose()
  }

  const handleDeleteClick = () => {
    if (selectedModelIndex !== null) {
      const model = userModels[selectedModelIndex]
      setModelToDelete(model.id)
      setDialogOpen(true)
    }
    handleMenuClose()
  }

  const confirmDelete = () => {
    if (modelToDelete !== null) {
      handleDelete(modelToDelete)
      setModelToDelete(null)
    }
    setDialogOpen(false)
  }

  const cancelDelete = () => {
    setModelToDelete(null)
    setDialogOpen(false)
  }

  const truncate = (text: string, max: number) =>
    text.length > max ? text.slice(0, max) + '...' : text

  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        API Settings
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ flex: 1 }}>
        <Box mb={2}>
          <PyrenzFormControl fullWidth>
            <PyrenzInputLabel id="provider-select-label">Select Provider</PyrenzInputLabel>
            <PyrenzSelect
              labelId="provider-select-label"
              id="provider-select"
              value={selectedProvider}
              label="Select Provider"
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
          <Textarea
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
            placeholder="Enter the API URL"
            require_link={true}
          />
        </Box>

        <Box mb={2}>
          <Typography variant="subtitle1">API Key</Typography>
          <Textarea
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your API Key"
          />
        </Box>

        <Box mb={2}>
          <Typography variant="subtitle1">Model Name</Typography>
          <Textarea
            value={modelName}
            onChange={(e) => setModelName(e.target.value)}
            placeholder="Enter the Model Name or slug name eg moonshotai/kimi-k2:free"
          />
        </Box>

        <Box mb={2}>
          <Typography variant="subtitle1">Model Description</Typography>
          <Textarea
            value={modelDescription}
            onChange={(e) => setModelDescription(e.target.value)}
            placeholder="Describe your model's vibes"
          />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <PyrenzBlueButton type="submit">Save Settings</PyrenzBlueButton>
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
                  <Typography variant="h5" component="div">
                    {model.model_name}
                  </Typography>
                  <IconButton
                    aria-label="more"
                    aria-controls="pyrenz-model-menu"
                    aria-haspopup="true"
                    onClick={(event) => handleMenuOpen(event, index)}
                  >
                    <MoreHorizIcon />
                  </IconButton>
                </Box>

                <Typography variant="body2">
                  {truncate(model.model_description, 100)}
                </Typography>
              </CardContent>

              <PyrenzMenu
                anchorEl={anchorEl}
                open={Boolean(anchorEl) && selectedModelIndex === index}
                onClose={handleMenuClose}
              >
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
  )
}
