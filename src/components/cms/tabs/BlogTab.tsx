import React from 'react';
import { Input } from '../../common/Input';
import type { LandingPageCmsData } from '../../../types/cms';

interface BlogTabProps {
  cmsData: LandingPageCmsData;
  updateNestedField: (path: string, value: unknown) => void;
}

export const BlogTab: React.FC<BlogTabProps> = ({ cmsData, updateNestedField }) => {
  return (
    <div className="panel" style={{ padding: 24 }}>
      <div className="header" style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1a2540', margin: 0 }}>
          Editorial & Research Matrix Settings
        </h3>
        <span className="tag-blue">Articles & Market Trends</span>
      </div>

      <div className="fields" style={{ marginBottom: 20 }}>
        <div className="field-group half">
          <label>Section Tag</label>
          <Input
            className="form-control"
            value={cmsData.blogMatrix.sectionTag}
            onChange={(e) => updateNestedField('blogMatrix.sectionTag', e.target.value)}
          />
        </div>
        <div className="field-group half">
          <label>Headline Title</label>
          <Input
            className="form-control"
            value={cmsData.blogMatrix.title}
            onChange={(e) => updateNestedField('blogMatrix.title', e.target.value)}
          />
        </div>
      </div>

      <h4 style={{ fontSize: 15, fontWeight: 700, color: '#06284f', marginBottom: 12 }}>
        Articles ({cmsData.blogMatrix.articles.length})
      </h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {cmsData.blogMatrix.articles.map((art, idx) => (
          <div key={art.id} style={{ border: '1px solid #e2edf8', borderRadius: 12, padding: 16, background: '#f8faff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontWeight: 700, fontSize: 13, color: '#063970' }}>
                Article #{idx + 1} {art.featured ? '(★ Flagship Featured)' : ''}
              </span>
              <span className="tag-blue" style={{ fontSize: 11 }}>{art.category}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 10 }}>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ fontSize: 11, color: '#6b7a99' }}>Title</label>
                <Input
                  className="form-control"
                  value={art.title}
                  onChange={(e) => {
                    const arts = [...cmsData.blogMatrix.articles];
                    arts[idx].title = e.target.value;
                    updateNestedField('blogMatrix.articles', arts);
                  }}
                />
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ fontSize: 11, color: '#6b7a99' }}>Description</label>
                <textarea
                  className="form-control"
                  rows={2}
                  value={art.description}
                  onChange={(e) => {
                    const arts = [...cmsData.blogMatrix.articles];
                    arts[idx].description = e.target.value;
                    updateNestedField('blogMatrix.articles', arts);
                  }}
                />
              </div>
              <div>
                <label style={{ fontSize: 11, color: '#6b7a99' }}>Author</label>
                <Input
                  className="form-control"
                  value={art.author}
                  onChange={(e) => {
                    const arts = [...cmsData.blogMatrix.articles];
                    arts[idx].author = e.target.value;
                    updateNestedField('blogMatrix.articles', arts);
                  }}
                />
              </div>
              <div>
                <label style={{ fontSize: 11, color: '#6b7a99' }}>Read Time</label>
                <Input
                  className="form-control"
                  value={art.readTime}
                  onChange={(e) => {
                    const arts = [...cmsData.blogMatrix.articles];
                    arts[idx].readTime = e.target.value;
                    updateNestedField('blogMatrix.articles', arts);
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
