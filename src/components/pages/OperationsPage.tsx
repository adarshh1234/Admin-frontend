import { useState } from 'react';
import { Button } from '../common/Button';
import { ExploreOpportunitiesManagement } from '../platform/ExploreOpportunitiesManagement';
import { InterviewManagement } from '../platform/InterviewManagement';
import { ResumeManagement } from '../platform/ResumeManagement';
import {
  INITIAL_OPPORTUNITY_RECORDS,
  INITIAL_INTERVIEW_RECORDS,
  INITIAL_RESUME_RECORDS
} from '../../data/platformManagementData';

export type OperationsTab = 'platform-management' | 'explore-opportunities' | 'interview-management' | 'resume-management';

interface OperationsPageProps {
  initialTab?: OperationsTab;
}

export function OperationsPage({ initialTab = 'platform-management' }: OperationsPageProps) {
  const [activeTab, setActiveTab] = useState<OperationsTab>(initialTab);

  return (
    <div className="module-detail-page operations-module-page">
      {/* Module Title Header */}
      <div className="module-detail-header" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: '#eff6ff',
                color: '#0066cc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 20
              }}
            >
              <i className="fas fa-cogs" />
            </div>
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0a192f', margin: 0, letterSpacing: '-0.02em' }}>
                Operations
              </h1>
              <p style={{ margin: '2px 0 0', fontSize: 13, color: '#64748b' }}>
                Manage core platform operations, requisitions, interview schedules, and candidate verification workflows.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#059669', background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '5px 12px', borderRadius: 20, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
              Operations Stream Active
            </span>
          </div>
        </div>
      </div>

      {/* Horizontal Tab Navigation */}
      <div className="tab-nav" style={{ marginBottom: 20, overflowX: 'auto', display: 'flex', gap: 6 }}>
        <Button
          type="button"
          className={`tab-btn${activeTab === 'platform-management' ? ' active' : ''}`}
          onClick={() => setActiveTab('platform-management')}
        >
          <i className="fas fa-cubes" style={{ marginRight: 8 }} />
          Platform Management
        </Button>

        <Button
          type="button"
          className={`tab-btn${activeTab === 'explore-opportunities' ? ' active' : ''}`}
          onClick={() => setActiveTab('explore-opportunities')}
        >
          <i className="fas fa-compass" style={{ marginRight: 8 }} />
          Explore Opportunities
        </Button>

        <Button
          type="button"
          className={`tab-btn${activeTab === 'interview-management' ? ' active' : ''}`}
          onClick={() => setActiveTab('interview-management')}
        >
          <i className="fas fa-user-check" style={{ marginRight: 8 }} />
          Interview Management
        </Button>

        <Button
          type="button"
          className={`tab-btn${activeTab === 'resume-management' ? ' active' : ''}`}
          onClick={() => setActiveTab('resume-management')}
        >
          <i className="fas fa-file-alt" style={{ marginRight: 8 }} />
          Resume Management
        </Button>
      </div>

      {/* TAB CONTENT: 1. PLATFORM MANAGEMENT (Overview Hub) */}
      {activeTab === 'platform-management' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Main Welcome Hero Banner */}
          <div
            style={{
              background: 'linear-gradient(135deg, #062b63 0%, #004b99 50%, #0066cc 100%)',
              borderRadius: 20,
              padding: '28px 32px',
              color: '#ffffff',
              boxShadow: '0 8px 24px rgba(0, 75, 153, 0.2)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div style={{ maxWidth: 760, position: 'relative', zIndex: 2 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(6px)', padding: '4px 12px', borderRadius: 20, fontSize: 11.5, fontWeight: 700, marginBottom: 12 }}>
                <i className="fas fa-shield-alt" />
                LetGetIn User-Facing Platform Controls
              </div>
              <h2 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 8px', letterSpacing: '-0.02em', color: '#ffffff' }}>
                Platform Management Operations Hub
              </h2>
              <p style={{ fontSize: 13.5, color: '#e0f2fe', lineHeight: 1.6, margin: '0 0 20px' }}>
                Oversee verified job listings, configure featured highlights, coordinate multi-stage candidate interviews, and audit verified technical resumes with authorized admin tools.
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                <button
                  type="button"
                  onClick={() => setActiveTab('explore-opportunities')}
                  style={{
                    padding: '10px 18px',
                    background: '#ffffff',
                    color: '#062b63',
                    border: 'none',
                    borderRadius: 12,
                    fontWeight: 800,
                    fontSize: 12.5,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                >
                  <i className="fas fa-compass" />
                  <span>Manage Opportunities</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('interview-management')}
                  style={{
                    padding: '10px 18px',
                    background: 'rgba(255, 255, 255, 0.15)',
                    color: '#ffffff',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: 12,
                    fontWeight: 700,
                    fontSize: 12.5,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8
                  }}
                >
                  <i className="fas fa-calendar-check" />
                  <span>Schedule Interview</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('resume-management')}
                  style={{
                    padding: '10px 18px',
                    background: 'rgba(255, 255, 255, 0.15)',
                    color: '#ffffff',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: 12,
                    fontWeight: 700,
                    fontSize: 12.5,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8
                  }}
                >
                  <i className="fas fa-file-invoice" />
                  <span>Audit Candidate Resumes</span>
                </button>
              </div>
            </div>
          </div>

          {/* 3 Interactive Section Highlight Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 18 }}>

            {/* Card 1: Explore Opportunities */}
            <div
              style={{
                background: '#ffffff',
                border: '1px solid #e2edf8',
                borderRadius: 18,
                padding: 22,
                boxShadow: '0 2px 10px rgba(0, 102, 204, 0.04)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div style={{ width: 42, height: 42, borderRadius: 12, background: '#eff6ff', color: '#0066cc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                    <i className="fas fa-compass" />
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#0066cc', background: '#f0f8ff', padding: '3px 8px', borderRadius: 20, border: '1px solid #bae6fd' }}>
                    {INITIAL_OPPORTUNITY_RECORDS.length} Active Positions
                  </span>
                </div>

                <h3 style={{ fontSize: 17, fontWeight: 800, color: '#0a192f', margin: '0 0 6px' }}>
                  Explore Opportunities
                </h3>
                <p style={{ fontSize: 12.5, color: '#64748b', lineHeight: 1.5, margin: '0 0 16px' }}>
                  Control verified company positions, 4×4 card catalog, publish status toggles, compensation metadata, and featured tier placement.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12, color: '#334155' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <i className="fas fa-check-circle" style={{ color: '#0066cc', fontSize: 11 }} />
                    <span>Real-time publish/visibility control</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <i className="fas fa-check-circle" style={{ color: '#0066cc', fontSize: 11 }} />
                    <span>4×4 desktop grid + table view</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <i className="fas fa-check-circle" style={{ color: '#0066cc', fontSize: 11 }} />
                    <span>Featured position star badging</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab('explore-opportunities')}
                style={{
                  width: '100%',
                  marginTop: 18,
                  padding: '9px 14px',
                  background: '#f0f8ff',
                  border: '1px solid #bae6fd',
                  color: '#0066cc',
                  fontWeight: 700,
                  fontSize: 12.5,
                  borderRadius: 10,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6
                }}
              >
                <span>Open Opportunities Module</span>
                <i className="fas fa-arrow-right" style={{ fontSize: 11 }} />
              </button>
            </div>

            {/* Card 2: Interview Management */}
            <div
              style={{
                background: '#ffffff',
                border: '1px solid #e2edf8',
                borderRadius: 18,
                padding: 22,
                boxShadow: '0 2px 10px rgba(0, 102, 204, 0.04)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div style={{ width: 42, height: 42, borderRadius: 12, background: '#f0fdf4', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                    <i className="fas fa-user-check" />
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#16a34a', background: '#f0fdf4', padding: '3px 8px', borderRadius: 20, border: '1px solid #bbf7d0' }}>
                    {INITIAL_INTERVIEW_RECORDS.length} Scheduled
                  </span>
                </div>

                <h3 style={{ fontSize: 17, fontWeight: 800, color: '#0a192f', margin: '0 0 6px' }}>
                  Interview Management
                </h3>
                <p style={{ fontSize: 12.5, color: '#64748b', lineHeight: 1.5, margin: '0 0 16px' }}>
                  Manage candidate coding sandboxes, technical panel interviews, scorecard evaluations, and video room scheduling.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12, color: '#334155' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <i className="fas fa-check-circle" style={{ color: '#16a34a', fontSize: 11 }} />
                    <span>Candidate & panel round scheduling</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <i className="fas fa-check-circle" style={{ color: '#16a34a', fontSize: 11 }} />
                    <span>Scorecard & feedback summary logs</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <i className="fas fa-check-circle" style={{ color: '#16a34a', fontSize: 11 }} />
                    <span>Status management & meeting links</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab('interview-management')}
                style={{
                  width: '100%',
                  marginTop: 18,
                  padding: '9px 14px',
                  background: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  color: '#15803d',
                  fontWeight: 700,
                  fontSize: 12.5,
                  borderRadius: 10,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6
                }}
              >
                <span>Open Interviews Module</span>
                <i className="fas fa-arrow-right" style={{ fontSize: 11 }} />
              </button>
            </div>

            {/* Card 3: Resume Management */}
            <div
              style={{
                background: '#ffffff',
                border: '1px solid #e2edf8',
                borderRadius: 18,
                padding: 22,
                boxShadow: '0 2px 10px rgba(0, 102, 204, 0.04)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div style={{ width: 42, height: 42, borderRadius: 12, background: '#faf5ff', color: '#9333ea', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                    <i className="fas fa-file-alt" />
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#9333ea', background: '#faf5ff', padding: '3px 8px', borderRadius: 20, border: '1px solid #e9d5ff' }}>
                    {INITIAL_RESUME_RECORDS.length} Candidates
                  </span>
                </div>

                <h3 style={{ fontSize: 17, fontWeight: 800, color: '#0a192f', margin: '0 0 6px' }}>
                  Resume Management
                </h3>
                <p style={{ fontSize: 12.5, color: '#64748b', lineHeight: 1.5, margin: '0 0 16px' }}>
                  Audit candidate credentials, view full structured CVs, edit professional headlines and skills, and verify status.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12, color: '#334155' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <i className="fas fa-check-circle" style={{ color: '#9333ea', fontSize: 11 }} />
                    <span>Structured CV view & PDF export</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <i className="fas fa-check-circle" style={{ color: '#9333ea', fontSize: 11 }} />
                    <span>Authorized staff CV edit form</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <i className="fas fa-check-circle" style={{ color: '#9333ea', fontSize: 11 }} />
                    <span>Verification & audit trail status</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab('resume-management')}
                style={{
                  width: '100%',
                  marginTop: 18,
                  padding: '9px 14px',
                  background: '#faf5ff',
                  border: '1px solid #e9d5ff',
                  color: '#7e22ce',
                  fontWeight: 700,
                  fontSize: 12.5,
                  borderRadius: 10,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6
                }}
              >
                <span>Open Resumes Module</span>
                <i className="fas fa-arrow-right" style={{ fontSize: 11 }} />
              </button>
            </div>

          </div>

          {/* Recent Platform Operations Feed */}
          <div style={{ background: '#ffffff', border: '1px solid #e2edf8', borderRadius: 18, padding: 22, boxShadow: '0 2px 10px rgba(0, 102, 204, 0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <i className="fas fa-history" style={{ color: '#0066cc', fontSize: 16 }} />
                <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0a192f', margin: 0 }}>
                  Recent Platform Operations & Activity
                </h3>
              </div>
              <span style={{ fontSize: 11, fontWeight: 600, color: '#64748b' }}>Updated real-time</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#f8fafc', borderRadius: 10, border: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e' }} />
                  <div>
                    <strong style={{ fontSize: 13, color: '#0f172a' }}>Opportunity Published:</strong>{' '}
                    <span style={{ fontSize: 12.5, color: '#475569' }}>Research Engineer – Multimodal AI (OpenAI) marked live and featured</span>
                  </div>
                </div>
                <span style={{ fontSize: 11, color: '#94a3b8' }}>12m ago</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#f8fafc', borderRadius: 10, border: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#3b82f6' }} />
                  <div>
                    <strong style={{ fontSize: 13, color: '#0f172a' }}>Interview Scheduled:</strong>{' '}
                    <span style={{ fontSize: 12.5, color: '#475569' }}>Dr. Sarah Lin booked for System Architecture with Alexandre Moreau</span>
                  </div>
                </div>
                <span style={{ fontSize: 11, color: '#94a3b8' }}>45m ago</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#f8fafc', borderRadius: 10, border: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#a855f7' }} />
                  <div>
                    <strong style={{ fontSize: 13, color: '#0f172a' }}>Resume Verified:</strong>{' '}
                    <span style={{ fontSize: 12.5, color: '#475569' }}>Rohan Sharma passed staff credentials audit with 8 verified skills</span>
                  </div>
                </div>
                <span style={{ fontSize: 11, color: '#94a3b8' }}>2h ago</span>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* TAB CONTENT: 2. EXPLORE OPPORTUNITIES */}
      {activeTab === 'explore-opportunities' && (
        <ExploreOpportunitiesManagement />
      )}

      {/* TAB CONTENT: 3. INTERVIEW MANAGEMENT */}
      {activeTab === 'interview-management' && (
        <InterviewManagement />
      )}

      {/* TAB CONTENT: 4. RESUME MANAGEMENT */}
      {activeTab === 'resume-management' && (
        <ResumeManagement />
      )}

    </div>
  );
}

export default OperationsPage;
