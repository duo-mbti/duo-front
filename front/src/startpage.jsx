import { useState } from "react";

/**
 * MBTI 테스트 시작 페이지
 * 신화 · 우주 테마 (파르테논 / 별자리 / 룬 문자)
 *
 * 사용법:
 *   <StartPage onStart={(name) => console.log(name)} heroSrc="/hero.png" />
 *
 * heroSrc를 넘기면 실제 이미지가 아치 카드 안에 들어가고,
 * 넘기지 않으면 아래 CSS/SVG로 그린 우주 배경이 표시됩니다.
 */
export default function StartPage({ onStart, heroSrc }) {
  const [name, setName] = useState("");

  const handleStart = () => {
    if (onStart) onStart(name.trim());
  };

  return (
    <div style={styles.page}>
      {/* 상단 반짝임 */}
      <div style={styles.sparkle} aria-hidden="true">
        <Sparkles />
      </div>


      {/* 아치형 히어로 카드 */}
      <div style={styles.cardOuter}>
        <div style={styles.cardInner}>
          {heroSrc ? (
            <img src={heroSrc} alt="신화 속 신전" style={styles.heroImg} />
          ) : (
            <CosmicTemple />
          )}
          {/* 모서리 장식 */}
          <span style={{ ...styles.corner, ...styles.cornerBL }} />
          <span style={{ ...styles.corner, ...styles.cornerBR }} />
        </div>
      </div>

      {/* 이름 입력 */}
      <div style={styles.inputWrap}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="당신의 이름을 입력하세요"
          style={styles.input}
          maxLength={20}
          onKeyDown={(e) => e.key === "Enter" && handleStart()}
        />
        <div style={styles.divider} aria-hidden="true">
          <span style={styles.dividerLine} />
          <span style={styles.dividerStar}>✳</span>
          <span style={styles.dividerLine} />
        </div>
      </div>

      {/* 시작 버튼 */}
      <button style={styles.cta} onClick={handleStart}>
        <span>여정 시작하기</span>
        <span style={styles.arrow} aria-hidden="true">→</span>
      </button>
    </div>
  );
}

/* ── 상단 반짝임 SVG ── */
function Sparkles() {
  return (
    <svg width="48" height="36" viewBox="0 0 48 36" fill="none">
      <path
        d="M30 4l2.2 5.3L37.5 11.5 32.2 13.7 30 19l-2.2-5.3L22.5 11.5 27.8 9.3z"
        fill="#E8C86A"
      />
      <path
        d="M16 16l1.4 3.4L20.8 20.8 17.4 22.2 16 25.6l-1.4-3.4L11.2 20.8 14.6 19.4z"
        fill="#E8C86A"
        opacity="0.8"
      />
    </svg>
  );
}

/* ── 우주 신전 (이미지 대체용 SVG 배경) ── */
function CosmicTemple() {
  return (
    <svg viewBox="0 0 300 380" style={styles.heroImg} preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id="sky" cx="50%" cy="42%" r="75%">
          <stop offset="0%" stopColor="#3a2d63" />
          <stop offset="55%" stopColor="#241a45" />
          <stop offset="100%" stopColor="#0f0a24" />
        </radialGradient>
        <radialGradient id="glow" cx="50%" cy="55%" r="45%">
          <stop offset="0%" stopColor="#e8c86a" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#e8c86a" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="nebula" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c9a24a" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#7a5cff" stopOpacity="0.15" />
        </linearGradient>
      </defs>

      {/* 하늘 */}
      <rect width="300" height="380" fill="url(#sky)" />
      {/* 성운 */}
      <ellipse cx="240" cy="120" rx="120" ry="140" fill="url(#nebula)" opacity="0.7" />
      <ellipse cx="60" cy="300" rx="110" ry="90" fill="#6a4fce" opacity="0.18" />
      {/* 중앙 광휘 */}
      <rect width="300" height="380" fill="url(#glow)" />

      {/* 별 */}
      {STARS.map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#fff" opacity={s.o} />
      ))}

      {/* 별자리 선 */}
      <g stroke="#cdd6ff" strokeWidth="0.6" opacity="0.5">
        <line x1="45" y1="70" x2="75" y2="95" />
        <line x1="75" y1="95" x2="60" y2="130" />
        <line x1="60" y1="130" x2="95" y2="120" />
      </g>

      {/* 룬 원 */}
      <circle cx="150" cy="175" r="95" fill="none" stroke="#e8c86a" strokeWidth="0.7" opacity="0.4" strokeDasharray="2 6" />
      <circle cx="150" cy="175" r="78" fill="none" stroke="#e8c86a" strokeWidth="0.5" opacity="0.3" />

      {/* 파르테논 신전 */}
      <g fill="#d9d2c4" opacity="0.92">
        {/* 페디먼트(삼각지붕) */}
        <polygon points="105,230 195,230 150,205" />
        <rect x="103" y="230" width="94" height="8" />
        {/* 기둥 */}
        {[112, 128, 144, 160, 176, 182].map((x, i) => (
          <rect key={i} x={x} y="240" width="8" height="70" fill="#cfc7b8" />
        ))}
        {/* 바닥 계단 */}
        <rect x="98" y="310" width="104" height="6" />
        <rect x="92" y="316" width="116" height="6" fill="#c2bAA8" />
        <rect x="86" y="322" width="128" height="7" fill="#b6ae9c" />
      </g>

      {/* 아래쪽 안개 */}
      <ellipse cx="150" cy="345" rx="150" ry="55" fill="#2a2050" opacity="0.55" />
    </svg>
  );
}

const STARS = [
  { x: 40, y: 40, r: 1.2, o: 0.9 }, { x: 90, y: 30, r: 0.8, o: 0.7 },
  { x: 130, y: 55, r: 1, o: 0.8 }, { x: 200, y: 45, r: 0.9, o: 0.6 },
  { x: 250, y: 70, r: 1.3, o: 0.9 }, { x: 270, y: 40, r: 0.7, o: 0.5 },
  { x: 30, y: 110, r: 0.9, o: 0.7 }, { x: 260, y: 150, r: 1, o: 0.8 },
  { x: 280, y: 200, r: 0.8, o: 0.6 }, { x: 20, y: 220, r: 1.1, o: 0.8 },
  { x: 55, y: 180, r: 0.7, o: 0.5 }, { x: 235, y: 240, r: 0.9, o: 0.7 },
  { x: 180, y: 90, r: 0.6, o: 0.5 }, { x: 110, y: 100, r: 0.8, o: 0.6 },
];

/* ── 스타일 ── */
const styles = {
  page: {
    minHeight: "100vh",
    width: "100%",
    maxWidth: 390,
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    background:
      "linear-gradient(180deg, #cfc9dc 0%, #ded7e4 22%, #f3eee6 55%, #f7f2e9 100%)",
    padding: "56px 28px 48px",
    boxSizing: "border-box",
    fontFamily: "'Noto Serif KR', 'Nanum Myeongjo', serif",
  },
  sparkle: { marginBottom: 24 },
  cardOuter: {
    width: "100%",
    padding: 10,
    borderRadius: "140px 140px 28px 28px",
    background: "linear-gradient(160deg, #efe9df, #d8d0e0)",
    boxShadow: "0 24px 60px rgba(60,40,110,0.28)",
  },
  cardInner: {
    position: "relative",
    width: "100%",
    aspectRatio: "300 / 380",
    borderRadius: "132px 132px 20px 20px",
    overflow: "hidden",
    border: "1px solid rgba(232,200,106,0.35)",
  },
  heroImg: { width: "100%", height: "100%", objectFit: "cover", display: "block" },
  corner: {
    position: "absolute",
    width: 28,
    height: 28,
    borderColor: "rgba(232,200,106,0.8)",
    borderStyle: "solid",
  },
  cornerBL: { left: 14, bottom: 14, borderWidth: "0 0 1.5px 1.5px" },
  cornerBR: { right: 14, bottom: 14, borderWidth: "0 1.5px 1.5px 0" },
  inputWrap: { width: "100%", marginTop: 44, textAlign: "center" },
  input: {
    width: "100%",
    border: "none",
    outline: "none",
    background: "transparent",
    textAlign: "center",
    fontSize: 19,
    color: "#6a6478",
    fontFamily: "inherit",
    letterSpacing: "0.02em",
  },
  divider: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    marginTop: 18,
  },
  dividerLine: {
    height: 1,
    width: 70,
    background:
      "linear-gradient(90deg, transparent, #d9b95e, transparent)",
  },
  dividerStar: { color: "#d9b95e", fontSize: 14 },
  cta: {
    marginTop: 56,
    display: "inline-flex",
    alignItems: "center",
    gap: 14,
    background: "none",
    border: "none",
    cursor: "pointer",
    fontFamily: "inherit",
    fontSize: 21,
    fontWeight: 600,
    letterSpacing: "0.08em",
    color: "#3b3550",
    padding: "8px 4px",
  },
  arrow: { fontSize: 22, color: "#3b3550" },
};