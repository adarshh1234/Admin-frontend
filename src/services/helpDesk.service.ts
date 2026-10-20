import {
  INITIAL_SUPPORT_CATEGORIES,
  INITIAL_SUPPORT_ARTICLES,
  INITIAL_FAQS,
  INITIAL_HELP_DESK_SETTINGS,
} from '../data/helpDeskData';
import type {
  SupportCategory,
  SupportArticle,
  SupportFaq,
  HelpDeskSettings,
  ArticleStatus,
  FaqStatus,
} from '../types/helpDesk';

class HelpDeskService {
  private categories: SupportCategory[] = [...INITIAL_SUPPORT_CATEGORIES];
  private articles: SupportArticle[] = [...INITIAL_SUPPORT_ARTICLES];
  private faqs: SupportFaq[] = [...INITIAL_FAQS];
  private settings: HelpDeskSettings = { ...INITIAL_HELP_DESK_SETTINGS };

  // ---------------------------------------------------------------------------
  // CATEGORIES
  // ---------------------------------------------------------------------------
  public getCategories(): SupportCategory[] {
    return [...this.categories];
  }

  public createCategory(data: {
    name: string;
    description: string;
    icon?: string;
    color?: string;
  }): SupportCategory {
    const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newCat: SupportCategory = {
      id: `CAT-${Math.floor(100 + Math.random() * 900)}`,
      name: data.name,
      slug,
      icon: data.icon || 'fa-folder',
      description: data.description,
      color: data.color || '#0284c7',
      articleCount: 0,
      ticketCount: 0,
      status: 'Active',
      orderIndex: this.categories.length + 1,
    };
    this.categories.push(newCat);
    return newCat;
  }

  public updateCategory(id: string, updates: Partial<SupportCategory>): boolean {
    const cat = this.categories.find((c) => c.id === id);
    if (!cat) return false;
    Object.assign(cat, updates);
    return true;
  }

  public deleteCategory(id: string): boolean {
    const idx = this.categories.findIndex((c) => c.id === id);
    if (idx === -1) return false;
    this.categories.splice(idx, 1);
    return true;
  }

  // ---------------------------------------------------------------------------
  // ARTICLES
  // ---------------------------------------------------------------------------
  public getArticles(): SupportArticle[] {
    return [...this.articles];
  }

  public getArticleById(id: string): SupportArticle | undefined {
    return this.articles.find((a) => a.id === id);
  }

  public createArticle(data: {
    title: string;
    categoryId: string;
    summary: string;
    content: string;
    author: string;
    status: ArticleStatus;
    tags?: string[];
    isFeatured?: boolean;
  }): SupportArticle {
    const category = this.categories.find((c) => c.id === data.categoryId);
    const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const authorInitials = data.author.split(' ').map((n) => n[0]).join('').slice(0, 2);

    const newArticle: SupportArticle = {
      id: `ART-${Math.floor(100 + Math.random() * 900)}`,
      title: data.title,
      slug,
      categoryId: data.categoryId,
      categoryName: category?.name || 'General',
      summary: data.summary,
      content: data.content,
      author: data.author,
      authorAvatar: authorInitials || 'AD',
      status: data.status,
      views: 0,
      helpfulCount: 0,
      notHelpfulCount: 0,
      createdDate: new Date().toISOString().split('T')[0],
      updatedDate: new Date().toISOString().split('T')[0],
      tags: data.tags || [],
      isFeatured: data.isFeatured || false,
    };

    this.articles = [newArticle, ...this.articles];
    if (category) {
      category.articleCount += 1;
    }
    return newArticle;
  }

  public updateArticle(id: string, updates: Partial<SupportArticle>): boolean {
    const article = this.getArticleById(id);
    if (!article) return false;
    Object.assign(article, updates);
    article.updatedDate = new Date().toISOString().split('T')[0];
    return true;
  }

  public deleteArticle(id: string): boolean {
    const idx = this.articles.findIndex((a) => a.id === id);
    if (idx === -1) return false;
    const deleted = this.articles[idx];
    const cat = this.categories.find((c) => c.id === deleted.categoryId);
    if (cat && cat.articleCount > 0) {
      cat.articleCount -= 1;
    }
    this.articles.splice(idx, 1);
    return true;
  }

  // ---------------------------------------------------------------------------
  // FAQS
  // ---------------------------------------------------------------------------
  public getFaqs(): SupportFaq[] {
    return [...this.faqs];
  }

  public createFaq(data: {
    question: string;
    answer: string;
    categoryId: string;
    status: FaqStatus;
  }): SupportFaq {
    const category = this.categories.find((c) => c.id === data.categoryId);
    const newFaq: SupportFaq = {
      id: `FAQ-${Math.floor(100 + Math.random() * 900)}`,
      question: data.question,
      answer: data.answer,
      categoryId: data.categoryId,
      categoryName: category?.name || 'General',
      status: data.status,
      orderIndex: this.faqs.length + 1,
      helpfulVotes: 0,
      views: 0,
      createdDate: new Date().toISOString().split('T')[0],
      updatedDate: new Date().toISOString().split('T')[0],
    };
    this.faqs.push(newFaq);
    return newFaq;
  }

  public updateFaq(id: string, updates: Partial<SupportFaq>): boolean {
    const faq = this.faqs.find((f) => f.id === id);
    if (!faq) return false;
    Object.assign(faq, updates);
    faq.updatedDate = new Date().toISOString().split('T')[0];
    return true;
  }

  public deleteFaq(id: string): boolean {
    const idx = this.faqs.findIndex((f) => f.id === id);
    if (idx === -1) return false;
    this.faqs.splice(idx, 1);
    return true;
  }

  // ---------------------------------------------------------------------------
  // SETTINGS
  // ---------------------------------------------------------------------------
  public getSettings(): HelpDeskSettings {
    return JSON.parse(JSON.stringify(this.settings));
  }

  public updateSettings(updates: Partial<HelpDeskSettings>): HelpDeskSettings {
    this.settings = { ...this.settings, ...updates };
    return this.settings;
  }
}

export const helpDeskService = new HelpDeskService();
