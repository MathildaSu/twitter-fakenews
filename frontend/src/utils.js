import { useState, useEffect, useReducer } from "react";

export const buildRequestWithQueryParams = (queryParams) => {
  const url = new URL(process.env.REACT_APP_GET_TWEETS_API_URL);

  Object.entries(queryParams).forEach(([key, value]) => {
    if (value) {
      url.searchParams.append(key, encodeURIComponent(value));
    }
  });

  return url.href;
};

export const buildRequestWithPathParams = (pathParams) => {
  const url = new URL(process.env.REACT_APP_GET_TWEETS_API_URL);

  return url + encodeURIComponent(pathParams);
};

const dataFetchReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_INIT":
      return {
        ...state,
        isLoading: true,
        error: false,
      };
    case "FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        error: false,
        data: action.payload,
      };
    case "FETCH_FAILURE":
      return {
        ...state,
        isLoading: false,
        error: true,
      };
    default:
      throw new Error();
  }
};

export const useDataApi = (initialUrl, initialData) => {
  const [url, setUrl] = useState(initialUrl);

  const [state, dispatch] = useReducer(dataFetchReducer, {
    isLoading: false,
    error: false,
    data: initialData,
  });

  useEffect(() => {
    let didCancel = false;

    const fetchData = async () => {
      dispatch({ type: "FETCH_INIT" });

      try {
        const result = await fetch(url);
        const json = await result.json();

        if (!didCancel) {
          dispatch({ type: "FETCH_SUCCESS", payload: json });
        }
      } catch (error) {
        if (!didCancel) {
          dispatch({ type: "FETCH_FAILURE" });
        }
      }
    };

    fetchData();

    return () => {
      didCancel = true;
    };
  }, [url]);

  return [state, setUrl];
};
