export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'trana-primary': '#57A52D', // Brand Primary (Green)
        'trana-dark': '#2D5718',    // Brand Dark (Deep Forest)
        'trana-light': '#E8F5E1',   // Brand Light (Mint Tint)
        'text-primary': '#2C2C2C',  // Text Primary (Soft Charcoal)
        'neutral-bg': '#FFFFFF',    // Neutral Background
        'section-divider': '#F4F4F4', // Section Divider
        'action-orange': '#FF8C00', // Primary CTA (Action Orange)
      },
    },
  },
  plugins: [],
}
