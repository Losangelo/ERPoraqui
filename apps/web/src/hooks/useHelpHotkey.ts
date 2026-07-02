import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useHelp } from '@/contexts/HelpContext';
import { routeHelpMap } from '@/components/help-routes';

export function useHelpHotkey() {
  const { openHelp, isOpen, closeHelp } = useHelp();
  const location = useLocation();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'h' || e.key === 'H')) {
        e.preventDefault();
        if (isOpen) {
          closeHelp();
        } else {
          const route = location.pathname;
          const match = routeHelpMap[route];
          if (match) {
            openHelp(match.file, match.title);
          } else {
            openHelp('summary', 'Manual de Treinamento');
          }
        }
      }
      if (e.key === 'Escape' && isOpen) {
        closeHelp();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [location.pathname, isOpen, openHelp, closeHelp]);
}
