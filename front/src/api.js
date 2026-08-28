const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000";

async function request(path, options) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.error ?? "요청을 처리하지 못했습니다.");
  }
  return data;
}

export function fetchQuestions() {
  return request("/tests/questions");
}

export function submitAnswers(answers) {
  return request("/tests/submit", {
    method: "POST",
    body: JSON.stringify({ answers }),
  });
}

export function fetchResult(mbti) {
  return request(`/tests/result/${mbti}`);
}
