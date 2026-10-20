import React, { useState } from 'react';
import { Modal } from '../../common/Modal';
import { Button } from '../../common/Button';
import { Input } from '../../common/Input';

interface ManualDialerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDial: (phone: string, name: string) => void;
}

export const ManualDialerModal: React.FC<ManualDialerModalProps> = ({
  isOpen,
  onClose,
  onDial,
}) => {
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');

  const handleDial = () => {
    if (!phone.trim()) return;
    onDial(phone.trim(), name.trim());
    setPhone('');
    setName('');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Dial Outbound Call"
      size="sm"
      footer={
        <>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={handleDial}
            disabled={!phone.trim()}
            style={{ background: '#16a34a', borderColor: '#16a34a', gap: 6 }}
          >
            <i className="fas fa-phone-alt" />
            <span>Initiate Call</span>
          </Button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 6 }}>
            Customer Phone Number *
          </label>
          <Input
            type="text"
            placeholder="+91 98XXX XXXXX"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 6 }}>
            Customer Name (Optional)
          </label>
          <Input
            type="text"
            placeholder="e.g. Dr. Anita Desai"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
      </div>
    </Modal>
  );
};
