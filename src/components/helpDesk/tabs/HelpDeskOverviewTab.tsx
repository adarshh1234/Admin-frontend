import { Button } from '../../common/Button';
import type { SupportCategory, SupportArticle, SupportFaq, HelpDeskTab } from '../../../types/helpDesk';

interface HelpDeskOverviewTabProps {
  categories: SupportCategory[];
  articles: SupportArticle[];
  faqs: SupportFaq[];
  onNavigateTab: (tab: HelpDeskTab) => void;
  onOpenCreateArticle: () => void;
  onOpenCreateFaq: () => void;
  onSelectArticle: (article: SupportArticle) => void;
}

export function HelpDeskOverviewTab({
  categories,
  articles,
  faqs,
  onNavigateTab,
  onOpenCreateArticle,
  onOpenCreateFaq,
  onSelectArticle,
}: HelpDeskOverviewTabProps) {
  const publishedArticles = articles.filter((a) => a.status === 'Published');
  const totalViews = articles.reduce((acc, a) => acc + a.views, 0);
  const featuredArticles = articles.filter((a) => a.isFeatured || a.views > 800);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Top Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #091e42 0%, #0052cc 60%, #0284c7 100%)',
        borderRadius: 16,
        padding: '24px 28px',
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 20,
        boxShadow: '0 10px 25px rgba(2, 101, 194, 0.2)',
      }}>
        <div style={{ maxWidth: 600 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: 'rgba(255, 255, 255, 0.16)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            padding: '4px 12px',
            borderRadius: 20,
            fontSize: 12,
            fontWeight: 600,
            marginBottom: 10,
          }}>
            <i className="fas fa-life-ring" style={{ color: '#38bdf8' }} />
            <span>Customer Self-Service Portal Active</span>
          </div>
          <h2 style={{ margin: '0 0 6px', fontSize: 24, fontWeight: 800, letterSpacing: '-0.02em' }}>
            Help Desk & Knowledge Center
          </h2>
          <p style={{ margin: 0, fontSize: 14, opacity: 0.9, lineHeight: 1.5 }}>
            Publish customer documentation, manage FAQs, configure support taxonomy, and power automated AI answers.
          </p>
        </div>

        {/* Quick Actions */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={onOpenCreateArticle}
            style={{
              background: '#ffffff',
              color: '#0052cc',
              border: 'none',
              borderRadius: 10,
              padding: '10px 18px',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            }}
          >
            <i className="fas fa-file-plus" />
            <span>New Article</span>
          </button>

          <button
            type="button"
            onClick={onOpenCreateFaq}
            style={{
              background: 'rgba(255, 255, 255, 0.18)',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.35)',
              borderRadius: 10,
              padding: '10px 16px',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <i className="fas fa-question-circle" />
            <span>Add FAQ</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab('knowledge-base')}
            style={{
              background: 'rgba(255, 255, 255, 0.18)',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.35)',
              borderRadius: 10,
              padding: '10px 16px',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <i className="fas fa-book-open" />
            <span>Browse KB</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        gap: 16,
      }}>
        {/* Total KB Articles */}
        <div
          onClick={() => onNavigateTab('knowledge-base')}
          style={{
            background: '#ffffff',
            borderRadius: 14,
            padding: '20px',
            border: '1px solid #e2e8f0',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#64748b' }}>KB Articles</span>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: '#eff6ff',
              color: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 16,
            }}>
              <i className="fas fa-book" />
            </div>
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#0f172a' }}>{articles.length}</div>
          <div style={{ fontSize: 12, color: '#16a34a', marginTop: 4, fontWeight: 600 }}>
            {publishedArticles.length} Live Published
          </div>
        </div>

        {/* FAQs */}
        <div
          onClick={() => onNavigateTab('faqs')}
          style={{
            background: '#ffffff',
            borderRadius: 14,
            padding: '20px',
            border: '1px solid #e2e8f0',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#64748b' }}>Live FAQs</span>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: '#eff6ff',
              color: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 16,
            }}>
              <i className="fas fa-question-circle" />
            </div>
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#0f172a' }}>{faqs.length}</div>
          <div style={{ fontSize: 12, color: '#2563eb', marginTop: 4 }}>
            Across {categories.length} categories
          </div>
        </div>

        {/* Categories */}
        <div
          onClick={() => onNavigateTab('support-categories')}
          style={{
            background: '#ffffff',
            borderRadius: 14,
            padding: '20px',
            border: '1px solid #e2e8f0',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#64748b' }}>Support Categories</span>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: '#faf5ff',
              color: '#9333ea',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 16,
            }}>
              <i className="fas fa-layer-group" />
            </div>
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#0f172a' }}>{categories.length}</div>
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>
            Taxonomy & routing topics
          </div>
        </div>

        {/* Article Views */}
        <div
          onClick={() => onNavigateTab('support-articles')}
          style={{
            background: '#ffffff',
            borderRadius: 14,
            padding: '20px',
            border: '1px solid #e2e8f0',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#64748b' }}>Monthly Article Views</span>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: '#fffbeb',
              color: '#d97706',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 16,
            }}>
              <i className="fas fa-eye" />
            </div>
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#0f172a' }}>{totalViews.toLocaleString()}</div>
          <div style={{ fontSize: 12, color: '#16a34a', marginTop: 4, fontWeight: 600 }}>
            ★ 94.2% found helpful
          </div>
        </div>
      </div>

      {/* Main Grid: Categories Showcase & Top Featured Articles */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: 24 }}>
        {/* Support Categories Cards */}
        <div style={{
          background: '#ffffff',
          borderRadius: 16,
          padding: '24px',
          border: '1px solid #e2e8f0',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
            <div>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#0f172a' }}>
                Knowledge Categories
              </h3>
              <p style={{ margin: '2px 0 0', fontSize: 12, color: '#64748b' }}>Documentation topics</p>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('support-categories')}
              style={{
                background: 'none',
                border: 'none',
                color: '#0052cc',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Manage <i className="fas fa-arrow-right" style={{ marginLeft: 4 }} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {categories.map((cat) => (
              <div
                key={cat.id}
                onClick={() => onNavigateTab('knowledge-base')}
                style={{
                  padding: '12px 14px',
                  borderRadius: 10,
                  border: '1px solid #f1f5f9',
                  background: '#fafcff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: `${cat.color}15`,
                    color: cat.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 14,
                  }}>
                    <i className={`fas ${cat.icon}`} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13, color: '#0f172a' }}>{cat.name}</div>
                    <div style={{ fontSize: 11, color: '#64748b', maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {cat.description}
                    </div>
                  </div>
                </div>

                <span style={{
                  background: '#f1f5f9',
                  padding: '2px 8px',
                  borderRadius: 10,
                  fontSize: 11,
                  fontWeight: 600,
                  color: '#475569',
                }}>
                  {cat.articleCount} articles
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Help Articles */}
        <div style={{
          background: '#ffffff',
          borderRadius: 16,
          padding: '24px',
          border: '1px solid #e2e8f0',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
            <div>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#0f172a' }}>
                Most Viewed Support Articles
              </h3>
              <p style={{ margin: '2px 0 0', fontSize: 12, color: '#64748b' }}>Top customer documentation</p>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('support-articles')}
              style={{
                background: 'none',
                border: 'none',
                color: '#0052cc',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              All Articles <i className="fas fa-arrow-right" style={{ marginLeft: 4 }} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {featuredArticles.map((art) => (
              <div
                key={art.id}
                onClick={() => onSelectArticle(art)}
                style={{
                  padding: '14px',
                  borderRadius: 12,
                  border: '1px solid #e2e8f0',
                  background: '#ffffff',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{
                    background: '#e0f2fe',
                    color: '#0369a1',
                    padding: '2px 8px',
                    borderRadius: 4,
                    fontSize: 11,
                    fontWeight: 700,
                  }}>
                    {art.categoryName}
                  </span>
                  <span style={{ fontSize: 11, color: '#64748b' }}>
                    👁️ {art.views} views • 👍 {art.helpfulCount}
                  </span>
                </div>

                <div style={{ fontWeight: 700, fontSize: 13, color: '#0f172a', marginBottom: 4 }}>
                  {art.title}
                </div>

                <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.4 }}>
                  {art.summary}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
