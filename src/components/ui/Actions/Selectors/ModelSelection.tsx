import { useState, useEffect } from 'react';
import {
  Box,
  Popover,
  IconButton,
  Typography,
  CircularProgress,
  Paper,
} from '@mui/material';
import {
  HelpOutlineOutlined as HelpIcon,
  Lock as LockIcon,
} from '@mui/icons-material';
import { PyrenzAccordionInput } from '~/theme';
import { Utils } from '~/Utility';
import { GetUserUUID } from '@components';

interface PrivateModel {
  model_name: string;
  model_description: string;
}

interface ModelOption {
  value: string;
  label: string;
  description: string;
  subscription_plan: string;
  isPrivate?: boolean;
}

interface ModelSelectionProps {
  preferredModel: string;
  setPreferredModel: (value: string) => void;
}

export function ModelSelection({
  preferredModel,
  setPreferredModel,
}: ModelSelectionProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [popoverContent, setPopoverContent] = useState('');
  const [modelOptions, setModelOptions] = useState<ModelOption[] | null>(null);
  const [privateModels, setPrivateModels] = useState<
    Record<string, PrivateModel>
  >({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userUUID = await GetUserUUID();

        const { data: modelIdentifiers } = await Utils.db.select<{
          name: string;
          subscription_plan: string;
          model_description: string;
        }>('model_identifiers', 'name, subscription_plan, model_description');

        const { data: privateModelsData } = await Utils.db.select<PrivateModel>(
          'private_models',
          'model_name, model_description',
          null,
          { user_uuid: userUUID } 
        );

        const formattedModelOptions: ModelOption[] = modelIdentifiers.map(
          (model) => ({
            value: model.name,
            label: model.name,
            description: model.model_description,
            subscription_plan: model.subscription_plan,
          })
        );

        const formattedPrivateModels = privateModelsData.reduce(
          (acc, model) => {
            acc[model.model_name] = {
              model_name: model.model_name,
              model_description: model.model_description,
            };
            return acc;
          },
          {} as Record<string, PrivateModel>
        );

        setModelOptions(formattedModelOptions);
        setPrivateModels(formattedPrivateModels);
      } catch (error) {
        console.error('Error fetching model data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handlePopoverOpen = (
    event: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>,
    description: string
  ) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget as HTMLElement);
    setPopoverContent(description);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const mergedModels: ModelOption[] = [
    ...(modelOptions ?? []),
    ...Object.entries(privateModels)
      .filter(([key]) => !(modelOptions ?? []).some((opt) => opt.value === key))
      .map(([key, value]) => ({
        value: key,
        label: value.model_name,
        description: value.model_description,
        subscription_plan: 'Private',
        isPrivate: true,
      })),
  ];

  return (
    <Box sx={{ mt: 4 }}>
      <PyrenzAccordionInput label="Preferred Model">
        {loading || mergedModels.length === 0 ? (
          <Box display="flex" justifyContent="center" p={2}>
            <CircularProgress />
          </Box>
        ) : (
          <Box display="flex" flexDirection="column" gap={2}>
            {mergedModels.map((option) => {
              const isSelected = option.value === preferredModel;
              return (
                <Paper
                  key={option.value}
                  onClick={() => setPreferredModel(option.value)}
                  elevation={isSelected ? 6 : 2}
                  sx={{
                    p: 2,
                    cursor: 'pointer',
                    border: '1px solid',
                    borderColor: isSelected ? '#add8e6' : '#444',
                    backgroundColor: isSelected ? '#2a2a2a' : '#1e1e1e',
                    color: '#fff',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    '&:hover': {
                      borderColor: '#add8e6',
                    },
                  }}
                >
                  <Box display="flex" alignItems="center">
                    <Typography variant="body1">{option.label}</Typography>
                    {option.isPrivate && (
                      <LockIcon fontSize="small" sx={{ ml: 1 }} />
                    )}
                    <Typography variant="caption" color="gray" sx={{ ml: 2 }}>
                      Plan: {option.subscription_plan}
                    </Typography>
                  </Box>
                  <IconButton
                    onMouseEnter={(e) =>
                      handlePopoverOpen(e, option.description)
                    }
                    onMouseLeave={handlePopoverClose}
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePopoverOpen(e, option.description);
                    }}
                    size="small"
                    sx={{ color: '#fff' }}
                  >
                    <HelpIcon fontSize="small" />
                  </IconButton>
                </Paper>
              );
            })}
          </Box>
        )}
        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handlePopoverClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          sx={{ pointerEvents: 'none' }}
          disableRestoreFocus
        >
          <Box p={2}>{popoverContent}</Box>
        </Popover>
      </PyrenzAccordionInput>
    </Box>
  );
}
