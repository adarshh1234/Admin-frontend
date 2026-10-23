export type UMTab = 'user-management' | 'candidates' | 'bulk-candidates' | 'hrms' | 'acmaso';
export type CandidateSubTab = 'fresher' | 'experienced';

export interface UserManagementComingSoonProps {
  onBackToDashboard?: () => void;
}

export interface UserManagementTabbedViewProps {
  initialTab?: UMTab;
  activeTab?: UMTab;
  onTabChange?: (tab: UMTab) => void;
  onNavigateDashboard?: () => void;
}

export interface UserManagementPageProps {
  onNavigateDashboard?: () => void;
  initialSubTab?: 'staff' | 'admins';
}

export interface FresherCandidate {
  id: string;
  name: string;
  email: string;
  degree: string;
  college: string;
  year: number;
  cgpa: string;
  appliedRole: string;
  status: 'Applied' | 'Interview' | 'Shortlisted' | 'Offered';
}

export interface ExperiencedCandidate {
  id: string;
  name: string;
  email: string;
  currentCompany: string;
  currentRole: string;
  experienceYears: number;
  expectedCtc: string;
  noticePeriod: string;
  appliedRole: string;
  status: 'Tech Round' | 'Shortlisted' | 'HR Round' | 'Offered';
}

export interface BulkBatch {
  id: string;
  batchName: string;
  source: string;
  totalResumes: number;
  parsedCount: number;
  date: string;
  status: 'Completed' | 'Processing' | 'Pending';
}
