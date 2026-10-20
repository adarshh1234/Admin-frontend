import { useState } from 'react';
import { Button } from '../../common/Button';
import { Input } from '../../common/Input';
import type { HelpDeskSettings, SupportCategory } from '../../../types/helpDesk';

interface HelpDeskSettingsTabProps {
  settings: HelpDeskSettings;
  categories: SupportCategory[];
  onUpdateSettings: (settings: Partial<HelpDeskSettings>) => void;
}

export function HelpDeskSettingsTab({
  settings,
  categories,
  onUpdateSettings,
}: HelpDeskSettingsTabProps) {
  const [currentSettings, setCurrentSettings] = useState<HelpDeskSettings>(settings);
  const [isDirty, setIsDirty] = useState(false);
  const [savedAlert, setSavedAlert] = useState(false);

  function handleSave() {
    onUpdateSettings(currentSettings);
    setIsDirty(false);
    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 3000);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {savedAlert && (
        <div style={{
          padding: '12px 16px',
          background: '#dcfce7',
          border: '1px solid #bbf7d0',
          borderRadius: 10,
          color: '#15803d',
          fontSize: 13,
          fontWeight: 600,
        }}>
          <i className="fas fa-check-circle" style={{ marginRight: 6 }} />
          Help Desk settings successfully updated!
        </div>
      )}

      {/* Grid of Settings Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: 20,
      }}>
        {/* Card 1: General Portal Branding */}
        <div style={{
          background: '#ffffff',
          borderRadius: 16,
          padding: '24px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: '#eff6ff',
              color: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 16,
            }}>
              <i className="fas fa-globe" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#0f172a' }}>
                Portal Branding & Identity
              </h3>
              <p style={{ margin: 0, fontSize: 12, color: '#64748b' }}>Help Center public appearance</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                Help Center Portal Name
              </label>
              <Input
                type="text"
                value={currentSettings.portalName}
                onChange={(e) => {
                  setCurrentSettings((prev) => ({ ...prev, portalName: e.target.value }));
                  setIsDirty(true);
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                Public Support URL
              </label>
              <Input
                type="text"
                value={currentSettings.helpCenterUrl}
                onChange={(e) => {
                  setCurrentSettings((prev) => ({ ...prev, helpCenterUrl: e.target.value }));
                  setIsDirty(true);
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                  Support Inbound Email
                </label>
                <Input
                  type="email"
                  value={currentSettings.supportEmail}
                  onChange={(e) => {
                    setCurrentSettings((prev) => ({ ...prev, supportEmail: e.target.value }));
                    setIsDirty(true);
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                  Helpline Phone
                </label>
                <Input
                  type="text"
                  value={currentSettings.contactPhone}
                  onChange={(e) => {
                    setCurrentSettings((prev) => ({ ...prev, contactPhone: e.target.value }));
                    setIsDirty(true);
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Ticket Routing & Defaults */}
        <div style={{
          background: '#ffffff',
          borderRadius: 16,
          padding: '24px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: '#f0fdf4',
              color: '#16a34a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 16,
            }}>
              <i className="fas fa-sliders-h" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#0f172a' }}>
                Ticket Routing & Defaults
              </h3>
              <p style={{ margin: 0, fontSize: 12, color: '#64748b' }}>Default behavior for incoming incidents</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                Default Ticket Category
              </label>
              <select
                value={currentSettings.defaultTicketCategory}
                onChange={(e) => {
                  setCurrentSettings((prev) => ({ ...prev, defaultTicketCategory: e.target.value }));
                  setIsDirty(true);
                }}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: 8,
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  fontSize: 13,
                }}
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                  Default Priority
                </label>
                <select
                  value={currentSettings.defaultTicketPriority}
                  onChange={(e) => {
                    setCurrentSettings((prev) => ({ ...prev, defaultTicketPriority: e.target.value as any }));
                    setIsDirty(true);
                  }}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: 8,
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    fontSize: 12,
                  }}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                  Default Initial Status
                </label>
                <select
                  value={currentSettings.defaultTicketStatus}
                  onChange={(e) => {
                    setCurrentSettings((prev) => ({ ...prev, defaultTicketStatus: e.target.value as any }));
                    setIsDirty(true);
                  }}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: 8,
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    fontSize: 12,
                  }}
                >
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Support Availability & Business Hours */}
        <div style={{
          background: '#ffffff',
          borderRadius: 16,
          padding: '24px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: '#fffbeb',
              color: '#d97706',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 16,
            }}>
              <i className="fas fa-clock" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#0f172a' }}>
                Operating Hours & Timezone
              </h3>
              <p style={{ margin: 0, fontSize: 12, color: '#64748b' }}>Availability schedule & SLA clocks</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                Support Timezone
              </label>
              <Input
                type="text"
                value={currentSettings.businessHours.timezone}
                onChange={(e) => {
                  setCurrentSettings((prev) => ({
                    ...prev,
                    businessHours: { ...prev.businessHours, timezone: e.target.value },
                  }));
                  setIsDirty(true);
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                Standard Business Schedule
              </label>
              <Input
                type="text"
                value={currentSettings.businessHours.schedule}
                onChange={(e) => {
                  setCurrentSettings((prev) => ({
                    ...prev,
                    businessHours: { ...prev.businessHours, schedule: e.target.value },
                  }));
                  setIsDirty(true);
                }}
              />
            </div>
          </div>
        </div>

        {/* Card 4: Feedback & Customer Experience */}
        <div style={{
          background: '#ffffff',
          borderRadius: 16,
          padding: '24px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: '#faf5ff',
              color: '#9333ea',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 16,
            }}>
              <i className="fas fa-star" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#0f172a' }}>
                AI & CSAT Automation
              </h3>
              <p style={{ margin: 0, fontSize: 12, color: '#64748b' }}>Satisfaction surveys & AI auto-suggest</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#334155', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={currentSettings.enableCsatSurveys}
                onChange={(e) => {
                  setCurrentSettings((prev) => ({ ...prev, enableCsatSurveys: e.target.checked }));
                  setIsDirty(true);
                }}
                style={{ accentColor: '#0052cc' }}
              />
              <span>Trigger automated CSAT survey upon ticket resolution</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#334155', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={currentSettings.enableAiSuggestedArticles}
                onChange={(e) => {
                  setCurrentSettings((prev) => ({ ...prev, enableAiSuggestedArticles: e.target.checked }));
                  setIsDirty(true);
                }}
                style={{ accentColor: '#0052cc' }}
              />
              <span>Enable AI-suggested KB articles in live customer chat</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#334155', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={currentSettings.knowledgeBasePublicAccess}
                onChange={(e) => {
                  setCurrentSettings((prev) => ({ ...prev, knowledgeBasePublicAccess: e.target.checked }));
                  setIsDirty(true);
                }}
                style={{ accentColor: '#0052cc' }}
              />
              <span>Make Knowledge Base publicly indexable without login</span>
            </label>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
        <Button
          type="button"
          variant="primary"
          disabled={!isDirty}
          onClick={handleSave}
        >
          <i className="fas fa-save" style={{ marginRight: 6 }} />
          Save Help Desk Settings
        </Button>
      </div>
    </div>
  );
}
