import { useReducer } from "react";

import Header from "./Header";
import Form from "./Form";
import Tweets from "./Tweets";

import "./App.css";

const initialState = {
  queryParams: null,
  pathParams: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "setQueryParams":
      return {
        ...state,
        pathParams: null,
        queryParams: action.value,
      };
    case "setPathParams":
      return {
        ...state,
        queryParams: null,
        pathParams: action.value,
      };
    default:
      throw new Error();
  }
};

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleQueryParams = (queryParams) => {
    dispatch({ type: "setQueryParams", value: queryParams });
  };

  const handlePathParams = (pathParams) => {
    dispatch({ type: "setPathParams", value: pathParams });
  };

  return (
    <div className="main-container">
      <Header />
      <Form
        handleQueryParams={handleQueryParams}
        handlePathParams={handlePathParams}
      />
      {(state.queryParams || state.pathParams) && (
        <Tweets queryParams={state.queryParams} pathParams={state.pathParams} />
      )}
    </div>
  );
};

export default App;
