import type {
  CandidateUser,
  StartupUser,
  CompanyUser,
  InstitutionUser,
  UserSummaryStats,
  AccountStatus,
  VerificationStatus,
} from '../types/platformUsers';
import { API_BASE_URL } from './apiConfig';
import { authService } from './auth.service';

function getPlatformHeaders(): Record<string, string> {
  const token = authService.getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  } else {
    headers['Authorization'] = 'Bearer admin-token';
    headers['x-admin-key'] = 'admin';
    headers['x-admin-role'] = 'Admin';
  }
  return headers;
}

// ---------------------------------------------------------------------------
// INITIAL CANDIDATES MOCK DATA
// ---------------------------------------------------------------------------
const INITIAL_CANDIDATES: CandidateUser[] = [
  {
    id: 'CND-1001',
    name: 'Aarav Sharma',
    avatar: 'AS',
    email: 'aarav.sharma@example.com',
    phone: '+91 98765 43210',
    location: 'Bengaluru, Karnataka',
    education: 'B.Tech in Computer Science',
    college: 'IIT Kharagpur',
    graduationYear: 2024,
    experience: 'Fresher / 1 yr internship',
    experienceYears: 1,
    skills: ['React', 'TypeScript', 'Node.js', 'Python', 'Tailwind CSS', 'Docker'],
    resumeName: 'Aarav_Sharma_Resume_2026.pdf',
    resumeSize: '1.4 MB',
    profileCompletion: 95,
    accountStatus: 'Active',
    verificationStatus: 'Verified',
    registrationDate: '2026-08-14',
    bio: 'Full-stack software developer passionate about building scalable web applications, microservices, and AI workflow tools.',
    githubUrl: 'https://github.com/aaravsharma',
    linkedinUrl: 'https://linkedin.com/in/aaravsharma',
    recentActivity: [
      { id: 'act-1', action: 'Account Verified', timestamp: '2026-08-15 10:30 AM', user: 'Admin' },
      { id: 'act-2', action: 'Applied to InnovateTech - Fullstack Role', timestamp: '2026-09-10 02:15 PM' },
      { id: 'act-3', action: 'Updated Resume & Portfolio Links', timestamp: '2026-09-14 06:45 PM' },
    ],
  },
  {
    id: 'CND-1002',
    name: 'Pooja Iyer',
    avatar: 'PI',
    email: 'pooja.iyer@healthmed.org',
    phone: '+91 98234 56789',
    location: 'Mumbai, Maharashtra',
    education: 'M.S. in Biomedical Informatics',
    college: 'AIIMS New Delhi',
    graduationYear: 2022,
    experience: '3.5 yrs Experience',
    experienceYears: 3.5,
    skills: ['Clinical Data Analysis', 'Python', 'FHIR Standards', 'EHR Integration', 'R', 'SQL'],
    resumeName: 'Pooja_Iyer_Clinical_CV.pdf',
    resumeSize: '2.1 MB',
    profileCompletion: 90,
    accountStatus: 'Active',
    verificationStatus: 'Verified',
    registrationDate: '2026-07-22',
    bio: 'Healthcare informatics specialist bridging clinical workflow systems, patient data interoperability, and AI health modeling.',
    githubUrl: 'https://github.com/poojaiyer',
    linkedinUrl: 'https://linkedin.com/in/poojaiyer',
    recentActivity: [
      { id: 'act-4', action: 'Shortlisted by MedPulse Diagnostics', timestamp: '2026-09-12 11:20 AM' },
      { id: 'act-5', action: 'Completed Bio-Stats Verification Test', timestamp: '2026-08-01 04:00 PM' },
    ],
  },
  {
    id: 'CND-1003',
    name: 'Devendra Rathore',
    avatar: 'DR',
    email: 'devendra.r@cloudops.io',
    phone: '+91 99112 34567',
    location: 'Hyderabad, Telangana',
    education: 'B.E. Information Technology',
    college: 'NIT Warangal',
    graduationYear: 2021,
    experience: '4.8 yrs Experience',
    experienceYears: 4.8,
    skills: ['AWS', 'Kubernetes', 'Terraform', 'CI/CD', 'Golang', 'Prometheus'],
    resumeName: 'Devendra_DevOps_Senior.pdf',
    resumeSize: '890 KB',
    profileCompletion: 85,
    accountStatus: 'Active',
    verificationStatus: 'Pending',
    registrationDate: '2026-09-02',
    bio: 'Senior DevOps and Cloud Infrastructure architect specializing in automated multi-cloud deployments and reliability.',
    recentActivity: [
      { id: 'act-6', action: 'Registered on LetGetIn platform', timestamp: '2026-09-02 09:12 AM' },
      { id: 'act-7', action: 'Submitted KYC & Identity Documents', timestamp: '2026-09-02 09:30 AM' },
    ],
  },
  {
    id: 'CND-1004',
    name: 'Simran Kaur',
    avatar: 'SK',
    email: 'simran.kaur@fintechcorp.in',
    phone: '+91 97654 32109',
    location: 'Gurugram, Haryana',
    education: 'MBA in Finance & Analytics',
    college: 'IIM Lucknow',
    graduationYear: 2023,
    experience: '2.5 yrs Experience',
    experienceYears: 2.5,
    skills: ['Financial Modeling', 'Risk Assessment', 'PowerBI', 'Tableau', 'Excel Advanced', 'Python'],
    resumeName: 'Simran_Kaur_Fin_Analyst.pdf',
    resumeSize: '1.2 MB',
    profileCompletion: 88,
    accountStatus: 'Active',
    verificationStatus: 'Verified',
    registrationDate: '2026-08-05',
    bio: 'FinTech product analyst with focus on consumer lending risk metrics, cohort modeling, and regulatory compliance.',
    recentActivity: [
      { id: 'act-8', action: 'Attended Virtual Campus Hiring Expo', timestamp: '2026-09-08 03:00 PM' },
    ],
  },
  {
    id: 'CND-1005',
    name: 'Karan Mehra',
    avatar: 'KM',
    email: 'karan.m@suspicious.net',
    phone: '+91 90000 11111',
    location: 'Noida, Uttar Pradesh',
    education: 'B.Com / Unverified',
    college: 'City Open College',
    graduationYear: 2025,
    experience: 'Fresher',
    experienceYears: 0,
    skills: ['Data Entry', 'Copywriting'],
    resumeName: 'Resume_Draft.docx',
    resumeSize: '45 KB',
    profileCompletion: 35,
    accountStatus: 'Suspended',
    verificationStatus: 'Rejected',
    registrationDate: '2026-09-01',
    bio: 'Account flagged for submitting invalid certification credentials and automated bulk application spam.',
    recentActivity: [
      { id: 'act-9', action: 'Account Suspended by Admin', timestamp: '2026-09-05 05:10 PM', user: 'Admin' },
      { id: 'act-10', action: 'Verification Rejected - Incomplete Docs', timestamp: '2026-09-05 05:08 PM', user: 'Admin' },
    ],
  },
  {
    id: 'CND-1006',
    name: 'Ananya Deshmukh',
    avatar: 'AD',
    email: 'ananya.d@gmail.com',
    phone: '+91 98456 78901',
    location: 'Pune, Maharashtra',
    education: 'B.Tech Healthcare Tech',
    college: 'IIT Kharagpur',
    graduationYear: 2026,
    experience: 'Graduating 2026',
    experienceYears: 0.5,
    skills: ['Clinical Informatics', 'Frontend Dev', 'React', 'Bio-Sensors', 'Flutter'],
    resumeName: 'Ananya_Deshmukh_Resume.pdf',
    resumeSize: '1.6 MB',
    profileCompletion: 92,
    accountStatus: 'Active',
    verificationStatus: 'Verified',
    registrationDate: '2026-09-12',
    bio: 'Final year undergraduate exploring deep-tech healthcare instrumentation and telemedicine product engineering.',
    recentActivity: [
      { id: 'act-11', action: 'Interview Scheduled with Apollo TeleHealth', timestamp: '2026-09-15 01:30 PM' },
    ],
  },
  {
    id: 'CND-1007',
    name: 'Vikramaditya Roy',
    avatar: 'VR',
    email: 'v.roy@mednetwork.org',
    phone: '+91 97123 45678',
    location: 'Chennai, Tamil Nadu',
    education: 'M.D. Cardiology & Digital Health',
    college: 'CMC Vellore',
    graduationYear: 2017,
    experience: '8.5 yrs Experience',
    experienceYears: 8.5,
    skills: ['Clinical Operations', 'Cardiology Diagnostics', 'Medical Advisory', 'Team Leadership'],
    resumeName: 'Dr_Vikram_Roy_Executive_CV.pdf',
    resumeSize: '3.4 MB',
    profileCompletion: 100,
    accountStatus: 'Active',
    verificationStatus: 'Verified',
    registrationDate: '2026-07-10',
    bio: 'Medical doctor turned healthcare enterprise director specializing in telemedicine infrastructure expansion.',
    recentActivity: [
      { id: 'act-12', action: 'Received Director Offer from CureMaso Labs', timestamp: '2026-09-16 11:00 AM' },
    ],
  },
  {
    id: 'CND-1008',
    name: 'Sneha Patel',
    avatar: 'SP',
    email: 'sneha.p@outlook.com',
    phone: '+91 96543 21098',
    location: 'Ahmedabad, Gujarat',
    education: 'B.Pharm',
    college: 'Manipal College of Pharmaceutical Sciences',
    graduationYear: 2026,
    experience: 'Fresher',
    experienceYears: 0,
    skills: ['Pharmacovigilance', 'Drug Safety Reporting', 'Clinical Trials Protocol', 'Regulatory Affairs'],
    resumeName: 'Sneha_Patel_Pharm_CV.pdf',
    resumeSize: '1.1 MB',
    profileCompletion: 78,
    accountStatus: 'Inactive',
    verificationStatus: 'Pending',
    registrationDate: '2026-09-08',
    bio: 'Pharmaceutical graduate with strong interest in drug safety monitoring, clinical trial protocols, and regulatory filings.',
    recentActivity: [
      { id: 'act-13', action: 'Profile created, awaiting student email confirmation', timestamp: '2026-09-08 10:15 AM' },
    ],
  },
];

// ---------------------------------------------------------------------------
// INITIAL STARTUPS MOCK DATA
// ---------------------------------------------------------------------------
const INITIAL_STARTUPS: StartupUser[] = [
  {
    id: 'STP-2001',
    name: 'MediSync AI',
    logo: '⚡',
    founder: 'Rohan Varma',
    coFounders: ['Dr. Alok Sen', 'Priya Menon'],
    email: 'founders@medisync.ai',
    phone: '+91 98888 12345',
    industry: 'HealthTech / AI',
    location: 'Bengaluru, Karnataka',
    stage: 'Series A',
    website: 'https://medisync.ai',
    tagline: 'Autonomous AI clinical scribe and automated patient EHR copilot.',
    description: 'MediSync AI streamlines doctor-patient encounters by automatically generating structured prescription notes and clinical summaries directly into hospital records.',
    teamSize: '24 Members',
    fundingRaised: '$3.8M',
    documents: [
      { id: 'doc-1', name: 'Series_A_TermSheet.pdf', size: '2.4 MB', type: 'PDF', uploadedAt: '2026-08-10' },
      { id: 'doc-2', name: 'Certificate_of_Incorporation_MCA.pdf', size: '1.1 MB', type: 'PDF', uploadedAt: '2026-08-10' },
      { id: 'doc-3', name: 'HIPAA_Compliance_Audit.pdf', size: '3.9 MB', type: 'PDF', uploadedAt: '2026-08-15' },
    ],
    accountStatus: 'Active',
    verificationStatus: 'Verified',
    registrationDate: '2026-08-10',
    recentActivity: [
      { id: 'act-201', action: 'Verified by LetGetIn Compliance Desk', timestamp: '2026-08-12 04:30 PM', user: 'Admin' },
      { id: 'act-202', action: 'Posted 6 New Software Engineering Jobs', timestamp: '2026-09-04 11:00 AM' },
    ],
  },
  {
    id: 'STP-2002',
    name: 'KiteFlow Logistics',
    logo: '🚀',
    founder: 'Tanvi Nair',
    coFounders: ['Vikram Joshi'],
    email: 'contact@kiteflow.io',
    phone: '+91 97777 23456',
    industry: 'Supply Chain / Mobility',
    location: 'Mumbai, Maharashtra',
    stage: 'Seed',
    website: 'https://kiteflow.io',
    tagline: 'Ultra-fast cold-chain pharmaceuticals dispatch and route optimization.',
    description: 'KiteFlow uses IoT-enabled smart temperature containers and predictive algorithms for medical logistics across Tier 1 and Tier 2 cities.',
    teamSize: '14 Members',
    fundingRaised: '$1.2M',
    documents: [
      { id: 'doc-4', name: 'Pitch_Deck_Q3_2026.pdf', size: '5.2 MB', type: 'PDF', uploadedAt: '2026-09-01' },
      { id: 'doc-5', name: 'GST_Registration_Certificate.pdf', size: '820 KB', type: 'PDF', uploadedAt: '2026-09-01' },
    ],
    accountStatus: 'Active',
    verificationStatus: 'Verified',
    registrationDate: '2026-09-01',
    recentActivity: [
      { id: 'act-203', action: 'Connected with 4 Campus Placement Cells', timestamp: '2026-09-14 02:00 PM' },
    ],
  },
  {
    id: 'STP-2003',
    name: 'EduNext Cloud',
    logo: '🎓',
    founder: 'Sameer Sheikh',
    email: 'founders@edunext.cloud',
    phone: '+91 96666 34567',
    industry: 'EdTech',
    location: 'Pune, Maharashtra',
    stage: 'Pre-Seed',
    website: 'https://edunext.cloud',
    tagline: 'Interactive virtual STEM laboratory simulations for colleges.',
    description: 'Providing browser-based simulation sandboxes for engineering and biotechnology students to conduct hands-on laboratory experiments virtually.',
    teamSize: '6 Members',
    fundingRaised: '$250K',
    documents: [
      { id: 'doc-6', name: 'Startup_India_DPIIT_Cert.pdf', size: '1.4 MB', type: 'PDF', uploadedAt: '2026-09-07' },
    ],
    accountStatus: 'Active',
    verificationStatus: 'Pending',
    registrationDate: '2026-09-07',
    recentActivity: [
      { id: 'act-204', action: 'Submitted Registration Documents for Review', timestamp: '2026-09-07 01:20 PM' },
    ],
  },
  {
    id: 'STP-2004',
    name: 'CyberShield Quantum',
    logo: '🛡️',
    founder: 'Raghav Aggarwal',
    coFounders: ['Neha Chawla'],
    email: 'info@cybershieldq.com',
    phone: '+91 95555 45678',
    industry: 'Cyber Security / DeepTech',
    location: 'Hyderabad, Telangana',
    stage: 'Series B',
    website: 'https://cybershieldq.com',
    tagline: 'Post-quantum cryptographic encryption for enterprise and banking.',
    description: 'Developing next-generation encryption keys resistant to quantum computing attacks for defense and global financial institutions.',
    teamSize: '42 Members',
    fundingRaised: '$12.5M',
    documents: [
      { id: 'doc-7', name: 'Cert_In_Empanelment.pdf', size: '2.1 MB', type: 'PDF', uploadedAt: '2026-07-15' },
      { id: 'doc-8', name: 'Patent_Grant_PQ_Security.pdf', size: '3.0 MB', type: 'PDF', uploadedAt: '2026-07-15' },
    ],
    accountStatus: 'Active',
    verificationStatus: 'Verified',
    registrationDate: '2026-07-15',
    recentActivity: [
      { id: 'act-205', action: 'Annual Security Compliance Re-verified', timestamp: '2026-09-10 10:00 AM', user: 'Admin' },
    ],
  },
  {
    id: 'STP-2005',
    name: 'FakeCrypto Yield',
    logo: '⚠️',
    founder: 'Anonymous / Unverified',
    email: 'support@fakeyield-invest.xyz',
    phone: '+91 91111 00000',
    industry: 'FinTech / High Risk',
    location: 'Unknown / Offshore',
    stage: 'Pre-Seed',
    website: 'https://fakeyield-invest.xyz',
    tagline: 'High yield automated returns.',
    description: 'Suspicious scheme flagged for fraudulent multi-level referral practices and missing regulatory licensing.',
    teamSize: '2 Members',
    fundingRaised: 'N/A',
    documents: [],
    accountStatus: 'Suspended',
    verificationStatus: 'Rejected',
    registrationDate: '2026-08-28',
    recentActivity: [
      { id: 'act-206', action: 'Startup Account Suspended & Blacklisted', timestamp: '2026-08-29 03:30 PM', user: 'Admin' },
    ],
  },
  {
    id: 'STP-2006',
    name: 'AgriSense Robotics',
    logo: '🌱',
    founder: 'Manish Gowda',
    email: 'manish@agrisenserobotics.in',
    phone: '+91 94444 56789',
    industry: 'AgriTech / Hardware',
    location: 'Mysuru, Karnataka',
    stage: 'Seed',
    website: 'https://agrisenserobotics.in',
    tagline: 'Autonomous crop health monitoring drones and soil sensor networks.',
    description: 'Precision agricultural drones equipped with multispectral cameras to identify crop disease early and reduce pesticide waste.',
    teamSize: '11 Members',
    fundingRaised: '$850K',
    documents: [
      { id: 'doc-9', name: 'Drone_DGCA_Type_Certificate.pdf', size: '4.5 MB', type: 'PDF', uploadedAt: '2026-09-03' },
    ],
    accountStatus: 'Inactive',
    verificationStatus: 'Pending',
    registrationDate: '2026-09-03',
    recentActivity: [
      { id: 'act-207', action: 'Awaiting DGCA clearance verification', timestamp: '2026-09-03 04:45 PM' },
    ],
  },
];

// ---------------------------------------------------------------------------
// INITIAL COMPANIES MOCK DATA
// ---------------------------------------------------------------------------
const INITIAL_COMPANIES: CompanyUser[] = [
  {
    id: 'CMP-3001',
    name: 'Apollo Health City',
    logo: '🏥',
    contactPerson: 'Dr. Ramesh Kulkarni',
    contactRole: 'Chief Human Resources Officer',
    email: 'careers@apollohealthcity.com',
    phone: '+91 40 2360 7777',
    industry: 'Healthcare & Hospital Networks',
    location: 'Hyderabad, Telangana',
    companySize: '1000+',
    website: 'https://apollohealthcity.com',
    description: 'Asia’s premier integrated healthcare city providing multispeciality tertiary care, clinical research labs, and academic medical training.',
    activeHiringPositions: 38,
    documents: [
      { id: 'cdoc-1', name: 'NABH_Accreditation_2026.pdf', size: '2.8 MB', type: 'PDF', uploadedAt: '2026-06-10' },
      { id: 'cdoc-2', name: 'Corporate_CIN_Registration.pdf', size: '1.2 MB', type: 'PDF', uploadedAt: '2026-06-10' },
    ],
    accountStatus: 'Active',
    verificationStatus: 'Verified',
    registrationDate: '2026-06-10',
    recentActivity: [
      { id: 'cact-1', action: 'Posted 12 Clinical Resident Positions', timestamp: '2026-09-14 09:30 AM' },
      { id: 'cact-2', action: 'Verified Corporate Partnership Agreement', timestamp: '2026-06-12 02:00 PM', user: 'Admin' },
    ],
  },
  {
    id: 'CMP-3002',
    name: 'TechMed Diagnostics Global',
    logo: '🔬',
    contactPerson: 'Arpita Sengupta',
    contactRole: 'Head of Global Talent Acquisition',
    email: 'recruitment@techmedglobal.io',
    phone: '+91 80 4123 9999',
    industry: 'Health Tech & Diagnostics',
    location: 'Bengaluru, Karnataka',
    companySize: '500-1000',
    website: 'https://techmedglobal.io',
    description: 'Global medical diagnostics and laboratory enterprise operating 120+ diagnostic centers across 6 countries with automated sequencing pipelines.',
    activeHiringPositions: 19,
    documents: [
      { id: 'cdoc-3', name: 'CAP_ISO_15189_Cert.pdf', size: '3.1 MB', type: 'PDF', uploadedAt: '2026-07-01' },
    ],
    accountStatus: 'Active',
    verificationStatus: 'Verified',
    registrationDate: '2026-07-01',
    recentActivity: [
      { id: 'cact-3', action: 'Interviewed 45 Shortlisted Campus Candidates', timestamp: '2026-09-16 04:00 PM' },
    ],
  },
  {
    id: 'CMP-3003',
    name: 'Cerner Health Technologies India',
    logo: '💻',
    contactPerson: 'Anand Viswanathan',
    contactRole: 'Engineering Director',
    email: 'india.hr@cernerhealth.com',
    phone: '+91 80 6600 1234',
    industry: 'Enterprise Software / EHR',
    location: 'Bengaluru, Karnataka',
    companySize: '1000+',
    website: 'https://cernerhealth.com',
    description: 'Enterprise healthcare information systems leader supplying digital health records, hospital pharmacy automation, and telehealth portals.',
    activeHiringPositions: 24,
    documents: [
      { id: 'cdoc-4', name: 'Entity_Registration_PAN.pdf', size: '950 KB', type: 'PDF', uploadedAt: '2026-08-01' },
    ],
    accountStatus: 'Active',
    verificationStatus: 'Verified',
    registrationDate: '2026-08-01',
    recentActivity: [
      { id: 'cact-4', action: 'Renewed Enterprise Recruiter License', timestamp: '2026-09-01 10:00 AM' },
    ],
  },
  {
    id: 'CMP-3004',
    name: 'InnoVenture Cloud Systems',
    logo: '☁️',
    contactPerson: 'Sanjay Deshpande',
    contactRole: 'VP Operations',
    email: 'admin@innoventurecloud.net',
    phone: '+91 22 2840 5555',
    industry: 'Cloud Computing / IT',
    location: 'Mumbai, Maharashtra',
    companySize: '50-200',
    website: 'https://innoventurecloud.net',
    description: 'Cloud migration consultancy and DevOps service provider for mid-market financial and insurance enterprises.',
    activeHiringPositions: 8,
    documents: [
      { id: 'cdoc-5', name: 'GSTIN_Certificate.pdf', size: '1.4 MB', type: 'PDF', uploadedAt: '2026-09-05' },
    ],
    accountStatus: 'Active',
    verificationStatus: 'Pending',
    registrationDate: '2026-09-05',
    recentActivity: [
      { id: 'cact-5', action: 'Corporate registration documents under admin verification', timestamp: '2026-09-05 03:15 PM' },
    ],
  },
  {
    id: 'CMP-3005',
    name: 'Shadow BPO Outsourcing Ltd',
    logo: '🚫',
    contactPerson: 'Unknown Representative',
    contactRole: 'Manager',
    email: 'hiring@shadowbpo-fake.org',
    phone: '+91 99999 88888',
    industry: 'Staffing / Unverified',
    location: 'Unknown',
    companySize: '10-50',
    website: 'https://shadowbpo-fake.org',
    description: 'Flagged entity attempting to collect processing fees from candidates during recruitment drives.',
    activeHiringPositions: 0,
    documents: [],
    accountStatus: 'Suspended',
    verificationStatus: 'Rejected',
    registrationDate: '2026-08-15',
    recentActivity: [
      { id: 'cact-6', action: 'Account Suspended & Reported for Fraud', timestamp: '2026-08-18 11:30 AM', user: 'Admin' },
    ],
  },
  {
    id: 'CMP-3006',
    name: 'Fortis Hospitals Group',
    logo: '🏨',
    contactPerson: 'Meera Nambiar',
    contactRole: 'Director Talent & Culture',
    email: 'careers@fortishealthcare.com',
    phone: '+91 124 492 1021',
    industry: 'Hospital Care / Tertiary Medicine',
    location: 'Gurugram, Haryana',
    companySize: '1000+',
    website: 'https://fortishealthcare.com',
    description: 'Leading integrated healthcare services provider in India with over 4,000 operational beds across 28 hospitals.',
    activeHiringPositions: 31,
    documents: [
      { id: 'cdoc-6', name: 'Fortis_Accreditation_Folder.zip', size: '8.2 MB', type: 'ZIP', uploadedAt: '2026-07-20' },
    ],
    accountStatus: 'Active',
    verificationStatus: 'Verified',
    registrationDate: '2026-07-20',
    recentActivity: [
      { id: 'cact-7', action: 'Created 2026-2027 Campus Drive Schedule', timestamp: '2026-09-11 02:40 PM' },
    ],
  },
];

// ---------------------------------------------------------------------------
// INITIAL INSTITUTIONS MOCK DATA
// ---------------------------------------------------------------------------
const INITIAL_INSTITUTIONS: InstitutionUser[] = [
  {
    id: 'INS-4001',
    name: 'Indian Institute of Technology Kharagpur (IIT-KGP)',
    logo: '🏛️',
    contactPerson: 'Prof. Debashis Sen',
    contactRole: 'Dean of Career Development & Placement',
    email: 'placement@iitkgp.ac.in',
    phone: '+91 3222 282 022',
    institutionType: 'Central University',
    location: 'Kharagpur, West Bengal',
    website: 'https://www.iitkgp.ac.in',
    description: 'Premier national institute of technology established in 1951, offering top-tier undergraduate and doctoral engineering, medical sciences and tech curricula.',
    accreditation: 'Institute of National Importance / NIRF #5',
    totalStudents: '14,500+ Students',
    documents: [
      { id: 'idoc-1', name: 'IIT_Placement_Brochure_2026.pdf', size: '6.4 MB', type: 'PDF', uploadedAt: '2026-06-01' },
      { id: 'idoc-2', name: 'Institute_Charter_MCA.pdf', size: '2.1 MB', type: 'PDF', uploadedAt: '2026-06-01' },
    ],
    accountStatus: 'Active',
    verificationStatus: 'Verified',
    registrationDate: '2026-06-01',
    recentActivity: [
      { id: 'iact-1', action: 'Approved 24 Recruiter Partner Companies', timestamp: '2026-09-15 11:00 AM' },
      { id: 'iact-2', action: 'Bulk Uploaded 450 Graduating Student Profiles', timestamp: '2026-09-12 04:30 PM' },
    ],
  },
  {
    id: 'INS-4002',
    name: 'All India Institute of Medical Sciences (AIIMS) New Delhi',
    logo: '🏥',
    contactPerson: 'Dr. Suniti Singhal',
    contactRole: 'Director Medical Training & Internships',
    email: 'academic.dean@aiims.edu',
    phone: '+91 11 2658 8500',
    institutionType: 'Medical Institute',
    location: 'New Delhi, Delhi',
    website: 'https://www.aiims.edu',
    description: 'Apex medical college and medical research public institute in India, recognized globally for clinical excellence, medical research, and residency programs.',
    accreditation: 'NIRF Medical Rank #1',
    totalStudents: '4,200+ Students',
    documents: [
      { id: 'idoc-3', name: 'MCI_NMC_Recognition_Affidavit.pdf', size: '1.8 MB', type: 'PDF', uploadedAt: '2026-06-15' },
    ],
    accountStatus: 'Active',
    verificationStatus: 'Verified',
    registrationDate: '2026-06-15',
    recentActivity: [
      { id: 'iact-3', action: 'Verified 120 Resident Doctor Credentials', timestamp: '2026-09-10 03:15 PM' },
    ],
  },
  {
    id: 'INS-4003',
    name: 'National Institute of Technology (NIT) Trichy',
    logo: '🏢',
    contactPerson: 'Dr. G. Kannabiran',
    contactRole: 'Placement Cell Convenor',
    email: 'tnp@nitt.edu',
    phone: '+91 431 250 3000',
    institutionType: 'Engineering College',
    location: 'Tiruchirappalli, Tamil Nadu',
    website: 'https://www.nitt.edu',
    description: 'One of the premier technical institutes in Southern India renowned for research output, computing innovation, and industry placements.',
    accreditation: 'NIRF Engineering Rank #9',
    totalStudents: '6,800+ Students',
    documents: [
      { id: 'idoc-4', name: 'NIT_Placement_Policy_2026.pdf', size: '2.5 MB', type: 'PDF', uploadedAt: '2026-07-10' },
    ],
    accountStatus: 'Active',
    verificationStatus: 'Verified',
    registrationDate: '2026-07-10',
    recentActivity: [
      { id: 'iact-4', action: 'Scheduled Fall Campus Drive 2026', timestamp: '2026-09-08 10:00 AM' },
    ],
  },
  {
    id: 'INS-4004',
    name: 'Apex Academy of Management & Technology',
    logo: '🏫',
    contactPerson: 'Vipul Mathur',
    contactRole: 'Registrar',
    email: 'registrar@apexacademy-unverified.edu',
    phone: '+91 120 456 7890',
    institutionType: 'Business School',
    location: 'Greater Noida, Uttar Pradesh',
    website: 'https://apexacademy-edu.in',
    description: 'Private management college awaiting state university affiliation renewal and UGC validation clearance.',
    accreditation: 'UGC Under Review',
    totalStudents: '1,200 Students',
    documents: [
      { id: 'idoc-5', name: 'Application_For_Affiliation_Renewal.pdf', size: '3.3 MB', type: 'PDF', uploadedAt: '2026-09-02' },
    ],
    accountStatus: 'Active',
    verificationStatus: 'Pending',
    registrationDate: '2026-09-02',
    recentActivity: [
      { id: 'iact-5', action: 'Submitted Affiliation Papers for Admin Review', timestamp: '2026-09-02 02:30 PM' },
    ],
  },
  {
    id: 'INS-4005',
    name: 'Unregistered Diploma Scam Center',
    logo: '🚫',
    contactPerson: 'Fake Admin',
    contactRole: 'Director',
    email: 'admin@bogusdiploma.org',
    phone: '+91 99999 00000',
    institutionType: 'Research Academy',
    location: 'Unverified Location',
    website: 'https://bogusdiploma.org',
    description: 'Entity issuing unaccredited certificates without AICTE/UGC approval.',
    accreditation: 'None / Fake',
    totalStudents: '0',
    documents: [],
    accountStatus: 'Suspended',
    verificationStatus: 'Rejected',
    registrationDate: '2026-08-18',
    recentActivity: [
      { id: 'iact-6', action: 'Institution Blacklisted & Suspended', timestamp: '2026-08-20 01:00 PM', user: 'Admin' },
    ],
  },
  {
    id: 'INS-4006',
    name: 'Manipal College of Pharmaceutical Sciences',
    logo: '💊',
    contactPerson: 'Dr. C. Mallikarjuna Rao',
    contactRole: 'Principal & Placement Head',
    email: 'pharmacy.manipal@manipal.edu',
    phone: '+91 820 292 2482',
    institutionType: 'Medical Institute',
    location: 'Manipal, Karnataka',
    website: 'https://manipal.edu/mcops',
    description: 'Leading pharmacy college in India accredited by PCI and AICTE, excelling in pharmaceutical chemistry, clinical research, and pharmacology.',
    accreditation: 'NIRF Pharmacy Rank #2',
    totalStudents: '1,850+ Students',
    documents: [
      { id: 'idoc-6', name: 'PCI_Approval_Letter.pdf', size: '1.9 MB', type: 'PDF', uploadedAt: '2026-07-28' },
    ],
    accountStatus: 'Active',
    verificationStatus: 'Verified',
    registrationDate: '2026-07-28',
    recentActivity: [
      { id: 'iact-7', action: 'Organized Virtual Healthcare Career Summit', timestamp: '2026-09-13 03:00 PM' },
    ],
  },
];

// ---------------------------------------------------------------------------
// STATE STORAGE HELPERS
// ---------------------------------------------------------------------------
function loadFromStorage<T>(key: string, defaultData: T[]): T[] {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn(`Could not load ${key} from localStorage`, e);
  }
  return defaultData;
}

function saveToStorage<T>(key: string, data: T[]) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn(`Could not save ${key} to localStorage`, e);
  }
}

// In-memory persistent caches
let candidatesData = loadFromStorage<CandidateUser>('letgetin_candidates', INITIAL_CANDIDATES);
let startupsData = loadFromStorage<StartupUser>('letgetin_startups', INITIAL_STARTUPS);
let companiesData = loadFromStorage<CompanyUser>('letgetin_companies', INITIAL_COMPANIES);
let institutionsData = loadFromStorage<InstitutionUser>('letgetin_institutions', INITIAL_INSTITUTIONS);

// ---------------------------------------------------------------------------
// SERVICE API METHODS
// ---------------------------------------------------------------------------
export const platformUsersService = {
  // CANDIDATES
  async getCandidates(): Promise<CandidateUser[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/platform/candidates`, {
        headers: getPlatformHeaders(),
      });
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json.data) && json.data.length > 0) {
          candidatesData = json.data;
          saveToStorage('letgetin_candidates', candidatesData);
          return json.data;
        }
      }
    } catch (e) {
      console.warn('API error fetching candidates, using cache:', e);
    }
    return [...candidatesData];
  },
  async getCandidateStats(): Promise<UserSummaryStats> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/platform/candidates/stats`, {
        headers: getPlatformHeaders(),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.data) return json.data;
      }
    } catch (e) {
      console.warn('API error fetching candidate stats:', e);
    }
    return {
      total: candidatesData.length,
      active: candidatesData.filter((c) => c.accountStatus === 'Active').length,
      pending: candidatesData.filter((c) => c.verificationStatus === 'Pending').length,
      suspended: candidatesData.filter((c) => c.accountStatus === 'Suspended').length,
    };
  },
  async saveCandidate(candidate: Partial<CandidateUser>): Promise<CandidateUser> {
    if (candidate.id) {
      try {
        await fetch(`${API_BASE_URL}/api/platform/candidates/${candidate.id}`, {
          method: 'PUT',
          headers: getPlatformHeaders(),
          body: JSON.stringify(candidate),
        });
      } catch (e) {
        console.warn('API error saving candidate:', e);
      }
      const idx = candidatesData.findIndex((c) => c.id === candidate.id);
      if (idx !== -1) {
        candidatesData[idx] = { ...candidatesData[idx], ...candidate } as CandidateUser;
        saveToStorage('letgetin_candidates', candidatesData);
        return candidatesData[idx];
      }
    }
    const newCandidate: CandidateUser = {
      id: `CND-${Math.floor(1000 + Math.random() * 9000)}`,
      name: candidate.name || 'New Candidate',
      avatar: (candidate.name || 'NC').substring(0, 2).toUpperCase(),
      email: candidate.email || 'candidate@example.com',
      phone: candidate.phone || '+91 90000 00000',
      location: candidate.location || 'Bengaluru, Karnataka',
      education: candidate.education || 'B.Tech Graduate',
      college: candidate.college || 'Engineering Institute',
      experience: candidate.experience || 'Fresher',
      experienceYears: candidate.experienceYears || 0,
      skills: candidate.skills || ['React', 'TypeScript'],
      profileCompletion: 80,
      accountStatus: candidate.accountStatus || 'Active',
      verificationStatus: candidate.verificationStatus || 'Pending',
      registrationDate: new Date().toISOString().split('T')[0],
      bio: candidate.bio || '',
      recentActivity: [
        { id: `act-${Date.now()}`, action: 'Candidate account created by Admin', timestamp: new Date().toLocaleString(), user: 'Admin' },
      ],
    };
    candidatesData = [newCandidate, ...candidatesData];
    saveToStorage('letgetin_candidates', candidatesData);
    return newCandidate;
  },
  async updateCandidateStatus(id: string, accountStatus?: AccountStatus, verificationStatus?: VerificationStatus): Promise<CandidateUser | null> {
    try {
      await fetch(`${API_BASE_URL}/api/platform/candidates/${id}/status`, {
        method: 'PATCH',
        headers: getPlatformHeaders(),
        body: JSON.stringify({ accountStatus, verificationStatus }),
      });
    } catch (e) {
      console.warn('API error updating candidate status:', e);
    }
    const idx = candidatesData.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    const current = candidatesData[idx];
    const updated: CandidateUser = {
      ...current,
      ...(accountStatus ? { accountStatus } : {}),
      ...(verificationStatus ? { verificationStatus } : {}),
      recentActivity: [
        {
          id: `act-${Date.now()}`,
          action: `Status updated: Account = ${accountStatus || current.accountStatus}, Verification = ${verificationStatus || current.verificationStatus}`,
          timestamp: new Date().toLocaleString(),
          user: 'Admin',
        },
        ...current.recentActivity,
      ],
    };
    candidatesData[idx] = updated;
    saveToStorage('letgetin_candidates', candidatesData);
    return updated;
  },
  async deleteCandidate(id: string): Promise<boolean> {
    try {
      await fetch(`${API_BASE_URL}/api/platform/candidates/${id}`, {
        method: 'DELETE',
        headers: getPlatformHeaders(),
      });
    } catch (e) {
      console.warn('API error deleting candidate:', e);
    }
    candidatesData = candidatesData.filter((c) => c.id !== id);
    saveToStorage('letgetin_candidates', candidatesData);
    return true;
  },

  // STARTUPS
  async getStartups(): Promise<StartupUser[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/platform/startups`, {
        headers: getPlatformHeaders(),
      });
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json.data) && json.data.length > 0) {
          startupsData = json.data;
          saveToStorage('letgetin_startups', startupsData);
          return json.data;
        }
      }
    } catch (e) {
      console.warn('API error fetching startups, using cache:', e);
    }
    return [...startupsData];
  },
  async getStartupStats(): Promise<UserSummaryStats> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/platform/startups/stats`, {
        headers: getPlatformHeaders(),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.data) return json.data;
      }
    } catch (e) {
      console.warn('API error fetching startup stats:', e);
    }
    return {
      total: startupsData.length,
      active: startupsData.filter((s) => s.accountStatus === 'Active').length,
      pending: startupsData.filter((s) => s.verificationStatus === 'Pending').length,
      suspended: startupsData.filter((s) => s.accountStatus === 'Suspended').length,
    };
  },
  async saveStartup(startup: Partial<StartupUser>): Promise<StartupUser> {
    if (startup.id) {
      try {
        await fetch(`${API_BASE_URL}/api/platform/startups/${startup.id}`, {
          method: 'PUT',
          headers: getPlatformHeaders(),
          body: JSON.stringify(startup),
        });
      } catch (e) {
        console.warn('API error saving startup:', e);
      }
      const idx = startupsData.findIndex((s) => s.id === startup.id);
      if (idx !== -1) {
        startupsData[idx] = { ...startupsData[idx], ...startup } as StartupUser;
        saveToStorage('letgetin_startups', startupsData);
        return startupsData[idx];
      }
    }
    const newStartup: StartupUser = {
      id: `STP-${Math.floor(2000 + Math.random() * 8000)}`,
      name: startup.name || 'New Startup',
      logo: startup.logo || '🚀',
      founder: startup.founder || 'Founder Name',
      email: startup.email || 'founder@startup.io',
      phone: startup.phone || '+91 98888 00000',
      industry: startup.industry || 'HealthTech',
      location: startup.location || 'Bengaluru, Karnataka',
      stage: startup.stage || 'Seed',
      website: startup.website || 'https://startup.io',
      description: startup.description || 'Innovative technology startup.',
      teamSize: startup.teamSize || '10 Members',
      fundingRaised: startup.fundingRaised || '$500K',
      documents: startup.documents || [],
      accountStatus: startup.accountStatus || 'Active',
      verificationStatus: startup.verificationStatus || 'Pending',
      registrationDate: new Date().toISOString().split('T')[0],
      recentActivity: [
        { id: `act-${Date.now()}`, action: 'Startup registered on LetGetIn', timestamp: new Date().toLocaleString(), user: 'Admin' },
      ],
    };
    startupsData = [newStartup, ...startupsData];
    saveToStorage('letgetin_startups', startupsData);
    return newStartup;
  },
  async updateStartupStatus(id: string, accountStatus?: AccountStatus, verificationStatus?: VerificationStatus): Promise<StartupUser | null> {
    try {
      await fetch(`${API_BASE_URL}/api/platform/startups/${id}/status`, {
        method: 'PATCH',
        headers: getPlatformHeaders(),
        body: JSON.stringify({ accountStatus, verificationStatus }),
      });
    } catch (e) {
      console.warn('API error updating startup status:', e);
    }
    const idx = startupsData.findIndex((s) => s.id === id);
    if (idx === -1) return null;
    const current = startupsData[idx];
    const updated: StartupUser = {
      ...current,
      ...(accountStatus ? { accountStatus } : {}),
      ...(verificationStatus ? { verificationStatus } : {}),
      recentActivity: [
        {
          id: `act-${Date.now()}`,
          action: `Status updated: Account = ${accountStatus || current.accountStatus}, Verification = ${verificationStatus || current.verificationStatus}`,
          timestamp: new Date().toLocaleString(),
          user: 'Admin',
        },
        ...current.recentActivity,
      ],
    };
    startupsData[idx] = updated;
    saveToStorage('letgetin_startups', startupsData);
    return updated;
  },
  async deleteStartup(id: string): Promise<boolean> {
    try {
      await fetch(`${API_BASE_URL}/api/platform/startups/${id}`, {
        method: 'DELETE',
        headers: getPlatformHeaders(),
      });
    } catch (e) {
      console.warn('API error deleting startup:', e);
    }
    startupsData = startupsData.filter((s) => s.id !== id);
    saveToStorage('letgetin_startups', startupsData);
    return true;
  },

  // COMPANIES
  async getCompanies(): Promise<CompanyUser[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/platform/companies`, {
        headers: getPlatformHeaders(),
      });
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json.data) && json.data.length > 0) {
          companiesData = json.data;
          saveToStorage('letgetin_companies', companiesData);
          return json.data;
        }
      }
    } catch (e) {
      console.warn('API error fetching companies, using cache:', e);
    }
    return [...companiesData];
  },
  async getCompanyStats(): Promise<UserSummaryStats> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/platform/companies/stats`, {
        headers: getPlatformHeaders(),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.data) return json.data;
      }
    } catch (e) {
      console.warn('API error fetching company stats:', e);
    }
    return {
      total: companiesData.length,
      active: companiesData.filter((c) => c.accountStatus === 'Active').length,
      pending: companiesData.filter((c) => c.verificationStatus === 'Pending').length,
      suspended: companiesData.filter((c) => c.accountStatus === 'Suspended').length,
    };
  },
  async saveCompany(company: Partial<CompanyUser>): Promise<CompanyUser> {
    if (company.id) {
      try {
        await fetch(`${API_BASE_URL}/api/platform/companies/${company.id}`, {
          method: 'PUT',
          headers: getPlatformHeaders(),
          body: JSON.stringify(company),
        });
      } catch (e) {
        console.warn('API error saving company:', e);
      }
      const idx = companiesData.findIndex((c) => c.id === company.id);
      if (idx !== -1) {
        companiesData[idx] = { ...companiesData[idx], ...company } as CompanyUser;
        saveToStorage('letgetin_companies', companiesData);
        return companiesData[idx];
      }
    }
    const newCompany: CompanyUser = {
      id: `CMP-${Math.floor(3000 + Math.random() * 7000)}`,
      name: company.name || 'New Company Ltd',
      logo: company.logo || '🏢',
      contactPerson: company.contactPerson || 'HR Manager',
      email: company.email || 'hr@company.com',
      phone: company.phone || '+91 80 4000 0000',
      industry: company.industry || 'Healthcare & Tech',
      location: company.location || 'Bengaluru, Karnataka',
      companySize: company.companySize || '50-200',
      website: company.website || 'https://company.com',
      description: company.description || 'Enterprise healthcare and technical hiring partner.',
      activeHiringPositions: company.activeHiringPositions || 5,
      documents: company.documents || [],
      accountStatus: company.accountStatus || 'Active',
      verificationStatus: company.verificationStatus || 'Pending',
      registrationDate: new Date().toISOString().split('T')[0],
      recentActivity: [
        { id: `act-${Date.now()}`, action: 'Company account created by Admin', timestamp: new Date().toLocaleString(), user: 'Admin' },
      ],
    };
    companiesData = [newCompany, ...companiesData];
    saveToStorage('letgetin_companies', companiesData);
    return newCompany;
  },
  async updateCompanyStatus(id: string, accountStatus?: AccountStatus, verificationStatus?: VerificationStatus): Promise<CompanyUser | null> {
    try {
      await fetch(`${API_BASE_URL}/api/platform/companies/${id}/status`, {
        method: 'PATCH',
        headers: getPlatformHeaders(),
        body: JSON.stringify({ accountStatus, verificationStatus }),
      });
    } catch (e) {
      console.warn('API error updating company status:', e);
    }
    const idx = companiesData.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    const current = companiesData[idx];
    const updated: CompanyUser = {
      ...current,
      ...(accountStatus ? { accountStatus } : {}),
      ...(verificationStatus ? { verificationStatus } : {}),
      recentActivity: [
        {
          id: `act-${Date.now()}`,
          action: `Status updated: Account = ${accountStatus || current.accountStatus}, Verification = ${verificationStatus || current.verificationStatus}`,
          timestamp: new Date().toLocaleString(),
          user: 'Admin',
        },
        ...current.recentActivity,
      ],
    };
    companiesData[idx] = updated;
    saveToStorage('letgetin_companies', companiesData);
    return updated;
  },
  async deleteCompany(id: string): Promise<boolean> {
    try {
      await fetch(`${API_BASE_URL}/api/platform/companies/${id}`, {
        method: 'DELETE',
        headers: getPlatformHeaders(),
      });
    } catch (e) {
      console.warn('API error deleting company:', e);
    }
    companiesData = companiesData.filter((c) => c.id !== id);
    saveToStorage('letgetin_companies', companiesData);
    return true;
  },

  // INSTITUTIONS
  async getInstitutions(): Promise<InstitutionUser[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/platform/institutions`, {
        headers: getPlatformHeaders(),
      });
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json.data) && json.data.length > 0) {
          institutionsData = json.data;
          saveToStorage('letgetin_institutions', institutionsData);
          return json.data;
        }
      }
    } catch (e) {
      console.warn('API error fetching institutions, using cache:', e);
    }
    return [...institutionsData];
  },
  async getInstitutionStats(): Promise<UserSummaryStats> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/platform/institutions/stats`, {
        headers: getPlatformHeaders(),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.data) return json.data;
      }
    } catch (e) {
      console.warn('API error fetching institution stats:', e);
    }
    return {
      total: institutionsData.length,
      active: institutionsData.filter((i) => i.accountStatus === 'Active').length,
      pending: institutionsData.filter((i) => i.verificationStatus === 'Pending').length,
      suspended: institutionsData.filter((i) => i.accountStatus === 'Suspended').length,
    };
  },
  async saveInstitution(inst: Partial<InstitutionUser>): Promise<InstitutionUser> {
    if (inst.id) {
      try {
        await fetch(`${API_BASE_URL}/api/platform/institutions/${inst.id}`, {
          method: 'PUT',
          headers: getPlatformHeaders(),
          body: JSON.stringify(inst),
        });
      } catch (e) {
        console.warn('API error saving institution:', e);
      }
      const idx = institutionsData.findIndex((i) => i.id === inst.id);
      if (idx !== -1) {
        institutionsData[idx] = { ...institutionsData[idx], ...inst } as InstitutionUser;
        saveToStorage('letgetin_institutions', institutionsData);
        return institutionsData[idx];
      }
    }
    const newInst: InstitutionUser = {
      id: `INS-${Math.floor(4000 + Math.random() * 6000)}`,
      name: inst.name || 'New University',
      logo: inst.logo || '🏛️',
      contactPerson: inst.contactPerson || 'Placement Director',
      email: inst.email || 'placement@university.edu',
      phone: inst.phone || '+91 11 2000 0000',
      institutionType: inst.institutionType || 'Central University',
      location: inst.location || 'New Delhi, Delhi',
      website: inst.website || 'https://university.edu',
      description: inst.description || 'Premier educational and research institution.',
      accreditation: inst.accreditation || 'NAAC A++ / NIRF Top 20',
      totalStudents: inst.totalStudents || '5,000+ Students',
      documents: inst.documents || [],
      accountStatus: inst.accountStatus || 'Active',
      verificationStatus: inst.verificationStatus || 'Pending',
      registrationDate: new Date().toISOString().split('T')[0],
      recentActivity: [
        { id: `act-${Date.now()}`, action: 'Institution registered on LetGetIn', timestamp: new Date().toLocaleString(), user: 'Admin' },
      ],
    };
    institutionsData = [newInst, ...institutionsData];
    saveToStorage('letgetin_institutions', institutionsData);
    return newInst;
  },
  async updateInstitutionStatus(id: string, accountStatus?: AccountStatus, verificationStatus?: VerificationStatus): Promise<InstitutionUser | null> {
    try {
      await fetch(`${API_BASE_URL}/api/platform/institutions/${id}/status`, {
        method: 'PATCH',
        headers: getPlatformHeaders(),
        body: JSON.stringify({ accountStatus, verificationStatus }),
      });
    } catch (e) {
      console.warn('API error updating institution status:', e);
    }
    const idx = institutionsData.findIndex((i) => i.id === id);
    if (idx === -1) return null;
    const current = institutionsData[idx];
    const updated: InstitutionUser = {
      ...current,
      ...(accountStatus ? { accountStatus } : {}),
      ...(verificationStatus ? { verificationStatus } : {}),
      recentActivity: [
        {
          id: `act-${Date.now()}`,
          action: `Status updated: Account = ${accountStatus || current.accountStatus}, Verification = ${verificationStatus || current.verificationStatus}`,
          timestamp: new Date().toLocaleString(),
          user: 'Admin',
        },
        ...current.recentActivity,
      ],
    };
    institutionsData[idx] = updated;
    saveToStorage('letgetin_institutions', institutionsData);
    return updated;
  },
  async deleteInstitution(id: string): Promise<boolean> {
    try {
      await fetch(`${API_BASE_URL}/api/platform/institutions/${id}`, {
        method: 'DELETE',
        headers: getPlatformHeaders(),
      });
    } catch (e) {
      console.warn('API error deleting institution:', e);
    }
    institutionsData = institutionsData.filter((i) => i.id !== id);
    saveToStorage('letgetin_institutions', institutionsData);
    return true;
  },
};
