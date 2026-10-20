import React from 'react';
import { Button } from '../common/Button';
import type { LandingPageCmsData } from '../../types/cms';

interface CmsHeaderProps {
  cmsData: LandingPageCmsData;
  saving: boolean;
  publishing: boolean;
  onReset: () => void;
  onSaveDraft: () => void;
  onPublish: () => void;
}

export const CmsHeader: React.FC<CmsHeaderProps> = ({
  cmsData,
  saving,
  publishing,
  onReset,
  onSaveDraft,
  onPublish,
}) => {
  return (
    <div
      className="panel"
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 16,
        marginBottom: 20,
        background: 'linear-gradient(135deg, #0a192f 0%, #063970 100%)',
        color: '#fff',
        borderRadius: 16,
        padding: '24px 28px',
        boxShadow: '0 10px 25px rgba(6, 40, 79, 0.15)',
      }}
    >
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: 'rgba(255, 255, 255, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
            }}
          >
            <i className="fas fa-layer-group" />
          </div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#fff' }}>
            Landing Page CMS
          </h2>
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              padding: '3px 9px',
              borderRadius: 20,
              background: cmsData.status === 'published' ? '#10b981' : '#f59e0b',
              color: '#fff',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {cmsData.status === 'published' ? '● Live Published' : '● Draft Mode'}
          </span>
        </div>
        <p style={{ margin: 0, fontSize: 13, color: '#bae6fd' }}>
          Manage and publish dynamic content for the LetGetIn public landing page with real database persistence.
        </p>
      </div>

      {/* Global Action Buttons */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        <Button
          type="button"
          variant="outline"
          onClick={onReset}
          style={{
            borderColor: 'rgba(255,255,255,0.3)',
            color: '#fff',
            background: 'rgba(255,255,255,0.08)',
            fontSize: 13,
          }}
        >
          <i className="fas fa-undo" style={{ marginRight: 6 }} /> Reset Defaults
        </Button>

        <Button
          type="button"
          variant="primary"
          onClick={onSaveDraft}
          disabled={saving || publishing}
          style={{
            background: '#2563eb',
            color: '#fff',
            borderColor: '#2563eb',
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          <i className={saving ? 'fas fa-spinner fa-spin' : 'fas fa-save'} style={{ marginRight: 6 }} />
          {saving ? 'Saving...' : 'Save Draft'}
        </Button>

        <Button
          type="button"
          variant="primary"
          onClick={onPublish}
          disabled={publishing || saving}
          style={{
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            borderColor: '#059669',
            color: '#fff',
            fontSize: 13,
            fontWeight: 700,
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
          }}
        >
          <i className={publishing ? 'fas fa-spinner fa-spin' : 'fas fa-paper-plane'} style={{ marginRight: 6 }} />
          {publishing ? 'Publishing...' : 'Publish Live'}
        </Button>
      </div>
    </div>
  );
};
