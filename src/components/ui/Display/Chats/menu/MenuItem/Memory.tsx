import React, { useState, useEffect, useMemo } from 'react';
import { Box, Button, Typography, Tooltip } from '@mui/material';
import { Textarea } from '@components';
import { supabase } from '~/Utility/supabaseClient';
import { usePyrenzAlert } from '~/provider';
import { useParams } from 'react-router-dom';
import { LlamaTokenizer } from 'llama-tokenizer-js';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import WarningIcon from '@mui/icons-material/Warning';

export function Memory() {
  const [textValue, setTextValue] = useState('');
  const [tokenCount, setTokenCount] = useState<number | null>(null);
  const showAlert = usePyrenzAlert();
  const { chat_uuid } = useParams<{ chat_uuid: string }>();
  const tokenizer = useMemo(() => new LlamaTokenizer(), []);

  useEffect(() => {
    const fetchMemory = async () => {
      if (!chat_uuid) {
        showAlert('Unknown Chat', 'alert');
        return;
      }

      try {
        const { data, error } = await supabase
          .from('chats')
          .select('characters_memories')
          .eq('chat_uuid', chat_uuid)
          .single();

        if (error) {
          throw error;
        }

        if (data) {
          setTextValue(data.characters_memories || '');
        }
      } catch (error) {
        console.error('Error fetching memory:', error);
        showAlert('Failed to fetch memory. Please try again.', 'alert');
      }
    };

    fetchMemory();
  }, [chat_uuid]);

  useEffect(() => {
    setTokenCount(null);
    const timeout = setTimeout(() => {
      const tokens = tokenizer.encode(textValue);
      setTokenCount(tokens.length);
    }, 300);

    return () => clearTimeout(timeout);
  }, [textValue, tokenizer]);

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextValue(event.target.value);
  };

  const handleSubmit = async () => {
    try {
      if (!chat_uuid) {
        showAlert('Unknown Chat', 'alert');
        return;
      }

      const { error } = await supabase
        .from('chats')
        .update({ characters_memories: textValue })
        .eq('chat_uuid', chat_uuid);

      if (error) {
        throw error;
      }

      showAlert('Memory updated successfully!', 'success');
    } catch (error) {
      console.error('Error updating memory:', error);
      showAlert('Failed to update memory. Please try again.', 'alert');
    }
  };

  if (chat_uuid === undefined) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="h6">Unknown Chat</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Box className="flex items-center mb-2 flex-col">
        <Textarea
          label="Characters Memories"
          value={textValue}
          onChange={handleTextChange}
        />
        <Typography variant="caption" display="block" sx={{ mt: 1 }}>
          Longer memory can lead to better recall, but it may also increase the
          risk of hallucinations and cause the bot to forget parts of the
          scenario. It's also best to use {'{{char}}'} and {'{{user}}'} to
          denote the user and character.
        </Typography>
        <Box display="flex" alignItems="center" sx={{ mt: 1 }}>
          {tokenCount !== null && (
            <Tooltip
              title={
                tokenCount <= 1000
                  ? 'Good memory limit'
                  : 'Too many tokens, consider reducing'
              }
            >
              {tokenCount <= 1000 ? (
                <CheckCircleOutlineIcon color="success" sx={{ mr: 1 }} />
              ) : (
                <WarningIcon color="warning" sx={{ mr: 1 }} />
              )}
            </Tooltip>
          )}
          <Typography variant="caption">
            Token Count: {tokenCount === null ? 'Counting...' : tokenCount}
          </Typography>
        </Box>
      </Box>
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        fullWidth
      >
        Submit
      </Button>
    </Box>
  );
}
