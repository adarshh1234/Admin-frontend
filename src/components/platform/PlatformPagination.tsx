import { Button } from '../common/Button';

interface PlatformPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange?: (limit: number) => void;
}

export function PlatformPagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
}: PlatformPaginationProps) {
  if (totalItems === 0) return null;

  const start = (currentPage - 1) * itemsPerPage + 1;
  const end = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 12,
        padding: '16px 20px',
        borderTop: '1px solid #e9edf4',
        fontSize: 13,
        color: '#64748b',
        background: '#fafcff',
        borderRadius: '0 0 14px 14px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span>
          Showing <strong style={{ color: '#0f172a' }}>{start}</strong> to{' '}
          <strong style={{ color: '#0f172a' }}>{end}</strong> of{' '}
          <strong style={{ color: '#0f172a' }}>{totalItems}</strong> records
        </span>

        {onItemsPerPageChange && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 8 }}>
            <span>Per page:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
              style={{
                border: '1px solid #cbd5e1',
                borderRadius: 6,
                padding: '3px 8px',
                fontSize: 12,
                background: '#ffffff',
                color: '#334155',
                cursor: 'pointer',
              }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: 6 }}>
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          style={{ padding: '4px 10px', fontSize: 12 }}
        >
          <i className="fas fa-chevron-left" style={{ marginRight: 4 }} /> Prev
        </Button>

        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .slice(Math.max(0, currentPage - 3), Math.min(totalPages, currentPage + 2))
          .map((p) => (
            <Button
              key={p}
              variant={p === currentPage ? 'primary' : 'outline'}
              size="sm"
              onClick={() => onPageChange(p)}
              style={{
                padding: '4px 12px',
                fontSize: 12,
                minWidth: 32,
                fontWeight: p === currentPage ? 700 : 500,
              }}
            >
              {p}
            </Button>
          ))}

        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => onPageChange(currentPage + 1)}
          style={{ padding: '4px 10px', fontSize: 12 }}
        >
          Next <i className="fas fa-chevron-right" style={{ marginLeft: 4 }} />
        </Button>
      </div>
    </div>
  );
}
