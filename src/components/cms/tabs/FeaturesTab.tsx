import React from 'react';
import { Input } from '../../common/Input';
import type { LandingPageCmsData } from '../../../types/cms';

interface FeaturesTabProps {
  cmsData: LandingPageCmsData;
  updateNestedField: (path: string, value: unknown) => void;
}

export const FeaturesTab: React.FC<FeaturesTabProps> = ({ cmsData, updateNestedField }) => {
  return (
    <div className="panel" style={{ padding: 24 }}>
      <div className="header" style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1a2540', margin: 0 }}>
          Core Features (OS) Settings
        </h3>
        <span className="tag-blue">6 Main Architecture Features</span>
      </div>

      <div className="fields" style={{ marginBottom: 20 }}>
        <div className="field-group half">
          <label>Section Tag</label>
          <Input
            className="form-control"
            value={cmsData.corePlatformOS.sectionTag}
            onChange={(e) => updateNestedField('corePlatformOS.sectionTag', e.target.value)}
          />
        </div>
        <div className="field-group half">
          <label>Title Suffix / Main Heading</label>
          <Input
            className="form-control"
            value={cmsData.corePlatformOS.titleSuffix}
            onChange={(e) => updateNestedField('corePlatformOS.titleSuffix', e.target.value)}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
        {cmsData.corePlatformOS.features.map((feat, idx) => (
          <div key={feat.id} style={{ border: '1px solid #e2edf8', borderRadius: 12, padding: 16, background: '#f8faff' }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: '#0066cc', marginBottom: 8 }}>
              Feature #{idx + 1}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div>
                <label style={{ fontSize: 11, color: '#6b7a99' }}>Title</label>
                <Input
                  className="form-control"
                  value={feat.title}
                  onChange={(e) => {
                    const feats = [...cmsData.corePlatformOS.features];
                    feats[idx].title = e.target.value;
                    updateNestedField('corePlatformOS.features', feats);
                  }}
                />
              </div>
              <div>
                <label style={{ fontSize: 11, color: '#6b7a99' }}>Description</label>
                <textarea
                  className="form-control"
                  rows={2}
                  value={feat.description}
                  onChange={(e) => {
                    const feats = [...cmsData.corePlatformOS.features];
                    feats[idx].description = e.target.value;
                    updateNestedField('corePlatformOS.features', feats);
                  }}
                />
              </div>
              <div>
                <label style={{ fontSize: 11, color: '#6b7a99' }}>Bottom Tag</label>
                <Input
                  className="form-control"
                  value={feat.tag}
                  onChange={(e) => {
                    const feats = [...cmsData.corePlatformOS.features];
                    feats[idx].tag = e.target.value;
                    updateNestedField('corePlatformOS.features', feats);
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
