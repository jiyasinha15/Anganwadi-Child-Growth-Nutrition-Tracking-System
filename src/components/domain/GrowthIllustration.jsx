// Original illustration: five children of rising height standing on an arched bridge ("setu"),
// with a growth curve and milestone markers above them. Pure SVG, no external assets.
const KIDS = [
  { x: 92, h: 46, body: "#b7cdbd", skin: "#e8c9a6", hair: "#3b2a22" },
  { x: 168, h: 62, body: "#14805f", skin: "#d9ae86", hair: "#2a1d18" },
  { x: 244, h: 80, body: "#e9d3a3", skin: "#e8c9a6", hair: "#4a3328" },
  { x: 320, h: 98, body: "#0b5d46", skin: "#c99a74", hair: "#241a15" },
  { x: 396, h: 118, body: "#8fb6a0", skin: "#e2bb94", hair: "#33241d" },
];
const GROUND = 252;

function Kid({ x, h, body, skin, hair }, i) {
  const headR = 11 + h * 0.035, bodyH = h - headR * 2 - 4, top = GROUND - h;
  return (
    <g key={x} className="ill-kid" style={{ animationDelay: `${0.5 + i * 0.14}s` }}>
      <rect x={x - 10} y={top + headR * 2 + 2} width="20" height={bodyH} rx="9" fill={body} />
      <rect x={x - 11} y={GROUND - 12} width="9" height="12" rx="4" fill="#4a5a52" opacity=".75" />
      <rect x={x + 2} y={GROUND - 12} width="9" height="12" rx="4" fill="#4a5a52" opacity=".75" />
      <circle cx={x} cy={top + headR} r={headR} fill={skin} />
      <path d={`M${x - headR} ${top + headR} a${headR} ${headR} 0 0 1 ${headR * 2} 0 q-${headR} -5 -${headR * 2} 0z`} fill={hair} />
    </g>
  );
}

export default function GrowthIllustration() {
  return (
    <svg className="ill" viewBox="0 0 520 340" role="img" aria-label="Five children of growing height standing on a bridge under a rising growth curve">
      <defs>
        <linearGradient id="ill-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f6ecd7" /><stop offset="1" stopColor="#f7f4ec" stopOpacity="0" /></linearGradient>
        <linearGradient id="ill-hill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#b7cdbd" /><stop offset="1" stopColor="#dfeae2" /></linearGradient>
        <linearGradient id="ill-curve" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#b7cdbd" /><stop offset="1" stopColor="#0b5d46" /></linearGradient>
      </defs>
      <circle cx="430" cy="74" r="60" fill="url(#ill-sky)" />
      <circle cx="430" cy="74" r="26" fill="#e9d3a3" className="ill-sun" />
      <path d="M0 262 C90 214 170 226 250 238 C340 252 430 206 520 236 L520 340 L0 340Z" fill="url(#ill-hill)" opacity=".7" />
      <path d="M0 292 C120 262 220 290 330 276 C410 266 470 280 520 268 L520 340 L0 340Z" fill="#0b5d46" opacity=".1" />
      {/* the bridge */}
      <path d="M36 268 Q260 196 484 268" fill="none" stroke="#0b5d46" strokeWidth="3" opacity=".25" strokeLinecap="round" />
      <rect x="40" y={GROUND} width="440" height="16" rx="8" fill="#0b5d46" />
      <rect x="40" y={GROUND} width="440" height="5" rx="2.5" fill="#14805f" />
      {[110, 190, 270, 350, 430].map((x) => <rect key={x} x={x} y={GROUND + 16} width="6" height="18" rx="3" fill="#0b5d46" opacity=".5" />)}
      {/* growth curve with milestones */}
      <path className="ill-curve" d="M70 214 C150 196 210 170 280 142 S400 88 462 58" fill="none" stroke="url(#ill-curve)" strokeWidth="3.5" strokeLinecap="round" />
      {[[70, 214], [168, 188], [262, 154], [356, 118], [462, 58]].map(([x, y], i) => (
        <g key={x} className="ill-dot" style={{ animationDelay: `${1.1 + i * 0.16}s` }}>
          <circle cx={x} cy={y} r="9" fill="#fffefa" stroke="#0b5d46" strokeWidth="2" /><circle cx={x} cy={y} r="4" fill="#0b5d46" />
        </g>))}
      {KIDS.map(Kid)}
      <g className="ill-leaf" aria-hidden="true">
        <path d="M470 262 q14 -34 36 -40 q-4 30 -36 40z" fill="#14805f" opacity=".85" />
        <path d="M486 270 q-4 -26 -22 -36 q-8 22 22 36z" fill="#b7cdbd" />
      </g>
    </svg>
  );
}
