import { useState, useMemo } from 'react';
import { Button } from '../../common/Button';
import { Input } from '../../common/Input';
import type { SupportArticle, SupportCategory } from '../../../types/helpDesk';

interface KnowledgeBaseTabProps {
  articles: SupportArticle[];
  categories: SupportCategory[];
  onOpenCreateArticle: () => void;
  onSelectArticle: (article: SupportArticle) => void;
}

export function KnowledgeBaseTab({
  articles,
  categories,
  onOpenCreateArticle,
  onSelectArticle,
}: KnowledgeBaseTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredArticles = useMemo(() => {
    return articles.filter((art) => {
      const matchSearch =
        searchQuery.trim() === '' ||
        art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchCategory = selectedCategoryId === 'all' || art.categoryId === selectedCategoryId;
      const matchStatus = statusFilter === 'all' || art.status === statusFilter;

      return matchSearch && matchCategory && matchStatus;
    });
  }, [articles, searchQuery, selectedCategoryId, statusFilter]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Category Pills Bar */}
      <div style={{
        display: 'flex',
        gap: 8,
        overflowX: 'auto',
        paddingBottom: 4,
      }}>
        <button
          type="button"
          onClick={() => setSelectedCategoryId('all')}
          style={{
            padding: '8px 14px',
            borderRadius: 10,
            border: selectedCategoryId === 'all' ? '1px solid #0052cc' : '1px solid #e2e8f0',
            background: selectedCategoryId === 'all' ? '#0052cc' : '#ffffff',
            color: selectedCategoryId === 'all' ? '#ffffff' : '#334155',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          All Categories ({articles.length})
        </button>

        {categories.map((cat) => {
          const isSelected = selectedCategoryId === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategoryId(cat.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 14px',
                borderRadius: 10,
                border: isSelected ? `1px solid ${cat.color}` : '1px solid #e2e8f0',
                background: isSelected ? cat.color : '#ffffff',
                color: isSelected ? '#ffffff' : '#334155',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              <i className={`fas ${cat.icon}`} />
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Search & Actions Bar */}
      <div style={{
        background: '#ffffff',
        borderRadius: 16,
        padding: '16px 20px',
        border: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12,
      }}>
        <div style={{ flex: 1, minWidth: 260, position: 'relative' }}>
          <Input
            type="text"
            placeholder="Search articles by title, keywords, tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
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

          <Button type="button" variant="primary" onClick={onOpenCreateArticle}>
            <i className="fas fa-plus" style={{ marginRight: 6 }} />
            New Article
          </Button>
        </div>
      </div>

      {/* Articles Grid Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: 16,
      }}>
        {filteredArticles.length === 0 ? (
          <div style={{
            gridColumn: '1 / -1',
            textAlign: 'center',
            padding: '40px',
            background: '#ffffff',
            borderRadius: 16,
            border: '1px solid #e2e8f0',
            color: '#8e9bb5',
          }}>
            No articles found matching query.
          </div>
        ) : (
          filteredArticles.map((art) => (
            <div
              key={art.id}
              onClick={() => onSelectArticle(art)}
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: 14,
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                cursor: 'pointer',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span style={{
                    background: '#e0f2fe',
                    color: '#0369a1',
                    fontSize: 11,
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: 6,
                  }}>
                    {art.categoryName}
                  </span>

                  <span style={{
                    fontSize: 11,
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: 6,
                    background: art.status === 'Published' ? '#dcfce7' : '#fef3c7',
                    color: art.status === 'Published' ? '#15803d' : '#b45309',
                  }}>
                    {art.status}
                  </span>
                </div>

                <h4 style={{
                  margin: '0 0 8px',
                  fontSize: 15,
                  fontWeight: 700,
                  color: '#0f172a',
                  lineHeight: 1.35,
                }}>
                  {art.title}
                </h4>

                <p style={{
                  margin: 0,
                  fontSize: 13,
                  color: '#64748b',
                  lineHeight: 1.5,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                }}>
                  {art.summary}
                </p>
              </div>

              <div style={{
                marginTop: 16,
                paddingTop: 12,
                borderTop: '1px solid #f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: 11,
                color: '#94a3b8',
              }}>
                <span>By <strong>{art.author}</strong></span>
                <span>👁️ {art.views} • Updated {art.updatedDate}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
