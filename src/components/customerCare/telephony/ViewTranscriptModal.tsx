import React from 'react';
import { Modal } from '../../common/Modal';
import { Button } from '../../common/Button';
import { useToast } from '../../../hooks/useToast';
import type { CustomerCallRecord } from '../../../types/customerCare';

interface ViewTranscriptModalProps {
  call: CustomerCallRecord | null;
  onClose: () => void;
}

export const ViewTranscriptModal: React.FC<ViewTranscriptModalProps> = ({ call, onClose }) => {
  const { showToast } = useToast();

  if (!call) return null;

  const handleCopy = () => {
    if (call.transcript) {
      navigator.clipboard.writeText(call.transcript);
      showToast('Transcript copied to clipboard!', 'success');
    }
  };

  return (
    <Modal
      isOpen={Boolean(call)}
      onClose={onClose}
      title="Call Audio Transcript"
      subtitle={`${call.customerName} (${call.customerPhone}) • ${call.callDate}`}
      size="md"
      footer={
        <>
          <Button type="button" variant="outline" onClick={handleCopy} disabled={!call.transcript}>
            <i className="fas fa-copy" style={{ marginRight: 6 }} />
            Copy Transcript
          </Button>
          <Button type="button" variant="primary" onClick={onClose}>
            Close
          </Button>
        </>
      }
    >
      <div
        style={{
          background: '#f8fafc',
          padding: 16,
          borderRadius: 12,
          border: '1px solid #e2e8f0',
          fontSize: 13,
          lineHeight: 1.6,
          color: '#1e293b',
          whiteSpace: 'pre-wrap',
          fontFamily: 'inherit',
          maxHeight: 380,
          overflowY: 'auto',
        }}
      >
        {call.transcript || 'No transcript record available.'}
      </div>
    </Modal>
  );
};
