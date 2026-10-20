import React from 'react';
import { Input } from '../../common/Input';
import type { LandingPageCmsData } from '../../../types/cms';

interface DimensionsTabProps {
  cmsData: LandingPageCmsData;
  updateNestedField: (path: string, value: unknown) => void;
}

export const DimensionsTab: React.FC<DimensionsTabProps> = ({ cmsData, updateNestedField }) => {
  return (
    <div className="panel" style={{ padding: 24 }}>
      <div className="header" style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1a2540', margin: 0 }}>
          The 6 Dimensions of Talent
        </h3>
        <span className="tag-blue">Candidate Evaluation Framework</span>
      </div>

      <div className="fields" style={{ marginBottom: 20 }}>
        <div className="field-group half">
          <label>Section Tag</label>
          <Input
            className="form-control"
            value={cmsData.dimensionsOfTalent.sectionTag}
            onChange={(e) => updateNestedField('dimensionsOfTalent.sectionTag', e.target.value)}
          />
        </div>
        <div className="field-group half">
          <label>Title</label>
          <Input
            className="form-control"
            value={cmsData.dimensionsOfTalent.title}
            onChange={(e) => updateNestedField('dimensionsOfTalent.title', e.target.value)}
          />
        </div>
        <div className="field-group full" style={{ gridColumn: 'span 2' }}>
          <label>Expert Insight Callout</label>
          <textarea
            className="form-control"
            rows={2}
            value={cmsData.dimensionsOfTalent.expertInsight}
            onChange={(e) => updateNestedField('dimensionsOfTalent.expertInsight', e.target.value)}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 14 }}>
        {cmsData.dimensionsOfTalent.dimensions.map((dim, idx) => (
          <div key={idx} style={{ border: '1px solid #e2edf8', borderRadius: 12, padding: 14, background: '#f8faff' }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: '#0066cc', marginBottom: 6 }}>
              Dimension {dim.num}
            </div>
            <label style={{ fontSize: 11, color: '#6b7a99' }}>Title</label>
            <Input
              className="form-control"
              style={{ marginBottom: 6 }}
              value={dim.title}
              onChange={(e) => {
                const dims = [...cmsData.dimensionsOfTalent.dimensions];
                dims[idx].title = e.target.value;
                updateNestedField('dimensionsOfTalent.dimensions', dims);
              }}
            />
            <label style={{ fontSize: 11, color: '#6b7a99' }}>Description</label>
            <textarea
              className="form-control"
              rows={2}
              value={dim.description}
              onChange={(e) => {
                const dims = [...cmsData.dimensionsOfTalent.dimensions];
                dims[idx].description = e.target.value;
                updateNestedField('dimensionsOfTalent.dimensions', dims);
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
