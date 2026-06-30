import { create } from 'zustand';

export type Theme = 'light' | 'dark' | 'system';

interface ThemeState {
  theme: Theme;
  resolved: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
}

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme: Theme): 'light' | 'dark' {
  const resolved = theme === 'system' ? getSystemTheme() : theme;
  document.documentElement.classList.toggle('dark', resolved === 'dark');
  return resolved;
}

const saved = (typeof window !== 'undefined' ? localStorage.getItem('erporaqui-theme') : null) as Theme | null;
const initial = saved || 'light';
applyTheme(initial);

export const useTheme = create<ThemeState>((set) => ({
  theme: initial,
  resolved: applyTheme(initial),
  setTheme: (theme: Theme) => {
    localStorage.setItem('erporaqui-theme', theme);
    const resolved = applyTheme(theme);
    set({ theme, resolved });
  },
}));

if (typeof window !== 'undefined') {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    const { theme } = useTheme.getState();
    if (theme === 'system') {
      const resolved = applyTheme('system');
      useTheme.setState({ resolved });
    }
  });
}
