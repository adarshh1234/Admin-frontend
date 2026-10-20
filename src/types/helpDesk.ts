export type ArticleStatus = 'Published' | 'Draft' | 'Under Review' | 'Archived';
export type FaqStatus = 'Published' | 'Draft' | 'Archived';

export interface SupportCategory {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  color: string;
  articleCount: number;
  ticketCount: number;
  status: 'Active' | 'Archived';
  orderIndex: number;
}

export interface SupportArticle {
  id: string;
  title: string;
  slug: string;
  categoryId: string;
  categoryName: string;
  summary: string;
  content: string;
  author: string;
  authorAvatar: string;
  status: ArticleStatus;
  views: number;
  helpfulCount: number;
  notHelpfulCount: number;
  createdDate: string;
  updatedDate: string;
  tags: string[];
  isFeatured?: boolean;
}

export interface SupportFaq {
  id: string;
  question: string;
  answer: string;
  categoryId: string;
  categoryName: string;
  status: FaqStatus;
  orderIndex: number;
  helpfulVotes: number;
  views: number;
  createdDate: string;
  updatedDate: string;
}

export interface HelpDeskSettings {
  portalName: string;
  helpCenterUrl: string;
  supportEmail: string;
  contactPhone: string;
  brandColor: string;
  defaultTicketCategory: string;
  defaultTicketPriority: 'Low' | 'Medium' | 'High';
  defaultTicketStatus: 'Open' | 'In Progress';
  businessHours: {
    enabled: boolean;
    timezone: string;
    schedule: string;
  };
  enableCsatSurveys: boolean;
  enableAiSuggestedArticles: boolean;
  allowAnonymousTicketSubmission: boolean;
  knowledgeBasePublicAccess: boolean;
}

export type HelpDeskTab =
  | 'overview'
  | 'knowledge-base'
  | 'faqs'
  | 'support-categories'
  | 'support-articles'
  | 'settings';
