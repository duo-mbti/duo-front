import { useState } from "react";
import StartPage from "./startpage";
import ResultPage from "./ResultPage";

function App() {
  const [screen, setScreen] = useState("start"); // "start" | "result"
  const [type, setType] = useState(null);

  const handleStart = () => {
    // TODO: 실제 테스트(질문) 화면이 생기면 답변을 집계해서 MBTI 유형을 계산한 뒤 setType 하기
    // 지금은 테스트 로직이 없어서 임시로 하나의 유형을 고정해둠
    setType("ENTP");
    setScreen("result");
  };

  const handleRestart = () => {
    setType(null);
    setScreen("start");
  };

  return screen === "start" ? (
    <StartPage heroSrc="/hero.png" onStart={handleStart} />
  ) : (
    <ResultPage type={type} onRestart={handleRestart} />
  );
}

export default App;
