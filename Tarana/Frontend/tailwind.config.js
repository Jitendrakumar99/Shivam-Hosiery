export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'trana-primary': 'var(--trana-primary)',
        'trana-dark': 'var(--trana-dark)',
        'trana-middle': 'var(--trana-middle)',
        'trana-light': 'var(--trana-light)',
        'text-primary': 'var(--text-primary)',
        'neutral-bg': 'var(--neutral-bg)',
        'section-divider': 'var(--section-divider)',
        'action-orange': 'var(--action-orange)',
        'page-bg': 'var(--page-bg)',
        'header-bg': 'var(--header-bg)',
        'page-header-bg': 'var(--page-header-bg)',
        'card-bg': 'var(--card-bg)',
        'section-bg': 'var(--section-bg)',
        'footer-bg': 'var(--footer-bg)',
        'dropdown-bg': 'var(--dropdown-bg)',
      },
    },
  },
  plugins: [],
}
