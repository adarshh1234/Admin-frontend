import React from 'react';
import type { LandingPageCmsData } from '../../../types/cms';

interface SectionVisibilityTabProps {
  cmsData: LandingPageCmsData;
  updateNestedField: (path: string, value: unknown) => void;
}

export const SectionVisibilityTab: React.FC<SectionVisibilityTabProps> = ({
  cmsData,
  updateNestedField,
}) => {
  const sections = [
    { key: 'hero', label: '1. Hero Section', icon: 'fa-star' },
    { key: 'cinematicShowcase', label: '2. Cinematic Video Showcase', icon: 'fa-play' },
    { key: 'statsAndShift', label: '3. Stats & The Shift', icon: 'fa-chart-pie' },
    { key: 'coreFeatures', label: '4. Core Platform Features OS', icon: 'fa-cube' },
    { key: 'dimensions', label: '5. The 6 Dimensions of Talent', icon: 'fa-shapes' },
    { key: 'exploreOpportunities', label: '6. Explore Opportunities Marketplace', icon: 'fa-compass' },
    { key: 'blogMatrix', label: '7. Editorial & Research Matrix', icon: 'fa-book' },
    { key: 'videoHub', label: '8. Video Showcase Hub', icon: 'fa-video' },
    { key: 'whyAndTestimonials', label: '9. Why LetGetIn & Testimonials', icon: 'fa-quote-left' },
    { key: 'finalCTA', label: '10. Final CTA Banner', icon: 'fa-flag' },
  ];

  return (
    <div className="panel" style={{ padding: 24 }}>
      <div className="header" style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1a2540', margin: 0 }}>
          Section Visibility & Display Controls
        </h3>
        <span className="tag-blue">Toggle Sections On / Off</span>
      </div>

      <p style={{ color: '#6b7a99', fontSize: 13, marginBottom: 20 }}>
        Enable or disable specific landing page sections dynamically without code deployments.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
        {sections.map((sec) => {
          const visibilityRecord = cmsData.sectionVisibility as unknown as Record<string, boolean | undefined>;
          const isVisible = visibilityRecord[sec.key];
          return (
            <div
              key={sec.key}
              style={{
                border: '1px solid #e2edf8',
                borderRadius: 12,
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: isVisible ? '#f8faff' : '#fcfcfd',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <i className={`fas ${sec.icon}`} style={{ color: isVisible ? '#2563eb' : '#94a3b8' }} />
                <span style={{ fontWeight: 600, fontSize: 13, color: isVisible ? '#1a2540' : '#94a3b8' }}>
                  {sec.label}
                </span>
              </div>

              <button
                type="button"
                onClick={() => updateNestedField(`sectionVisibility.${sec.key}`, !isVisible)}
                style={{
                  padding: '5px 14px',
                  borderRadius: 20,
                  border: 'none',
                  background: isVisible ? '#2563eb' : '#e2e8f0',
                  color: isVisible ? '#fff' : '#64748b',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {isVisible ? 'Visible' : 'Hidden'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
