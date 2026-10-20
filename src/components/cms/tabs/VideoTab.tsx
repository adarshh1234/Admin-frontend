import React from 'react';
import { Input } from '../../common/Input';
import type { LandingPageCmsData } from '../../../types/cms';

interface VideoTabProps {
  cmsData: LandingPageCmsData;
  updateNestedField: (path: string, value: unknown) => void;
}

export const VideoTab: React.FC<VideoTabProps> = ({ cmsData, updateNestedField }) => {
  return (
    <div className="panel" style={{ padding: 24 }}>
      <div className="header" style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1a2540', margin: 0 }}>
          Video Showcase & Playlist Settings
        </h3>
        <span className="tag-blue">Interactive Video Hub</span>
      </div>

      <div className="fields" style={{ marginBottom: 20 }}>
        <div className="field-group half">
          <label>Section Tag</label>
          <Input
            className="form-control"
            value={cmsData.videoContent.sectionTag}
            onChange={(e) => updateNestedField('videoContent.sectionTag', e.target.value)}
          />
        </div>
        <div className="field-group half">
          <label>Main Title</label>
          <Input
            className="form-control"
            value={cmsData.videoContent.title}
            onChange={(e) => updateNestedField('videoContent.title', e.target.value)}
          />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {cmsData.videoContent.videoList.map((vid, idx) => (
          <div key={vid.id} style={{ border: '1px solid #e2edf8', borderRadius: 12, padding: 16, background: '#f8faff' }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: '#073b80', marginBottom: 8 }}>
              Video #{idx + 1}: {vid.badge}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10 }}>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ fontSize: 11, color: '#6b7a99' }}>Video Title</label>
                <Input
                  className="form-control"
                  value={vid.title}
                  onChange={(e) => {
                    const vids = [...cmsData.videoContent.videoList];
                    vids[idx].title = e.target.value;
                    updateNestedField('videoContent.videoList', vids);
                  }}
                />
              </div>
              <div>
                <label style={{ fontSize: 11, color: '#6b7a99' }}>Speaker</label>
                <Input
                  className="form-control"
                  value={vid.speaker}
                  onChange={(e) => {
                    const vids = [...cmsData.videoContent.videoList];
                    vids[idx].speaker = e.target.value;
                    updateNestedField('videoContent.videoList', vids);
                  }}
                />
              </div>
              <div>
                <label style={{ fontSize: 11, color: '#6b7a99' }}>Duration</label>
                <Input
                  className="form-control"
                  value={vid.duration}
                  onChange={(e) => {
                    const vids = [...cmsData.videoContent.videoList];
                    vids[idx].duration = e.target.value;
                    updateNestedField('videoContent.videoList', vids);
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
