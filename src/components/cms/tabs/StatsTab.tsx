import React from 'react';
import { Input } from '../../common/Input';
import type { LandingPageCmsData } from '../../../types/cms';

interface StatsTabProps {
  cmsData: LandingPageCmsData;
  updateNestedField: (path: string, value: unknown) => void;
}

export const StatsTab: React.FC<StatsTabProps> = ({ cmsData, updateNestedField }) => {
  return (
    <div className="panel" style={{ padding: 24 }}>
      <div className="header" style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1a2540', margin: 0 }}>
          Stats & The Shift Settings
        </h3>
        <span className="tag-blue">Metrics & Old vs New Comparison</span>
      </div>

      <h4 style={{ fontSize: 15, fontWeight: 700, color: '#06284f', marginBottom: 12 }}>
        Key Metrics Row
      </h4>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginBottom: 24 }}>
        {cmsData.statsAndShift.stats.map((st, i) => (
          <div key={i} style={{ border: '1px solid #e2edf8', borderRadius: 10, padding: 12, background: '#f8faff' }}>
            <label style={{ fontSize: 11, fontWeight: 600, color: '#6b7a99' }}>Stat #{i + 1} Number</label>
            <Input
              className="form-control"
              style={{ marginBottom: 6 }}
              value={st.value}
              onChange={(e) => {
                const stats = [...cmsData.statsAndShift.stats];
                stats[i].value = e.target.value;
                updateNestedField('statsAndShift.stats', stats);
              }}
            />
            <label style={{ fontSize: 11, fontWeight: 600, color: '#6b7a99' }}>Label</label>
            <Input
              className="form-control"
              style={{ marginBottom: 6 }}
              value={st.label}
              onChange={(e) => {
                const stats = [...cmsData.statsAndShift.stats];
                stats[i].label = e.target.value;
                updateNestedField('statsAndShift.stats', stats);
              }}
            />
            <label style={{ fontSize: 11, fontWeight: 600, color: '#6b7a99' }}>Subtext</label>
            <Input
              className="form-control"
              value={st.sub}
              onChange={(e) => {
                const stats = [...cmsData.statsAndShift.stats];
                stats[i].sub = e.target.value;
                updateNestedField('statsAndShift.stats', stats);
              }}
            />
          </div>
        ))}
      </div>

      <div className="fields">
        <div className="field-group half">
          <label>Section Tag</label>
          <Input
            className="form-control"
            value={cmsData.statsAndShift.sectionTag}
            onChange={(e) => updateNestedField('statsAndShift.sectionTag', e.target.value)}
          />
        </div>

        <div className="field-group half">
          <label>Heading Line 1</label>
          <Input
            className="form-control"
            value={cmsData.statsAndShift.headingLine1}
            onChange={(e) => updateNestedField('statsAndShift.headingLine1', e.target.value)}
          />
        </div>

        <div className="field-group full" style={{ gridColumn: 'span 2' }}>
          <label>Subtitle</label>
          <textarea
            className="form-control"
            rows={2}
            value={cmsData.statsAndShift.subtitle}
            onChange={(e) => updateNestedField('statsAndShift.subtitle', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};
