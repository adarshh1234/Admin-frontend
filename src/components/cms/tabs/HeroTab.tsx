import React from 'react';
import { Input } from '../../common/Input';
import type { LandingPageCmsData } from '../../../types/cms';

interface HeroTabProps {
  cmsData: LandingPageCmsData;
  updateNestedField: (path: string, value: unknown) => void;
}

export const HeroTab: React.FC<HeroTabProps> = ({ cmsData, updateNestedField }) => {
  return (
    <div className="panel" style={{ padding: 24 }}>
      <div className="header" style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1a2540', margin: 0 }}>
          Hero Section Settings
        </h3>
        <span className="tag-blue">First Impression & Candidates Card</span>
      </div>

      <div className="fields">
        <div className="field-group half">
          <label>Top Tag Badge</label>
          <Input
            className="form-control"
            value={cmsData.hero.tagBadge}
            onChange={(e) => updateNestedField('hero.tagBadge', e.target.value)}
          />
        </div>

        <div className="field-group half">
          <label>Main Headline Line 1</label>
          <Input
            className="form-control"
            value={cmsData.hero.headlineLine1}
            onChange={(e) => updateNestedField('hero.headlineLine1', e.target.value)}
          />
        </div>

        <div className="field-group half">
          <label>Headline Line 2 (Blue Gradient Highlight)</label>
          <Input
            className="form-control"
            value={cmsData.hero.headlineLine2Gradient}
            onChange={(e) => updateNestedField('hero.headlineLine2Gradient', e.target.value)}
          />
        </div>

        <div className="field-group half">
          <label>Primary CTA Button Text</label>
          <Input
            className="form-control"
            value={cmsData.hero.primaryCtaText}
            onChange={(e) => updateNestedField('hero.primaryCtaText', e.target.value)}
          />
        </div>

        <div className="field-group half">
          <label>Secondary CTA Button Text</label>
          <Input
            className="form-control"
            value={cmsData.hero.secondaryCtaText}
            onChange={(e) => updateNestedField('hero.secondaryCtaText', e.target.value)}
          />
        </div>

        <div className="field-group full" style={{ gridColumn: 'span 2' }}>
          <label>Subtitle Description</label>
          <textarea
            className="form-control"
            rows={2}
            value={cmsData.hero.subtitle}
            onChange={(e) => updateNestedField('hero.subtitle', e.target.value)}
          />
        </div>

        <div className="field-group full" style={{ gridColumn: 'span 2' }}>
          <label>Subtitle Bold Highlight</label>
          <Input
            className="form-control"
            value={cmsData.hero.subtitleHighlight}
            onChange={(e) => updateNestedField('hero.subtitleHighlight', e.target.value)}
          />
        </div>
      </div>

      {/* Candidate Showcase Profiles */}
      <div style={{ marginTop: 28 }}>
        <h4 style={{ fontSize: 15, fontWeight: 700, color: '#06284f', marginBottom: 12 }}>
          Hero Showcase Candidate Profiles
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
          {cmsData.hero.profiles.map((prof, idx) => (
            <div
              key={idx}
              style={{
                border: '1px solid #e2edf8',
                borderRadius: 12,
                padding: 16,
                background: '#f8faff',
              }}
            >
              <div style={{ fontWeight: 700, fontSize: 14, color: '#06284f', marginBottom: 10 }}>
                Profile #{idx + 1}: {prof.name} ({prof.initials})
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div>
                  <label style={{ fontSize: 11, color: '#6b7a99' }}>Full Name</label>
                  <Input
                    className="form-control"
                    value={prof.name}
                    onChange={(e) => {
                      const updated = [...cmsData.hero.profiles];
                      updated[idx].name = e.target.value;
                      updateNestedField('hero.profiles', updated);
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 11, color: '#6b7a99' }}>Role / Title</label>
                  <Input
                    className="form-control"
                    value={prof.role}
                    onChange={(e) => {
                      const updated = [...cmsData.hero.profiles];
                      updated[idx].role = e.target.value;
                      updateNestedField('hero.profiles', updated);
                    }}
                  />
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: 11, color: '#6b7a99' }}>Fit Score</label>
                    <Input
                      className="form-control"
                      value={prof.fitScore}
                      onChange={(e) => {
                        const updated = [...cmsData.hero.profiles];
                        updated[idx].fitScore = e.target.value;
                        updateNestedField('hero.profiles', updated);
                      }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: 11, color: '#6b7a99' }}>Tier</label>
                    <Input
                      className="form-control"
                      value={prof.tier}
                      onChange={(e) => {
                        const updated = [...cmsData.hero.profiles];
                        updated[idx].tier = e.target.value;
                        updateNestedField('hero.profiles', updated);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
