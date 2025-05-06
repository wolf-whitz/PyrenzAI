import React from 'react';
import { Button, CircularProgress } from '@mui/material';
import clsx from 'clsx';
import { Plus } from 'lucide-react';

interface CreateButtonProps {
  loading: boolean;
  className?: string;
}

export default function CreateButton({
  loading,
  className,
}: CreateButtonProps) {
  return (
    <Button
      type="submit"
      disabled={loading}
      variant="contained"
      color="primary"
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
    </Button>
  );
}
