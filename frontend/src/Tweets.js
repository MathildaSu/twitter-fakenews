import {
  buildRequestWithQueryParams,
  buildRequestWithPathParams,
  useDataApi,
} from "./utils";

import Tweet from "./Tweet";

import "./Tweets.css";
import { useEffect } from "react";

const createRequestUrl = (queryParams, pathParams) => {
  if (pathParams) {
    return buildRequestWithPathParams(pathParams);
  } else {
    return buildRequestWithQueryParams(queryParams);
  }
};

const Tweets = ({ queryParams, pathParams }) => {
  const requestUrl = createRequestUrl(queryParams, pathParams);

  const [{ isLoading, error, data }, setUrl] = useDataApi(requestUrl, []);

  useEffect(() => {
    const requestUrl = createRequestUrl(queryParams, pathParams);
    setUrl(requestUrl);
  }, [pathParams, queryParams, setUrl]);

  if (isLoading) return <div className="loading">Loading...</div>;

  if (error)
    return <div className="error">An error has occurred. Please retry</div>;

  if (data) {
    return (
      <div className="tweets">
        {queryParams &&
          data.statuses &&
          data.statuses.map((status) => {
            return (
              <div key={status.id_str}>
                <Tweet id={status.id_str} />
              </div>
            );
          })}
        {pathParams &&
          data &&
          data.map((status) => {
            return (
              <div key={status.id_str}>
                <Tweet id={status.id_str} />
              </div>
            );
          })}
      </div>
    );
  }

  return null;
};

export default Tweets;
