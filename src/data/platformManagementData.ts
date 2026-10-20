export interface OpportunityRecord {
  id: string;
  title: string;
  company: string;
  verified: boolean;
  category: string;
  tags: string[];
  location: string;
  salary: string;
  employmentType: string;
  appliedCount: string;
  matchedCount: string;
  description: string;
  featured: boolean;
  published: boolean;
  status: 'active' | 'draft' | 'closed' | 'archived';
  postedTime: string;
  postedDate: string;
  requirements: string[];
  department?: string;
  contactEmail?: string;
}

export interface InterviewRecord {
  id: string;
  candidateName: string;
  candidateEmail: string;
  candidateAvatar?: string;
  targetRole: string;
  company: string;
  interviewer: string;
  interviewerRole: string;
  scheduledDate: string;
  scheduledTime: string;
  roundType: 'Technical Screening' | 'System Architecture' | 'Coding Sandbox' | 'Behavioral & Leadership' | 'Executive Fit';
  format: 'Video Conference' | 'Live Sandbox' | 'On-site Office';
  status: 'Scheduled' | 'Completed' | 'In Progress' | 'Cancelled' | 'Needs Reschedule';
  score?: number; // Out of 5 or 100
  notes?: string;
  meetingLink?: string;
  feedbackSummary?: string;
}

export interface CandidateResumeRecord {
  id: string;
  candidateName: string;
  email: string;
  phone: string;
  location: string;
  headline: string;
  yearsOfExperience: number;
  primaryDiscipline: 'Software Engineering' | 'AI & Machine Learning' | 'Product & Design' | 'Fintech & Quant' | 'Operations';
  skills: string[];
  status: 'Verified' | 'Pending Review' | 'Needs Update' | 'Flagged';
  lastUpdated: string;
  summary: string;
  education: Array<{
    degree: string;
    institution: string;
    year: string;
  }>;
  experience: Array<{
    role: string;
    company: string;
    duration: string;
    highlights: string[];
  }>;
  links?: {
    github?: string;
    linkedin?: string;
    portfolio?: string;
  };
}

export const INITIAL_OPPORTUNITY_RECORDS: OpportunityRecord[] = [
  {
    id: 'opp-1',
    title: 'Research Engineer – Multimodal AI',
    company: 'OpenAI',
    verified: true,
    category: 'AI Research',
    tags: ['AI Research', 'Machine Learning', 'Python'],
    location: 'San Francisco, CA (Remote)',
    salary: '$180k - $260k',
    employmentType: 'Full-time',
    appliedCount: '1.2k applied',
    matchedCount: '1.2k applied',
    description: 'Work on next-generation multimodal models and contribute to real-world AI systems.',
    featured: true,
    published: true,
    status: 'active',
    postedTime: '2 days ago',
    postedDate: '2026-09-16',
    requirements: [
      'Strong research background in deep learning, multimodal vision-language models, or diffusion models.',
      'Proficiency with distributed PyTorch training frameworks across large GPU clusters.',
      'Demonstrated track record of novel contributions or high-impact open source implementations.'
    ],
    department: 'Frontier AI Labs',
    contactEmail: 'careers@openai.com'
  },
  {
    id: 'opp-2',
    title: 'Senior Product Designer',
    company: 'Google',
    verified: true,
    category: 'Design',
    tags: ['Design', 'Product', 'UX/UI'],
    location: 'Mountain View, CA',
    salary: '$150k - $220k',
    employmentType: 'Full-time',
    appliedCount: '856 applied',
    matchedCount: '856 applied',
    description: 'Design delightful experiences for millions of users across Google products.',
    featured: true,
    published: true,
    status: 'active',
    postedTime: '1 day ago',
    postedDate: '2026-09-17',
    requirements: [
      '5+ years leading end-to-end product design for high-scale consumer or enterprise web platforms.',
      'Deep mastery of Figma design systems, motion choreography, and accessible UI standards.',
      'Proven ability to turn complex AI workflow constraints into intuitive user journeys.'
    ],
    department: 'Material Design Core',
    contactEmail: 'design-hiring@google.com'
  },
  {
    id: 'opp-3',
    title: 'Senior Backend Engineer',
    company: 'Stripe',
    verified: true,
    category: 'Engineering',
    tags: ['Engineering', 'Node.js', 'Distributed Systems'],
    location: 'Dublin, Ireland (Remote)',
    salary: '$160k - $240k',
    employmentType: 'Full-time',
    appliedCount: '642 applied',
    matchedCount: '642 applied',
    description: 'Build scalable financial infrastructure for the internet economy.',
    featured: true,
    published: true,
    status: 'active',
    postedTime: '3 days ago',
    postedDate: '2026-09-15',
    requirements: [
      'Expertise in high-throughput distributed architectures, transaction consistency, and idempotency.',
      'Fluency in Node.js, Go, or Ruby with robust observability and automated testing mindset.',
      'Track record designing mission-critical APIs with zero downtime guarantees.'
    ],
    department: 'Payments Core Infrastructure',
    contactEmail: 'talent@stripe.com'
  },
  {
    id: 'opp-4',
    title: 'Frontend AI Evaluation Specialist',
    company: 'Anthropic',
    verified: true,
    category: 'AI Research',
    tags: ['AI Research', 'Evaluation', 'React'],
    location: 'San Francisco, CA',
    salary: '$90 - $130/hr',
    employmentType: 'Contract',
    appliedCount: '842 matched',
    matchedCount: '842 matched',
    description: 'Evaluate reasoning alignment and construct interactive benchmark harness environments.',
    featured: true,
    published: true,
    status: 'active',
    postedTime: '4 hours ago',
    postedDate: '2026-09-18',
    requirements: [
      'Experience building rich interactive eval harnesses in React and TypeScript.',
      'Familiarity with RLHF datasets and automated prompt perturbation testing.',
      'Deep attention to user safety and alignment accuracy.'
    ],
    department: 'Alignment & Evaluation Team',
    contactEmail: 'evals@anthropic.com'
  },
  {
    id: 'opp-5',
    title: 'Senior Distributed Systems Architect',
    company: 'AWS',
    verified: true,
    category: 'Engineering',
    tags: ['Engineering', 'Cloud', 'Architecture'],
    location: 'Seattle, WA',
    salary: '$180k - $240k',
    employmentType: 'Full-time',
    appliedCount: '154 hired',
    matchedCount: '154 hired',
    description: 'Design planet-scale compute primitives and cloud isolation layers for next-gen serverless tiers.',
    featured: true,
    published: true,
    status: 'active',
    postedTime: '6 hours ago',
    postedDate: '2026-09-18',
    requirements: [
      'Deep systems design experience in Rust, C++, or Go.',
      'Track record operating hyper-scale multi-tenant compute clusters.',
      'Zero-downtime distributed consensus mastery.'
    ],
    department: 'EC2 Core Foundation',
    contactEmail: 'aws-talent@amazon.com'
  },
  {
    id: 'opp-6',
    title: 'Quantitative Risk & KYC Modeling Lead',
    company: 'Revolut',
    verified: true,
    category: 'Fintech',
    tags: ['Fintech', 'Risk', 'KYC', 'Python'],
    location: 'London, UK (Hybrid)',
    salary: '$110/hr',
    employmentType: 'Contract',
    appliedCount: '312 hired',
    matchedCount: '312 hired',
    description: 'Implement real-time fraud scoring algorithms and automated AML compliance pipelines.',
    featured: true,
    published: true,
    status: 'active',
    postedTime: '8 hours ago',
    postedDate: '2026-09-18',
    requirements: [
      'Advanced degree in quantitative finance, mathematics, or statistics.',
      'Hands-on experience deploying ML fraud models in high-frequency trading or neobanks.',
      'Robust understanding of international regulatory frameworks.'
    ],
    department: 'Risk Intelligence',
    contactEmail: 'quant-recruiting@revolut.com'
  },
  {
    id: 'opp-7',
    title: 'Product & Design Systems Engineer',
    company: 'Figma',
    verified: true,
    category: 'Design',
    tags: ['Design', 'Frontend', 'Systems'],
    location: 'New York, NY',
    salary: '$150k - $195k',
    employmentType: 'Full-time',
    appliedCount: '489 hired',
    matchedCount: '489 hired',
    description: 'Bridge creative design tokens and component architecture across collaborative canvas tools.',
    featured: true,
    published: true,
    status: 'active',
    postedTime: '10 hours ago',
    postedDate: '2026-09-18',
    requirements: [
      'Deep expertise in WebGL/Canvas rendering, WebAssembly, and React.',
      'Passion for developer experience, tokens, and multi-brand theming.',
      'Strong eye for visual micro-interactions and performance.'
    ],
    department: 'Canvas Rendering Group',
    contactEmail: 'careers@figma.com'
  },
  {
    id: 'opp-8',
    title: 'AI Platform Engineer',
    company: 'Microsoft',
    verified: true,
    category: 'Engineering',
    tags: ['Engineering', 'AI/ML', 'Azure'],
    location: 'Redmond, WA (Remote)',
    salary: '$160k - $230k',
    employmentType: 'Full-time',
    appliedCount: '421 hired',
    matchedCount: '421 hired',
    description: 'Build enterprise model orchestration nodes and low-latency inference pipelines on Azure.',
    featured: true,
    published: true,
    status: 'active',
    postedTime: '12 hours ago',
    postedDate: '2026-09-17',
    requirements: [
      'Experience with ONNX runtime, vLLM, TensorRT-LLM optimization.',
      'Kubernetes orchestration across multi-region clusters.',
      'High security standards for enterprise AI workloads.'
    ],
    department: 'Azure Cognitive Services',
    contactEmail: 'azure-ai-jobs@microsoft.com'
  }
];

export const INITIAL_INTERVIEW_RECORDS: InterviewRecord[] = [
  {
    id: 'int-101',
    candidateName: 'Dr. Sarah Lin',
    candidateEmail: 'sarah.lin@stanford.alumni.edu',
    targetRole: 'Research Engineer – Multimodal AI',
    company: 'OpenAI',
    interviewer: 'Alexandre Moreau (Principal AI Scientist)',
    interviewerRole: 'Staff Research Lead',
    scheduledDate: '2026-09-20',
    scheduledTime: '14:00 - 15:30 PST',
    roundType: 'System Architecture',
    format: 'Video Conference',
    status: 'Scheduled',
    notes: 'Candidate has published 4 CVPR papers in vision-language alignment. Focus on GPU cluster optimization.',
    meetingLink: 'https://meet.letgetin.com/room/openai-lin-902'
  },
  {
    id: 'int-102',
    candidateName: 'Rohan Sharma',
    candidateEmail: 'rohan.sharma.dev@gmail.com',
    targetRole: 'Senior Backend Engineer',
    company: 'Stripe',
    interviewer: 'Elena Rostova (Staff Infrastructure Eng)',
    interviewerRole: 'Core Payments Lead',
    scheduledDate: '2026-09-19',
    scheduledTime: '10:00 - 11:15 EST',
    roundType: 'Coding Sandbox',
    format: 'Live Sandbox',
    status: 'Scheduled',
    notes: 'Live distributed lock idempotency challenge in Go/Node.js.',
    meetingLink: 'https://sandbox.letgetin.com/session/stripe-sharma-411'
  },
  {
    id: 'int-103',
    candidateName: 'Maya Patel',
    candidateEmail: 'maya.design@uxstudio.io',
    targetRole: 'Senior Product Designer',
    company: 'Google',
    interviewer: 'Marcus Vance (Design Director)',
    interviewerRole: 'Design Director',
    scheduledDate: '2026-09-18',
    scheduledTime: '16:00 - 17:00 PST',
    roundType: 'Behavioral & Leadership',
    format: 'Video Conference',
    status: 'Completed',
    score: 94,
    notes: 'Exceptional presentation of AI canvas mental model and tokens architecture.',
    feedbackSummary: 'Strong hire recommendation. Cultural champion with proven cross-functional influence.'
  },
  {
    id: 'int-104',
    candidateName: 'Kevin Zhao',
    candidateEmail: 'kzhao.fin@quantnet.org',
    targetRole: 'Quantitative Risk & KYC Modeling Lead',
    company: 'Revolut',
    interviewer: 'Sophie Dubois (Head of Risk Engineering)',
    interviewerRole: 'VP Risk Intelligence',
    scheduledDate: '2026-09-17',
    scheduledTime: '11:00 - 12:30 BST',
    roundType: 'Technical Screening',
    format: 'Video Conference',
    status: 'Completed',
    score: 88,
    notes: 'Strong knowledge of extreme value theory and AML transaction graph algorithms.',
    feedbackSummary: 'Approved for final round with Chief Risk Officer.'
  },
  {
    id: 'int-105',
    candidateName: 'Ananya Verma',
    candidateEmail: 'ananya.v@caltech.edu',
    targetRole: 'Frontend AI Evaluation Specialist',
    company: 'Anthropic',
    interviewer: 'David Chen (Evaluation Lead)',
    interviewerRole: 'Staff Eval Architect',
    scheduledDate: '2026-09-21',
    scheduledTime: '13:00 - 14:15 PST',
    roundType: 'Coding Sandbox',
    format: 'Live Sandbox',
    status: 'Scheduled',
    notes: 'Will construct a live dynamic perturbation widget in React 19.',
    meetingLink: 'https://sandbox.letgetin.com/session/anthropic-verma-782'
  },
  {
    id: 'int-106',
    candidateName: 'Vikram Menon',
    candidateEmail: 'vikram.menon@kerala.ac.in',
    targetRole: 'Junior React & Node.js Developer',
    company: 'Calicut Tech Labs',
    interviewer: 'Kiran Raj (Engineering Manager)',
    interviewerRole: 'EM Core Systems',
    scheduledDate: '2026-09-18',
    scheduledTime: '15:30 - 16:30 IST',
    roundType: 'Technical Screening',
    format: 'Video Conference',
    status: 'In Progress',
    notes: 'Live fullstack coding & state management live test.',
    meetingLink: 'https://meet.letgetin.com/room/calicut-menon-118'
  },
  {
    id: 'int-107',
    candidateName: 'Lucas Dubois',
    candidateEmail: 'lucas.d@polytechnique.fr',
    targetRole: 'Security & Blockchain Engineer',
    company: 'Coinbase',
    interviewer: 'Tanya Peterson (Security VP)',
    interviewerRole: 'Director Security Ops',
    scheduledDate: '2026-09-16',
    scheduledTime: '09:00 - 10:30 EST',
    roundType: 'Executive Fit',
    format: 'Video Conference',
    status: 'Completed',
    score: 96,
    notes: 'Comprehensive audit walk-through of MPC threshold signature schemes.',
    feedbackSummary: 'Offer extended. Background check and KYC verification initiated.'
  }
];

export const INITIAL_RESUME_RECORDS: CandidateResumeRecord[] = [
  {
    id: 'res-201',
    candidateName: 'Dr. Sarah Lin',
    email: 'sarah.lin@stanford.alumni.edu',
    phone: '+1 (415) 890-2341',
    location: 'San Francisco, CA',
    headline: 'Senior AI Research Scientist · Multimodal & Diffusion Models',
    yearsOfExperience: 7,
    primaryDiscipline: 'AI & Machine Learning',
    skills: ['PyTorch', 'Distributed Training', 'CUDA', 'Vision Transformers', 'Diffusion Models', 'Ray', 'vLLM'],
    status: 'Verified',
    lastUpdated: '2026-09-17',
    summary: 'Ph.D. in Computer Science from Stanford University. Author of 6 top-tier papers in CVPR, NeurIPS, and ICML. Specialized in hyper-scale multimodal reasoning, latent diffusion optimization, and reinforcement learning with verifiable benchmarks.',
    education: [
      { degree: 'Ph.D. Computer Science (AI/ML)', institution: 'Stanford University', year: '2019 - 2023' },
      { degree: 'B.S. Electrical Engineering & CS', institution: 'UC Berkeley', year: '2015 - 2019' }
    ],
    experience: [
      {
        role: 'Senior Research Fellow',
        company: 'Berkeley AI Research (BAIR)',
        duration: '2023 - Present',
        highlights: [
          'Led research on 12B parameter multimodal diffusion architectures, cutting inference compute by 42%.',
          'Managed 256 H100 GPU cluster allocations with zero downtime pipeline orchestration.'
        ]
      },
      {
        role: 'AI Research Intern',
        company: 'Meta FAIR',
        duration: 'Summer 2022',
        highlights: [
          'Developed fast continuous latent decoders for real-time video generation models.'
        ]
      }
    ],
    links: {
      github: 'https://github.com/sarah-lin-ai',
      linkedin: 'https://linkedin.com/in/drsarahlin',
      portfolio: 'https://sarahlin.research.io'
    }
  },
  {
    id: 'res-202',
    candidateName: 'Rohan Sharma',
    email: 'rohan.sharma.dev@gmail.com',
    phone: '+1 (206) 554-9912',
    location: 'Seattle, WA',
    headline: 'Staff Backend & Distributed Systems Architect',
    yearsOfExperience: 9,
    primaryDiscipline: 'Software Engineering',
    skills: ['Go', 'Rust', 'Kafka', 'Kubernetes', 'PostgreSQL', 'Distributed Transactions', 'gRPC', 'AWS'],
    status: 'Verified',
    lastUpdated: '2026-09-18',
    summary: 'Distinguished distributed systems engineer with deep expertise in 99.999% availability financial ledgers, transactional idempotency, and asynchronous high-throughput message streaming.',
    education: [
      { degree: 'M.S. Computer Engineering', institution: 'University of Washington', year: '2015 - 2017' },
      { degree: 'B.Tech Computer Science', institution: 'IIT Delhi', year: '2011 - 2015' }
    ],
    experience: [
      {
        role: 'Lead Systems Architect',
        company: 'Twilio',
        duration: '2021 - Present',
        highlights: [
          'Re-architected core telephony dispatch router in Rust, processing 4.2M events/sec.',
          'Reduced p99 routing latency from 85ms to 6ms across 8 global edge regions.'
        ]
      },
      {
        role: 'Senior Backend Engineer',
        company: 'Amazon Web Services',
        duration: '2017 - 2021',
        highlights: [
          'Built internal distributed locking consensus manager for DynamoDB replication.'
        ]
      }
    ],
    links: {
      github: 'https://github.com/rohansharma-sys',
      linkedin: 'https://linkedin.com/in/rohan-sharma-backend'
    }
  },
  {
    id: 'res-203',
    candidateName: 'Maya Patel',
    email: 'maya.design@uxstudio.io',
    phone: '+1 (312) 441-8890',
    location: 'Chicago, IL',
    headline: 'Principal Product Designer & Design Systems Director',
    yearsOfExperience: 8,
    primaryDiscipline: 'Product & Design',
    skills: ['Figma', 'Design Systems', 'Design Tokens', 'Interaction Design', 'User Research', 'Prototyping', 'Accessibility (WCAG AAA)'],
    status: 'Verified',
    lastUpdated: '2026-09-15',
    summary: 'Award-winning product design leader crafting enterprise workflows and consumer delight. Proven track record unifying multi-brand tokens, mobile-first apps, and generative canvas user paradigms.',
    education: [
      { degree: 'B.Des Interaction & Industrial Design', institution: 'Rhode Island School of Design (RISD)', year: '2014 - 2018' }
    ],
    experience: [
      {
        role: 'Staff Product Designer',
        company: 'Shopify',
        duration: '2021 - Present',
        highlights: [
          'Spearheaded Polaris web token overhaul adopted by 1.8M global store merchants.',
          'Designed high-converting headless checkout builder with 18% lift in customer completion.'
        ]
      }
    ],
    links: {
      portfolio: 'https://mayapatel.design',
      linkedin: 'https://linkedin.com/in/mayapateldesign'
    }
  },
  {
    id: 'res-204',
    candidateName: 'Kevin Zhao',
    email: 'kzhao.fin@quantnet.org',
    phone: '+44 20 7946 0912',
    location: 'London, UK',
    headline: 'Quantitative Risk & Machine Learning Strategist',
    yearsOfExperience: 6,
    primaryDiscipline: 'Fintech & Quant',
    skills: ['Python', 'C++', 'Time Series Analysis', 'Graph Neural Networks', 'PyTorch', 'Risk Modeling', 'AML/KYC Algorithms'],
    status: 'Pending Review',
    lastUpdated: '2026-09-18',
    summary: 'Quantitative researcher combining statistical risk modeling and deep graph embeddings to combat modern financial crime at high frequency and extreme reliability.',
    education: [
      { degree: 'M.Sc. Mathematics & Finance', institution: 'Imperial College London', year: '2019 - 2020' },
      { degree: 'B.Sc. Pure Mathematics', institution: 'University of Cambridge', year: '2016 - 2019' }
    ],
    experience: [
      {
        role: 'Quant Risk Associate',
        company: 'Barclays Investment Bank',
        duration: '2020 - Present',
        highlights: [
          'Engineered real-time anomaly detection for £40B daily foreign exchange transactions.'
        ]
      }
    ],
    links: {
      linkedin: 'https://linkedin.com/in/kevin-zhao-quant'
    }
  },
  {
    id: 'res-205',
    candidateName: 'Vikram Menon',
    email: 'vikram.menon@kerala.ac.in',
    phone: '+91 98470 12345',
    location: 'Calicut, Kerala, India',
    headline: 'Full Stack Engineer · React, TypeScript & Node.js',
    yearsOfExperience: 3,
    primaryDiscipline: 'Software Engineering',
    skills: ['React', 'TypeScript', 'Node.js', 'Express', 'Tailwind CSS', 'PostgreSQL', 'Redis', 'Docker'],
    status: 'Pending Review',
    lastUpdated: '2026-09-16',
    summary: 'Agile full stack developer passionate about creating ultra-responsive web interfaces, robust RESTful and GraphQL APIs, and scalable containerized microservices.',
    education: [
      { degree: 'B.Tech Computer Science and Engineering', institution: 'National Institute of Technology Calicut (NITC)', year: '2020 - 2024' }
    ],
    experience: [
      {
        role: 'Software Engineer',
        company: 'CareHealth Solutions',
        duration: '2024 - Present',
        highlights: [
          'Developed patient intake triage dashboard handling 50k+ daily consultations in Kerala.'
        ]
      }
    ],
    links: {
      github: 'https://github.com/vikrammenon-dev'
    }
  }
];
