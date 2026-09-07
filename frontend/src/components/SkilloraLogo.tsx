interface Props {
  size?: number;
  className?: string;
}

export default function SkilloraLogo({ size = 40, className = "" }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="sGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f87171" />
          <stop offset="100%" stopColor="#dc2626" />
        </linearGradient>
        <radialGradient id="bgGrad" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#2d0000" />
          <stop offset="100%" stopColor="#0f0000" />
        </radialGradient>
      </defs>

      {/* Background circle */}
      <circle cx="100" cy="100" r="97" fill="url(#bgGrad)" stroke="#dc2626" strokeWidth="2.5" />

      {/* Inner subtle ring */}
      <circle cx="100" cy="100" r="86" fill="none" stroke="#dc2626" strokeWidth="0.6" opacity="0.3" />

      {/* Laurel wreath — left */}
      <g fill="#dc2626" opacity="0.85">
        <ellipse cx="28"  cy="100" rx="9" ry="4.5" transform="rotate(-10 28 100)" />
        <ellipse cx="34"  cy="80"  rx="9" ry="4.5" transform="rotate(-30 34 80)"  />
        <ellipse cx="46"  cy="63"  rx="9" ry="4.5" transform="rotate(-50 46 63)"  />
        <ellipse cx="62"  cy="50"  rx="9" ry="4.5" transform="rotate(-70 62 50)"  />
        <ellipse cx="80"  cy="41"  rx="9" ry="4.5" transform="rotate(-85 80 41)"  />
        <ellipse cx="100" cy="37"  rx="9" ry="4.5" transform="rotate(-100 100 37)"/>
        <ellipse cx="34"  cy="120" rx="9" ry="4.5" transform="rotate(10 34 120)"  />
        <ellipse cx="44"  cy="138" rx="9" ry="4.5" transform="rotate(30 44 138)"  />
        <ellipse cx="58"  cy="152" rx="9" ry="4.5" transform="rotate(50 58 152)"  />
        <ellipse cx="76"  cy="161" rx="9" ry="4.5" transform="rotate(70 76 161)"  />
        <ellipse cx="96"  cy="165" rx="9" ry="4.5" transform="rotate(85 96 165)"  />
      </g>

      {/* Laurel wreath — right */}
      <g fill="#dc2626" opacity="0.85">
        <ellipse cx="172" cy="100" rx="9" ry="4.5" transform="rotate(10 172 100)"  />
        <ellipse cx="166" cy="80"  rx="9" ry="4.5" transform="rotate(30 166 80)"   />
        <ellipse cx="154" cy="63"  rx="9" ry="4.5" transform="rotate(50 154 63)"   />
        <ellipse cx="138" cy="50"  rx="9" ry="4.5" transform="rotate(70 138 50)"   />
        <ellipse cx="120" cy="41"  rx="9" ry="4.5" transform="rotate(85 120 41)"   />
        <ellipse cx="100" cy="37"  rx="9" ry="4.5" transform="rotate(100 100 37)"  />
        <ellipse cx="166" cy="120" rx="9" ry="4.5" transform="rotate(-10 166 120)" />
        <ellipse cx="156" cy="138" rx="9" ry="4.5" transform="rotate(-30 156 138)" />
        <ellipse cx="142" cy="152" rx="9" ry="4.5" transform="rotate(-50 142 152)" />
        <ellipse cx="124" cy="161" rx="9" ry="4.5" transform="rotate(-70 124 161)" />
        <ellipse cx="104" cy="165" rx="9" ry="4.5" transform="rotate(-85 104 165)" />
      </g>

      {/* Bottom bow */}
      <path d="M82 172 Q100 184 118 172" stroke="#dc2626" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M88 174 Q100 181 112 174" stroke="#dc2626" strokeWidth="1.8" fill="none" strokeLinecap="round" />

      {/* Central S — bold, clean */}
      <text
        x="100"
        y="118"
        textAnchor="middle"
        fontSize="88"
        fontWeight="900"
        fontFamily="Arial Black, Arial, sans-serif"
        fill="url(#sGrad)"
      >
        S
      </text>
    </svg>
  );
}
