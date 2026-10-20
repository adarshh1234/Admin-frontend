import { Button } from '../common/Button';
import type { ActivityItem, DocumentItem } from '../../types/platformUsers';

// ---------------------------------------------------------------------------
// CONFIRMATION DIALOG MODAL
// ---------------------------------------------------------------------------
interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'primary' | 'success';
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmationModal({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'primary',
  onConfirm,
  onCancel,
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  const colorMap = {
    danger: { bg: '#fee2e2', color: '#dc2626', icon: 'fa-trash-alt', btnBg: '#dc2626' },
    warning: { bg: '#fef3c7', color: '#d97706', icon: 'fa-exclamation-triangle', btnBg: '#d97706' },
    primary: { bg: '#eff6ff', color: '#2563eb', icon: 'fa-info-circle', btnBg: '#2563eb' },
    success: { bg: '#dcfce7', color: '#16a34a', icon: 'fa-check-circle', btnBg: '#16a34a' },
  };

  const style = colorMap[variant];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}
      onClick={onCancel}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: 16,
          width: '100%',
          maxWidth: 440,
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
          padding: '24px',
          animation: 'modalFadeIn 0.15s ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: style.bg,
              color: style.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
              flexShrink: 0,
            }}
          >
            <i className={`fas ${style.icon}`} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: '#0f172a' }}>{title}</h3>
          </div>
        </div>

        <p style={{ margin: '0 0 24px 0', fontSize: 13.5, color: '#64748b', lineHeight: 1.5 }}>
          {message}
        </p>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <Button variant="outline" onClick={onCancel} style={{ fontSize: 13, padding: '8px 18px' }}>
            {cancelLabel}
          </Button>
          <button
            type="button"
            onClick={onConfirm}
            style={{
              background: style.btnBg,
              color: '#ffffff',
              border: 'none',
              borderRadius: 8,
              padding: '8px 20px',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// ACTIVITY AUDIT TRAIL MODAL
// ---------------------------------------------------------------------------
interface ActivityModalProps {
  isOpen: boolean;
  entityName: string;
  activities: ActivityItem[];
  onClose: () => void;
}

export function ActivityModal({ isOpen, entityName, activities, onClose }: ActivityModalProps) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: 16,
          width: '100%',
          maxWidth: 560,
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
          padding: '24px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, borderBottom: '1px solid #f1f5f9', paddingBottom: 14 }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: '#0f172a' }}>
              <i className="fas fa-history" style={{ color: '#2563eb', marginRight: 8 }} />
              Activity Log: {entityName}
            </h3>
            <span style={{ fontSize: 12, color: '#64748b' }}>Complete audit trail &amp; system events</span>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', fontSize: 18, color: '#94a3b8', cursor: 'pointer' }}
          >
            <i className="fas fa-times" />
          </button>
        </div>

        <div style={{ overflowY: 'auto', flex: 1, paddingRight: 6 }}>
          {activities && activities.length > 0 ? (
            <div style={{ position: 'relative', paddingLeft: 24, borderLeft: '2px solid #e2e8f0', marginLeft: 10 }}>
              {activities.map((act) => (
                <div key={act.id} style={{ position: 'relative', marginBottom: 20 }}>
                  <div
                    style={{
                      position: 'absolute',
                      left: -31,
                      top: 2,
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      background: '#2563eb',
                      border: '3px solid #ffffff',
                      boxShadow: '0 0 0 2px #93c5fd',
                    }}
                  />
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: '#1e293b' }}>{act.action}</div>
                  <div style={{ display: 'flex', gap: 12, fontSize: 11.5, color: '#64748b', marginTop: 4 }}>
                    <span><i className="far fa-clock" style={{ marginRight: 4 }} />{act.timestamp}</span>
                    {act.user && <span><i className="far fa-user" style={{ marginRight: 4 }} />By: {act.user}</span>}
                  </div>
                  {act.details && (
                    <div style={{ fontSize: 12, color: '#475569', background: '#f8fafc', padding: '6px 10px', borderRadius: 6, marginTop: 6 }}>
                      {act.details}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '32px 0', color: '#94a3b8', fontSize: 13 }}>
              No recorded activity history yet.
            </div>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16, borderTop: '1px solid #f1f5f9', paddingTop: 14 }}>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// DOCUMENTS LIST COMPONENT
// ---------------------------------------------------------------------------
interface DocumentListProps {
  documents: DocumentItem[];
  onDownload?: (doc: DocumentItem) => void;
}

export function DocumentList({ documents, onDownload }: DocumentListProps) {
  if (!documents || documents.length === 0) {
    return (
      <div style={{ background: '#f8fafc', padding: 16, borderRadius: 10, textAlign: 'center', color: '#94a3b8', fontSize: 12.5 }}>
        <i className="fas fa-file-excel" style={{ marginRight: 6 }} /> No verification documents attached.
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {documents.map((doc) => (
        <div
          key={doc.id}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 14px',
            background: '#f8fafc',
            borderRadius: 8,
            border: '1px solid #e2e8f0',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ color: '#2563eb', fontSize: 16 }}>
              <i className="fas fa-file-pdf" />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#1e293b' }}>{doc.name}</div>
              <div style={{ fontSize: 11, color: '#64748b' }}>{doc.size} • Uploaded {doc.uploadedAt}</div>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            style={{ fontSize: 11, padding: '3px 10px' }}
            onClick={() => {
              if (onDownload) {
                onDownload(doc);
              } else {
                const url = doc.url || '#';
                window.open(url, '_blank');
              }
            }}
          >
            <i className="fas fa-download" style={{ marginRight: 4 }} /> View
          </Button>
        </div>
      ))}
    </div>
  );
}
