export type AccountStatus = 'Active' | 'Inactive' | 'Suspended';
export type VerificationStatus = 'Verified' | 'Pending' | 'Rejected';

export interface ActivityItem {
  id: string;
  action: string;
  timestamp: string;
  details?: string;
  user?: string;
}

export interface DocumentItem {
  id: string;
  name: string;
  size: string;
  type: string;
  url?: string;
  uploadedAt: string;
}

// ---------------------------------------------------------------------------
// CANDIDATES
// ---------------------------------------------------------------------------
export interface CandidateUser {
  id: string;
  name: string;
  avatar?: string;
  email: string;
  phone: string;
  location: string;
  education: string;
  college: string;
  graduationYear?: number;
  experience: string;
  experienceYears: number;
  skills: string[];
  resumeName?: string;
  resumeSize?: string;
  profileCompletion: number;
  accountStatus: AccountStatus;
  verificationStatus: VerificationStatus;
  registrationDate: string;
  bio?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  recentActivity: ActivityItem[];
}

// ---------------------------------------------------------------------------
// STARTUPS
// ---------------------------------------------------------------------------
export interface StartupUser {
  id: string;
  name: string;
  logo?: string;
  founder: string;
  coFounders?: string[];
  email: string;
  phone: string;
  industry: string;
  location: string;
  stage: 'Pre-Seed' | 'Seed' | 'Series A' | 'Series B' | 'Growth' | 'Early Stage';
  website: string;
  description: string;
  tagline?: string;
  teamSize: string;
  fundingRaised?: string;
  documents: DocumentItem[];
  accountStatus: AccountStatus;
  verificationStatus: VerificationStatus;
  registrationDate: string;
  recentActivity: ActivityItem[];
}

// ---------------------------------------------------------------------------
// COMPANIES
// ---------------------------------------------------------------------------
export interface CompanyUser {
  id: string;
  name: string;
  logo?: string;
  contactPerson: string;
  contactRole?: string;
  email: string;
  phone: string;
  industry: string;
  location: string;
  companySize: '1-10' | '10-50' | '50-200' | '200-500' | '500-1000' | '1000+';
  website: string;
  description: string;
  activeHiringPositions?: number;
  documents: DocumentItem[];
  accountStatus: AccountStatus;
  verificationStatus: VerificationStatus;
  registrationDate: string;
  recentActivity: ActivityItem[];
}

// ---------------------------------------------------------------------------
// INSTITUTIONS
// ---------------------------------------------------------------------------
export interface InstitutionUser {
  id: string;
  name: string;
  logo?: string;
  contactPerson: string;
  contactRole?: string;
  email: string;
  phone: string;
  institutionType: 'Central University' | 'State University' | 'Engineering College' | 'Medical Institute' | 'Business School' | 'Research Academy';
  location: string;
  website: string;
  description: string;
  accreditation?: string;
  totalStudents?: string;
  documents: DocumentItem[];
  accountStatus: AccountStatus;
  verificationStatus: VerificationStatus;
  registrationDate: string;
  recentActivity: ActivityItem[];
}

export interface UserSummaryStats {
  total: number;
  active: number;
  pending: number;
  suspended: number;
}
