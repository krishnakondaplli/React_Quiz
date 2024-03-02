import { useEffect, useReducer } from "react";
import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";
import NextButton from "./NextButton";
import Prograss from "./Prograss";
import FinishScreen from "./FinishScreen";
import Footer from "./Footer";
import Timer from "./Timer";

const SECS_PER_QUESTION=30;
const initialstate = {
  questions: [],

  //'loading', 'error' ,'ready','active','finished'
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
  highscore:0,
  secondsRemaining:null,
};
function reducer(state, action) {
  const question = state.questions.at(state.index);

  switch (action.type) {
    case "dataRecevied":
      return {
        ...state,
        questions: action.payload,
        status: "ready",
      };
    case "dataFailed":
      return {
        ...state,
        status: "error",
      };
    case "start":
      return {
        ...state,
        status: "active",
        secondsRemaining:state.questions.length*SECS_PER_QUESTION,
      };
    case "newAnswer":
     
      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
      };
     case 'nextQuestion':
      return{
        ...state,
        index:state.index+1,
        answer:null
      } 

     case "finish":
      return{
        ...state,
        status:'finished',
        points:
        action.payload === question.correctOption
          ? state.points + question.points
          : state.points,
        highscore: state.points > state.highscore ?state.points:state.highscore, 
      } 
    case "restart":
      return{
        ...initialstate,questions:state.questions,
        status:"ready"
        
      }  
    case 'tick':
      return{
        ...state,
        secondsRemaining:state.secondsRemaining - 1,
        status:state.secondsRemaining === 0 ? 'finished':state.status,
      }  
    default:
      throw new Error("Uknown action");
  }
}

export default function App() {
  const [{ questions, status, index, answer,points,highscore,secondsRemaining }, dispatch] = useReducer(
    reducer,
    initialstate
  );
  const numQuestions = questions.length;
  const maxPossiblePoints=questions.reduce((prev,cur)=>prev + cur.points,0)

  useEffect(function () {
    fetch("http://localhost:8000/questions")
      .then((res) => res.json())
      .then((data) =>
        dispatch({
          type: "dataRecevied",
          payload: data,
        })
      )
      .catch((err) => dispatch({ type: "dataFailed" }));
  }, []);

  return (
    <div>
      <Header />
      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}

        {status === "ready" && (
          <StartScreen 
          numQuestions={numQuestions}
           dispatch={dispatch} />
        )}

        {status === "active" && (
        <>
        <Prograss index={index} 
        numQuestions={numQuestions}
        points={points} 
        maxPossiblePoints={maxPossiblePoints}
        answer={answer} />

        <Question
            question={questions[index]}
            dispatch={dispatch}
            answer={answer}
          />
          <Footer>
           <Timer dispatch={dispatch} secondsRemaining={secondsRemaining} />
           <NextButton
           dispatch={dispatch} 
           answer={answer} 
           index={index}
          numQuestions={numQuestions} />
          </Footer>
          </>
         )}
         {status === 'finished' &&
          <FinishScreen 
          points={points}
          maxPossiblePoints={maxPossiblePoints} 
          highscore={highscore} 
          dispatch={dispatch} />}
        
      </Main>
    </div>
  );
        }