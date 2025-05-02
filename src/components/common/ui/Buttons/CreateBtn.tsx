import React from 'react';
import { Button, CircularProgress } from '@mui/material';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

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
      className={classNames('flex items-center', className)}
      startIcon={
        loading ? (
          <CircularProgress size={20} color="inherit" />
        ) : (
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
        )
      }
    >
      {loading ? 'Submitting...' : 'Create'}
    </Button>
  );
}
