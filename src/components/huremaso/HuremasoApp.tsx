import React, { Suspense, useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../common/Button';
import { Loader } from '../common/Loader';
import { ModuleDetailPage } from '../pages/ModuleDetailPage';
import { ALL_MODULES } from '../../data/modulesData';
import { App as HuremasoCoreApp } from '@huremaso/App';
import '../../styles/huremaso-scoped.css';

interface HuremasoAppProps {
  onNavigateDashboard?: () => void;
}

export const HuremasoApp: React.FC<HuremasoAppProps> = ({ onNavigateDashboard }) => {
  const { user, isAdmin, isSuperAdmin, isStaff } = useAuth();
  const [showModuleSettings, setShowModuleSettings] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Sync session authentication token with Huremaso demo auth
  useEffect(() => {
    localStorage.setItem('hr_demo_auth', 'true');
    if (user?.role) {
      localStorage.setItem('huremaso_active_role', user.role);
    }
  }, [user]);

  // Authorization validation: Super Admin & Admin have full access.
  // If staff member lacks permission, show safe restricted message.
  const hasAccess = isSuperAdmin || isAdmin || (user?.role && ['HR', 'HR Manager', 'Manager'].includes(user.role));

  if (!hasAccess && isStaff) {
    return (
      <div style={{ padding: '60px 20px', textAlign: 'center', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
        <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: '#fee2e2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', margin: '0 auto 16px' }}>
          <i className="fas fa-lock" />
        </div>
        <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: '0 0 8px' }}>
          Restricted Module Access
        </h2>
        <p style={{ fontSize: '14px', color: '#64748b', maxWidth: '440px', margin: '0 auto 20px' }}>
          The Huremaso HRMS Suite requires Administrator or Super Administrator permissions. Please contact your system administrator for access.
        </p>
        {onNavigateDashboard && (
          <Button variant="primary" onClick={onNavigateDashboard}>
            <i className="fas fa-arrow-left" style={{ marginRight: '6px' }} /> Return to Dashboard
          </Button>
        )}
      </div>
    );
  }

  // Find module metadata for settings view
  const huremasoModuleMeta = ALL_MODULES.find((m) => m.id === 11) || {
    id: 11,
    name: 'Huremaso',
    category: 'people',
    icon: 'fa-user-tie',
  };

  return (
    <div className={`huremaso-integration-wrapper ${isFullscreen ? 'fullscreen-mode' : ''}`} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Top ERP Context Header & Control Bar */}
      <div
        className="huremaso-control-bar"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          padding: '12px 18px',
          background: '#ffffff',
          borderRadius: '14px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #002222 0%, #004848 50%, #007878 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              boxShadow: '0 4px 12px rgba(0, 72, 72, 0.25)',
            }}
          >
            <i className="fas fa-user-tie" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>Huremaso HRMS Suite</span>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#006666',
                  background: 'rgba(0, 102, 102, 0.08)',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  border: '1px solid rgba(0, 102, 102, 0.2)',
                }}
              >
                ● Integrated Module
              </span>
            </div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>
              LETGETIN ERP Enterprise · Human Resource Management System & AI Automation
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              const url = import.meta.env.VITE_HUREMASO_URL || 'http://localhost:5173';
              window.open(url, '_blank', 'noopener,noreferrer');
            }}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <i className="fas fa-external-link-alt" />
            <span>Launch Standalone App</span>
          </Button>
        </div>
      </div>

      {/* Standalone Launch Action Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #002222 0%, #004848 50%, #007878 100%)',
          color: '#ffffff',
          borderRadius: '16px',
          padding: '24px 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          boxShadow: '0 8px 24px rgba(0, 72, 72, 0.25)',
        }}
      >
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 6px 0', color: '#ffffff' }}>
            Huremaso Standalone Application
          </h3>
          <p style={{ fontSize: '13.5px', margin: 0, opacity: 0.9, color: '#e0f2f1', maxWidth: '600px' }}>
            The complete Huremaso HRMS Suite runs in its own dedicated standalone browser tab with its full header, sidebar, dashboard, AI, notes, calendar, recruitment, and payroll features.
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => {
            const url = import.meta.env.VITE_HUREMASO_URL || 'http://localhost:5173';
            window.open(url, '_blank', 'noopener,noreferrer');
          }}
          style={{
            background: '#ffffff',
            color: '#004848',
            fontWeight: 700,
            padding: '10px 20px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          }}
        >
          <i className="fas fa-external-link-alt" />
          <span>Open in New Tab</span>
        </Button>
      </div>

      {/* Module Configuration & Details Form */}
      <div style={{ background: '#ffffff', borderRadius: '16px', padding: '16px', border: '1px solid #e2e8f0' }}>
        <ModuleDetailPage module={huremasoModuleMeta} />
      </div>
    </div>
  );
};

export default HuremasoApp;
