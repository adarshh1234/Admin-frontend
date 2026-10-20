import React from 'react';
import type { TaskTagsCardProps } from './types';

export const TaskTagsCard: React.FC<TaskTagsCardProps> = ({
  attachedTags,
  isAddingTag,
  newTagName,
  onNewTagNameChange,
  onCreateAndAddTag,
  onRemoveTag,
}) => {
  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: 8,
        border: '1px solid #e2e8f0',
        padding: 16,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <h4
          style={{
            margin: 0,
            fontSize: 13,
            fontWeight: 700,
            color: '#64748b',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
          }}
        >
          Project Tags
        </h4>
        <span style={{ fontSize: 11, color: '#94a3b8' }}>{attachedTags.length}</span>
      </div>

      {/* Tag Pills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
        {attachedTags.length === 0 ? (
          <span style={{ fontSize: 12, color: '#94a3b8', fontStyle: 'italic' }}>No tags attached.</span>
        ) : (
          attachedTags.map((tag) => (
            <span
              key={tag.id}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                background: '#f5f3ff',
                color: '#7c3aed',
                border: '1px solid #ddd6fe',
                borderRadius: 14,
                padding: '2px 8px',
                fontSize: 11,
                fontWeight: 600,
              }}
            >
              #{tag.name}
              <button
                type="button"
                onClick={() => onRemoveTag(tag.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#7c3aed',
                  cursor: 'pointer',
                  padding: 0,
                  fontSize: 10,
                }}
                title="Remove tag"
              >
                <i className="fas fa-times" />
              </button>
            </span>
          ))
        )}
      </div>

      {/* Add tag form */}
      <form onSubmit={onCreateAndAddTag} style={{ display: 'flex', gap: 6 }}>
        <input
          className="form-control"
          placeholder="tag-name"
          value={newTagName}
          onChange={(e) => onNewTagNameChange(e.target.value)}
          style={{ fontSize: 12, padding: '4px 8px' }}
        />
        <button
          type="submit"
          className="btn-outline"
          disabled={isAddingTag || !newTagName.trim()}
          style={{ fontSize: 12, padding: '4px 8px' }}
        >
          Add
        </button>
      </form>
    </div>
  );
};
