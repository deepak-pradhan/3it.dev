import { browser } from '$app/environment';

function getInitialTheme(): 'light' | 'dark' {
  if (browser) {
    const stored = localStorage.getItem('theme');
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
  }
  return 'dark';
}

function updateDocument(t: 'light' | 'dark') {
  if (browser) {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(t);
    localStorage.setItem('theme', t);
  }
}

function createThemeStore() {
  const initial = getInitialTheme();
  let theme = $state<'light' | 'dark'>(initial);

  // Apply initial theme
  updateDocument(initial);

  return {
    get current() {
      return theme;
    },
    toggle() {
      theme = theme === 'dark' ? 'light' : 'dark';
      updateDocument(theme);
    },
    set(t: 'light' | 'dark') {
      theme = t;
      updateDocument(theme);
    },
  };
}

export const themeStore = createThemeStore();
