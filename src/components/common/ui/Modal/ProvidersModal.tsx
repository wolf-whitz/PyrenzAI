import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Card,
  CardContent,
  Typography,
} from '@mui/material';
import ReactDOM from 'react-dom';
import { supabase } from '~/Utility/supabaseClient';

interface Provider {
  provider_name: string;
  provider_website: string;
  provider_api_link: string;
  provider_description: string;
}

interface ProviderModalsProps {
  open: boolean;
  onClose: () => void;
  onSelect: (provider: Provider) => void;
}

export default function ProviderModals({
  open,
  onClose,
  onSelect,
}: ProviderModalsProps) {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const { data, error } = await supabase
          .from('providers')
          .select(
            'provider_name, provider_website, provider_api_link, provider_description'
          );

        if (error) {
          throw error;
        }

        setProviders(data);
      } catch (error) {
        console.error('Error fetching providers:', error);
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      fetchProviders();
    }
  }, [open]);

  const handleSelect = (provider: Provider) => {
    onSelect(provider);
    onClose();
  };

  if (!open) return null;

  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) {
    console.error('Modal root element not found');
    return null;
  }

  return ReactDOM.createPortal(
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      className="p-4"
    >
      <DialogTitle className="text-2xl font-bold">
        Premade Providers
      </DialogTitle>
      <DialogContent>
        {loading ? (
          <Typography className="text-gray-600">
            Loading providers...
          </Typography>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {providers.map((provider) => (
              <Card
                key={provider.provider_name}
                className="shadow-md rounded-lg"
              >
                <CardContent className="p-4">
                  <Typography
                    variant="h5"
                    component="div"
                    className="text-xl font-semibold"
                  >
                    {provider.provider_name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    className="text-gray-600"
                  >
                    {provider.provider_description}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    className="text-gray-600"
                  >
                    Website:{' '}
                    <a
                      href={provider.provider_website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      {provider.provider_website}
                    </a>
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    className="text-gray-600"
                  >
                    API Link:{' '}
                    <a
                      href={provider.provider_api_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      {provider.provider_api_link}
                    </a>
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleSelect(provider)}
                    fullWidth
                    className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Select
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          color="primary"
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>,
    modalRoot
  );
}
