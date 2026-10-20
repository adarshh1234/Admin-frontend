import { useState } from 'react';
import { Button } from '../../common/Button';
import type { SupportCategory } from '../../../types/helpDesk';

interface SupportCategoriesTabProps {
  categories: SupportCategory[];
  onOpenCreateCategory: () => void;
  onUpdateCategoryStatus: (id: string, status: 'Active' | 'Archived') => void;
  onDeleteCategory: (id: string) => void;
}

export function SupportCategoriesTab({
  categories,
  onOpenCreateCategory,
  onUpdateCategoryStatus,
  onDeleteCategory,
}: SupportCategoriesTabProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header and Action */}
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
            Support & Taxonomy Categories ({filteredCategories.length})
          </h3>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>
            Configure topic taxonomies for knowledge base articles and ticket routing
          </p>
        </div>

        <Button type="button" variant="primary" onClick={onOpenCreateCategory}>
          <i className="fas fa-plus" style={{ marginRight: 6 }} />
          Create Category
        </Button>
      </div>

      {/* Grid of Categories */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: 16,
      }}>
        {filteredCategories.map((cat) => {
          const isActive = cat.status === 'Active';
          return (
            <div
              key={cat.id}
              style={{
                background: '#ffffff',
                borderRadius: 14,
                border: '1px solid #e2e8f0',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      background: `${cat.color}15`,
                      color: cat.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 16,
                    }}>
                      <i className={`fas ${cat.icon}`} />
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#0f172a' }}>
                        {cat.name}
                      </h4>
                      <span style={{ fontSize: 11, color: '#94a3b8' }}>/{cat.slug}</span>
                    </div>
                  </div>

                  <span style={{
                    fontSize: 11,
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: 10,
                    background: isActive ? '#dcfce7' : '#f1f5f9',
                    color: isActive ? '#15803d' : '#64748b',
                  }}>
                    {cat.status}
                  </span>
                </div>

                <p style={{ margin: '0 0 16px', fontSize: 13, color: '#64748b', lineHeight: 1.5 }}>
                  {cat.description}
                </p>
              </div>

              <div style={{
                paddingTop: 14,
                borderTop: '1px solid #f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <div style={{ display: 'flex', gap: 10, fontSize: 12, color: '#475569' }}>
                  <span><strong>{cat.articleCount}</strong> articles</span>
                  <span>•</span>
                  <span><strong>{cat.ticketCount}</strong> tickets</span>
                </div>

                <div style={{ display: 'flex', gap: 6 }}>
                  <button
                    type="button"
                    onClick={() => onUpdateCategoryStatus(cat.id, isActive ? 'Archived' : 'Active')}
                    style={{
                      background: '#f8fafc',
                      border: '1px solid #cbd5e1',
                      borderRadius: 6,
                      padding: '4px 8px',
                      fontSize: 11,
                      fontWeight: 600,
                      color: '#475569',
                      cursor: 'pointer',
                    }}
                  >
                    {isActive ? 'Archive' : 'Activate'}
                  </button>

                  <button
                    type="button"
                    onClick={() => onDeleteCategory(cat.id)}
                    style={{
                      background: '#fef2f2',
                      border: '1px solid #fecaca',
                      borderRadius: 6,
                      padding: '4px 8px',
                      fontSize: 11,
                      color: '#dc2626',
                      cursor: 'pointer',
                    }}
                    title="Delete Category"
                  >
                    <i className="fas fa-trash-alt" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
