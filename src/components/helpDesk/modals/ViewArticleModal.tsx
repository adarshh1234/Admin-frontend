import { Button } from '../../common/Button';
import type { SupportArticle } from '../../../types/helpDesk';

interface ViewArticleModalProps {
  isOpen: boolean;
  article: SupportArticle | null;
  onClose: () => void;
  onEdit: (article: SupportArticle) => void;
}

export function ViewArticleModal({
  isOpen,
  article,
  onClose,
  onEdit,
}: ViewArticleModalProps) {
  if (!isOpen || !article) return null;

  return (
    <div className="modal-overlay" style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: 16,
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: 16,
        width: '100%',
        maxWidth: 720,
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
      }}>
        {/* Header */}
        <div style={{
          padding: '24px',
          borderBottom: '1px solid #e2e8f0',
          background: '#f8fafc',
          position: 'relative',
        }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              position: 'absolute',
              top: 18,
              right: 18,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#94a3b8',
              fontSize: 18,
            }}
          >
            <i className="fas fa-times" />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span style={{
              background: '#e0f2fe',
              color: '#0369a1',
              padding: '3px 8px',
              borderRadius: 6,
              fontSize: 11,
              fontWeight: 700,
            }}>
              {article.categoryName}
            </span>
            <span style={{
              background: article.status === 'Published' ? '#dcfce7' : '#fef3c7',
              color: article.status === 'Published' ? '#15803d' : '#b45309',
              padding: '3px 8px',
              borderRadius: 6,
              fontSize: 11,
              fontWeight: 700,
            }}>
              {article.status}
            </span>
          </div>

          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#0f172a', lineHeight: 1.3 }}>
            {article.title}
          </h2>

          <div style={{ fontSize: 12, color: '#64748b', marginTop: 8 }}>
            By <strong>{article.author}</strong> • Updated on {article.updatedDate} • 👁️ {article.views} views • 👍 {article.helpfulCount} helpful
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: 24 }}>
          <div style={{
            background: '#f0f9ff',
            border: '1px solid #bae6fd',
            borderRadius: 10,
            padding: '12px 16px',
            marginBottom: 20,
            fontSize: 13,
            color: '#0369a1',
            lineHeight: 1.4,
          }}>
            <strong>Summary:</strong> {article.summary}
          </div>

          <div style={{
            fontSize: 14,
            color: '#334155',
            lineHeight: 1.7,
            whiteSpace: 'pre-wrap',
            fontFamily: 'inherit',
          }}>
            {article.content}
          </div>

          {article.tags && article.tags.length > 0 && (
            <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid #e2e8f0', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 12, color: '#64748b', alignSelf: 'center', marginRight: 4 }}>Tags:</span>
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    background: '#f1f5f9',
                    color: '#475569',
                    padding: '2px 8px',
                    borderRadius: 12,
                    fontSize: 11,
                    fontWeight: 600,
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
            <Button type="button" variant="secondary" onClick={onClose}>
              Close
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={() => {
                onClose();
                onEdit(article);
              }}
            >
              <i className="fas fa-edit" style={{ marginRight: 6 }} />
              Edit Article
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
