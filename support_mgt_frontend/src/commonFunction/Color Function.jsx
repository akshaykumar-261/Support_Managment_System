const colorMap = {
  high: {
    bg: "#FEE2E2",
    text: "#DC2626",
  },

  urgent: {
    bg: "#FEE2E2",
    text: "#DC2626",
  },

  medium: {
    bg: "#FFEDD5",
    text: "#EA580C",
  },

  low: {
    bg: "#DCFCE7",
    text: "#16A34A",
  },

  open: {
    bg: "#EFF6FF",
    text: "#2563EB",
  },

  in_progress: {
    bg: "#FFFAF0",
    text: "#B45309",
  },

  closed: {
    bg: "#F0FDF4",
    text: "#15803D",
  },
};
export const getColor = (value = "") => {
  return (
    colorMap[value.toLocaleLowerCase()] || {
      bg: "#F3F4F6",
      text: "#6B7280",
    }
  );
};
