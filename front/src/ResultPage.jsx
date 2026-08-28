import { useEffect, useState } from "react";
import { fetchResult } from "./api";
import { getBestMatchCode, getWorstMatchCode } from "./data/mbtiResults";

/**
 * MBTI 결과 페이지
 * 신화 · 우주 테마 (그리스 신 매칭 / 별자리 / 골드 프레임)
 *
 * 사용법:
 *   <ResultPage type="ENTP" />
 *
 * 유형별 콘텐츠(신 이름/설명/키워드 등)는 GET /tests/result/:mbti로 불러옵니다.
 * 궁합(천상의 동맹 / 우주의 마찰) 계산은 src/data/mbtiResults.js 를 사용합니다.
 *
 * 유형별 사진: public/results/{TYPE}.png (예: public/results/ENTP.png) 에
 * 이미지를 넣으면 자동으로 표시됩니다. 파일이 없으면 이모지 심볼로 대체됩니다.
 */
export default function ResultPage({ type = "ENTP", onShare, onRestart }) {
  const code = type.toUpperCase();
  const [result, setResult] = useState(null);
  const [bestMatch, setBestMatch] = useState(null);
  const [worstMatch, setWorstMatch] = useState(null);
  const [error, setError] = useState(null);
  const [imgError, setImgError] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setImgError(false);
    setError(null);
    setResult(null);

    const bestCode = getBestMatchCode(code);
    const worstCode = getWorstMatchCode(code);

    Promise.all([fetchResult(code), fetchResult(bestCode), fetchResult(worstCode)])
      .then(([main, best, worst]) => {
        setResult(main);
        setBestMatch({ code: bestCode, god: best.title });
        setWorstMatch({ code: worstCode, god: worst.title });
      })
      .catch((err) => setError(err.message));
  }, [code]);

  if (error) {
    return (
      <div style={styles.page}>
        <p style={{ color: "#e8c86a" }}>결과를 불러오지 못했습니다: {error}</p>
      </div>
    );
  }

  if (!result || !bestMatch || !worstMatch) {
    return (
      <div style={styles.page}>
        <p style={{ color: "#e8c86a" }}>신탁을 해석하는 중...</p>
      </div>
    );
  }

  const { title: god, epithet, symbol, description: desc, long_description: longDesc, keywords } = result;
  const imgSrc = `/results/${code}.png`;

  const shareUrl = `${window.location.origin}${window.location.pathname}?type=${code}`;

  const handleShare = () => {
    if (onShare) return onShare(result);
    const text = `나의 신화 속 정체는 ${code} · ${god}!`;
    if (navigator.share) {
      navigator.share({ title: "신화 MBTI 결과", text, url: shareUrl }).catch(() => {});
      return;
    }
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(`${text} ${shareUrl}`)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch(() => {});
    }
  };

  return (
    <div style={styles.page}>
      {/* 아치형 초상 프레임 */}
      <div style={styles.frameOuter}>
        <div style={styles.frameInner}>
          <div style={styles.frameGlow} aria-hidden="true" />
          {!imgError ? (
            <img
              src={imgSrc}
              alt={`${code} ${god}`}
              style={styles.frameImg}
              onError={() => setImgError(true)}
            />
          ) : (
            <span style={styles.frameSymbol}>{symbol}</span>
          )}
        </div>
      </div>

      {/* 신격 배지 */}
      <div style={styles.badge}>
        <span>✨ {epithet} ✨</span>
      </div>

      {/* 타입 타이틀 */}
      <h1 style={styles.title}>{code}</h1>
      <p style={styles.godName}>{god}</p>

      {/* 짧은 설명 */}
      <p style={styles.desc}>{desc}</p>

      {/* 구분선 */}
      <div style={styles.divider} aria-hidden="true">
        <span style={styles.dividerLine} />
        <span style={styles.dividerIcon}>❦</span>
        <span style={styles.dividerLine} />
      </div>

      {/* 궁합 카드 */}
      <MatchCard
        icon="♥"
        iconColor="#b79ce0"
        label="천상의 동맹"
        labelColor="#c9b8ef"
        type={bestMatch.code}
        god={bestMatch.god}
      />
      <MatchCard
        icon="✕"
        iconColor="#e0708a"
        label="우주의 마찰"
        labelColor="#e0708a"
        type={worstMatch.code}
        god={worstMatch.god}
      />

      {/* 천상의 설계도 */}
      <div style={styles.blueprint}>
        <h2 style={styles.blueprintTitle}>📖 천상의 설계도</h2>
        <div style={styles.pillRow}>
          {keywords.map((k) => (
            <span key={k.label} style={styles.pill}>
              {k.icon} {k.label}
            </span>
          ))}
        </div>
        <p style={styles.blueprintDesc}>{longDesc}</p>
      </div>

      {/* 공유 버튼 */}
      <button style={styles.cta} onClick={handleShare}>
        <span>{copied ? "링크가 복사됐어요!" : "결과 공유하기"}</span>
        <span aria-hidden="true">🔗</span>
      </button>

      {/* 다시하기 버튼 */}
      {onRestart && (
        <button style={styles.retry} onClick={onRestart}>
          <span>다시하기</span>
          <span aria-hidden="true">↺</span>
        </button>
      )}
    </div>
  );
}

function MatchCard({ icon, iconColor, label, labelColor, type, god }) {
  return (
    <div style={styles.matchCard}>
      <div style={{ ...styles.matchIcon, color: iconColor }}>{icon}</div>
      <p style={{ ...styles.matchLabel, color: labelColor }}>{label}</p>
      <p style={styles.matchType}>{type}</p>
      <p style={styles.matchGod}>{god}</p>
    </div>
  );
}

/* ── 스타일 ── */
const GOLD = "#e8c86a";

const styles = {
  page: {
    minHeight: "100vh",
    width: "100%",
    maxWidth: 390,
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    background: "linear-gradient(180deg, #1a1330 0%, #150f28 45%, #0d0a1c 100%)",
    padding: "48px 28px 56px",
    boxSizing: "border-box",
    fontFamily: "'Noto Serif KR', 'Nanum Myeongjo', serif",
  },
  frameOuter: {
    width: "100%",
    maxWidth: 260,
    padding: 8,
    border: `1.5px solid ${GOLD}`,
    boxShadow: `0 0 24px rgba(232,200,106,0.25)`,
  },
  frameInner: {
    position: "relative",
    width: "100%",
    aspectRatio: "3 / 4",
    border: `1px solid rgba(232,200,106,0.5)`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    background: "radial-gradient(ellipse at 50% 40%, #2a2050 0%, #17112c 70%, #0d0a1c 100%)",
  },
  frameGlow: {
    position: "absolute",
    inset: 0,
    zIndex: 0,
    background: "radial-gradient(ellipse at 50% 45%, rgba(232,200,106,0.28) 0%, transparent 60%)",
  },
  frameImg: {
    position: "relative",
    zIndex: 1,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },
  frameSymbol: { position: "relative", zIndex: 1, fontSize: 72 },
  badge: {
    marginTop: 28,
    padding: "10px 18px",
    border: `1px solid rgba(232,200,106,0.5)`,
    borderRadius: 999,
    color: GOLD,
    fontSize: 14,
    letterSpacing: "0.02em",
    whiteSpace: "nowrap",
  },
  title: {
    marginTop: 22,
    fontSize: 34,
    fontWeight: 700,
    letterSpacing: "0.08em",
    color: GOLD,
    textShadow: "0 0 18px rgba(232,200,106,0.4)",
  },
  godName: {
    marginTop: -6,
    fontSize: 15,
    letterSpacing: "0.2em",
    color: "rgba(232,200,106,0.75)",
  },
  desc: {
    marginTop: 18,
    fontSize: 15,
    lineHeight: 1.7,
    color: "#c9c3d6",
    textAlign: "center",
  },
  divider: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    width: "100%",
    margin: "32px 0",
  },
  dividerLine: {
    height: 1,
    width: 60,
    background: "linear-gradient(90deg, transparent, rgba(232,200,106,0.5), transparent)",
  },
  dividerIcon: { color: GOLD, fontSize: 16 },
  matchCard: {
    width: "100%",
    marginBottom: 16,
    padding: "24px 20px",
    borderRadius: 14,
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(232,200,106,0.18)",
    textAlign: "center",
    boxSizing: "border-box",
  },
  matchIcon: { fontSize: 26, marginBottom: 6 },
  matchLabel: { fontSize: 13, letterSpacing: "0.05em", marginBottom: 8 },
  matchType: { fontSize: 22, fontWeight: 700, color: "#f2eef8" },
  matchGod: { marginTop: 2, fontSize: 14, color: "#a89fc0" },
  blueprint: {
    width: "100%",
    marginTop: 8,
    padding: "24px 22px",
    borderRadius: 14,
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(232,200,106,0.18)",
    boxSizing: "border-box",
  },
  blueprintTitle: {
    margin: 0,
    fontSize: 18,
    color: GOLD,
    fontWeight: 600,
  },
  pillRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 16,
  },
  pill: {
    padding: "7px 14px",
    borderRadius: 999,
    background: "rgba(183,156,224,0.12)",
    border: "1px solid rgba(183,156,224,0.4)",
    color: "#d8cdf0",
    fontSize: 13,
  },
  blueprintDesc: {
    marginTop: 16,
    fontSize: 14.5,
    lineHeight: 1.8,
    color: "#c9c3d6",
  },
  cta: {
    marginTop: 40,
    display: "inline-flex",
    alignItems: "center",
    gap: 10,
    border: "none",
    borderRadius: 999,
    cursor: "pointer",
    fontFamily: "inherit",
    fontSize: 16,
    fontWeight: 600,
    letterSpacing: "0.03em",
    color: "#2b2140",
    padding: "14px 28px",
    background: "linear-gradient(90deg, #e8c86a, #c9a8e8)",
    boxShadow: "0 10px 30px rgba(232,200,106,0.25)",
  },
  retry: {
    marginTop: 16,
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    border: "1px solid rgba(232,200,106,0.4)",
    borderRadius: 999,
    cursor: "pointer",
    fontFamily: "inherit",
    fontSize: 14,
    fontWeight: 600,
    letterSpacing: "0.03em",
    color: GOLD,
    padding: "12px 24px",
    background: "transparent",
  },
};
