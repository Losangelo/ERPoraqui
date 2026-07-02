import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface HelpContextType {
  isOpen: boolean;
  helpFile: string | null;
  helpTitle: string;
  openHelp: (file: string, title: string) => void;
  closeHelp: () => void;
}

const HelpContext = createContext<HelpContextType | undefined>(undefined);

export function HelpProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [helpFile, setHelpFile] = useState<string | null>(null);
  const [helpTitle, setHelpTitle] = useState('');

  const openHelp = useCallback((file: string, title: string) => {
    setHelpFile(file);
    setHelpTitle(title);
    setIsOpen(true);
  }, []);

  const closeHelp = useCallback(() => {
    setIsOpen(false);
    setHelpFile(null);
    setHelpTitle('');
  }, []);

  return (
    <HelpContext.Provider value={{ isOpen, helpFile, helpTitle, openHelp, closeHelp }}>
      {children}
    </HelpContext.Provider>
  );
}

export function useHelp() {
  const ctx = useContext(HelpContext);
  if (!ctx) throw new Error('useHelp must be used within HelpProvider');
  return ctx;
}
