import React from 'react';
import { CircularProgress } from '@mui/material';
import clsx from 'clsx';
import { Plus } from 'lucide-react';
import { PyrenzBlueButton } from '~/theme';

interface CreateButtonProps {
  loading: boolean;
  className?: string;
}

export function CreateButton({ loading, className }: CreateButtonProps) {
  return (
    <PyrenzBlueButton
      type="submit"
      disabled={loading}
      variant="contained"
      className={clsx('flex items-center', className)}
      startIcon={
        loading ? (
          <CircularProgress size={20} color="inherit" />
        ) : (
          <Plus className="mr-2" />
        )
      }
    >
      {loading ? 'Submitting...' : 'Create'}
    </PyrenzBlueButton>
  );
}
