import React from "react";
import Svg, { Path } from "react-native-svg";

// Props: size (number), variant ("light"|"dark")
export default function NestupLogo({ size = 48, variant = "light" }) {
  // Colors based on variant (light/dark)
  const teal = "#1a6b5a";
  const ochre = "#d97b3a";
  const cream = "#f5f4f0";

  // Simple home/roof + up-arrow as logomark; adjust SVG as per visual kit later.
  // For now, brand color fill and simple N/arrow motif.
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      {/* House base - brand teal */}
      <Path
        d="M8 24L24 10L40 24"
        stroke={teal}
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Door - accent ochre */}
      <Path
        d="M20 34v-7a4 4 0 0 1 8 0v7"
        stroke={ochre}
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Up arrow */}
      <Path
        d="M24 18v8"
        stroke={variant === "dark" ? cream : teal}
        strokeWidth={2.5}
        strokeLinecap="round"
      />
      <Path
        d="M22 20l2-2 2 2"
        stroke={variant === "dark" ? cream : teal}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
