import { useState } from "react";
import StartPage from "./startpage";
import QuestionPage from "./QuestionPage";
import ResultPage from "./ResultPage";

const sharedType = new URLSearchParams(window.location.search).get("type");

function App() {
  const [screen, setScreen] = useState(sharedType ? "result" : "start"); // "start" | "question" | "result"
  const [type, setType] = useState(sharedType);

  const handleStart = () => {
    setScreen("question");
  };

  const handleQuestionsComplete = (mbtiCode) => {
    setType(mbtiCode);
    setScreen("result");
  };

  const handleRestart = () => {
    setType(null);
    setScreen("start");
    window.history.replaceState({}, "", window.location.pathname);
  };

  if (screen === "start") {
    return <StartPage heroSrc="/hero.png" onStart={handleStart} />;
  }
  if (screen === "question") {
    return <QuestionPage onComplete={handleQuestionsComplete} onExit={handleRestart} />;
  }
  return <ResultPage type={type} onRestart={handleRestart} />;
}

export default App;
