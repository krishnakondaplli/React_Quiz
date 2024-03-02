function StartScreen({ numQuestions, dispatch }) {
  return (
    <div className="start">
      <h2>Wellcome to The React Quiz!</h2>
      <h3>{numQuestions} to test your React mastery</h3>
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "start", payload: "actve" })}
      >
        Let's start
      </button>
    </div>
  );
}

export default StartScreen;
