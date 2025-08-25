import React, { useState, useEffect } from 'react';
import { Box, Typography, Select, MenuItem, TextField } from '@mui/material';
import { PyrenzBlueButton, PyrenzCard, PyrenzDialog } from '~/theme';
import { Utils } from '~/utility';
import { useUserStore } from '~/store';
import { Textarea } from '@components';
import { usePyrenzAlert } from '~/provider';

interface InsertModelFormProps {
  onSuccess?: () => void;
}

interface ModelIdentifier {
  name: string;
  slug: string;
  model_description: string;
  subscription_plan: string;
}

export function InsertModelForm({ onSuccess }: InsertModelFormProps) {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [modelDescription, setModelDescription] = useState('');
  const [subscriptionPlan, setSubscriptionPlan] = useState('Melon');
  const [submitting, setSubmitting] = useState(false);
  const [models, setModels] = useState<ModelIdentifier[]>([]);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState<React.ReactNode>(null);
  const [pendingPayload, setPendingPayload] = useState<any>(null);
  const showAlert = usePyrenzAlert();
  const userUUID = useUserStore((state) => state.userUUID);

  const fetchModels = async () => {
    try {
      const { data } = await Utils.db.select<ModelIdentifier>({
        tables: 'model_identifiers',
        columns: 'name, slug, model_description, subscription_plan',
      });
      setModels(data || []);
    } catch (err) {
      console.error('Failed to fetch models:', err);
    }
  };

  const handleInsertModel = async () => {
    if (!name.trim()) {
      showAlert('Name is required', 'error');
      return;
    }
    if (!modelDescription.trim()) {
      showAlert('Description is required', 'error');
      return;
    }
    if (!slug.trim()) {
      showAlert('Slug is required', 'error');
      return;
    }
    try {
      const [author, modelSlug] = slug.split('/');
      if (!author || !modelSlug) {
        showAlert(
          'Invalid slug format. Example: deepseek/deepseek-r1-distill-llama-8b',
          'error'
        );
        return;
      }
      const res = await fetch(
        `https://openrouter.ai/api/v1/models/${author}/${modelSlug}/endpoints`
      );
      if (!res.ok) throw new Error('Failed to fetch pricing');
      const json = await res.json();
      if (!json?.data) {
        showAlert('No data found for this model.', 'error');
        return;
      }
      const payload = json.data;
      if (!payload.endpoints || payload.endpoints.length === 0) {
        showAlert('No endpoints found for this model.', 'error');
        return;
      }
      const pricing = payload.endpoints[0]?.pricing || {};
      const promptPrice = parseFloat(pricing.prompt || '0');
      const completionPrice = parseFloat(pricing.completion || '0');
      const totalCost = promptPrice + completionPrice;
      setDialogContent(
        <Box>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            <strong>Name:</strong> {payload.name}
          </Typography>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            <strong>Slug:</strong> {payload.id}
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            {payload.description}
          </Typography>
          <Typography variant="subtitle1" sx={{ mt: 1 }}>
            <strong>Pricing:</strong>
          </Typography>
          <Typography variant="body2">
            Prompt: ${promptPrice.toFixed(8)} | Completion: $
            {completionPrice.toFixed(8)} | Total per token: $
            {totalCost.toFixed(8)}
          </Typography>
          {payload.architecture && (
            <>
              <Typography variant="subtitle1" sx={{ mt: 2 }}>
                <strong>Architecture:</strong>
              </Typography>
              <Typography variant="body2">
                Tokenizer: {payload.architecture.tokenizer}
              </Typography>
              <Typography variant="body2">
                Instruct Type: {payload.architecture.instruct_type}
              </Typography>
              <Typography variant="body2">
                Modality: {payload.architecture.modality}
              </Typography>
              <Typography variant="body2">
                Input Modalities:{' '}
                {payload.architecture.input_modalities?.join(', ') || 'N/A'}
              </Typography>
              <Typography variant="body2">
                Output Modalities:{' '}
                {payload.architecture.output_modalities?.join(', ') || 'N/A'}
              </Typography>
            </>
          )}
        </Box>
      );
      setPendingPayload(payload);
      setDialogOpen(true);
    } catch (err) {
      console.error(err);
      showAlert('Could not fetch pricing data', 'error');
    }
  };

  const confirmInsertModel = async () => {
    setDialogOpen(false);
    setSubmitting(true);
    try {
      await Utils.db.rpc({
        func: 'insert_model',
        params: {
          admin_uuid: userUUID,
          name: name || pendingPayload?.name || '',
          slug: slug || pendingPayload?.id || '',
          model_description: modelDescription || pendingPayload?.description || '',
          subscription_plan: subscriptionPlan,
        },
      });
      setName('');
      setSlug('');
      setModelDescription('');
      setSubscriptionPlan('Melon');
      if (onSuccess) onSuccess();
      await fetchModels();
      showAlert('Model inserted successfully', 'success');
    } catch (err) {
      console.error('Failed to insert model:', err);
      showAlert('Failed to insert model', 'error');
    } finally {
      setSubmitting(false);
      setPendingPayload(null);
    }
  };

  useEffect(() => {
    fetchModels();
  }, []);

  const filteredModels = models.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box mt={4}>
      <Typography variant="h6" gutterBottom>
        Insert New Model
      </Typography>
      <Textarea
        placeholder="Model Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="mb-4 w-full"
      />
      <Textarea
        placeholder="Model Slug (author/model-slug)"
        value={slug}
        onChange={(e) => setSlug(e.target.value)}
        className="mb-4 w-full"
      />
      <Textarea
        placeholder="Model Description"
        value={modelDescription}
        onChange={(e) => setModelDescription(e.target.value)}
        className="mb-4 w-full"
      />
      <Select
        value={subscriptionPlan}
        onChange={(e) => setSubscriptionPlan(e.target.value)}
        displayEmpty
        className="mb-4 w-full"
      >
        <MenuItem value="Melon">Melon</MenuItem>
        <MenuItem value="Durian">Durian</MenuItem>
        <MenuItem value="Pineapple">Pineapple</MenuItem>
      </Select>
      <Box display="flex" justifyContent="center" mt={2}>
        <PyrenzBlueButton
          variant="contained"
          onClick={handleInsertModel}
          disabled={submitting}
        >
          {submitting ? 'Submitting...' : 'Submit Model'}
        </PyrenzBlueButton>
      </Box>
      <Box mt={4}>
        <Typography variant="h6" gutterBottom>
          Existing Models
        </Typography>
        <TextField
          placeholder="Search models..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
        {filteredModels.length === 0 ? (
          <Typography color="text.secondary">No models found.</Typography>
        ) : (
          <Box
            display="grid"
            gridTemplateColumns="repeat(auto-fill, minmax(280px, 1fr))"
            gap={2}
          >
            {filteredModels.map((model, idx) => (
              <PyrenzCard key={idx}>
                <Typography variant="h6">{model.name}</Typography>
                <Typography color="text.secondary">
                  Slug: {model.slug}
                </Typography>
                <Typography sx={{ mt: 1 }}>{model.model_description}</Typography>
                <Typography sx={{ mt: 1, fontStyle: 'italic' }}>
                  Plan: {model.subscription_plan}
                </Typography>
              </PyrenzCard>
            ))}
          </Box>
        )}
      </Box>
      <PyrenzDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title="Confirm Model Insert"
        content={dialogContent}
        onConfirm={confirmInsertModel}
      />
    </Box>
  );
}
