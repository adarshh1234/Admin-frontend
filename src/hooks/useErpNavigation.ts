import { useCallback, useMemo, useState, useEffect } from 'react';
import { ALL_MODULES, NON_SPECIAL_MODULES, SPECIAL_MODULES } from '../data/modulesData';

export function useErpNavigation(initialModuleId: number = 1) {
  const getInitialModuleId = () => {
    if (typeof window !== 'undefined' && window.location.pathname.startsWith('/huremaso')) {
      return 11;
    }
    return initialModuleId;
  };

  const [activeModuleId, setActiveModuleId] = useState<number>(getInitialModuleId);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const navigateTo = useCallback((id: number) => {
    setActiveModuleId(id);
    if (typeof window !== 'undefined') {
      if (id === 11) {
        if (!window.location.pathname.startsWith('/huremaso')) {
          window.history.pushState({}, '', '/huremaso');
        }
      } else if (window.location.pathname.startsWith('/huremaso')) {
        window.history.pushState({}, '', '/');
      }
    }
  }, []);

  // Listen to browser navigation events (back/forward)
  useEffect(() => {
    const handlePopState = () => {
      if (window.location.pathname.startsWith('/huremaso')) {
        setActiveModuleId(11);
      } else if (window.location.pathname === '/' || window.location.pathname === '') {
        setActiveModuleId((prev) => (prev === 11 ? 1 : prev));
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const filteredNonSpecialModules = useMemo(() => {
    if (!searchQuery.trim()) return NON_SPECIAL_MODULES;
    const q = searchQuery.trim().toLowerCase();
    return NON_SPECIAL_MODULES.filter(
      (m) => m.name.toLowerCase().includes(q) || m.category.toLowerCase().includes(q),
    );
  }, [searchQuery]);

  const activeModule = useMemo(() => {
    return ALL_MODULES.find((m) => m.id === activeModuleId) || ALL_MODULES[0];
  }, [activeModuleId]);

  return {
    activeModuleId,
    activeModule,
    specialModules: SPECIAL_MODULES,
    filteredNonSpecialModules,
    searchQuery,
    setSearchQuery,
    navigateTo,
  };
}
