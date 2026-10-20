import React from 'react';
import { Input } from '../../common/Input';
import type { LandingPageCmsData } from '../../../types/cms';

interface CtaFooterTabProps {
  cmsData: LandingPageCmsData;
  updateNestedField: (path: string, value: unknown) => void;
}

export const CtaFooterTab: React.FC<CtaFooterTabProps> = ({ cmsData, updateNestedField }) => {
  return (
    <div className="panel" style={{ padding: 24 }}>
      <div className="header" style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1a2540', margin: 0 }}>
          Final CTA, Navbar & Footer Settings
        </h3>
        <span className="tag-blue">Headers, Footers & Action Banners</span>
      </div>

      <h4 style={{ fontSize: 15, fontWeight: 700, color: '#06284f', marginBottom: 12 }}>
        Final CTA Banner
      </h4>
      <div className="fields" style={{ marginBottom: 24 }}>
        <div className="field-group half">
          <label>CTA Badge</label>
          <Input
            className="form-control"
            value={cmsData.finalCTA.badge}
            onChange={(e) => updateNestedField('finalCTA.badge', e.target.value)}
          />
        </div>
        <div className="field-group half">
          <label>CTA Headline</label>
          <Input
            className="form-control"
            value={cmsData.finalCTA.headline}
            onChange={(e) => updateNestedField('finalCTA.headline', e.target.value)}
          />
        </div>
        <div className="field-group full" style={{ gridColumn: 'span 2' }}>
          <label>CTA Subtitle</label>
          <textarea
            className="form-control"
            rows={2}
            value={cmsData.finalCTA.subtitle}
            onChange={(e) => updateNestedField('finalCTA.subtitle', e.target.value)}
          />
        </div>
        <div className="field-group half">
          <label>Primary Button Text</label>
          <Input
            className="form-control"
            value={cmsData.finalCTA.primaryButtonText}
            onChange={(e) => updateNestedField('finalCTA.primaryButtonText', e.target.value)}
          />
        </div>
        <div className="field-group half">
          <label>Secondary Button Text</label>
          <Input
            className="form-control"
            value={cmsData.finalCTA.secondaryButtonText}
            onChange={(e) => updateNestedField('finalCTA.secondaryButtonText', e.target.value)}
          />
        </div>
      </div>

      <h4 style={{ fontSize: 15, fontWeight: 700, color: '#06284f', marginBottom: 12 }}>
        Navbar & Footer Branding
      </h4>
      <div className="fields">
        <div className="field-group half">
          <label>Navbar Brand Name</label>
          <Input
            className="form-control"
            value={cmsData.navbar.brandName}
            onChange={(e) => updateNestedField('navbar.brandName', e.target.value)}
          />
        </div>
        <div className="field-group half">
          <label>Navbar Beta Badge</label>
          <Input
            className="form-control"
            value={cmsData.navbar.badge}
            onChange={(e) => updateNestedField('navbar.badge', e.target.value)}
          />
        </div>
        <div className="field-group full" style={{ gridColumn: 'span 2' }}>
          <label>Footer Description</label>
          <Input
            className="form-control"
            value={cmsData.footer.brandDescription}
            onChange={(e) => updateNestedField('footer.brandDescription', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};
