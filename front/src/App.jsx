import { useState } from "react";
import StartPage from "./startpage";
import QuestionPage from "./QuestionPage";
import ResultPage from "./ResultPage";

function App() {
  const [screen, setScreen] = useState("start"); // "start" | "question" | "result"
  const [type, setType] = useState(null);

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
