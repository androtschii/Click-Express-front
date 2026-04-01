import React, { useState } from "react";
import { useLanguage } from "../../context/LanguageContext";

interface FleetPageProps {
  theme?: "dark" | "light";
  onBack?: () => void;
}

// ── SVG Truck side-view illustrations ──────────────────────────────────────

function CascadiaSVG({ color, bg }: { color: string; bg: string }) {
  return (
    <svg viewBox="0 0 820 360" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", maxWidth: 820, display: "block" }}>
      {/* Shadow */}
      <ellipse cx="410" cy="332" rx="340" ry="14" fill={color} opacity="0.08"/>
      {/* Fuel tank */}
      <rect x="540" y="220" width="58" height="66" rx="6" fill={color} opacity="0.18" stroke={color} strokeWidth="1.5"/>
      <rect x="548" y="228" width="42" height="50" rx="4" fill={color} opacity="0.1"/>
      {/* Frame rail */}
      <rect x="120" y="278" width="590" height="14" rx="3" fill={color} opacity="0.55"/>
      <rect x="130" y="270" width="570" height="8" rx="2" fill={color} opacity="0.3"/>
      {/* Cab body */}
      <path d="M148 270 L148 138 Q152 106 190 88 L340 72 Q380 68 400 76 L470 96 Q510 110 524 138 L524 270 Z" fill={color} opacity="0.13" stroke={color} strokeWidth="2"/>
      {/* Hood slope */}
      <path d="M148 200 L148 138 Q152 106 190 88 L270 76 L270 200 Z" fill={color} opacity="0.22" stroke={color} strokeWidth="1.5"/>
      {/* Windshield */}
      <path d="M274 88 L340 74 Q370 70 390 76 L440 92 L440 168 L274 168 Z" fill={color} opacity="0.35" stroke={color} strokeWidth="1.5"/>
      {/* Windshield divider */}
      <line x1="357" y1="72" x2="357" y2="168" stroke={bg} strokeWidth="3" opacity="0.7"/>
      {/* Windshield wipers */}
      <line x1="290" y1="164" x2="350" y2="148" stroke={bg} strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
      <line x1="366" y1="145" x2="426" y2="160" stroke={bg} strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
      {/* Door */}
      <rect x="446" y="96" width="70" height="154" rx="3" fill={color} opacity="0.08" stroke={color} strokeWidth="1.5"/>
      {/* Door handle */}
      <rect x="500" y="170" width="14" height="5" rx="2.5" fill={color} opacity="0.7"/>
      {/* Sleeper */}
      <rect x="444" y="84" width="78" height="186" rx="5" fill={color} opacity="0.1" stroke={color} strokeWidth="1.5"/>
      {/* Sleeper window */}
      <rect x="454" y="96" width="28" height="22" rx="3" fill={color} opacity="0.3" stroke={color} strokeWidth="1.2"/>
      {/* Roof fairing */}
      <path d="M176 88 Q200 60 260 52 L460 52 Q500 52 516 78 L524 92 L176 92 Z" fill={color} opacity="0.2" stroke={color} strokeWidth="1.5"/>
      {/* Exhaust stacks */}
      <rect x="524" y="52" width="8" height="80" rx="4" fill={color} opacity="0.6" stroke={color} strokeWidth="1"/>
      <ellipse cx="528" cy="52" rx="5" ry="4" fill={color} opacity="0.5"/>
      {/* Air intake */}
      <rect x="536" y="60" width="6" height="60" rx="3" fill={color} opacity="0.4"/>
      {/* Side mirror */}
      <rect x="137" y="132" width="16" height="26" rx="3" fill={color} opacity="0.6" stroke={color} strokeWidth="1.2"/>
      <line x1="148" y1="140" x2="148" y2="158" stroke={bg} strokeWidth="1.5" opacity="0.4"/>
      {/* Steps */}
      <rect x="153" y="258" width="30" height="6" rx="1" fill={color} opacity="0.5"/>
      <rect x="153" y="248" width="22" height="6" rx="1" fill={color} opacity="0.35"/>
      {/* Headlight assembly */}
      <path d="M150 158 Q148 170 152 185 L170 185 L170 158 Z" fill={color} opacity="0.5" stroke={color} strokeWidth="1.2"/>
      <ellipse cx="163" cy="172" rx="8" ry="10" fill={color} opacity="0.7"/>
      {/* Grill */}
      <path d="M150 186 L150 236 Q152 246 162 248 L210 248 L210 186 Z" fill={color} opacity="0.15" stroke={color} strokeWidth="1.5"/>
      {[196,206,216,226,236].map(y => (
        <line key={y} x1="153" y1={y} x2="209" y2={y} stroke={color} strokeWidth="1.2" opacity="0.35"/>
      ))}
      {/* Front wheel */}
      <circle cx="218" cy="306" r="46" stroke={color} strokeWidth="3" fill="none"/>
      <circle cx="218" cy="306" r="33" stroke={color} strokeWidth="1.5" fill={color} opacity="0.07"/>
      <circle cx="218" cy="306" r="10" fill={color} opacity="0.4"/>
      {[0,45,90,135,180,225,270,315].map(deg => {
        const r = deg * Math.PI / 180;
        return <line key={deg} x1={218+Math.cos(r)*10} y1={306+Math.sin(r)*10} x2={218+Math.cos(r)*33} y2={306+Math.sin(r)*33} stroke={color} strokeWidth="1.5" opacity="0.3"/>;
      })}
      {/* Rear dual wheels */}
      {[620, 648].map(cx => (
        <g key={cx}>
          <circle cx={cx} cy={306} r={42} stroke={color} strokeWidth="3" fill="none"/>
          <circle cx={cx} cy={306} r={30} stroke={color} strokeWidth="1.2" fill={color} opacity="0.06"/>
          <circle cx={cx} cy={306} r={9} fill={color} opacity="0.35"/>
          {[0,60,120,180,240,300].map(deg => {
            const r = deg * Math.PI / 180;
            return <line key={deg} x1={cx+Math.cos(r)*9} y1={306+Math.sin(r)*9} x2={cx+Math.cos(r)*30} y2={306+Math.sin(r)*30} stroke={color} strokeWidth="1.2" opacity="0.25"/>;
          })}
        </g>
      ))}
      {/* Mud flaps */}
      <rect x="590" y="284" width="8" height="38" rx="2" fill={color} opacity="0.4"/>
      {/* Model badge line */}
      <line x1="320" y1="340" x2="560" y2="340" stroke={color} strokeWidth="1" opacity="0.15"/>
    </svg>
  );
}

function CoronadoSVG({ color, bg }: { color: string; bg: string }) {
  return (
    <svg viewBox="0 0 820 360" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", maxWidth: 820, display: "block" }}>
      <ellipse cx="400" cy="332" rx="320" ry="13" fill={color} opacity="0.08"/>
      {/* Frame */}
      <rect x="120" y="278" width="580" height="14" rx="3" fill={color} opacity="0.55"/>
      {/* Classic boxy hood */}
      <rect x="140" y="148" width="140" height="126" rx="4" fill={color} opacity="0.18" stroke={color} strokeWidth="2"/>
      {/* Vertical grill */}
      <rect x="142" y="150" width="136" height="80" rx="2" fill={color} opacity="0.12" stroke={color} strokeWidth="1.5"/>
      {[162,176,190,204,218].map(y => (
        <line key={y} x1="145" y1={y} x2="277" y2={y} stroke={color} strokeWidth="1.5" opacity="0.3"/>
      ))}
      {/* Chrome bumper */}
      <rect x="140" y="248" width="142" height="18" rx="3" fill={color} opacity="0.35" stroke={color} strokeWidth="1.5"/>
      {/* Cab body */}
      <rect x="280" y="82" width="240" height="192" rx="4" fill={color} opacity="0.12" stroke={color} strokeWidth="2"/>
      {/* Windshield - more upright */}
      <rect x="284" y="88" width="180" height="100" rx="3" fill={color} opacity="0.32" stroke={color} strokeWidth="1.5"/>
      <line x1="374" y1="88" x2="374" y2="188" stroke={bg} strokeWidth="3" opacity="0.6"/>
      {/* Door */}
      <rect x="466" y="92" width="50" height="178" rx="3" fill={color} opacity="0.08" stroke={color} strokeWidth="1.5"/>
      {/* Sleeper */}
      <rect x="516" y="82" width="90" height="192" rx="4" fill={color} opacity="0.1" stroke={color} strokeWidth="1.5"/>
      {/* Sleeper window */}
      <rect x="524" y="96" width="34" height="26" rx="3" fill={color} opacity="0.28" stroke={color} strokeWidth="1.2"/>
      {/* Chrome stacks */}
      <rect x="277" y="30" width="9" height="90" rx="4.5" fill={color} opacity="0.7" stroke={color} strokeWidth="1"/>
      <rect x="292" y="38" width="7" height="78" rx="3.5" fill={color} opacity="0.5"/>
      {/* Headlights */}
      <rect x="142" y="148" width="24" height="20" rx="2" fill={color} opacity="0.6" stroke={color} strokeWidth="1.2"/>
      <rect x="142" y="172" width="24" height="14" rx="2" fill={color} opacity="0.4" stroke={color} strokeWidth="1"/>
      {/* Mirror */}
      <rect x="274" y="108" width="14" height="22" rx="3" fill={color} opacity="0.6"/>
      {/* Fuel tank */}
      <rect x="530" y="210" width="52" height="70" rx="6" fill={color} opacity="0.18" stroke={color} strokeWidth="1.5"/>
      {/* Front wheel */}
      <circle cx="214" cy="308" r="46" stroke={color} strokeWidth="3" fill="none"/>
      <circle cx="214" cy="308" r="32" fill={color} opacity="0.06"/>
      <circle cx="214" cy="308" r="10" fill={color} opacity="0.35"/>
      {/* Rear wheels */}
      {[610, 638].map(cx => (
        <g key={cx}>
          <circle cx={cx} cy={308} r={42} stroke={color} strokeWidth="3" fill="none"/>
          <circle cx={cx} cy={308} r={9} fill={color} opacity="0.35"/>
        </g>
      ))}
    </svg>
  );
}

function KenworthSVG({ color, bg }: { color: string; bg: string }) {
  return (
    <svg viewBox="0 0 820 360" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", maxWidth: 820, display: "block" }}>
      <ellipse cx="410" cy="332" rx="330" ry="13" fill={color} opacity="0.08"/>
      <rect x="118" y="278" width="590" height="14" rx="3" fill={color} opacity="0.55"/>
      {/* Hood — T680 aerodynamic */}
      <path d="M148 270 L148 165 Q155 128 185 108 L258 90 L258 270 Z" fill={color} opacity="0.2" stroke={color} strokeWidth="2"/>
      {/* Distinctive K badge area */}
      <path d="M155 190 L155 240 Q158 248 168 250 L210 250 L210 190 Z" fill={color} opacity="0.14" stroke={color} strokeWidth="1.5"/>
      {[200,210,220,230,240].map(y => (
        <line key={y} x1="158" y1={y} x2="209" y2={y} stroke={color} strokeWidth="1.2" opacity="0.3"/>
      ))}
      {/* Cab body */}
      <path d="M155 270 L155 140 Q160 110 190 92 L340 72 L380 72 Q420 74 450 96 L510 120 L510 270 Z" fill={color} opacity="0.11" stroke={color} strokeWidth="2"/>
      {/* Windshield — T680 signature */}
      <path d="M262 90 L336 74 L378 74 Q406 76 426 90 L426 160 L262 160 Z" fill={color} opacity="0.32" stroke={color} strokeWidth="1.5"/>
      <line x1="344" y1="73" x2="344" y2="160" stroke={bg} strokeWidth="3" opacity="0.6"/>
      {/* T680 distinctive roof curve */}
      <path d="M172 90 Q195 56 250 46 L440 46 Q480 48 505 74 L510 88 L172 88 Z" fill={color} opacity="0.18" stroke={color} strokeWidth="1.5"/>
      {/* Sleeper */}
      <rect x="430" y="80" width="78" height="192" rx="4" fill={color} opacity="0.1" stroke={color} strokeWidth="1.5"/>
      <rect x="440" y="94" width="30" height="24" rx="3" fill={color} opacity="0.28" stroke={color} strokeWidth="1.2"/>
      {/* Exhaust stack */}
      <rect x="510" y="44" width="8" height="82" rx="4" fill={color} opacity="0.65" stroke={color} strokeWidth="1"/>
      {/* Headlights — T680 quad LED */}
      <rect x="151" y="158" width="20" height="14" rx="2" fill={color} opacity="0.7" stroke={color} strokeWidth="1"/>
      <rect x="151" y="175" width="20" height="10" rx="2" fill={color} opacity="0.45"/>
      {/* Mirror */}
      <rect x="140" y="128" width="15" height="24" rx="3" fill={color} opacity="0.6"/>
      {/* Fuel tank */}
      <rect x="516" y="212" width="54" height="68" rx="6" fill={color} opacity="0.18" stroke={color} strokeWidth="1.5"/>
      {/* Steps */}
      <rect x="155" y="254" width="28" height="6" rx="1" fill={color} opacity="0.45"/>
      <rect x="155" y="244" width="20" height="6" rx="1" fill={color} opacity="0.3"/>
      {/* Front wheel */}
      <circle cx="218" cy="308" r="46" stroke={color} strokeWidth="3" fill="none"/>
      <circle cx="218" cy="308" r="32" fill={color} opacity="0.07"/>
      <circle cx="218" cy="308" r="10" fill={color} opacity="0.4"/>
      {[0,45,90,135,180,225,270,315].map(deg => {
        const r = deg * Math.PI / 180;
        return <line key={deg} x1={218+Math.cos(r)*10} y1={308+Math.sin(r)*10} x2={218+Math.cos(r)*32} y2={308+Math.sin(r)*32} stroke={color} strokeWidth="1.5" opacity="0.28"/>;
      })}
      {[614, 642].map(cx => (
        <g key={cx}>
          <circle cx={cx} cy={308} r={42} stroke={color} strokeWidth="3" fill="none"/>
          <circle cx={cx} cy={308} r={9} fill={color} opacity="0.35"/>
          {[0,60,120,180,240,300].map(deg => {
            const r2 = deg * Math.PI / 180;
            return <line key={deg} x1={cx+Math.cos(r2)*9} y1={308+Math.sin(r2)*9} x2={cx+Math.cos(r2)*30} y2={308+Math.sin(r2)*30} stroke={color} strokeWidth="1.2" opacity="0.25"/>;
          })}
        </g>
      ))}
    </svg>
  );
}

// ── 3D Isometric trailer illustrations ─────────────────────────────────────

function FlatbedIso({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 700 300" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", maxWidth: 700, display: "block" }}>
      {/* Isometric flatbed deck */}
      {/* Top face */}
      <path d="M80 100 L580 100 L620 130 L80 130 Z" fill={color} opacity="0.25"/>
      {/* Front face */}
      <path d="M80 100 L80 130 L60 160 L60 130 Z" fill={color} opacity="0.45"/>
      {/* Side face */}
      <path d="M80 130 L580 130 L620 160 L80 160 Z" fill={color} opacity="0.15"/>
      {/* Bottom rail */}
      <path d="M60 160 L80 160 L620 160 L640 190 L60 190 Z" fill={color} opacity="0.35"/>
      {/* Cross-members */}
      {[148,216,284,352,420,488,556].map(x => (
        <path key={x} d={`M${x} 100 L${x+30} 130 L${x+30} 160 L${x} 130 Z`} fill={color} opacity="0.12"/>
      ))}
      {/* Stake pockets */}
      {[148,220,290,360,430,500].map(x => (
        <rect key={x} x={x} y="96" width="12" height="8" rx="2" fill={color} opacity="0.5"/>
      ))}
      {/* Rear axle group */}
      <rect x="530" y="184" width="100" height="18" rx="4" fill={color} opacity="0.4"/>
      {[540,560,600,620].map(cx => (
        <ellipse key={cx} cx={cx} cy={226} rx={24} ry={10} stroke={color} strokeWidth="2.5" fill="none"/>
      ))}
      <rect x="520" y="215" width="120" height="18" rx="3" fill={color} opacity="0.25"/>
      {/* Front axle */}
      <rect x="72" y="184" width="80" height="14" rx="4" fill={color} opacity="0.4"/>
      {[82, 102, 122, 142].map(cx => (
        <ellipse key={cx} cx={cx} cy={218} rx={18} ry={8} stroke={color} strokeWidth="2" fill="none"/>
      ))}
      {/* Kingpin */}
      <circle cx="90" cy="138" r="8" fill={color} opacity="0.5"/>
      {/* Dimension arrow: length */}
      <line x1="80" y1="248" x2="620" y2="248" stroke={color} strokeWidth="1" strokeDasharray="5 3" opacity="0.4"/>
      <line x1="80" y1="243" x2="80" y2="253" stroke={color} strokeWidth="2" opacity="0.5"/>
      <line x1="620" y1="243" x2="620" y2="253" stroke={color} strokeWidth="2" opacity="0.5"/>
      <text x="350" y="268" textAnchor="middle" fill={color} opacity="0.7" fontSize="13" fontFamily="'Barlow',sans-serif" fontWeight="700">53'</text>
      {/* Width arrow */}
      <line x1="648" y1="130" x2="648" y2="160" stroke={color} strokeWidth="1" strokeDasharray="4 3" opacity="0.4"/>
      <text x="670" y="150" fill={color} opacity="0.7" fontSize="11" fontFamily="'Barlow',sans-serif" fontWeight="700">102"</text>
    </svg>
  );
}

function StepDeckIso({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 700 320" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", maxWidth: 700, display: "block" }}>
      {/* Upper deck top */}
      <path d="M80 80 L220 80 L260 110 L80 110 Z" fill={color} opacity="0.25"/>
      <path d="M80 80 L80 110 L60 140 L60 110 Z" fill={color} opacity="0.45"/>
      <path d="M80 110 L220 110 L260 140 L80 140 Z" fill={color} opacity="0.15"/>
      {/* Step */}
      <path d="M220 80 L260 110 L260 160 L220 130 Z" fill={color} opacity="0.4"/>
      <path d="M220 110 L260 140 L260 170 L220 140 Z" fill={color} opacity="0.25"/>
      {/* Lower deck top */}
      <path d="M220 130 L580 130 L620 160 L220 160 Z" fill={color} opacity="0.22"/>
      <path d="M220 160 L580 160 L620 190 L220 190 Z" fill={color} opacity="0.12"/>
      {/* Bottom rail */}
      <path d="M60 140 L80 140 L80 190 L220 190 L620 190 L640 220 L60 220 Z" fill={color} opacity="0.35"/>
      {/* Cross-members lower */}
      {[290,360,430,500,560].map(x => (
        <path key={x} d={`M${x} 130 L${x+28} 160 L${x+28} 190 L${x} 160 Z`} fill={color} opacity="0.1"/>
      ))}
      {/* Stake pockets */}
      {[290,360,430,500,560].map(x => (
        <rect key={x} x={x} y="126" width="11" height="7" rx="1.5" fill={color} opacity="0.5"/>
      ))}
      {/* Rear axle */}
      <rect x="530" y="214" width="100" height="16" rx="4" fill={color} opacity="0.35"/>
      {[540,560,600,620].map(cx => (
        <ellipse key={cx} cx={cx} cy={248} rx={22} ry={9} stroke={color} strokeWidth="2.5" fill="none"/>
      ))}
      {/* Front axle */}
      <rect x="68" y="186" width="70" height="12" rx="3" fill={color} opacity="0.35"/>
      {[78,98,118].map(cx => (
        <ellipse key={cx} cx={cx} cy={216} rx={16} ry={7} stroke={color} strokeWidth="2" fill="none"/>
      ))}
      {/* Dimension upper */}
      <text x="150" y="68" textAnchor="middle" fill={color} opacity="0.65" fontSize="12" fontFamily="'Barlow',sans-serif" fontWeight="700">11'</text>
      <text x="400" y="120" textAnchor="middle" fill={color} opacity="0.65" fontSize="12" fontFamily="'Barlow',sans-serif" fontWeight="700">37'</text>
      {/* total length */}
      <line x1="80" y1="270" x2="620" y2="270" stroke={color} strokeWidth="1" strokeDasharray="5 3" opacity="0.35"/>
      <text x="350" y="290" textAnchor="middle" fill={color} opacity="0.65" fontSize="13" fontFamily="'Barlow',sans-serif" fontWeight="700">48'</text>
    </svg>
  );
}

function ConesteogaIso({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 700 340" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", maxWidth: 700, display: "block" }}>
      {/* Main box body - isometric */}
      {/* Top face */}
      <path d="M80 60 L580 60 L620 90 L80 90 Z" fill={color} opacity="0.2"/>
      {/* Front face */}
      <path d="M80 60 L80 230 L60 258 L60 90 Z" fill={color} opacity="0.4"/>
      {/* Side face */}
      <path d="M80 230 L580 230 L620 258 L80 258 Z" fill={color} opacity="0.12"/>
      {/* Back face */}
      <path d="M580 60 L580 230 L620 258 L620 90 Z" fill={color} opacity="0.28"/>
      {/* Tarp vertical rails */}
      {[148,216,284,352,420,488,556].map(x => (
        <line key={x} x1={x} y1="62" x2={x} y2="228" stroke={color} strokeWidth="1.5" opacity="0.22"/>
      ))}
      {/* Sliding tarp panel highlight */}
      <path d="M240 60 L360 60 L400 90 L240 90 Z" fill={color} opacity="0.18"/>
      <path d="M240 60 L240 228 L260 244" stroke={color} strokeWidth="2.5" opacity="0.55" strokeLinecap="round"/>
      <path d="M360 60 L360 228" stroke={color} strokeWidth="2.5" opacity="0.55"/>
      {/* Floor */}
      <path d="M60 258 L80 258 L580 258 L620 258 L640 280 L60 280 Z" fill={color} opacity="0.35"/>
      {/* Rear axle group */}
      <rect x="530" y="274" width="100" height="16" rx="4" fill={color} opacity="0.38"/>
      {[540,562,600,622].map(cx => (
        <ellipse key={cx} cx={cx} cy={308} rx={22} ry={9} stroke={color} strokeWidth="2.5" fill="none"/>
      ))}
      {/* Front axle */}
      <rect x="66" y="270" width="76" height="12" rx="3" fill={color} opacity="0.35"/>
      {[76,96,116,136].map(cx => (
        <ellipse key={cx} cx={cx} cy={300} rx={16} ry={7} stroke={color} strokeWidth="2" fill="none"/>
      ))}
      {/* Height marker */}
      <line x1="648" y1="60" x2="648" y2="258" stroke={color} strokeWidth="1" strokeDasharray="4 3" opacity="0.4"/>
      <text x="666" y="165" fill={color} opacity="0.7" fontSize="11" fontFamily="'Barlow',sans-serif" fontWeight="700">103"</text>
      {/* Length marker */}
      <line x1="80" y1="320" x2="580" y2="320" stroke={color} strokeWidth="1" strokeDasharray="5 3" opacity="0.35"/>
      <text x="330" y="338" textAnchor="middle" fill={color} opacity="0.7" fontSize="13" fontFamily="'Barlow',sans-serif" fontWeight="700">53'</text>
    </svg>
  );
}

function LowboyIso({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 700 300" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", maxWidth: 700, display: "block" }}>
      {/* Gooseneck - isometric */}
      <path d="M80 80 Q100 80 120 110 L160 130 L160 150 L80 150 Z" fill={color} opacity="0.3" stroke={color} strokeWidth="1.5"/>
      {/* Gooseneck side */}
      <path d="M80 80 L80 150 L60 170 L60 100 Q70 80 80 80 Z" fill={color} opacity="0.45"/>
      {/* Main deck — very low */}
      <path d="M160 140 L560 140 L600 168 L160 168 Z" fill={color} opacity="0.22"/>
      <path d="M160 168 L560 168 L600 196 L160 196 Z" fill={color} opacity="0.12"/>
      {/* Rear ramp */}
      <path d="M560 140 L600 168 L640 190 L600 168 Z" fill={color} opacity="0.3" stroke={color} strokeWidth="1.5"/>
      {/* Frame */}
      <path d="M60 170 L80 170 L160 170 L560 170 L600 196 L640 196 L640 212 L60 212 Z" fill={color} opacity="0.35"/>
      {/* Triple axle group */}
      <rect x="490" y="206" width="140" height="14" rx="3" fill={color} opacity="0.35"/>
      {[500,522,564,586].map(cx => (
        <ellipse key={cx} cx={cx} cy={238} rx={20} ry={8} stroke={color} strokeWidth="2.5" fill="none"/>
      ))}
      {[600,622].map(cx => (
        <ellipse key={cx} cx={cx} cy={238} rx={20} ry={8} stroke={color} strokeWidth="2.5" fill="none"/>
      ))}
      {/* Front support */}
      <rect x="66" y="206" width="64" height="12" rx="3" fill={color} opacity="0.35"/>
      {[76,96,116].map(cx => (
        <ellipse key={cx} cx={cx} cy={234} rx={16} ry={7} stroke={color} strokeWidth="2" fill="none"/>
      ))}
      {/* Deck height callout */}
      <line x1="648" y1="140" x2="648" y2="196" stroke={color} strokeWidth="1" strokeDasharray="4 3" opacity="0.4"/>
      <text x="662" y="172" fill={color} opacity="0.7" fontSize="11" fontFamily="'Barlow',sans-serif" fontWeight="700">18"</text>
      {/* RGN text */}
      <text x="340" y="130" textAnchor="middle" fill={color} opacity="0.4" fontSize="22" fontFamily="'Oswald',sans-serif" fontWeight="700" letterSpacing="4">RGN</text>
      {/* Length */}
      <line x1="80" y1="268" x2="600" y2="268" stroke={color} strokeWidth="1" strokeDasharray="5 3" opacity="0.3"/>
      <text x="340" y="286" textAnchor="middle" fill={color} opacity="0.65" fontSize="13" fontFamily="'Barlow',sans-serif" fontWeight="700">48'</text>
    </svg>
  );
}

const TRUCK_SVG_MAP: Record<string, React.FC<{ color: string; bg: string }>> = {
  cascadia: CascadiaSVG,
  coronado: CoronadoSVG,
  kenworth: KenworthSVG,
};

const TRAILER_ISO_MAP: Record<string, React.FC<{ color: string }>> = {
  flatbed:   FlatbedIso,
  stepdeck:  StepDeckIso,
  conestoga: ConesteogaIso,
  lowboy:    LowboyIso,
};

// ── Data ────────────────────────────────────────────────────────────────────

const TRUCKS = [
  {
    id: "cascadia",
    nameEn: "Freightliner Cascadia",
    nameRu: "Freightliner Cascadia",
    year: "2022–2026",
    specs: [
      { labelEn: "MODEL",        labelRu: "МОДЕЛЬ",     value: "Cascadia Evolution" },
      { labelEn: "ENGINE",       labelRu: "ДВИГАТЕЛЬ",  value: "Detroit DD15 — 505 HP" },
      { labelEn: "TRANSMISSION", labelRu: "КПП",        value: "12-Speed Auto (DT12)" },
      { labelEn: "SLEEPER",      labelRu: "КАБИНА",     value: `72" Full-Size Condo` },
      { labelEn: "INVERTER",     labelRu: "ИНВЕРТОР",   value: "3000W" },
      { labelEn: "APU",          labelRu: "APU",        value: "ParkSmart" },
    ],
  },
  {
    id: "coronado",
    nameEn: "Freightliner Coronado",
    nameRu: "Freightliner Coronado",
    year: "2019–2023",
    specs: [
      { labelEn: "MODEL",        labelRu: "МОДЕЛЬ",     value: "Coronado 132 SD" },
      { labelEn: "ENGINE",       labelRu: "ДВИГАТЕЛЬ",  value: "Detroit DD15 — 475 HP" },
      { labelEn: "TRANSMISSION", labelRu: "КПП",        value: "13-Speed Manual" },
      { labelEn: "SLEEPER",      labelRu: "КАБИНА",     value: `72" Full-Size Condo` },
      { labelEn: "INVERTER",     labelRu: "ИНВЕРТОР",   value: "3000W" },
      { labelEn: "APU",          labelRu: "APU",        value: "Espar" },
    ],
  },
  {
    id: "kenworth",
    nameEn: "Kenworth T680",
    nameRu: "Kenworth T680",
    year: "2021–2025",
    specs: [
      { labelEn: "MODEL",        labelRu: "МОДЕЛЬ",     value: "T680 Next Gen" },
      { labelEn: "ENGINE",       labelRu: "ДВИГАТЕЛЬ",  value: "PACCAR MX-13 — 455 HP" },
      { labelEn: "TRANSMISSION", labelRu: "КПП",        value: "12-Speed Auto" },
      { labelEn: "SLEEPER",      labelRu: "КАБИНА",     value: `76" Mid-Roof Condo` },
      { labelEn: "INVERTER",     labelRu: "ИНВЕРТОР",   value: "2000W" },
      { labelEn: "APU",          labelRu: "APU",        value: "Dynasys D3" },
    ],
  },
];

const TRAILERS = [
  {
    id: "flatbed",
    nameEn: "53' Flatbed",
    nameRu: "Платформа 53'",
    isoType: "flatbed",
    specs: [
      { labelEn: "MODEL",    labelRu: "МОДЕЛЬ",    value: "Reitnouer MaxMiser" },
      { labelEn: "YEAR",     labelRu: "ГОД",       value: "2020–2024" },
      { labelEn: "LENGTH",   labelRu: "ДЛИНА",     value: "53'" },
      { labelEn: "WIDTH",    labelRu: "ШИРИНА",    value: `102"` },
      { labelEn: "CAPACITY", labelRu: "ГРУЗОП.",   value: "48,000 lbs" },
      { labelEn: "MATERIAL", labelRu: "МАТЕРИАЛ",  value: "Aluminum / Steel" },
    ],
    descEn: "Standard 53-foot aluminum flatbed. Handles full truckload, oversized, and heavy freight. Tarps, chains and binders available on request.",
    descRu: "Стандартная алюминиевая платформа 53 фута. Полные грузы, негабаритные и тяжёлые перевозки. Брезент, цепи и стяжки по запросу.",
  },
  {
    id: "stepdeck",
    nameEn: "48' Step Deck",
    nameRu: "Степ-дек 48'",
    isoType: "stepdeck",
    specs: [
      { labelEn: "UPPER DECK", labelRu: "ВЕРХ. ДЕКА",  value: "11'" },
      { labelEn: "LOWER DECK", labelRu: "НИЖ. ДЕКА",   value: "37'" },
      { labelEn: "DECK HEIGHT",labelRu: "ВЫСОТА",       value: `11'6"` },
      { labelEn: "WIDTH",      labelRu: "ШИРИНА",       value: `102"` },
      { labelEn: "CAPACITY",   labelRu: "ГРУЗОП.",      value: "46,000 lbs" },
      { labelEn: "AXLES",      labelRu: "ОСИ",          value: "2 + Tag" },
    ],
    descEn: "Two-level trailer for taller cargo exceeding standard flatbed height limits. Perfect for construction equipment and oversized machinery.",
    descRu: "Двухуровневый прицеп для грузов выше стандартной платформы. Идеален для строительной и тяжёлой техники.",
  },
  {
    id: "conestoga",
    nameEn: "53' Conestoga",
    nameRu: "Конестога 53'",
    isoType: "conestoga",
    specs: [
      { labelEn: "MODEL",    labelRu: "МОДЕЛЬ",    value: "Reitnouer Conestoga" },
      { labelEn: "LENGTH",   labelRu: "ДЛИНА",     value: "53'" },
      { labelEn: "WIDTH",    labelRu: "ШИРИНА",    value: `103"` },
      { labelEn: "HEIGHT",   labelRu: "ВЫСОТА",    value: `103" interior` },
      { labelEn: "CAPACITY", labelRu: "ГРУЗОП.",   value: "48,000 lbs" },
      { labelEn: "TARPING",  labelRu: "ТАРПИНГ",   value: "Sliding roll-tarp" },
    ],
    descEn: "Fully retractable sliding tarp system — weather protection with flatbed access. No manual tarping. Saves time at every stop.",
    descRu: "Скользящий брезент с полным ретрактом — защита как у вэна, доступ как у платформы. Ручной тарпинг не нужен.",
  },
  {
    id: "lowboy",
    nameEn: "Lowboy / RGN",
    nameRu: "Лоуборд / RGN",
    isoType: "lowboy",
    specs: [
      { labelEn: "TYPE",     labelRu: "ТИП",       value: "Removable Gooseneck" },
      { labelEn: "LENGTH",   labelRu: "ДЛИНА",      value: "48'–53'" },
      { labelEn: "DECK HT",  labelRu: "ДЕКА",       value: `18"–24"` },
      { labelEn: "CAPACITY", labelRu: "ГРУЗОП.",    value: "40,000–80,000 lbs" },
      { labelEn: "PERMITS",  labelRu: "РАЗРЕШ.",    value: "Oversized / Superload" },
      { labelEn: "AXLES",    labelRu: "ОСИ",        value: "3–5 (removable)" },
    ],
    descEn: "Removable gooseneck for the heaviest loads. Direct drive-on loading for tracked vehicles, cranes, and industrial machinery.",
    descRu: "Съёмная шея для самых тяжёлых грузов. Загрузка наездом для гусеничной техники, кранов и промышленного оборудования.",
  },
];

// ── Main Component ──────────────────────────────────────────────────────────

export const FleetPage: React.FC<FleetPageProps> = ({ theme = "dark", onBack }) => {
  const { lang } = useLanguage();
  const isDark = theme === "dark";

  const [activeTruck,   setActiveTruck]   = useState("cascadia");
  const [activeTrailer, setActiveTrailer] = useState("flatbed");
  const [truckKey,      setTruckKey]      = useState(0);
  const [trailerKey,    setTrailerKey]    = useState(0);

  const bg      = isDark ? "#080808" : "#f4f2ef";
  const surface = isDark ? "#0f0f0f" : "#ffffff";
  const text    = isDark ? "#f0ede8" : "#0d0d0d";
  const muted   = isDark ? "rgba(240,237,232,0.42)" : "rgba(13,13,13,0.44)";
  const divider = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.09)";

  const svgColor = isDark ? "#CC0000" : "#CC0000";
  const svgBg    = isDark ? "#080808" : "#f4f2ef";

  const truck   = TRUCKS.find(t => t.id === activeTruck) || TRUCKS[0];
  const trailer = TRAILERS.find(t => t.id === activeTrailer) || TRAILERS[0];

  const TruckComp   = TRUCK_SVG_MAP[activeTruck];
  const TrailerComp = TRAILER_ISO_MAP[activeTrailer];

  const handleTruck = (id: string) => { if (id !== activeTruck) { setActiveTruck(id); setTruckKey(k => k + 1); } };
  const handleTrailer = (id: string) => { if (id !== activeTrailer) { setActiveTrailer(id); setTrailerKey(k => k + 1); } };

  return (
    <div style={{ background: bg, minHeight: "100vh", color: text }}>
      <style>{`
        @keyframes svgSlideIn {
          0%  { opacity:0; transform:translateX(-50px); }
          70% { opacity:1; transform:translateX(6px); }
          100%{ opacity:1; transform:translateX(0); }
        }
        @keyframes specIn { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes lineExpand { from{transform:scaleX(0)} to{transform:scaleX(1)} }
        @keyframes fleetIn { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        .fl-row { cursor:pointer; }
        .fl-row:hover .fl-name { color:#CC0000 !important; }
        .spec-grid { display:grid; grid-template-columns:1fr 1fr; }
      `}</style>

      <div style={{ animation: "fleetIn 0.4s ease both" }}>

        {/* ── HEADER ── */}
        <div style={{ borderBottom: `1px solid ${divider}`, padding: "28px clamp(20px,5vw,80px)", display: "flex", alignItems: "center", gap: 16 }}>
          <button onClick={onBack} style={{ background: "transparent", border: `1px solid ${divider}`, borderRadius: 20, padding: "7px 16px", color: muted, fontFamily: "'Barlow',sans-serif", fontWeight: 600, fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", cursor: "pointer", flexShrink: 0, transition: "all 0.15s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor="#CC0000"; e.currentTarget.style.color="#CC0000"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor=divider; e.currentTarget.style.color=muted; }}>
            ← {lang === "ru" ? "НАЗАД" : "BACK"}
          </button>
          <div style={{ width: 1, height: 24, background: divider }} />
          <div style={{ fontFamily: "'Barlow',sans-serif", fontSize: 9, color: "#CC0000", letterSpacing: 4, textTransform: "uppercase" }}>
            CLICK EXPRESS INC · {lang === "ru" ? "НАШ ФЛОТ" : "OUR FLEET"}
          </div>
        </div>

        {/* ── SECTION: TRUCKS ── */}
        <section style={{ padding: "56px clamp(20px,5vw,80px) 72px" }}>
          {/* Title */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 44 }}>
            <div style={{ width: 3, height: 44, background: "#CC0000", flexShrink: 0 }} />
            <div>
              <div style={{ fontFamily: "'Barlow',sans-serif", fontSize: 9, color: "#CC0000", letterSpacing: 4, textTransform: "uppercase", marginBottom: 3 }}>
                {lang === "ru" ? "АВТОПАРК" : "OUR FLEET"}
              </div>
              <h2 style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: "clamp(40px,6vw,76px)", textTransform: "uppercase", lineHeight: 0.88, letterSpacing: -1.5, color: text, margin: 0 }}>
                {lang === "ru" ? "ГРУЗОВИКИ" : "TRUCKS"}
              </h2>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "minmax(280px,42%) 1fr", gap: "clamp(32px,6vw,90px)", alignItems: "start" }}>
            {/* LEFT: accordion */}
            <div>
              {TRUCKS.map(tr => {
                const isActive = activeTruck === tr.id;
                return (
                  <div key={tr.id}>
                    <div className="fl-row" onClick={() => handleTruck(tr.id)}
                      style={{ borderTop: `1px solid ${divider}`, padding: "20px 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        {isActive && <div style={{ width: 3, height: 20, background: "#CC0000", flexShrink: 0 }} />}
                        <span className="fl-name" style={{ fontFamily: "'Oswald',sans-serif", fontWeight: isActive ? 700 : 500, fontSize: "clamp(15px,2vw,21px)", textTransform: "uppercase", letterSpacing: 0.5, color: isActive ? "#CC0000" : text, transition: "color 0.18s" }}>
                          {lang === "ru" ? tr.nameRu : tr.nameEn}
                        </span>
                      </div>
                      <span style={{ color: isActive ? "#CC0000" : muted, fontSize: 16, opacity: isActive ? 1 : 0.4, transform: isActive ? "rotate(0deg)" : "rotate(-90deg)", transition: "all 0.25s" }}>↓</span>
                    </div>
                    {isActive && (
                      <div style={{ paddingBottom: 28, animation: "specIn 0.3s ease both" }}>
                        <div style={{ height: 2, background: "#CC0000", transformOrigin: "left", animation: "lineExpand 0.35s ease both", marginBottom: 20 }} />
                        <div className="spec-grid">
                          {tr.specs.map((s, i) => (
                            <div key={i} style={{ padding: "13px 12px 13px 0", borderBottom: `1px solid ${divider}` }}>
                              <div style={{ fontFamily: "'Barlow',sans-serif", fontSize: 8, color: muted, letterSpacing: 2.5, textTransform: "uppercase", marginBottom: 4 }}>
                                {lang === "ru" ? s.labelRu : s.labelEn}
                              </div>
                              <div style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 600, fontSize: 14, color: text, letterSpacing: 0.3 }}>
                                {s.value}
                              </div>
                            </div>
                          ))}
                        </div>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 24 }}>
                          {["DOT Certified", "GPS Tracked", "ELD Compliant", "FMCSA Licensed"].map(tag => (
                            <span key={tag} style={{ fontFamily: "'Barlow',sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", color: muted, border: `1px solid ${divider}`, padding: "4px 10px", borderRadius: 20 }}>✓ {tag}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              <div style={{ borderTop: `1px solid ${divider}` }} />
            </div>

            {/* RIGHT: SVG truck illustration */}
            <div style={{ position: "sticky", top: 84 }}>
              <div key={truckKey} style={{ animation: "svgSlideIn 0.65s cubic-bezier(0.22,1,0.36,1) both" }}>
                {/* Name header */}
                <div style={{ marginBottom: 12, display: "flex", alignItems: "baseline", gap: 14 }}>
                  <span style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: "clamp(22px,3vw,38px)", color: "#CC0000", textTransform: "uppercase", letterSpacing: -0.5 }}>
                    {lang === "ru" ? truck.nameRu : truck.nameEn}
                  </span>
                  <span style={{ fontFamily: "'Barlow',sans-serif", fontSize: 10, color: muted, letterSpacing: 2, textTransform: "uppercase" }}>{truck.year}</span>
                </div>

                {/* SVG illustration area */}
                <div style={{ background: surface, border: `1px solid ${divider}`, padding: "clamp(20px,4vw,44px) clamp(16px,3vw,36px)", position: "relative", overflow: "hidden" }}>
                  {/* Grid dots */}
                  <div style={{ position: "absolute", inset: 0, backgroundImage: isDark ? "radial-gradient(circle,rgba(255,255,255,0.03) 1px,transparent 1px)" : "radial-gradient(circle,rgba(0,0,0,0.04) 1px,transparent 1px)", backgroundSize: "22px 22px", pointerEvents: "none" }} />
                  {/* Red left bar */}
                  <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: "#CC0000" }} />
                  <div style={{ position: "relative" }}>
                    {TruckComp && <TruckComp color={svgColor} bg={svgBg} />}
                  </div>
                </div>

                {/* Bottom status bar */}
                <div style={{ background: isDark ? "#0f0f0f" : "#fff", border: `1px solid ${divider}`, borderTop: "none", padding: "10px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontFamily: "'Barlow',sans-serif", fontSize: 10, color: muted, letterSpacing: 1, textTransform: "uppercase" }}>
                    {lang === "ru" ? "В ПАРКЕ С" : "IN FLEET SINCE"} {truck.year.split("–")[0]}
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(204,0,0,0.1)", border: "1px solid rgba(204,0,0,0.25)", borderRadius: 20, padding: "4px 12px" }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#CC0000" }} />
                    <span style={{ fontFamily: "'Barlow',sans-serif", fontSize: 9, color: "#CC0000", letterSpacing: 2, fontWeight: 700, textTransform: "uppercase" }}>
                      {lang === "ru" ? "АКТИВЕН" : "ACTIVE"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div style={{ height: 1, background: `linear-gradient(90deg,transparent,${isDark?"rgba(255,255,255,0.08)":"rgba(0,0,0,0.08)"},transparent)`, margin: "0 clamp(20px,5vw,80px)" }} />

        {/* ── SECTION: TRAILERS ── */}
        <section style={{ padding: "56px clamp(20px,5vw,80px) 90px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 44 }}>
            <div style={{ width: 3, height: 44, background: "#CC0000", flexShrink: 0 }} />
            <div>
              <div style={{ fontFamily: "'Barlow',sans-serif", fontSize: 9, color: "#CC0000", letterSpacing: 4, textTransform: "uppercase", marginBottom: 3 }}>
                {lang === "ru" ? "ОБОРУДОВАНИЕ" : "EQUIPMENT"}
              </div>
              <h2 style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: "clamp(40px,6vw,76px)", textTransform: "uppercase", lineHeight: 0.88, letterSpacing: -1.5, color: text, margin: 0 }}>
                {lang === "ru" ? "ПРИЦЕПЫ" : "TRAILERS"}
              </h2>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "minmax(280px,42%) 1fr", gap: "clamp(32px,6vw,90px)", alignItems: "start" }}>
            {/* LEFT: trailer accordion */}
            <div>
              {TRAILERS.map(tr => {
                const isActive = activeTrailer === tr.id;
                return (
                  <div key={tr.id}>
                    <div className="fl-row" onClick={() => handleTrailer(tr.id)}
                      style={{ borderTop: `1px solid ${divider}`, padding: "20px 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        {isActive && <div style={{ width: 3, height: 20, background: "#CC0000", flexShrink: 0 }} />}
                        <span className="fl-name" style={{ fontFamily: "'Oswald',sans-serif", fontWeight: isActive ? 700 : 500, fontSize: "clamp(15px,2vw,21px)", textTransform: "uppercase", letterSpacing: 0.5, color: isActive ? "#CC0000" : text, transition: "color 0.18s" }}>
                          {lang === "ru" ? tr.nameRu : tr.nameEn}
                        </span>
                      </div>
                      <span style={{ color: isActive ? "#CC0000" : muted, fontSize: 16, opacity: isActive ? 1 : 0.4, transform: isActive ? "rotate(0deg)" : "rotate(-90deg)", transition: "all 0.25s" }}>↓</span>
                    </div>
                    {isActive && (
                      <div style={{ paddingBottom: 28, animation: "specIn 0.3s ease both" }}>
                        <div style={{ height: 2, background: "#CC0000", transformOrigin: "left", animation: "lineExpand 0.35s ease both", marginBottom: 20 }} />
                        <div className="spec-grid">
                          {tr.specs.map((s, i) => (
                            <div key={i} style={{ padding: "12px 12px 12px 0", borderBottom: `1px solid ${divider}` }}>
                              <div style={{ fontFamily: "'Barlow',sans-serif", fontSize: 8, color: muted, letterSpacing: 2.5, textTransform: "uppercase", marginBottom: 4 }}>
                                {lang === "ru" ? s.labelRu : s.labelEn}
                              </div>
                              <div style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 600, fontSize: 14, color: text }}>
                                {s.value}
                              </div>
                            </div>
                          ))}
                        </div>
                        <p style={{ fontFamily: "'Barlow',sans-serif", fontSize: 13, color: muted, lineHeight: 1.8, marginTop: 18, marginBottom: 0 }}>
                          {lang === "ru" ? tr.descRu : tr.descEn}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
              <div style={{ borderTop: `1px solid ${divider}` }} />
            </div>

            {/* RIGHT: 3D isometric SVG */}
            <div style={{ position: "sticky", top: 84 }}>
              <div key={`t-${trailerKey}`} style={{ animation: "svgSlideIn 0.6s cubic-bezier(0.22,1,0.36,1) both" }}>
                {/* Title */}
                <div style={{ marginBottom: 16, display: "flex", alignItems: "baseline", gap: 14 }}>
                  <span style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: "clamp(22px,3vw,38px)", color: "#CC0000", textTransform: "uppercase", letterSpacing: -0.5 }}>
                    {lang === "ru" ? trailer.nameRu : trailer.nameEn}
                  </span>
                </div>

                {/* ISO diagram */}
                <div style={{ background: surface, border: `1px solid ${divider}`, padding: "clamp(20px,4vw,44px) clamp(16px,3vw,36px)", position: "relative", overflow: "hidden", marginBottom: 16 }}>
                  <div style={{ position: "absolute", inset: 0, backgroundImage: isDark ? "radial-gradient(circle,rgba(255,255,255,0.03) 1px,transparent 1px)" : "radial-gradient(circle,rgba(0,0,0,0.04) 1px,transparent 1px)", backgroundSize: "22px 22px", pointerEvents: "none" }} />
                  <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: "#CC0000" }} />
                  <div style={{ position: "relative" }}>
                    {TrailerComp && <TrailerComp color={svgColor} />}
                  </div>
                </div>

                {/* Spec badges grid */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                  {trailer.specs.map((s, i) => (
                    <div key={i} style={{ border: `1px solid ${divider}`, padding: "10px 12px", background: surface }}>
                      <div style={{ fontFamily: "'Barlow',sans-serif", fontSize: 8, color: muted, letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>
                        {lang === "ru" ? s.labelRu : s.labelEn}
                      </div>
                      <div style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 600, fontSize: 13, color: text }}>
                        {s.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <div style={{ background: "#CC0000", padding: "40px clamp(20px,5vw,80px)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24, flexWrap: "wrap", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(45deg,rgba(0,0,0,0.06) 0,rgba(0,0,0,0.06) 1px,transparent 1px,transparent 20px)", pointerEvents: "none" }} />
          <div style={{ position: "relative" }}>
            <div style={{ fontFamily: "'Barlow',sans-serif", fontSize: 9, color: "rgba(255,255,255,0.6)", letterSpacing: 3, textTransform: "uppercase", marginBottom: 7 }}>
              {lang === "ru" ? "ГОТОВ РАБОТАТЬ С НАМИ?" : "READY TO HAUL WITH US?"}
            </div>
            <div style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: "clamp(22px,4vw,44px)", color: "#fff", textTransform: "uppercase", lineHeight: 0.95, letterSpacing: -0.5 }}>
              {lang === "ru" ? "СВЯЖИСЬ С ДИСПЕТЧЕРОМ" : "CONTACT OUR DISPATCHER"}
            </div>
          </div>
          <a href="tel:+17862026599" style={{ position: "relative", display: "inline-flex", alignItems: "center", gap: 10, background: "#fff", color: "#CC0000", padding: "15px 30px", fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: 14, letterSpacing: 2, textTransform: "uppercase", textDecoration: "none", flexShrink: 0, transition: "all 0.15s", boxShadow: "0 4px 20px rgba(0,0,0,0.2)" }}
            onMouseEnter={e => { e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 10px 28px rgba(0,0,0,0.3)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow="0 4px 20px rgba(0,0,0,0.2)"; }}>
            <svg width="15" height="15" viewBox="0 0 256 256" fill="#CC0000">
              <path d="M222.37,158.46l-47.11-21.11a16,16,0,0,0-15.17,1.4l-24.78,20.37c-15.42-7.49-31.34-23.29-38.83-38.51l20.78-24.71a16,16,0,0,0,1.32-15.06L97.54,33.64A16,16,0,0,0,81,24.12,56.26,56.26,0,0,0,32,80c0,79.4,64.6,144,144,144a56.26,56.26,0,0,0,55.88-48.92,16,16,0,0,0-9.51-16.62Z"/>
            </svg>
            +1 786-202-6599
          </a>
        </div>

      </div>
    </div>
  );
};
