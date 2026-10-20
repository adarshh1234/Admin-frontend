import { useState, useMemo } from 'react';
import { Button } from '../../common/Button';
import { Input } from '../../common/Input';
import type { SupportFaq, SupportCategory, FaqStatus } from '../../../types/helpDesk';

interface FaqsTabProps {
  faqs: SupportFaq[];
  categories: SupportCategory[];
  onOpenCreateFaq: () => void;
  onUpdateStatus: (id: string, status: FaqStatus) => void;
  onDeleteFaq: (id: string) => void;
}

export function FaqsTab({
  faqs,
  categories,
  onOpenCreateFaq,
  onUpdateStatus,
  onDeleteFaq,
}: FaqsTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(faqs[0]?.id || null);

  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => {
      const matchSearch =
        searchQuery.trim() === '' ||
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCategory = categoryFilter === 'all' || faq.categoryId === categoryFilter;

      return matchSearch && matchCategory;
    });
  }, [faqs, searchQuery, categoryFilter]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header and Controls */}
      <div style={{
        background: '#ffffff',
        borderRadius: 16,
        padding: '20px 24px',
        border: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12,
        boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
      }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#0f172a' }}>
            Frequently Asked Questions ({filteredFaqs.length})
          </h3>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>
            Customer self-service quick answers and troubleshooting guides
          </p>
        </div>

        <Button type="button" variant="primary" onClick={onOpenCreateFaq}>
          <i className="fas fa-plus" style={{ marginRight: 6 }} />
          Add New FAQ
        </Button>
      </div>

      {/* Filter Bar */}
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
            placeholder="Search FAQs by question or answer keywords..."
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
      </div>

      {/* FAQs List Accordion */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filteredFaqs.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            background: '#ffffff',
            borderRadius: 16,
            border: '1px solid #e2e8f0',
            color: '#8e9bb5',
          }}>
            No FAQs found matching query.
          </div>
        ) : (
          filteredFaqs.map((faq) => {
            const isExpanded = expandedId === faq.id;
            const isPublished = faq.status === 'Published';

            return (
              <div
                key={faq.id}
                style={{
                  background: '#ffffff',
                  borderRadius: 14,
                  border: isExpanded ? '1px solid #2563eb' : '1px solid #e2e8f0',
                  overflow: 'hidden',
                  transition: 'all 0.15s ease',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                }}
              >
                {/* Accordion Bar */}
                <div
                  onClick={() => setExpandedId(isExpanded ? null : faq.id)}
                  style={{
                    padding: '16px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    background: isExpanded ? '#eff6ff' : '#ffffff',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
                    <div style={{
                      width: 28,
                      height: 28,
                      borderRadius: 6,
                      background: isExpanded ? '#2563eb' : '#f1f5f9',
                      color: isExpanded ? '#ffffff' : '#64748b',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 12,
                      fontWeight: 700,
                      flexShrink: 0,
                    }}>
                      Q
                    </div>
                    <span style={{ fontWeight: 700, fontSize: 14, color: '#0f172a' }}>
                      {faq.question}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }} onClick={(e) => e.stopPropagation()}>
                    <span style={{
                      background: '#e0f2fe',
                      color: '#0369a1',
                      padding: '2px 8px',
                      borderRadius: 6,
                      fontSize: 11,
                      fontWeight: 600,
                    }}>
                      {faq.categoryName}
                    </span>

                    {/* Publish toggle */}
                    <button
                      type="button"
                      onClick={() => onUpdateStatus(faq.id, isPublished ? 'Draft' : 'Published')}
                      style={{
                        padding: '3px 8px',
                        borderRadius: 6,
                        border: 'none',
                        background: isPublished ? '#dcfce7' : '#f1f5f9',
                        color: isPublished ? '#15803d' : '#64748b',
                        fontSize: 11,
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      {isPublished ? '● Published' : '○ Draft'}
                    </button>

                    <button
                      type="button"
                      onClick={() => onDeleteFaq(faq.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#ef4444',
                        cursor: 'pointer',
                        padding: 4,
                      }}
                      title="Delete FAQ"
                    >
                      <i className="fas fa-trash-alt" />
                    </button>

                    <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'}`} style={{ color: '#94a3b8', fontSize: 12 }} />
                  </div>
                </div>

                {/* Expanded Answer */}
                {isExpanded && (
                  <div style={{
                    padding: '16px 20px',
                    borderTop: '1px solid #e2e8f0',
                    background: '#fafcff',
                    fontSize: 13,
                    color: '#334155',
                    lineHeight: 1.6,
                  }}>
                    <div style={{ marginBottom: 12 }}>{faq.answer}</div>
                    <div style={{ fontSize: 11, color: '#94a3b8', display: 'flex', gap: 16 }}>
                      <span>👍 {faq.helpfulVotes} users found this helpful</span>
                      <span>👁️ {faq.views} total views</span>
                      <span>Updated {faq.updatedDate}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
