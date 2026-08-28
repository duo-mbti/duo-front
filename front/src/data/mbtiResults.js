/**
 * MBTI 16유형 궁합(상성) 매칭표
 *
 * 유형별 신 매칭/설명 콘텐츠는 백엔드 mbti_types API(GET /tests/result/:mbti)에서
 * 받아오며, 이 파일은 상성(천상의 동맹 / 우주의 마찰) 계산 로직만 담당합니다.
 *
 *  - 천상의 동맹(최고 궁합): 2번째 글자(N/S)만 같고 나머지 3글자는 반대
 *  - 우주의 마찰(최악 궁합): 4글자 전부 반대(정반대 유형)
 */
export const MATCHES = {
  ISTJ: { best: "ESTJ", worst: "ENFP" },
  ISFJ: { best: "ESFJ", worst: "INTJ" },
  INFJ: { best: "ENFP", worst: "ESTP" },
  INTJ: { best: "ENTJ", worst: "ESFP" },
  ISTP: { best: "ESTP", worst: "ENFJ" },
  ISFP: { best: "ESTP", worst: "ENTP" },
  INFP: { best: "ENFJ", worst: "ESTJ" },
  INTP: { best: "ENTJ", worst: "ESFP" },
  ESTP: { best: "ESFP", worst: "INFP" },
  ESFP: { best: "ESTP", worst: "INTJ" },
  ENFP: { best: "INFJ", worst: "ISTJ" },
  ENTP: { best: "INFJ", worst: "ISFJ" },
  ESTJ: { best: "ISTP", worst: "ENFP" },
  ESFJ: { best: "ISFJ", worst: "ENTP" },
  ENFJ: { best: "INFP", worst: "ISTP" },
  ENTJ: { best: "INTP", worst: "ISFP" },
};

export function getBestMatchCode(code) {
  return MATCHES[code]?.best;
}

export function getWorstMatchCode(code) {
  return MATCHES[code]?.worst;
}
