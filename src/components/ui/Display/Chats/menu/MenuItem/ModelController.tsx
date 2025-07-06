import React, { useState, useEffect } from 'react';
import { Textarea, GetUserUUID } from '@components';
import { PyrenzSlider } from '~/theme';
import { supabase } from '~/Utility/supabaseClient';
import { applyTokenizer, decodeTokenizer } from "~/Utility/Tokenizer";
import { Box, Button, Typography, Tooltip, IconButton } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

export function ModelControl() {
  const [blockedWords, setBlockedWords] = useState('');
  const [encouragedWords, setEncouragedWords] = useState('');
  const [blockedFrequency, setBlockedFrequency] = useState(-100);
  const [encouragedFrequency, setEncouragedFrequency] = useState(100);
  const [userUUID, setUserUUID] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      const uuid = await GetUserUUID();
      if (!uuid) return;
      setUserUUID(uuid);

      const { data, error } = await supabase
        .from('user_data')
        .select('model_controls')
        .eq('user_uuid', uuid)
        .single();

      if (error) {
        console.error('Error fetching model_controls:', error);
        return;
      }

      const controls = data?.model_controls;
      if (!controls) return;

      if (Array.isArray(controls.blocked) && controls.blocked.length > 0) {
        const decoded = controls.blocked.map((tokens: number[]) => decodeTokenizer(tokens)).join(', ');
        setBlockedWords(decoded);
      }

      if (Array.isArray(controls.encouraged) && controls.encouraged.length > 0) {
        const decoded = controls.encouraged.map((tokens: number[]) => decodeTokenizer(tokens)).join(', ');
        setEncouragedWords(decoded);
      }

      const controller = controls.controller ?? {};
      if (controller['Blocked Words Frequency']) {
        setBlockedFrequency(controller['Blocked Words Frequency']);
      }

      if (controller['Encouraged Word Frequency']) {
        setEncouragedFrequency(controller['Encouraged Word Frequency']);
      }
    };

    init();
  }, []);

  const handleSubmit = async () => {
    if (!userUUID) return;

    const blockedWordsArray = blockedWords.split(',').map(word => word.trim()).filter(Boolean);
    const encouragedWordsArray = encouragedWords.split(',').map(word => word.trim()).filter(Boolean);
    const blockedTokens = blockedWordsArray.map(word => applyTokenizer(word));
    const encouragedTokens = encouragedWordsArray.map(word => applyTokenizer(word));

    const data = {
      model_controls: {
        blocked: blockedTokens,
        encouraged: encouragedTokens,
        controller: {
          "Blocked Words Frequency": blockedFrequency,
          "Encouraged Word Frequency": encouragedFrequency,
        },
      },
    };

    const { error } = await supabase
      .from('user_data')
      .update(data)
      .eq('user_uuid', userUUID);

    if (error) {
      console.error('Error submitting data:', error);
    } else {
      console.log('Data submitted successfully');
    }
  };

  return (
    <Box>
      <Box display="flex" alignItems="center">
        <Typography variant="h6">Blocked Words</Typography>
        <Tooltip title="Words that the model will avoid using">
          <IconButton>
            <HelpOutlineIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
      <Textarea
        value={blockedWords}
        onChange={(e) => setBlockedWords(e.target.value)}
        placeholder="Enter blocked words separated by commas..."
      />

      <Box display="flex" alignItems="center">
        <Typography variant="h6">Encouraged Words</Typography>
        <Tooltip title="Words that the model will prefer using">
          <IconButton>
            <HelpOutlineIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
      <Textarea
        value={encouragedWords}
        onChange={(e) => setEncouragedWords(e.target.value)}
        placeholder="Enter encouraged words separated by commas..."
      />

      <Box display="flex" alignItems="center">
        <Typography variant="subtitle1">Blocked Words Frequency: {blockedFrequency}</Typography>
        <Tooltip title="Adjust the frequency penalty for blocked words">
          <IconButton>
            <HelpOutlineIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
      <PyrenzSlider
        value={blockedFrequency}
        onChange={(e, newValue) => setBlockedFrequency(newValue as number)}
        min={-100}
        max={0}
      />

      <Box display="flex" alignItems="center">
        <Typography variant="subtitle1">Encouraged Word Frequency: {encouragedFrequency}</Typography>
        <Tooltip title="Adjust the frequency bonus for encouraged words">
          <IconButton>
            <HelpOutlineIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
      <PyrenzSlider
        value={encouragedFrequency}
        onChange={(e, newValue) => setEncouragedFrequency(newValue as number)}
        min={0}
        max={100}
      />

      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        disabled={!userUUID}
      >
        Submit
      </Button>
    </Box>
  );
}
