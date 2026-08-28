import { useEffect, useState } from "react";
import { fetchQuestions, submitAnswers } from "./api";

const ACT_LABELS = ["Ἡ πορεία ἄρχεται", "Ἡ μοῖρα ὑφαίνεται"];
const ACT_BACKGROUNDS = [
  "/backgrounds/act1.png",
  "/backgrounds/act2.png",
  "/backgrounds/act3.png",
  "/backgrounds/act4.png",
];

/**
 * MBTI 질문(챕터) 화면
 * 신화 · 우주 테마 (별자리 진행바 / 양피지 카드 / 두 갈래 선택지)
 *
 * 사용법:
 *   <QuestionPage onComplete={(mbtiCode) => ...} onExit={() => ...} />
 *
 * 문항은 GET /tests/questions로 불러오고, 마지막 문항 응답 시
 * POST /tests/submit으로 채점해 받은 4글자 코드를 onComplete로 넘깁니다.
 */
export default function QuestionPage({ onComplete, onExit }) {
  const [questions, setQuestions] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({}); // { [questionId]: 'a' | 'b' }
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    fetchQuestions()
      .then(setQuestions)
      .catch((err) => setLoadError(err.message));
  }, []);

  if (loadError) {
    return (
      <div style={styles.page}>
        <p style={styles.errorText}>문항을 불러오지 못했습니다: {loadError}</p>
        {onExit && (
          <button style={styles.iconBtn} onClick={onExit}>
            돌아가기
          </button>
        )}
      </div>
    );
  }

  if (!questions) {
    return (
      <div style={styles.page}>
        <p style={styles.errorText}>신탁을 준비하는 중...</p>
      </div>
    );
  }

  const total = questions.length;
  const question = questions[step];
  const actIndex = Math.floor(step / 5); // 0: E/I, 1: S/N, 2: T/F, 3: J/P

  const handleChoice = async (choice) => {
    if (submitting) return;
    const nextAnswers = { ...answers, [question.id]: choice };

    if (step + 1 < total) {
      setAnswers(nextAnswers);
      setStep(step + 1);
      return;
    }

    setSubmitting(true);
    setSubmitError(null);
    try {
      const payload = questions.map((q) => ({ questionId: q.id, choice: nextAnswers[q.id] }));
      const { mbti } = await submitAnswers(payload);
      onComplete?.(mbti);
    } catch (err) {
      setSubmitError(err.message);
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    if (step === 0) {
      onExit?.();
      return;
    }
    setStep(step - 1);
  };

  return (
    <div style={styles.page}>
      <div
        style={{ ...styles.bgImage, backgroundImage: `url(${ACT_BACKGROUNDS[actIndex]})` }}
        aria-hidden="true"
      />
      <div style={styles.bgOverlay} aria-hidden="true" />

      {/* 상단 바 */}
      <div style={styles.topBar}>
        <button style={styles.iconBtn} onClick={handleBack} aria-label="이전으로">
          ←
        </button>
        <button style={styles.iconBtn} aria-label="일시정지">
          ❙❙
        </button>
      </div>

      {/* 진행 상황 */}
      <p style={styles.progressLabel}>{ACT_LABELS[actIndex === 0 ? 0 : 1]}</p>
      <ProgressDots total={5} current={actIndex + 1} />

      {/* 질문 카드 */}
      <div style={styles.card}>
        <div style={styles.cardDivider} aria-hidden="true">
          <span style={styles.cardDividerLine} />
          <span style={styles.cardDividerIcon}>🪶</span>
          <span style={styles.cardDividerLine} />
        </div>

        <h1 style={styles.title}>
          {step + 1}. {question.title}
        </h1>
        <p style={styles.description}>{question.story_text}</p>
        <p style={styles.prompt}>당신의 행동은?</p>

        {submitError && <p style={styles.errorText}>{submitError}</p>}

        <div style={styles.choiceList}>
          <button
            style={styles.choiceBtn}
            onClick={() => handleChoice("a")}
            disabled={submitting}
          >
            {question.option_a_text}
          </button>
          <button
            style={styles.choiceBtn}
            onClick={() => handleChoice("b")}
            disabled={submitting}
          >
            {question.option_b_text}
          </button>
        </div>
        {submitting && <p style={styles.progressLabel}>신탁을 받는 중...</p>}

        <span style={styles.footerGlyph} aria-hidden="true">△</span>
      </div>
    </div>
  );
}

function ProgressDots({ total, current }) {
  const dots = Array.from({ length: total }, (_, i) => i);
  return (
    <div style={styles.dotsRow} aria-hidden="true">
      {dots.map((i) => (
        <div key={i} style={styles.dotWrap}>
          <span
            style={{
              ...styles.dot,
              ...(i < current ? styles.dotDone : null),
              ...(i === current ? styles.dotActive : null),
            }}
          />
          {i < dots.length - 1 && (
            <span
              style={{
                ...styles.dotLine,
                ...(i < current ? styles.dotLineDone : null),
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

/* ── 스타일 ── */
const GOLD = "#e8c86a";

const styles = {
  errorText: {
    marginTop: 16,
    fontSize: 14,
    color: GOLD,
    textAlign: "center",
  },
  page: {
    position: "relative",
    minHeight: "100vh",
    width: "100%",
    maxWidth: 390,
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    background: "linear-gradient(180deg, #1a1330 0%, #150f28 45%, #0d0a1c 100%)",
    padding: "20px 24px 48px",
    boxSizing: "border-box",
    fontFamily: "'Noto Serif KR', 'Nanum Myeongjo', serif",
    overflow: "hidden",
  },
  bgImage: {
    position: "absolute",
    inset: 0,
    zIndex: 0,
    backgroundSize: "cover",
    backgroundPosition: "center center",
    backgroundRepeat: "no-repeat",
    transition: "background-image 0.3s ease",
  },
  bgOverlay: {
    position: "absolute",
    inset: 0,
    zIndex: 0,
    background:
      "linear-gradient(180deg, rgba(13,10,28,0.55) 0%, rgba(13,10,28,0.72) 45%, rgba(13,10,28,0.9) 100%)",
  },
  topBar: {
    position: "relative",
    zIndex: 1,
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#e9e5f2",
    fontSize: 18,
    padding: 6,
    lineHeight: 1,
  },
  progressLabel: {
    position: "relative",
    zIndex: 1,
    marginTop: 28,
    marginBottom: 14,
    fontSize: 13,
    letterSpacing: "0.06em",
    color: GOLD,
    fontStyle: "italic",
  },
  dotsRow: {
    position: "relative",
    zIndex: 1,
    display: "flex",
    alignItems: "center",
    width: "100%",
    maxWidth: 260,
  },
  dotWrap: { display: "flex", alignItems: "center", flex: 1, minWidth: 0 },
  dot: {
    flexShrink: 0,
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: "rgba(232,200,106,0.3)",
  },
  dotDone: { background: GOLD },
  dotActive: {
    width: 12,
    height: 12,
    boxShadow: `0 0 10px ${GOLD}`,
  },
  dotLine: {
    flex: 1,
    height: 1.5,
    background: "rgba(232,200,106,0.25)",
  },
  dotLineDone: { background: GOLD },
  card: {
    position: "relative",
    zIndex: 1,
    width: "100%",
    marginTop: 32,
    padding: "32px 22px 26px",
    borderRadius: 18,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(232,200,106,0.22)",
    boxSizing: "border-box",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  cardDivider: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    width: "100%",
  },
  cardDividerLine: {
    height: 1,
    width: 56,
    background: "linear-gradient(90deg, transparent, rgba(232,200,106,0.5), transparent)",
  },
  cardDividerIcon: { fontSize: 14, color: GOLD },
  title: {
    margin: "22px 0 0",
    fontSize: 19,
    fontWeight: 700,
    color: "#f2eef8",
    lineHeight: 1.4,
  },
  description: {
    marginTop: 14,
    fontSize: 14.5,
    lineHeight: 1.8,
    color: "#c9c3d6",
  },
  prompt: {
    marginTop: 24,
    fontSize: 15,
    fontWeight: 600,
    letterSpacing: "0.03em",
    color: GOLD,
  },
  choiceList: {
    width: "100%",
    marginTop: 18,
    display: "flex",
    flexDirection: "column",
    gap: 14,
  },
  choiceBtn: {
    width: "100%",
    boxSizing: "border-box",
    padding: "18px 18px",
    borderRadius: 14,
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(232,200,106,0.3)",
    color: "#e9e5f2",
    fontFamily: "inherit",
    fontSize: 14.5,
    lineHeight: 1.6,
    cursor: "pointer",
    transition: "background 0.15s ease, border-color 0.15s ease",
  },
  footerGlyph: {
    marginTop: 22,
    fontSize: 13,
    color: "rgba(232,200,106,0.5)",
  },
};
