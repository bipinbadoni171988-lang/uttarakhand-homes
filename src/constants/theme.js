// Extended/modified theme file based on instructions.
// If this file does not exist in your repo, create it. If it does, EXTEND in place, preserving all previous tokens.

const COLORS = {
  // --- Brand Colors ---
  primary: "#1a6b5a",        // Forest Teal
  accent: "#d97b3a",         // Warm Ochre
  background: "#f5f4f0",     // Stone Cream
  text: "#1e1c17",           // Charcoal (Primary)
  textMuted: "#6b6860",      // Muted
  border: "#d2cec7",
  // --- Legacy (for backward compat) ---
  // Add legacy tokens you find here below if app depends on them.
  teal: "#01696f",
  gold: "#f4b400",
  bg: "#f7fff7",
  dark: "#222",
};

const SPACING = {
  xs: 4,
  sm: 8,
  md: 14,
  lg: 24,
  xl: 36,
};

const RADIUS = {
  xs: 4,
  sm: 8,
  md: 14,
  lg: 20,
  pill: 999,
};

const FONTS = {
  // Use fallback for now. Add to project: Outfit, Plus Jakarta Sans
  heading: "Outfit, System",        // TODO: Use custom font after adding assets
  body: "PlusJakartaSans, System",  // TODO: Use custom font after adding assets
  mono: "monospace",
};

export { COLORS, SPACING, RADIUS, FONTS };

// Optionally, if app uses a ThemeProvider/context, export a theme object:
export default {
  colors: COLORS,
  spacing: SPACING,
  radius: RADIUS,
  fonts: FONTS,
};
