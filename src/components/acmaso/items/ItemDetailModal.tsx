import React from 'react';
import { Button } from '../../common/Button';
import type { ItemDetailModalProps } from './types';

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({
  item,
  onClose,
  onEdit,
  onDelete,
}) => {
  if (!item) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.6)',
        backdropFilter: 'blur(4px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: 16,
          width: '100%',
          maxWidth: 540,
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: 28,
          boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div>
            <span style={{ fontSize: 11.5, fontWeight: 700, color: '#2563eb', textTransform: 'uppercase' }}>
              {item.category || 'ITEM MASTER'}
            </span>
            <h3 style={{ margin: '2px 0 0', fontSize: 18, fontWeight: 800, color: '#0f172a' }}>{item.name}</h3>
            <span style={{ fontFamily: 'monospace', fontSize: 12, color: '#64748b' }}>Code: {item.code}</span>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: '#64748b' }}
          >
            ×
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14, marginBottom: 20 }}>
          <div style={{ background: '#f8fafc', padding: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>Selling Rate</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#0f172a' }}>
              ₹{Number(item.rate).toLocaleString('en-IN')} / {item.unit || 'Unit'}
            </div>
          </div>
          <div style={{ background: '#f8fafc', padding: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>Purchase / Cost Rate</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#64748b' }}>
              ₹{Number(item.purchaseRate || item.purchase_rate || 0).toLocaleString('en-IN')} / {item.unit || 'Unit'}
            </div>
          </div>
          <div style={{ background: '#f8fafc', padding: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>HSN / SAC Code</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', fontFamily: 'monospace' }}>
              {item.hsnSac || item.hsn_code || '—'}
            </div>
          </div>
          <div style={{ background: '#f8fafc', padding: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>GST Tax Bracket</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#2563eb' }}>
              GST-{item.taxRate ?? item.tax_rate ?? 18}%
            </div>
          </div>
        </div>

        <div
          style={{
            background: '#f8fafc',
            padding: 12,
            borderRadius: 8,
            border: '1px solid #e2e8f0',
            marginBottom: 14,
            fontSize: 12.5,
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
          }}
        >
          <div>
            <strong>Default Income Account:</strong> {item.incomeAccount || item.income_account || 'Sales'}
          </div>
          <div>
            <strong>Default Expense Account:</strong> {item.expenseAccount || item.expense_account || 'Cost of Goods Sold'}
          </div>
          <div>
            <strong>Unit Type:</strong> {item.unit || 'Unit'}
          </div>
        </div>

        {item.description && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 4 }}>Description:</div>
            <div
              style={{
                background: '#fff',
                border: '1px solid #e2e8f0',
                padding: 10,
                borderRadius: 8,
                fontSize: 13,
                color: '#334155',
                lineHeight: 1.5,
              }}
            >
              {item.description}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button
            variant="outline"
            size="sm"
            style={{ color: '#ef4444', borderColor: '#ef4444' }}
            onClick={() => onDelete(item)}
          >
            <i className="fas fa-trash-alt" style={{ marginRight: 6 }} /> Delete Item
          </Button>
          <div style={{ display: 'flex', gap: 10 }}>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button variant="primary" onClick={() => onEdit(item)}>
              <i className="fas fa-edit" style={{ marginRight: 6 }} /> Edit Item
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
