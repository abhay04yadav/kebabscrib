import type { CSSProperties } from "react";

type IconProps = {
  size?: number;
  stroke?: string;
  width?: number;
  style?: CSSProperties;
};

const base = (size: number, stroke: string, width: number) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke,
  strokeWidth: width,
});

export const HomeIcon = ({ size = 16, stroke = "currentColor", width = 2, style }: IconProps) => (
  <svg {...base(size, stroke, width)} style={style}>
    <path d="M4 11l8-7 8 7" />
    <path d="M6 10v9h12v-9" />
  </svg>
);

export const MenuIcon = ({ size = 16, stroke = "currentColor", width = 2, style }: IconProps) => (
  <svg {...base(size, stroke, width)} style={style}>
    <path d="M6 4v16M6 4c0 3-3 3-3 6s3 3 3 3M18 4v16" />
  </svg>
);

export const CartIcon = ({ size = 20, stroke = "#006244", width = 2, style }: IconProps) => (
  <svg {...base(size, stroke, width)} style={style}>
    <path d="M6 6h15l-1.5 9h-12z" />
    <circle cx="9" cy="20" r="1.5" />
    <circle cx="18" cy="20" r="1.5" />
  </svg>
);

export const ClockIcon = ({ size = 13, stroke = "#006244", width = 2, style }: IconProps) => (
  <svg {...base(size, stroke, width)} style={{ flex: "none", ...style }}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);

export const BurgerIcon = ({ size = 17, stroke = "#006244", width = 2, style }: IconProps) => (
  <svg {...base(size, stroke, width)} style={style}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
);

export const TruckIcon = ({ size = 16, stroke = "currentColor", width = 2, style }: IconProps) => (
  <svg {...base(size, stroke, width)} style={style}>
    <path d="M3 11l2-6h14l2 6M5 11h14v7H5z" />
    <circle cx="8.5" cy="18" r="1.2" />
    <circle cx="15.5" cy="18" r="1.2" />
  </svg>
);

export const ChatIcon = ({ size = 16, stroke = "currentColor", width = 2, style }: IconProps) => (
  <svg {...base(size, stroke, width)} style={style}>
    <path d="M4 5h16v13H7l-3 3z" />
  </svg>
);

export const InstagramIcon = ({ size = 16, stroke = "currentColor", width = 2, style }: IconProps) => (
  <svg {...base(size, stroke, width)} style={style}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17" cy="7" r="1" fill="currentColor" stroke="none" />
  </svg>
);

export const FacebookIcon = ({ size = 15, stroke = "currentColor", width = 2, style }: IconProps) => (
  <svg {...base(size, stroke, width)} style={style}>
    <path d="M15 4h-2a4 4 0 00-4 4v3H7v3h2v6h3v-6h2.5l.5-3H12V8a1 1 0 011-1h2z" />
  </svg>
);

export const GlobeIcon = ({ size = 15, stroke = "currentColor", width = 2, style }: IconProps) => (
  <svg {...base(size, stroke, width)} style={style}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 3a15 15 0 010 18M3 12h18" />
  </svg>
);

export const BagIcon = ({ size = 15, stroke = "currentColor", width = 2, style }: IconProps) => (
  <svg {...base(size, stroke, width)} style={style}>
    <path d="M6 8h12l-1 12H7z" />
    <path d="M9 8a3 3 0 016 0" />
  </svg>
);

export const PinIcon = ({ size = 14, stroke = "currentColor", width = 2, style }: IconProps) => (
  <svg {...base(size, stroke, width)} style={style}>
    <path d="M12 21s7-6.5 7-11a7 7 0 10-14 0c0 4.5 7 11 7 11z" />
    <circle cx="12" cy="10" r="2.5" />
  </svg>
);

export const SearchIcon = ({ size = 16, stroke = "rgba(0,98,68,.6)", width = 2, style }: IconProps) => (
  <svg {...base(size, stroke, width)} style={style}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="M16 16l4.5 4.5" />
  </svg>
);

export const CloseIcon = ({ size = 16, stroke = "#FFFFFF", width = 2.5, style }: IconProps) => (
  <svg {...base(size, stroke, width)} style={style}>
    <path d="M5 5l14 14M19 5L5 19" />
  </svg>
);

export const ChevronLeft = ({ size = 18, stroke = "#006244", width = 2, style }: IconProps) => (
  <svg {...base(size, stroke, width)} style={style}>
    <path d="M15 5l-7 7 7 7" />
  </svg>
);

export const ChevronRight = ({ size = 18, stroke = "#006244", width = 2, style }: IconProps) => (
  <svg {...base(size, stroke, width)} style={style}>
    <path d="M9 5l7 7-7 7" />
  </svg>
);

export const CheckIcon = ({ size = 13, stroke = "#FFFFFF", width = 3, style }: IconProps) => (
  <svg {...base(size, stroke, width)} style={style}>
    <path d="M5 13l4 4L19 6" />
  </svg>
);

export const SendIcon = ({ size = 18, stroke = "#242424", width = 2, style }: IconProps) => (
  <svg {...base(size, stroke, width)} style={style}>
    <path d="M4 12h15M13 6l6 6-6 6" />
  </svg>
);

export const SoundOnIcon = ({ size = 16, stroke = "#006244", width = 2, style }: IconProps) => (
  <svg {...base(size, stroke, width)} style={style}>
    <path d="M4 9h4l5-4v14l-5-4H4z" />
    <path d="M17 8a5 5 0 010 8" />
    <path d="M20 5.5a9 9 0 010 13" />
  </svg>
);

export const SoundOffIcon = ({ size = 16, stroke = "#006244", width = 2, style }: IconProps) => (
  <svg {...base(size, stroke, width)} style={style}>
    <path d="M4 9h4l5-4v14l-5-4H4z" />
    <path d="M16 9l5 6M21 9l-5 6" />
  </svg>
);

export const WhatsAppIcon = ({ size = 17, style }: { size?: number; style?: CSSProperties }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="#25D366" style={{ flex: "none", ...style }}>
    <path d="M12.04 2C6.6 2 2.2 6.4 2.2 11.84c0 1.74.46 3.44 1.32 4.94L2 22l5.36-1.4a9.85 9.85 0 004.68 1.19h.01c5.43 0 9.84-4.4 9.84-9.84C21.89 6.4 17.48 2 12.04 2zm5.76 14.07c-.24.68-1.42 1.3-1.96 1.34-.5.05-1.14.07-1.84-.11-.42-.13-.97-.31-1.67-.61-2.94-1.27-4.86-4.23-5-4.43-.15-.2-1.2-1.59-1.2-3.03 0-1.44.76-2.15 1.03-2.44.27-.3.59-.37.78-.37h.56c.18 0 .42-.07.66.5.24.59.83 2.03.9 2.18.08.15.13.32.02.51-.1.2-.15.32-.3.49-.15.17-.31.38-.45.51-.15.15-.3.31-.13.61.17.29.76 1.25 1.63 2.03 1.12 1 2.06 1.3 2.36 1.45.29.15.46.13.63-.08.17-.2.73-.85.92-1.14.2-.29.39-.24.66-.15.27.1 1.7.8 1.99.95.29.15.49.22.56.34.07.13.07.71-.17 1.4z" />
  </svg>
);

export const GoogleIcon = ({ size = 22, style }: { size?: number; style?: CSSProperties }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" style={{ flex: "none", ...style }}>
    <path fill="#4285F4" d="M45.1 24.5c0-1.6-.1-2.7-.4-4H24v7.3h12.1c-.2 2-1.6 5-4.5 7l-.1.3 6.5 5 .5.1c4.1-3.8 6.6-9.4 6.6-15.7z" />
    <path fill="#34A853" d="M24 46c5.9 0 10.9-2 14.5-5.3l-6.9-5.4c-1.9 1.3-4.4 2.2-7.6 2.2-5.8 0-10.7-3.8-12.5-9.1l-.3.1-6.7 5.2-.1.3C7.9 41 15.3 46 24 46z" />
    <path fill="#FBBC05" d="M11.5 28.4c-.5-1.4-.7-2.9-.7-4.4s.3-3 .7-4.4v-.3l-6.8-5.3-.2.1A22 22 0 002 24c0 3.5.9 6.9 2.5 9.9l7-5.5z" />
    <path fill="#EA4335" d="M24 9.5c4.1 0 6.9 1.8 8.5 3.3l6.2-6C34.9 3.4 29.9 1 24 1 15.3 1 7.9 6 4.5 14.1l7 5.5C13.3 14.3 18.2 9.5 24 9.5z" />
  </svg>
);

export const TrashIcon = ({ size = 15, stroke = "rgba(0,98,68,.6)", width = 2, style }: IconProps) => (
  <svg {...base(size, stroke, width)} style={style}>
    <path d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13" />
  </svg>
);

/** The Crib Bot mascot — a chewing robot. */
export const CribBotMascot = ({ size = 46 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 68"
    fill="none"
    style={{ animation: "kcBob 2.8s ease-in-out infinite", overflow: "visible" }}
    aria-hidden="true"
  >
    <path d="M32 12V6" stroke="#FDF6EE" strokeWidth="3" strokeLinecap="round" />
    <circle cx="32" cy="4.5" r="3.4" fill="#F4CF4B" style={{ animation: "kcAntenna 1.8s ease-in-out infinite" }} />
    <rect x="3" y="26" width="6" height="14" rx="3" fill="#FDF6EE" />
    <rect x="55" y="26" width="6" height="14" rx="3" fill="#FDF6EE" />
    <rect x="9" y="12" width="46" height="41" rx="16" fill="#FDF6EE" />
    <rect x="15" y="19" width="34" height="20" rx="10" fill="#006244" />
    <circle cx="25" cy="29" r="3.6" fill="#FDF6EE" />
    <circle cx="39" cy="29" r="3.6" fill="#FDF6EE" />
    <ellipse cx="16" cy="44" rx="4" ry="2.6" fill="#F7A890" />
    <ellipse cx="48" cy="44" rx="4" ry="2.6" fill="#F7A890" />
    <path
      d="M27 45q5 5 10 0"
      stroke="#006244"
      strokeWidth="2.6"
      strokeLinecap="round"
      style={{ animation: "kcChew 1.1s ease-in-out infinite", transformOrigin: "32px 45px" }}
    />
    <g style={{ animation: "kcNom 1.1s ease-in-out infinite", transformOrigin: "48px 52px" }}>
      <path d="M40 66L48 38L56 66Z" fill="#E9C489" />
      <path d="M43.4 54L48 38L52.6 54Z" fill="#9B343C" />
      <path d="M42 58h12" stroke="#7CA34A" strokeWidth="3" strokeLinecap="round" />
    </g>
  </svg>
);
