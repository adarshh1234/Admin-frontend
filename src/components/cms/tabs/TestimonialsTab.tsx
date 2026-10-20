import React from 'react';
import { Input } from '../../common/Input';
import type { LandingPageCmsData } from '../../../types/cms';

interface TestimonialsTabProps {
  cmsData: LandingPageCmsData;
  updateNestedField: (path: string, value: unknown) => void;
}

export const TestimonialsTab: React.FC<TestimonialsTabProps> = ({ cmsData, updateNestedField }) => {
  return (
    <div className="panel" style={{ padding: 24 }}>
      <div className="header" style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1a2540', margin: 0 }}>
          Why LetGetIn & Testimonials Settings
        </h3>
        <span className="tag-blue">Social Proof & Comparison</span>
      </div>

      <div className="fields" style={{ marginBottom: 24 }}>
        <div className="field-group half">
          <label>Why Section Tag</label>
          <Input
            className="form-control"
            value={cmsData.whyAndTestimonials.whyTag}
            onChange={(e) => updateNestedField('whyAndTestimonials.whyTag', e.target.value)}
          />
        </div>
        <div className="field-group half">
          <label>Why Title</label>
          <Input
            className="form-control"
            value={cmsData.whyAndTestimonials.whyTitle}
            onChange={(e) => updateNestedField('whyAndTestimonials.whyTitle', e.target.value)}
          />
        </div>
        <div className="field-group full" style={{ gridColumn: 'span 2' }}>
          <label>Why Subtitle</label>
          <textarea
            className="form-control"
            rows={2}
            value={cmsData.whyAndTestimonials.whySubtitle}
            onChange={(e) => updateNestedField('whyAndTestimonials.whySubtitle', e.target.value)}
          />
        </div>
      </div>

      <h4 style={{ fontSize: 15, fontWeight: 700, color: '#06284f', marginBottom: 12 }}>
        Testimonials ({cmsData.whyAndTestimonials.testimonialsList.length})
      </h4>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 14 }}>
        {cmsData.whyAndTestimonials.testimonialsList.map((t, idx) => (
          <div key={idx} style={{ border: '1px solid #e2edf8', borderRadius: 12, padding: 14, background: '#f8faff' }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: '#06284f', marginBottom: 8 }}>
              Testimonial #{idx + 1} ({t.initials})
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div>
                <label style={{ fontSize: 11, color: '#6b7a99' }}>Quote</label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={t.quote}
                  onChange={(e) => {
                    const list = [...cmsData.whyAndTestimonials.testimonialsList];
                    list[idx].quote = e.target.value;
                    updateNestedField('whyAndTestimonials.testimonialsList', list);
                  }}
                />
              </div>
              <div>
                <label style={{ fontSize: 11, color: '#6b7a99' }}>Author Name</label>
                <Input
                  className="form-control"
                  value={t.author}
                  onChange={(e) => {
                    const list = [...cmsData.whyAndTestimonials.testimonialsList];
                    list[idx].author = e.target.value;
                    updateNestedField('whyAndTestimonials.testimonialsList', list);
                  }}
                />
              </div>
              <div>
                <label style={{ fontSize: 11, color: '#6b7a99' }}>Role / Company</label>
                <Input
                  className="form-control"
                  value={t.role}
                  onChange={(e) => {
                    const list = [...cmsData.whyAndTestimonials.testimonialsList];
                    list[idx].role = e.target.value;
                    updateNestedField('whyAndTestimonials.testimonialsList', list);
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
