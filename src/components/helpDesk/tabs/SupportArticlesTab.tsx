import { useState, useMemo } from 'react';
import { Button } from '../../common/Button';
import { Input } from '../../common/Input';
import type { SupportArticle, SupportCategory, ArticleStatus } from '../../../types/helpDesk';

interface SupportArticlesTabProps {
  articles: SupportArticle[];
  categories: SupportCategory[];
  onOpenCreateArticle: () => void;
  onSelectArticle: (article: SupportArticle) => void;
  onDeleteArticle: (id: string) => void;
}

export function SupportArticlesTab({
  articles,
  categories,
  onOpenCreateArticle,
  onSelectArticle,
  onDeleteArticle,
}: SupportArticlesTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredArticles = useMemo(() => {
    return articles.filter((art) => {
      const matchSearch =
        searchQuery.trim() === '' ||
        art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.summary.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCategory = categoryFilter === 'all' || art.categoryId === categoryFilter;
      const matchStatus = statusFilter === 'all' || art.status === statusFilter;

      return matchSearch && matchCategory && matchStatus;
    });
  }, [articles, searchQuery, categoryFilter, statusFilter]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header and Controls */}
      <div style={{
        background: '#ffffff',
        borderRadius: 16,
        padding: '20px 24px',
        border: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#0f172a' }}>
              Support Documentation Master List ({filteredArticles.length})
            </h3>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>
              Manage all published help topics, drafts, author attributions, and view analytics
            </p>
          </div>

          <Button type="button" variant="primary" onClick={onOpenCreateArticle}>
            <i className="fas fa-plus" style={{ marginRight: 6 }} />
            Create Article
          </Button>
        </div>

        {/* Filters */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(240px, 2fr) 1fr 1fr',
          gap: 12,
        }}>
          <div style={{ position: 'relative' }}>
            <Input
              type="text"
              placeholder="Search by article title, author, summary..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{
              padding: '9px 12px',
              borderRadius: 8,
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              fontSize: 13,
              color: '#334155',
              outline: 'none',
            }}
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: '9px 12px',
              borderRadius: 8,
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              fontSize: 13,
              color: '#334155',
              outline: 'none',
            }}
          >
            <option value="all">All Statuses</option>
            <option value="Published">Published</option>
            <option value="Draft">Draft</option>
            <option value="Under Review">Under Review</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div style={{
        background: '#ffffff',
        borderRadius: 16,
        border: '1px solid #e2e8f0',
        overflow: 'hidden',
        boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
                <th style={{ padding: '14px 20px', fontWeight: 600 }}>Article Title</th>
                <th style={{ padding: '14px 16px', fontWeight: 600 }}>Category</th>
                <th style={{ padding: '14px 16px', fontWeight: 600 }}>Author</th>
                <th style={{ padding: '14px 16px', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '14px 16px', fontWeight: 600 }}>Created & Updated</th>
                <th style={{ padding: '14px 16px', fontWeight: 600 }}>Views & Feedback</th>
                <th style={{ padding: '14px 20px', fontWeight: 600, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredArticles.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '40px 20px', color: '#8e9bb5' }}>
                    No support articles found.
                  </td>
                </tr>
              ) : (
                filteredArticles.map((art) => (
                  <tr
                    key={art.id}
                    style={{
                      borderBottom: '1px solid #f1f5f9',
                      transition: 'background 0.15s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#fafcff')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = '#ffffff')}
                  >
                    {/* Title */}
                    <td style={{ padding: '14px 20px', maxWidth: 320 }}>
                      <div
                        onClick={() => onSelectArticle(art)}
                        style={{
                          fontWeight: 700,
                          color: '#0f172a',
                          cursor: 'pointer',
                          marginBottom: 2,
                        }}
                      >
                        {art.title}
                      </div>
                      <div style={{
                        fontSize: 11,
                        color: '#64748b',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}>
                        {art.summary}
                      </div>
                    </td>

                    {/* Category */}
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{
                        background: '#e0f2fe',
                        color: '#0369a1',
                        padding: '3px 8px',
                        borderRadius: 6,
                        fontSize: 11,
                        fontWeight: 700,
                      }}>
                        {art.categoryName}
                      </span>
                    </td>

                    {/* Author */}
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: 600, color: '#1e293b' }}>{art.author}</div>
                    </td>

                    {/* Status */}
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{
                        padding: '3px 8px',
                        borderRadius: 6,
                        fontSize: 11,
                        fontWeight: 700,
                        background: art.status === 'Published' ? '#dcfce7' : '#fef3c7',
                        color: art.status === 'Published' ? '#15803d' : '#b45309',
                      }}>
                        {art.status}
                      </span>
                    </td>

                    {/* Dates */}
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontSize: 12, color: '#1e293b' }}>{art.createdDate}</div>
                      <div style={{ fontSize: 11, color: '#94a3b8' }}>Updated {art.updatedDate}</div>
                    </td>

                    {/* Views & Feedback */}
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontSize: 12, color: '#0f172a', fontWeight: 600 }}>
                        👁️ {art.views}
                      </div>
                      <div style={{ fontSize: 11, color: '#16a34a' }}>
                        👍 {art.helpfulCount} helpful
                      </div>
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6 }}>
                        <button
                          type="button"
                          onClick={() => onSelectArticle(art)}
                          style={{
                            background: '#0284c7',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: 6,
                            padding: '6px 10px',
                            fontSize: 12,
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          View
                        </button>

                        <button
                          type="button"
                          onClick={() => onDeleteArticle(art.id)}
                          style={{
                            background: '#fee2e2',
                            color: '#dc2626',
                            border: '1px solid #fecaca',
                            borderRadius: 6,
                            padding: '6px 10px',
                            fontSize: 12,
                            cursor: 'pointer',
                          }}
                          title="Delete Article"
                        >
                          <i className="fas fa-trash-alt" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
