import React from 'react';
import { Input } from '../../common/Input';
import { Button } from '../../common/Button';
import type { LandingPageCmsData } from '../../../types/cms';

interface CinematicTabProps {
  cmsData: LandingPageCmsData;
  uploading: boolean;
  updateNestedField: (path: string, value: unknown) => void;
  onTriggerUpload: (fieldPath: string) => void;
}

export const CinematicTab: React.FC<CinematicTabProps> = ({
  cmsData,
  uploading,
  updateNestedField,
  onTriggerUpload,
}) => {
  return (
    <div className="panel" style={{ padding: 24 }}>
      <div className="header" style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1a2540', margin: 0 }}>
          Cinematic Video Showcase Settings
        </h3>
        <span className="tag-blue">Full-width Video Header</span>
      </div>

      <div className="fields">
        <div className="field-group half">
          <label>Top Heading</label>
          <Input
            className="form-control"
            value={cmsData.cinematicVideoShowcase.topHeading}
            onChange={(e) => updateNestedField('cinematicVideoShowcase.topHeading', e.target.value)}
          />
        </div>

        <div className="field-group half">
          <label>Top Badge Text</label>
          <Input
            className="form-control"
            value={cmsData.cinematicVideoShowcase.topBadge}
            onChange={(e) => updateNestedField('cinematicVideoShowcase.topBadge', e.target.value)}
          />
        </div>

        <div className="field-group full" style={{ gridColumn: 'span 2' }}>
          <label>Primary Video URL (MP4 / WebM / Stream)</label>
          <div style={{ display: 'flex', gap: 8 }}>
            <Input
              className="form-control"
              value={cmsData.cinematicVideoShowcase.videoUrls[0] || ''}
              onChange={(e) => {
                const urls = [...cmsData.cinematicVideoShowcase.videoUrls];
                urls[0] = e.target.value;
                updateNestedField('cinematicVideoShowcase.videoUrls', urls);
              }}
            />
            <Button
              variant="outline"
              type="button"
              disabled={uploading}
              onClick={() => onTriggerUpload('cinematicVideoShowcase.videoUrls.0')}
            >
              <i className={uploading ? 'fas fa-spinner fa-spin' : 'fas fa-upload'} /> {uploading ? 'Uploading...' : 'Upload'}
            </Button>
          </div>
        </div>

        <div className="field-group full" style={{ gridColumn: 'span 2' }}>
          <label>Poster / Fallback Image URL</label>
          <div style={{ display: 'flex', gap: 8 }}>
            <Input
              className="form-control"
              value={cmsData.cinematicVideoShowcase.posterImage}
              onChange={(e) => updateNestedField('cinematicVideoShowcase.posterImage', e.target.value)}
            />
            <Button
              variant="outline"
              type="button"
              onClick={() => onTriggerUpload('cinematicVideoShowcase.posterImage')}
            >
              <i className="fas fa-upload" /> Upload
            </Button>
          </div>
        </div>

        <div className="field-group half">
          <label>Match Accuracy Metric</label>
          <Input
            className="form-control"
            value={cmsData.cinematicVideoShowcase.stats.matchRate}
            onChange={(e) => updateNestedField('cinematicVideoShowcase.stats.matchRate', e.target.value)}
          />
        </div>

        <div className="field-group half">
          <label>Assessment Volume Metric</label>
          <Input
            className="form-control"
            value={cmsData.cinematicVideoShowcase.stats.assessmentVolume}
            onChange={(e) => updateNestedField('cinematicVideoShowcase.stats.assessmentVolume', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};
