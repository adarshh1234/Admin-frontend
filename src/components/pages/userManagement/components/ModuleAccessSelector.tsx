import React, { useState, useMemo } from 'react';
import { ALL_MODULES } from '../../../../data/modulesData';
import type { ModuleItem } from '../../../../types/module';
import { Input } from '../../../common/Input';
import { Button } from '../../../common/Button';

interface ModuleAccessSelectorProps {
  selectedModuleIds: number[];
  onChange: (newIds: number[]) => void;
  isSuperAdmin: boolean;
}

export const ModuleAccessSelector: React.FC<ModuleAccessSelectorProps> = ({
  selectedModuleIds,
  onChange,
  isSuperAdmin,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Available modules that can be assigned to Staff
  // Module 53 (Admin Console) and Module 9 (User Management) cannot be assigned to Staff accounts
  const assignableModules = useMemo(() => {
    return ALL_MODULES.filter((m) => {
      if (m.id === 53) return false; // Admin Console is restricted
      if (m.id === 9 && !isSuperAdmin) return false; // Only Super Admin could manage user admin
      return true;
    });
  }, [isSuperAdmin]);

  // Categories present in assignable modules
  const categories = useMemo(() => {
    const set = new Set(assignableModules.map((m) => m.category));
    return ['all', ...Array.from(set)];
  }, [assignableModules]);

  // Filtered modules by search term and category
  const filteredModules = useMemo(() => {
    return assignableModules.filter((m) => {
      const matchesSearch =
        m.name.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
        m.category.toLowerCase().includes(searchTerm.toLowerCase().trim());
      const matchesCategory = categoryFilter === 'all' || m.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [assignableModules, searchTerm, categoryFilter]);

  const handleToggleModule = (id: number) => {
    if (selectedModuleIds.includes(id)) {
      onChange(selectedModuleIds.filter((item) => item !== id));
    } else {
      onChange([...selectedModuleIds, id]);
    }
  };

  const handleSelectAll = () => {
    // Select all assignable modules available to this administrator
    const allIds = assignableModules.map((m) => m.id);
    onChange(allIds);
  };

  const handleClearSelection = () => {
    onChange([]);
  };

  return (
    <div
      style={{
        marginTop: '18px',
        padding: '16px 18px',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        background: '#f8fafc',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '26px',
                height: '26px',
                borderRadius: '6px',
                background: '#eff6ff',
                color: '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '13px',
              }}
            >
              <i className="fas fa-cubes" />
            </div>
            <h4 style={{ margin: 0, fontSize: '14.5px', fontWeight: 700, color: '#0f172a' }}>
              Module Access
            </h4>
          </div>
          <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#64748b', maxWidth: '440px' }}>
            Select the application modules this staff member is permitted to access. Unassigned modules will be hidden from their sidebar and access will be blocked.
          </p>
        </div>

        {/* Selected count pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span
            style={{
              fontSize: '12px',
              fontWeight: 700,
              padding: '3px 10px',
              borderRadius: '20px',
              background: selectedModuleIds.length > 0 ? '#dbeafe' : '#e2e8f0',
              color: selectedModuleIds.length > 0 ? '#1d4ed8' : '#64748b',
              border: selectedModuleIds.length > 0 ? '1px solid #bfdbfe' : '1px solid #cbd5e1',
            }}
          >
            {selectedModuleIds.length} of {assignableModules.length} selected
          </span>
        </div>
      </div>

      {/* Toolbar: Search, Select All, Clear Selection */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '10px',
          marginTop: '12px',
          marginBottom: '10px',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ position: 'relative', flex: '1 1 200px', maxWidth: '280px' }}>
          <Input
            type="text"
            placeholder="Search modules..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              paddingLeft: '32px',
              paddingTop: '6px',
              paddingBottom: '6px',
              fontSize: '12.5px',
              width: '100%',
              boxSizing: 'border-box',
              height: '32px',
            }}
          />
          <i
            className="fas fa-search"
            style={{
              position: 'absolute',
              left: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#94a3b8',
              fontSize: '11px',
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleSelectAll}
            style={{ fontSize: '11.5px', padding: '4px 10px', height: '30px' }}
          >
            <i className="fas fa-check-double" style={{ marginRight: '4px' }} /> Select All
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleClearSelection}
            style={{ fontSize: '11.5px', padding: '4px 10px', height: '30px', color: '#64748b' }}
          >
            <i className="fas fa-times" style={{ marginRight: '4px' }} /> Clear Selection
          </Button>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', paddingBottom: '6px', marginBottom: '8px' }}>
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategoryFilter(cat)}
            style={{
              background: categoryFilter === cat ? '#0f172a' : '#ffffff',
              color: categoryFilter === cat ? '#ffffff' : '#475569',
              border: categoryFilter === cat ? '1px solid #0f172a' : '1px solid #cbd5e1',
              padding: '2px 8px',
              borderRadius: '6px',
              fontSize: '11px',
              fontWeight: categoryFilter === cat ? 700 : 500,
              cursor: 'pointer',
              textTransform: 'capitalize',
              whiteSpace: 'nowrap',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Checkbox Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: '8px',
          maxHeight: '230px',
          overflowY: 'auto',
          padding: '4px',
          background: '#ffffff',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
        }}
      >
        {filteredModules.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', padding: '16px', textAlign: 'center', color: '#94a3b8', fontSize: '12px' }}>
            No matching modules found.
          </div>
        ) : (
          filteredModules.map((mod: ModuleItem) => {
            const isChecked = selectedModuleIds.includes(mod.id);
            return (
              <label
                key={mod.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '7px 10px',
                  borderRadius: '6px',
                  border: isChecked ? '1.5px solid #2563eb' : '1px solid #e2e8f0',
                  background: isChecked ? '#eff6ff' : '#ffffff',
                  cursor: 'pointer',
                  userSelect: 'none',
                  transition: 'all 0.12s ease',
                }}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleToggleModule(mod.id)}
                  style={{
                    width: '15px',
                    height: '15px',
                    cursor: 'pointer',
                    accentColor: '#2563eb',
                    margin: 0,
                  }}
                />
                <i
                  className={`fas ${mod.icon || 'fa-circle'}`}
                  style={{
                    fontSize: '12px',
                    color: isChecked ? '#2563eb' : '#64748b',
                    width: '14px',
                    textAlign: 'center',
                    flexShrink: 0,
                  }}
                />
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div
                    style={{
                      fontSize: '12px',
                      fontWeight: isChecked ? 700 : 500,
                      color: isChecked ? '#1e3a8a' : '#1e293b',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                    title={mod.name}
                  >
                    {mod.name}
                  </div>
                  <div style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'capitalize' }}>
                    {mod.category}
                  </div>
                </div>
              </label>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ModuleAccessSelector;
