import React, { useState } from 'react';
import { Button } from '../../common/Button';
import { Input } from '../../common/Input';
import { useToast } from '../../../hooks/useToast';
import type { CandidateSubTab, FresherCandidate, ExperiencedCandidate } from './types';

const SAMPLE_FRESHERS: FresherCandidate[] = [
  {
    id: 'FSH-101',
    name: 'Ananya Deshmukh',
    email: 'ananya.d@gmail.com',
    degree: 'B.Tech Healthcare Tech',
    college: 'IIT Kharagpur',
    year: 2026,
    cgpa: '8.9 / 10',
    appliedRole: 'Junior Clinical Informatics Engineer',
    status: 'Interview',
  },
  {
    id: 'FSH-102',
    name: 'Rohan Gupta',
    email: 'rohan.g@yahoo.com',
    degree: 'MBBS / General Medicine',
    college: 'AIIMS New Delhi',
    year: 2025,
    cgpa: 'Gold Medalist',
    appliedRole: 'Teleconsultation Resident',
    status: 'Shortlisted',
  },
  {
    id: 'FSH-103',
    name: 'Sneha Patel',
    email: 'sneha.p@outlook.com',
    degree: 'B.Pharm',
    college: 'Manipal College of Pharma',
    year: 2026,
    cgpa: '8.4 / 10',
    appliedRole: 'Pharmacovigilance Associate',
    status: 'Offered',
  },
  {
    id: 'FSH-104',
    name: 'Karthik Raja',
    email: 'karthik.r@gmail.com',
    degree: 'B.E. Computer Science',
    college: 'NIT Trichy',
    year: 2026,
    cgpa: '9.1 / 10',
    appliedRole: 'Frontend Developer',
    status: 'Applied',
  },
];

const SAMPLE_EXPERIENCED: ExperiencedCandidate[] = [
  {
    id: 'EXP-201',
    name: 'Dr. Vikramaditya Roy',
    email: 'v.roy@mednetwork.org',
    currentCompany: 'Apollo Health City',
    currentRole: 'Senior Consultant - Cardiology',
    experienceYears: 7.5,
    expectedCtc: '$120,000 / yr',
    noticePeriod: '30 Days',
    appliedRole: 'Head of Digital Cardiology Ops',
    status: 'HR Round',
  },
  {
    id: 'EXP-202',
    name: 'Meenakshi Sundaram',
    email: 'meenakshi.s@techmed.io',
    currentCompany: 'Cerner Health',
    currentRole: 'Lead EHR Systems Architect',
    experienceYears: 5.0,
    expectedCtc: '$95,000 / yr',
    noticePeriod: 'Immediate',
    appliedRole: 'Principal Health Tech Architect',
    status: 'Tech Round',
  },
  {
    id: 'EXP-203',
    name: 'Rajesh Menon',
    email: 'rajesh.menon@fortis.com',
    currentCompany: 'Fortis Hospitals Group',
    currentRole: 'Regional Hospital Operations Manager',
    experienceYears: 9.2,
    expectedCtc: '$110,000 / yr',
    noticePeriod: '15 Days',
    appliedRole: 'VP Hospital Partnerships',
    status: 'Offered',
  },
  {
    id: 'EXP-204',
    name: 'Pooja Kashyap',
    email: 'pooja.k@medpulse.in',
    currentCompany: 'MedPulse Diagnostics',
    currentRole: 'Senior Quality Assurance Specialist',
    experienceYears: 3.8,
    expectedCtc: '$65,000 / yr',
    noticePeriod: '30 Days',
    appliedRole: 'Clinical QA Lead',
    status: 'Shortlisted',
  },
];

export const CandidatesTab: React.FC = () => {
  const { showToast } = useToast();
  const [subTab, setSubTab] = useState<CandidateSubTab>('fresher');
  const [search, setSearch] = useState('');

  const filteredFreshers = SAMPLE_FRESHERS.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.college.toLowerCase().includes(search.toLowerCase()) ||
      c.appliedRole.toLowerCase().includes(search.toLowerCase()) ||
      c.degree.toLowerCase().includes(search.toLowerCase())
  );

  const filteredExperienced = SAMPLE_EXPERIENCED.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.currentCompany.toLowerCase().includes(search.toLowerCase()) ||
      c.appliedRole.toLowerCase().includes(search.toLowerCase()) ||
      c.currentRole.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Sub-tab Navigation for Fresher & Experienced */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', gap: 8, background: '#f1f5f9', padding: 4, borderRadius: 10 }}>
          <Button
            type="button"
            className={`tab-btn${subTab === 'fresher' ? ' active' : ''}`}
            onClick={() => {
              setSubTab('fresher');
              setSearch('');
            }}
            style={{
              padding: '7px 16px',
              fontSize: 13,
              borderRadius: 8,
              background: subTab === 'fresher' ? '#ffffff' : 'transparent',
              boxShadow: subTab === 'fresher' ? '0 2px 6px rgba(0,0,0,0.08)' : 'none',
              fontWeight: subTab === 'fresher' ? 700 : 500,
              color: subTab === 'fresher' ? '#2563eb' : '#64748b',
            }}
          >
            <i className="fas fa-graduation-cap" style={{ marginRight: 6 }} /> Fresher Candidates ({SAMPLE_FRESHERS.length})
          </Button>
          <Button
            type="button"
            className={`tab-btn${subTab === 'experienced' ? ' active' : ''}`}
            onClick={() => {
              setSubTab('experienced');
              setSearch('');
            }}
            style={{
              padding: '7px 16px',
              fontSize: 13,
              borderRadius: 8,
              background: subTab === 'experienced' ? '#ffffff' : 'transparent',
              boxShadow: subTab === 'experienced' ? '0 2px 6px rgba(0,0,0,0.08)' : 'none',
              fontWeight: subTab === 'experienced' ? 700 : 500,
              color: subTab === 'experienced' ? '#2563eb' : '#64748b',
            }}
          >
            <i className="fas fa-briefcase" style={{ marginRight: 6 }} /> Experienced Talent ({SAMPLE_EXPERIENCED.length})
          </Button>
        </div>

        <div style={{ position: 'relative', width: 260 }}>
          <Input
            type="text"
            placeholder={subTab === 'fresher' ? 'Search freshers...' : 'Search experienced...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: 32, fontSize: 13, height: 36, width: '100%' }}
          />
          <i
            className="fas fa-search"
            style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#8e9bb5', fontSize: 12 }}
          />
        </div>
      </div>

      {/* Sub-tab 1: Fresher Content */}
      {subTab === 'fresher' && (
        <div className="panel" style={{ padding: '20px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#1a2540' }}>
                Campus &amp; Entry-Level Graduate Pool
              </h3>
              <p style={{ margin: '4px 0 0 0', fontSize: 12, color: '#6b7a99' }}>
                Screening candidates graduating in 2025–2026 across healthcare, medical technology, informatics and software engineering.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => showToast('Exporting fresher shortlist as CSV…', 'info')}
            >
              <i className="fas fa-download" style={{ marginRight: 4 }} /> Export
            </Button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#f8faff', borderBottom: '1.5px solid #e9edf4' }}>
                  {['Candidate', 'Degree & Institution', 'Batch', 'CGPA / Score', 'Applied Role', 'Status', 'Actions'].map((h) => (
                    <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 600, color: '#6b7a99', fontSize: 12, whiteSpace: 'nowrap' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredFreshers.map((c) => (
                  <tr
                    key={c.id}
                    style={{ borderBottom: '1px solid #f0f3fa', transition: 'background 0.12s' }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLTableRowElement).style.background = '#f8faff')}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLTableRowElement).style.background = '')}
                  >
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ fontWeight: 600, color: '#1a2540' }}>{c.name}</div>
                      <div style={{ fontSize: 11, color: '#8e9bb5' }}>{c.email}</div>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ fontWeight: 500, color: '#2563eb' }}>{c.degree}</div>
                      <div style={{ fontSize: 11, color: '#64748b' }}>{c.college}</div>
                    </td>
                    <td style={{ padding: '12px 14px', color: '#6b7a99' }}>{c.year}</td>
                    <td style={{ padding: '12px 14px', fontWeight: 600, color: '#059669' }}>{c.cgpa}</td>
                    <td style={{ padding: '12px 14px', color: '#334155' }}>{c.appliedRole}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <span
                        style={{
                          background:
                            c.status === 'Offered'
                              ? '#dcfce7'
                              : c.status === 'Shortlisted'
                              ? '#eff6ff'
                              : c.status === 'Interview'
                              ? '#fef3c7'
                              : '#f1f5f9',
                          color:
                            c.status === 'Offered'
                              ? '#16a34a'
                              : c.status === 'Shortlisted'
                              ? '#1d4ed8'
                              : c.status === 'Interview'
                              ? '#b45309'
                              : '#64748b',
                          borderRadius: 20,
                          padding: '2px 10px',
                          fontSize: 11,
                          fontWeight: 600,
                        }}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px', whiteSpace: 'nowrap' }}>
                      <Button
                        variant="outline"
                        size="sm"
                        style={{ fontSize: 11, padding: '3px 8px', marginRight: 6 }}
                        onClick={() => showToast(`Reviewing resume of ${c.name}`, 'info')}
                      >
                        <i className="fas fa-file-alt" /> Resume
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        style={{ fontSize: 11, padding: '3px 8px' }}
                        onClick={() => showToast(`Shortlisted ${c.name} for technical test`, 'success')}
                      >
                        <i className="fas fa-check" /> Shortlist
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sub-tab 2: Experienced Content */}
      {subTab === 'experienced' && (
        <div className="panel" style={{ padding: '20px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#1a2540' }}>
                Lateral &amp; Senior Medical / Tech Professionals
              </h3>
              <p style={{ margin: '4px 0 0 0', fontSize: 12, color: '#6b7a99' }}>
                Experienced doctors, healthcare directors, systems architects, and clinical operations executives.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => showToast('Exporting lateral candidates report…', 'info')}
            >
              <i className="fas fa-download" style={{ marginRight: 4 }} /> Export
            </Button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#f8faff', borderBottom: '1.5px solid #e9edf4' }}>
                  {['Candidate', 'Current Role & Company', 'Experience', 'Expected CTC', 'Notice Period', 'Target Role', 'Stage', 'Actions'].map((h) => (
                    <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 600, color: '#6b7a99', fontSize: 12, whiteSpace: 'nowrap' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredExperienced.map((c) => (
                  <tr
                    key={c.id}
                    style={{ borderBottom: '1px solid #f0f3fa', transition: 'background 0.12s' }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLTableRowElement).style.background = '#f8faff')}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLTableRowElement).style.background = '')}
                  >
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ fontWeight: 600, color: '#1a2540' }}>{c.name}</div>
                      <div style={{ fontSize: 11, color: '#8e9bb5' }}>{c.email}</div>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ fontWeight: 500, color: '#1a2540' }}>{c.currentRole}</div>
                      <div style={{ fontSize: 11, color: '#2563eb' }}>{c.currentCompany}</div>
                    </td>
                    <td style={{ padding: '12px 14px', fontWeight: 700, color: '#334155' }}>
                      {c.experienceYears} yrs
                    </td>
                    <td style={{ padding: '12px 14px', color: '#16a34a', fontWeight: 600 }}>{c.expectedCtc}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ background: c.noticePeriod === 'Immediate' ? '#dcfce7' : '#f1f5f9', color: c.noticePeriod === 'Immediate' ? '#16a34a' : '#475569', padding: '2px 8px', borderRadius: 6, fontSize: 11, fontWeight: 600 }}>
                        {c.noticePeriod}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px', color: '#334155' }}>{c.appliedRole}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <span
                        style={{
                          background: c.status === 'Offered' ? '#dcfce7' : c.status === 'Shortlisted' ? '#eff6ff' : '#fef3c7',
                          color: c.status === 'Offered' ? '#16a34a' : c.status === 'Shortlisted' ? '#1d4ed8' : '#b45309',
                          borderRadius: 20,
                          padding: '2px 10px',
                          fontSize: 11,
                          fontWeight: 600,
                        }}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px', whiteSpace: 'nowrap' }}>
                      <Button
                        variant="outline"
                        size="sm"
                        style={{ fontSize: 11, padding: '3px 8px', marginRight: 6 }}
                        onClick={() => showToast(`Scheduling executive interview with ${c.name}`, 'info')}
                      >
                        <i className="fas fa-calendar-alt" /> Interview
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        style={{ fontSize: 11, padding: '3px 8px' }}
                        onClick={() => showToast(`Offer letter generated for ${c.name}`, 'success')}
                      >
                        <i className="fas fa-paper-plane" /> Offer
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
