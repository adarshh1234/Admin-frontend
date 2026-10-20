import { useState } from 'react';
import { Button } from '../../common/Button';
import { Input } from '../../common/Input';

interface CreateCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; description: string; icon?: string; color?: string }) => void;
}

const ICONS = [
  'fa-shield-alt',
  'fa-credit-card',
  'fa-heartbeat',
  'fa-code',
  'fa-mobile-alt',
  'fa-user-graduate',
  'fa-cog',
  'fa-database',
  'fa-lock',
  'fa-life-ring',
];

const COLORS = ['#0284c7', '#16a34a', '#e11d48', '#7c3aed', '#d97706', '#0891b2', '#2563eb', '#4f46e5'];

export function CreateCategoryModal({
  isOpen,
  onClose,
  onSubmit,
}: CreateCategoryModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('fa-shield-alt');
  const [selectedColor, setSelectedColor] = useState('#0284c7');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !description.trim()) {
      setError('Please provide category title and description.');
      return;
    }

    onSubmit({
      name: name.trim(),
      description: description.trim(),
      icon: selectedIcon,
      color: selectedColor,
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
        maxWidth: 520,
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
        overflow: 'hidden',
      }}>
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
              background: selectedColor,
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
            }}>
              <i className={`fas ${selectedIcon}`} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#0f172a' }}>
                New Support Category
              </h3>
              <p style={{ margin: 0, fontSize: 13, color: '#64748b' }}>
                Group articles, documentation and routing rules
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

          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
              Category Name *
            </label>
            <Input
              type="text"
              placeholder="e.g. Integrations & Webhooks"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
              Description *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Summary of topics covered by this category..."
              rows={3}
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

          {/* Icon & Color Selector */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 8 }}>
              Icon & Theme Color:
            </label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
              {ICONS.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setSelectedIcon(icon)}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    border: selectedIcon === icon ? '2px solid #0284c7' : '1px solid #cbd5e1',
                    background: selectedIcon === icon ? '#e0f2fe' : '#ffffff',
                    color: selectedIcon === icon ? '#0284c7' : '#64748b',
                    fontSize: 15,
                    cursor: 'pointer',
                  }}
                >
                  <i className={`fas ${icon}`} />
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              {COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: color,
                    border: selectedColor === color ? '3px solid #0f172a' : 'none',
                    cursor: 'pointer',
                  }}
                />
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              <i className="fas fa-plus" style={{ marginRight: 6 }} />
              Create Category
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
