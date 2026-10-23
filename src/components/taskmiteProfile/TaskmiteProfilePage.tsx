import React, { useState, Suspense } from 'react'
import { ToastProvider } from './context/ToastContext'
import { ToastContainer } from './components/common/Toast'
import {
  HomeIcon,
  BriefcaseIcon,
  FunnelIcon,
  WrenchIcon,
  HistoryIcon,
  BellIcon,
  GearIcon,
} from './components/common/Icons'
import Home from './pages/Home'
import PersonalInfo from './pages/PersonalInfo'
import DataPersonalization from './pages/DataPersonalization'
import Security from './pages/Security'
import PeopleSharing from './pages/PeopleSharing'
import PaymentsSubscription from './pages/PaymentsSubscription'
import Help from './pages/Help'

import './styles/taskmite-profile.css'

interface TabItem {
  id: string
  label: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
}

const TABS: TabItem[] = [
  { id: 'home', label: 'Home', icon: HomeIcon },
  { id: 'info', label: 'Personal Info', icon: BriefcaseIcon },
  { id: 'data', label: 'Data & Personalization', icon: FunnelIcon },
  { id: 'security', label: 'Security', icon: WrenchIcon },
  { id: 'people', label: 'People & Sharing', icon: HistoryIcon },
  { id: 'payments', label: 'Payments & Subscription', icon: BellIcon },
  { id: 'help', label: 'Help', icon: GearIcon },
]

function TaskmiteProfileInner() {
  const [activeTab, setActiveTab] = useState<string>('home')

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
  }

  return (
    <div className="taskmite-profile-wrapper">
      {/* Internal Navigation Subnav Bar */}
      <nav className="taskmite-subnav" aria-label="Profile navigation tabs">
        {TABS.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabChange(tab.id)}
              className={`taskmite-subnav-item ${isActive ? 'active' : ''}`}
            >
              <Icon className="taskmite-subnav-icon" />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </nav>

      {/* Subpage Content */}
      <main className="taskmite-page-container">
        {activeTab === 'home' && (
          <Home onNavigateTab={handleTabChange} />
        )}
        {activeTab === 'info' && (
          <PersonalInfo onNavigateTab={handleTabChange} />
        )}
        {activeTab === 'data' && (
          <DataPersonalization onNavigateTab={handleTabChange} />
        )}
        {activeTab === 'security' && (
          <Security onNavigateTab={handleTabChange} />
        )}
        {activeTab === 'people' && (
          <PeopleSharing onNavigateTab={handleTabChange} />
        )}
        {activeTab === 'payments' && (
          <PaymentsSubscription onNavigateTab={handleTabChange} />
        )}
        {activeTab === 'help' && (
          <Help onNavigateTab={handleTabChange} />
        )}
      </main>

      <ToastContainer />
    </div>
  )
}

export function TaskmiteProfilePage() {
  return (
    <ToastProvider>
      <Suspense fallback={<div className="p-12 text-center text-sm font-medium text-slate-500">Loading profile workspace...</div>}>
        <TaskmiteProfileInner />
      </Suspense>
    </ToastProvider>
  )
}

export default TaskmiteProfilePage
