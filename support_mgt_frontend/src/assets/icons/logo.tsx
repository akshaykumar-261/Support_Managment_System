import React from "react";

const SupportLogo = ({ width = 80, height = 80 }) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="200" height="200" rx="32" fill="white" />

      {/* Headphone arc */}
      <path
        d="M52 108 Q52 60 100 60 Q148 60 148 108"
        fill="none"
        stroke="#6d28d9"
        strokeWidth="12"
        strokeLinecap="round"
      />

      {/* Left ear cup */}
      <rect x="36" y="104" width="28" height="46" rx="13" fill="#7c3aed" />

      {/* Left ear cup inner */}
      <rect x="39" y="108" width="22" height="38" rx="10" fill="#6d28d9" />

      {/* Right ear cup */}
      <rect x="136" y="104" width="28" height="46" rx="13" fill="#7c3aed" />

      {/* Right ear cup inner */}
      <rect x="139" y="108" width="22" height="38" rx="10" fill="#6d28d9" />

      {/* Mic arm */}
      <path
        d="M50 147 Q50 168 68 172"
        fill="none"
        stroke="#7c3aed"
        strokeWidth="5"
        strokeLinecap="round"
      />

      {/* Mic tip */}
      <rect x="65" y="167" width="20" height="11" rx="5.5" fill="#6d28d9" />

      {/* Highlight dots */}
      <circle cx="47" cy="118" r="5" fill="#a78bfa" opacity="0.45" />

      <circle cx="153" cy="118" r="5" fill="#a78bfa" opacity="0.45" />
    </svg>
  );
};

export default SupportLogo;
