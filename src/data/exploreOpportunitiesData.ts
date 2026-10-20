export interface FeaturedOpportunity {
  id: string;
  company: string;
  verified: boolean;
  location: string;
  postedTime: string;
  title: string;
  category: string;
  tags: string[];
  salary: string;
  employmentType: string;
  appliedCount?: string;
  matchedCount?: string;
  description: string;
  featured: boolean;
  requirements?: string[];
}

export interface JustListedJob {
  id: string;
  company: string;
  title: string;
  location: string;
  postedTime: string;
  postedTimestamp: number; // for newest first sorting
  employmentType: string;
  salary?: string;
}

export const FEATURED_OPPORTUNITIES_LIST: FeaturedOpportunity[] = [
  {
    id: 'feat-1',
    company: 'OpenAI',
    verified: true,
    location: 'San Francisco, CA (Remote)',
    postedTime: '2 days ago',
    title: 'Research Engineer – Multimodal AI',
    category: 'AI Research',
    tags: ['AI Research', 'Machine Learning', 'Python'],
    salary: '$180k - $260k',
    employmentType: 'Full-time',
    appliedCount: '1.2k applied',
    matchedCount: '1.2k applied',
    description: 'Work on next-generation multimodal models and contribute to real-world AI systems.',
    featured: true,
    requirements: [
      'Strong research background in deep learning, multimodal vision-language models, or diffusion models.',
      'Proficiency with distributed PyTorch training frameworks across large GPU clusters.',
      'Demonstrated track record of novel contributions or high-impact open source implementations.'
    ]
  },
  {
    id: 'feat-2',
    company: 'Google',
    verified: true,
    location: 'Mountain View, CA',
    postedTime: '1 day ago',
    title: 'Senior Product Designer',
    category: 'Design',
    tags: ['Design', 'Product', 'UX/UI'],
    salary: '$150k - $220k',
    employmentType: 'Full-time',
    appliedCount: '856 applied',
    matchedCount: '856 applied',
    description: 'Design delightful experiences for millions of users across Google products.',
    featured: true,
    requirements: [
      '5+ years leading end-to-end product design for high-scale consumer or enterprise web platforms.',
      'Deep mastery of Figma design systems, motion choreography, and accessible UI standards.',
      'Proven ability to turn complex AI workflow constraints into intuitive user journeys.'
    ]
  },
  {
    id: 'feat-3',
    company: 'Stripe',
    verified: true,
    location: 'Dublin, Ireland (Remote)',
    postedTime: '3 days ago',
    title: 'Senior Backend Engineer',
    category: 'Engineering',
    tags: ['Engineering', 'Node.js', 'Distributed Systems'],
    salary: '$160k - $240k',
    employmentType: 'Full-time',
    appliedCount: '642 applied',
    matchedCount: '642 applied',
    description: 'Build scalable financial infrastructure for the internet economy.',
    featured: true,
    requirements: [
      'Expertise in high-throughput distributed architectures, transaction consistency, and idempotency.',
      'Fluency in Node.js, Go, or Ruby with robust observability and automated testing mindset.',
      'Track record designing mission-critical APIs with zero downtime guarantees.'
    ]
  },
  {
    id: 'feat-4',
    company: 'Anthropic',
    verified: true,
    location: 'San Francisco, CA',
    postedTime: '4 hours ago',
    title: 'Frontend AI Evaluation Specialist',
    category: 'AI Research',
    tags: ['AI Research', 'Evaluation', 'React'],
    salary: '$90 - $130/hr',
    employmentType: 'Contract',
    appliedCount: '842 matched',
    matchedCount: '842 matched',
    description: 'Evaluate reasoning alignment and construct interactive benchmark harness environments.',
    featured: true,
    requirements: [
      'Experience building rich interactive eval harnesses in React and TypeScript.',
      'Familiarity with RLHF datasets and automated prompt perturbation testing.',
      'Deep attention to user safety and alignment accuracy.'
    ]
  },
  {
    id: 'feat-5',
    company: 'AWS',
    verified: true,
    location: 'Seattle, WA',
    postedTime: '6 hours ago',
    title: 'Senior Distributed Systems Architect',
    category: 'Engineering',
    tags: ['Engineering', 'Cloud', 'Architecture'],
    salary: '$180k - $240k',
    employmentType: 'Full-time',
    appliedCount: '154 hired',
    matchedCount: '154 hired',
    description: 'Design planet-scale compute primitives and cloud isolation layers for next-gen serverless tiers.',
    featured: true,
    requirements: [
      'Deep systems design experience in Rust, C++, or Go.',
      'Track record operating hyper-scale multi-tenant compute clusters.',
      'Zero-downtime distributed consensus mastery.'
    ]
  },
  {
    id: 'feat-6',
    company: 'Revolut',
    verified: true,
    location: 'London, UK (Hybrid)',
    postedTime: '8 hours ago',
    title: 'Quantitative Risk & KYC Modeling Lead',
    category: 'Fintech',
    tags: ['Fintech', 'Risk', 'KYC', 'Python'],
    salary: '$110/hr',
    employmentType: 'Contract',
    appliedCount: '312 hired',
    matchedCount: '312 hired',
    description: 'Implement real-time fraud scoring algorithms and automated AML compliance pipelines.',
    featured: true,
    requirements: [
      'Advanced degree in quantitative finance, mathematics, or statistics.',
      'Hands-on experience deploying ML fraud models in high-frequency trading or neobanks.',
      'Robust understanding of international regulatory frameworks.'
    ]
  },
  {
    id: 'feat-7',
    company: 'Figma',
    verified: true,
    location: 'New York, NY',
    postedTime: '10 hours ago',
    title: 'Product & Design Systems Engineer',
    category: 'Design',
    tags: ['Design', 'Frontend', 'Systems'],
    salary: '$150k - $195k',
    employmentType: 'Full-time',
    appliedCount: '489 hired',
    matchedCount: '489 hired',
    description: 'Bridge creative design tokens and component architecture across collaborative canvas tools.',
    featured: true,
    requirements: [
      'Deep expertise in WebGL/Canvas rendering, WebAssembly, and React.',
      'Passion for developer experience, tokens, and multi-brand theming.',
      'Strong eye for visual micro-interactions and performance.'
    ]
  },
  {
    id: 'feat-8',
    company: 'Microsoft',
    verified: true,
    location: 'Redmond, WA (Remote)',
    postedTime: '12 hours ago',
    title: 'AI Platform Engineer',
    category: 'Engineering',
    tags: ['Engineering', 'AI/ML', 'Azure'],
    salary: '$160k - $230k',
    employmentType: 'Full-time',
    appliedCount: '421 hired',
    matchedCount: '421 hired',
    description: 'Build enterprise model orchestration nodes and low-latency inference pipelines on Azure.',
    featured: true,
    requirements: [
      'Experience with ONNX runtime, vLLM, TensorRT-LLM optimization.',
      'Kubernetes orchestration across multi-region clusters.',
      'High security standards for enterprise AI workloads.'
    ]
  },
  {
    id: 'feat-9',
    company: 'Pinterest',
    verified: true,
    location: 'San Francisco, CA',
    postedTime: '14 hours ago',
    title: 'Senior ML Engineer',
    category: 'AI Research',
    tags: ['AI Research', 'Machine Learning', 'Python'],
    salary: '$150k - $220k',
    employmentType: 'Full-time',
    appliedCount: '298 hired',
    matchedCount: '298 hired',
    description: 'Optimize visual recommendation engines and graph embeddings across 500M+ monthly users.',
    featured: true,
    requirements: [
      'Proven expertise in large graph neural networks and multimodal retrieval.',
      'Real-time ranking experience serving 100k+ QPS.',
      'PyTorch, Ray, and distributed feature stores.'
    ]
  },
  {
    id: 'feat-10',
    company: 'Shopify',
    verified: true,
    location: 'Toronto, Canada (Remote)',
    postedTime: '16 hours ago',
    title: 'Full Stack Engineer',
    category: 'Engineering',
    tags: ['Engineering', 'React', 'Node.js'],
    salary: '$120k - $180k',
    employmentType: 'Full-time',
    appliedCount: '376 hired',
    matchedCount: '376 hired',
    description: 'Empower global merchants with high-conversion checkout primitives and headless commerce APIs.',
    featured: true,
    requirements: [
      'Strong full-stack capabilities in Ruby on Rails, Node.js, and TypeScript React.',
      'Experience with high-scale e-commerce traffic spikes like Black Friday.',
      'Commitment to clean architecture and test coverage.'
    ]
  },
  {
    id: 'feat-11',
    company: 'Coinbase',
    verified: true,
    location: 'New York, NY',
    postedTime: '18 hours ago',
    title: 'Security & Blockchain Engineer',
    category: 'Fintech',
    tags: ['Security', 'Infrastructure', 'Blockchain'],
    salary: '$170k - $250k',
    employmentType: 'Full-time',
    appliedCount: '210 hired',
    matchedCount: '210 hired',
    description: 'Audit cryptographic key storage architectures and enforce zero-trust security postures.',
    featured: true,
    requirements: [
      'Deep knowledge of MPC protocols, HSMs, and smart contract auditing.',
      'Zero-trust network architecture in AWS/GCP.',
      'Incident response and proactive red-teaming experience.'
    ]
  },
  {
    id: 'feat-12',
    company: 'Notion',
    verified: true,
    location: 'San Francisco, CA (Remote)',
    postedTime: '1 day ago',
    title: 'Principal Product Manager',
    category: 'Design',
    tags: ['Product', 'Strategy', 'Growth'],
    salary: '$170k - $240k',
    employmentType: 'Full-time',
    appliedCount: '512 hired',
    matchedCount: '512 hired',
    description: 'Lead next-generation workspace collaboration features and AI block integrations.',
    featured: true,
    requirements: [
      'Track record shipping beloved 0-to-1 consumer and enterprise collaboration software.',
      'Strong quantitative product analytics and user empathy.',
      'Experience with AI product workflows and block ecosystems.'
    ]
  },
  {
    id: 'feat-13',
    company: 'Apple',
    verified: true,
    location: 'Cupertino, CA',
    postedTime: '1 day ago',
    title: 'Senior iOS Core OS Engineer',
    category: 'Engineering',
    tags: ['iOS', 'Swift', 'CoreOS'],
    salary: '$190k - $270k',
    employmentType: 'Full-time',
    appliedCount: '730 applied',
    matchedCount: '730 applied',
    description: 'Engineer high-performance low-level system services and kernel abstractions for iOS.',
    featured: true,
    requirements: [
      'Deep mastery of Swift, Objective-C, C/C++, and POSIX internals.',
      'Experience with memory management, power optimization, and multi-threading.',
      'Passion for privacy-preserving OS primitives.'
    ]
  },
  {
    id: 'feat-14',
    company: 'Tesla',
    verified: true,
    location: 'Austin, TX',
    postedTime: '2 days ago',
    title: 'Autonomous Systems & Vision Engineer',
    category: 'AI Research',
    tags: ['Robotics', 'Computer Vision', 'C++'],
    salary: '$185k - $260k',
    employmentType: 'Full-time',
    appliedCount: '940 applied',
    matchedCount: '940 applied',
    description: 'Develop real-time occupancy networks and neural trajectory planners for Autopilot.',
    featured: true,
    requirements: [
      'Experience deploying neural networks to custom edge silicon with microsecond latency.',
      'Expertise in 3D perception, sensor fusion, and spatial temporal modeling.',
      'Modern C++20 and CUDA programming.'
    ]
  },
  {
    id: 'feat-15',
    company: 'Netflix',
    verified: true,
    location: 'Los Gatos, CA (Remote)',
    postedTime: '2 days ago',
    title: 'Lead Data Scientist & Personalization',
    category: 'AI Research',
    tags: ['Data Science', 'Ranking', 'Personalization'],
    salary: '$200k - $300k',
    employmentType: 'Full-time',
    appliedCount: '620 applied',
    matchedCount: '620 applied',
    description: 'Design bandit algorithms and deep ranking models powering personal homepage experiences.',
    featured: true,
    requirements: [
      'Ph.D. or M.S. in Machine Learning, Statistics, or Computer Science.',
      'Strong track record in contextual bandits, causal inference, and offline-to-online eval.',
      'Experience with large-scale A/B experimentation.'
    ]
  },
  {
    id: 'feat-16',
    company: 'Spotify',
    verified: true,
    location: 'Stockholm, Sweden (Remote)',
    postedTime: '3 days ago',
    title: 'ML Infrastructure & Audio AI Engineer',
    category: 'Engineering',
    tags: ['Audio AI', 'MLOps', 'Distributed Systems'],
    salary: '$165k - $230k',
    employmentType: 'Full-time',
    appliedCount: '480 applied',
    matchedCount: '480 applied',
    description: 'Build audio feature generation pipelines and low-latency audio LLM serving infrastructure.',
    featured: true,
    requirements: [
      'Experience with audio DSP, acoustic embeddings, and generative audio architectures.',
      'Large-scale batch and streaming pipeline mastery (Kafka, Flink, Spark).',
      'Kubernetes, Ray, and high-throughput GPU serving.'
    ]
  }
];

export const JUST_LISTED_JOBS: JustListedJob[] = [
  {
    id: 'jl-1',
    company: 'Saroj Diagnostic Laboratory',
    title: 'MARKETING MANAGER',
    location: 'Chalapuram, Kerala · via SimplyHired',
    postedTime: '2 hours ago',
    postedTimestamp: 2,
    employmentType: 'Full-time'
  },
  {
    id: 'jl-2',
    company: 'Madhyamam Daily',
    title: 'Office Assistant/ Attendant',
    location: 'Kozhikode, Kerala · via BeBee',
    postedTime: '5 hours ago',
    postedTimestamp: 5,
    employmentType: 'Full-time'
  },
  {
    id: 'jl-3',
    company: 'Dekoconcepts',
    title: 'Office Assistant (Kottakkal)',
    location: 'Kottakkal, Kerala · via Jobrapido.com',
    postedTime: '1 day ago',
    postedTimestamp: 24,
    employmentType: 'Full-time'
  },
  {
    id: 'jl-4',
    company: 'Nifa Infocomp Services Private Limited',
    title: 'Mobilizer',
    location: 'Malappuram, Kerala · via SimplyHired',
    postedTime: '2 days ago',
    postedTimestamp: 48,
    employmentType: 'Full-time',
    salary: '₹12K–₹18K a month'
  },
  {
    id: 'jl-5',
    company: 'Discord',
    title: 'Senior Software Engineer (Voice Infrastructure)',
    location: 'San Francisco, CA · via LetGetIn',
    postedTime: '2 days ago',
    postedTimestamp: 52,
    employmentType: 'Full-time',
    salary: '$170k - $220k'
  },
  {
    id: 'jl-6',
    company: 'Uber',
    title: 'Backend Systems Engineer (Marketplace Dispatch)',
    location: 'Sunnyvale, CA · via LetGetIn',
    postedTime: '3 days ago',
    postedTimestamp: 72,
    employmentType: 'Full-time',
    salary: '$165k - $235k'
  },
  {
    id: 'jl-7',
    company: 'Adobe',
    title: 'Creative AI Research Associate',
    location: 'San Jose, CA · via Jobrapido.com',
    postedTime: '3 days ago',
    postedTimestamp: 75,
    employmentType: 'Full-time',
    salary: '$155k - $210k'
  },
  {
    id: 'jl-8',
    company: 'Calicut Tech Labs',
    title: 'Junior React & Node.js Developer',
    location: 'Calicut, Kerala · via SimplyHired',
    postedTime: '4 days ago',
    postedTimestamp: 96,
    employmentType: 'Full-time',
    salary: '₹25K–₹35K a month'
  }
];
