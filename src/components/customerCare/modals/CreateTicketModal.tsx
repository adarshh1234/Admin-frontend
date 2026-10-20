import { useState } from 'react';
import { Button } from '../../common/Button';
import { Input } from '../../common/Input';
import type { TicketPriority, TicketCategory, AgentUser } from '../../../types/customerCare';

interface CreateTicketModalProps {
  isOpen: boolean;
  agents: AgentUser[];
  onClose: () => void;
  onSubmit: (data: {
    customerName: string;
    customerEmail: string;
    customerCompany?: string;
    customerTier?: 'Standard' | 'Enterprise' | 'VIP';
    subject: string;
    category: TicketCategory;
    priority: TicketPriority;
    assignedAgent: string;
    description: string;
    tags?: string[];
  }) => void;
}

const CATEGORIES: TicketCategory[] = [
  'Technical Support',
  'Billing & Accounts',
  'Clinical Operations',
  'Feature Request',
  'Onboarding & Access',
  'Compliance & Security',
];

export function CreateTicketModal({
  isOpen,
  agents,
  onClose,
  onSubmit,
}: CreateTicketModalProps) {
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerCompany, setCustomerCompany] = useState('');
  const [customerTier, setCustomerTier] = useState<'Standard' | 'Enterprise' | 'VIP'>('Standard');
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState<TicketCategory>('Technical Support');
  const [priority, setPriority] = useState<TicketPriority>('Medium');
  const [assignedAgent, setAssignedAgent] = useState<string>(agents[0]?.name || 'David Chen');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!customerName.trim() || !customerEmail.trim() || !subject.trim() || !description.trim()) {
      setError('Please provide customer name, email, subject, and ticket description.');
      return;
    }

    onSubmit({
      customerName: customerName.trim(),
      customerEmail: customerEmail.trim().toLowerCase(),
      customerCompany: customerCompany.trim() || undefined,
      customerTier,
      subject: subject.trim(),
      category,
      priority,
      assignedAgent,
      description: description.trim(),
    });
    onClose();
  }

  return (
    <div className="modal-overlay" style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: 16,
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: 16,
        width: '100%',
        maxWidth: 600,
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#f8fafc',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #0284c7, #2563eb)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
            }}>
              <i className="fas fa-ticket-alt" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#0f172a' }}>
                Create Support Ticket
              </h3>
              <p style={{ margin: 0, fontSize: 13, color: '#64748b' }}>
                Open an internal or customer-reported incident ticket
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: 18 }}
          >
            <i className="fas fa-times" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: 24 }}>
          {error && (
            <div style={{
              padding: '10px 14px',
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: 8,
              color: '#dc2626',
              fontSize: 13,
              marginBottom: 16,
            }}>
              {error}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                Customer Name *
              </label>
              <Input
                type="text"
                placeholder="e.g. Dr. Anita Desai"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                Customer Email *
              </label>
              <Input
                type="email"
                placeholder="e.g. anita@apollohealth.org"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 14, marginBottom: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                Organization / Company
              </label>
              <Input
                type="text"
                placeholder="e.g. Apollo Health Enterprises"
                value={customerCompany}
                onChange={(e) => setCustomerCompany(e.target.value)}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                Account SLA Tier
              </label>
              <select
                value={customerTier}
                onChange={(e) => setCustomerTier(e.target.value as any)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: 8,
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  fontSize: 13,
                }}
              >
                <option value="Standard">Standard (24h SLA)</option>
                <option value="Enterprise">Enterprise (4h SLA)</option>
                <option value="VIP">VIP Platinum (15m SLA)</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
              Ticket Subject *
            </label>
            <Input
              type="text"
              placeholder="Brief summary of the issue or inquiry"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as TicketCategory)}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: 8,
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  fontSize: 12,
                }}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TicketPriority)}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: 8,
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  fontSize: 12,
                }}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                Assign Agent
              </label>
              <select
                value={assignedAgent}
                onChange={(e) => setAssignedAgent(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: 8,
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  fontSize: 12,
                }}
              >
                {agents.map((a) => (
                  <option key={a.id} value={a.name}>{a.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
              Detailed Description *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide exact error messages, affected workflows, or customer requests..."
              rows={4}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 8,
                border: '1px solid #cbd5e1',
                fontSize: 13,
                outline: 'none',
                boxSizing: 'border-box',
              }}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              <i className="fas fa-plus" style={{ marginRight: 6 }} />
              Create Ticket
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
