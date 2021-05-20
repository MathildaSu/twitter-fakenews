import { useReducer, useState } from "react";
import "./Form.css";

const initialState = {
  lang: "en",
  result_type: "popular",
  limit: 10,
  q: "",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "setQuery":
      return {
        ...state,
        q: action.value,
      };
    case "setLang":
      return {
        ...state,
        lang: action.value,
      };
    case "setLimit":
      return {
        ...state,
        limit: action.value,
      };
    case "setResultType":
      return {
        ...state,
        result_type: action.value,
      };
    default:
      throw new Error();
  }
};

const Form = ({ handleQueryParams, handlePathParams }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [inputType, setInputType] = useState("query");

  const onSubmit = (e) => {
    e.preventDefault();
    if (inputType === "query") {
      handleQueryParams(state);
    } else {
      handlePathParams(state.q);
    }
  };

  const onQueryChange = (e) => {
    dispatch({ type: "setQuery", value: e.target.value });
  };

  const onLangChange = (e) => {
    dispatch({ type: "setLang", value: e.target.value });
  };

  const onLimitChange = (e) => {
    dispatch({ type: "setLimit", value: e.target.value });
  };

  const onResultTypeChange = (e) => {
    dispatch({ type: "setResultType", value: e.target.value });
  };

  return (
    <form onSubmit={onSubmit} className="form">
      <div className="inputTypeContainer">
        <label htmlFor="inputType">Input as a list of Tweet IDs?</label>
        <input
          type="checkbox"
          id="inputType"
          name="inputType"
          checked={inputType === "ids" ? true : false}
          onChange={() => {
            if (inputType === "ids") {
              setInputType("query");
            } else {
              setInputType("ids");
              dispatch({ type: "setQuery", value: "" });
            }
          }}
        />
      </div>
      <div className="queryContainer">
        <div className="queryInputContainer">
          <label htmlFor="query">Query: </label>
          <input
            name="query"
            id="query"
            type="text"
            value={state.q}
            onChange={onQueryChange}
            placeholder={
              inputType === "ids"
                ? "A list of tweet IDs separated by ,"
                : "A keyword e.g. NHS or a Twitter Search Query"
            }
            className="queryInput"
          />
        </div>
        <div className="queryOptionsContainer">
          <label htmlFor="lang">Language: </label>
          <input
            disabled={inputType === "ids"}
            id="lang"
            name="lang"
            type="text"
            value={state.lang}
            onChange={onLangChange}
            className="langInput"
          />
          <label htmlFor="limit">Limit: </label>
          <input
            disabled={inputType === "ids"}
            name="limit"
            id="limit"
            type="number"
            value={state.limit}
            min="1"
            onChange={onLimitChange}
            className="limitInput"
          />
          <label htmlFor="resultType">Result Type:</label>
          <select
            disabled={inputType === "ids"}
            name="resultType"
            id="resultType"
            value={state.result_type}
            onChange={onResultTypeChange}
          >
            <option value="mixed">Mixed</option>
            <option value="popular">Popular</option>
            <option value="recent">Recent</option>
          </select>
        </div>
      </div>
      <button className="searchButton" disabled={!state.q}>
        Search
      </button>
    </form>
  );
};

export default Form;
