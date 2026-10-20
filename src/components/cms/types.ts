export type CmsTab =
  | 'visibility'
  | 'hero'
  | 'cinematic'
  | 'stats'
  | 'features'
  | 'dimensions'
  | 'explore-opportunities'
  | 'blog'
  | 'video'
  | 'testimonials'
  | 'cta-footer';

export const DEFAULT_EXPLORE_OPPORTUNITIES = {
  sectionTag: 'MARKETPLACE ROLES & OPPURTUNITIES',
  title: 'Explore Live Opportunities',
  titleHighlight: 'Oppurtunities',
  subtitle: 'Browse high-impact, AI-vetted roles and project contracts from world-class organizations. Apply in 1-click or earn referral rewards.',
  searchPlaceholder: 'Search 8.2k+ active opportunities, roles, or skillsets...',
  categories: [
    'All',
    'AI & Research',
    'Engineering & Systems',
    'Finance & Economics',
    'Product & Design',
    'Legal & Compliance',
    'Writing & Translation',
  ],
  opportunities: [
    {
      id: 'opp-1',
      title: 'Frontier AI Evaluation Specialist',
      rate: '$90 - $130 / hour',
      category: 'AI & Research',
      statusType: 'hired' as const,
      statusText: '842 recently matched',
      hiredCount: '842 hired this month',
      referralBonus: '$350',
      isOneClickApply: true,
      location: 'Global Remote',
      tags: ['Adaptive AI', 'Benchmark Eval', 'Python'],
      description: 'Design and execute multi-modal evaluation benchmarks for next-gen reasoning models.',
    },
    {
      id: 'opp-2',
      title: 'Senior Distributed Systems Architect',
      rate: '$180k - $240k / yr',
      category: 'Engineering & Systems',
      statusType: 'hired' as const,
      statusText: '154 recently hired',
      hiredCount: '154 hired this month',
      referralBonus: '$500',
      isOneClickApply: true,
      location: 'Remote · US/EU',
      tags: ['Rust', 'Distributed KV', 'Raft'],
      description: 'Architect ultra-low-latency consensus engines and distributed storage layers.',
    },
    {
      id: 'opp-3',
      title: 'Quantitative Risk & KYC Modeling Lead',
      rate: '$110 / hour',
      category: 'Finance & Economics',
      statusType: 'hired' as const,
      statusText: '312 recently hired',
      hiredCount: '312 hired this month',
      referralBonus: '$480',
      isOneClickApply: true,
      location: 'New York / London / Remote',
      tags: ['Monte Carlo', 'AML Modeling', 'Fintech'],
      description: 'Lead quantitative modeling for autonomous risk scoring and anti-money laundering analytics.',
    },
    {
      id: 'opp-4',
      title: 'Product & Design Systems Engineer',
      rate: '$150k - $195k / yr',
      category: 'Product & Design',
      statusType: 'new' as const,
      statusText: '489 recently matched',
      hiredCount: '489 hired this month',
      referralBonus: '$280',
      isOneClickApply: true,
      location: 'Global Remote',
      tags: ['Figma Tokens', 'Tailwind', 'React 19'],
      description: 'Build enterprise-grade design systems with cross-platform micro-interactions and tokens.',
    },
  ],
};
