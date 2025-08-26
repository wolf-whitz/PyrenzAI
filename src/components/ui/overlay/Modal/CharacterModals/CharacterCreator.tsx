import { PyrenzModal, PyrenzModalContent, PyrenzBlueButton, PyrenzMessageBox } from '~/theme';
import { Box } from '@mui/material';
import { useAssistantAPI } from '@components';

export function AssistantModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const {
    messages,
    input,
    setInput,
    contextInput,
    setContextInput,
    loading,
    handleSend,
    handleClear,
    handleContextSubmit,
    handleExtract,
    messagesEndRef,
  } = useAssistantAPI({ initialInstruction: 'You are a helpful assistant.' });

  return (
    <PyrenzModal open={open} onClose={onClose}>
      <PyrenzModalContent sx={{ width: 800, height: 600, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ flex: 1, maxHeight: 400, overflowY: 'auto', mb: 2, px: 1 }}>
          {messages.filter((m) => m.role !== 'system').map((msg, i) => (
            <PyrenzMessageBox
              key={i}
              role={msg.role === 'user' ? 'user' : 'char'}
              displayName={msg.role === 'user' ? 'You' : 'Assistant'}
              content={msg.content}
              isGeneratingEmptyCharMessage={msg.isGeneratingEmptyCharMessage}
              disableReplacement={true}
            />
          ))}
          <div ref={messagesEndRef} />
        </Box>

        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <textarea
            value={contextInput}
            onChange={(e) => setContextInput(e.target.value)}
            placeholder="Context via link..."
            style={{ flex: 1, padding: 10, borderRadius: 8, border: '1px solid #555', background: '#222', color: '#fff', minHeight: 60, resize: 'none' }}
            disabled={loading}
          />
          <PyrenzBlueButton onClick={handleContextSubmit} disabled={loading}>Submit</PyrenzBlueButton>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, mt: 'auto' }}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            style={{ flex: 1, padding: 10, borderRadius: 8, border: '1px solid #555', background: '#222', color: '#fff', minHeight: 60, resize: 'none' }}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(input); } }}
            disabled={loading}
          />
          <PyrenzBlueButton onClick={() => handleSend(input)} disabled={loading}>{loading ? 'Sending...' : 'Send'}</PyrenzBlueButton>
          <PyrenzBlueButton onClick={handleClear} disabled={loading} color="error">Clear</PyrenzBlueButton>
          <PyrenzBlueButton onClick={handleExtract} disabled={loading} color="secondary">Extract</PyrenzBlueButton>
        </Box>
      </PyrenzModalContent>
    </PyrenzModal>
  );
}
