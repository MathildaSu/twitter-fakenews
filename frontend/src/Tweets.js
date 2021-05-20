import { useQuery } from "react-query";
import TweetEmbed from "react-tweet-embed";

import "./Tweets.css";

const buildRequestWithQueryParams = (queryParams) => {
  const url = new URL("http://localhost:8000/tweets/");

  Object.entries(queryParams).forEach(([key, value]) => {
    if (value) {
      url.searchParams.append(key, encodeURIComponent(value));
    }
  });

  return url;
};

const buildRequestWithPathParams = (pathParams) => {
  const url = new URL("http://localhost:8000/tweets/");

  return url + encodeURIComponent(pathParams);
};

const Tweets = ({ queryParams, pathParams }) => {
  let requestUrl = "";

  if (pathParams) {
    requestUrl = buildRequestWithPathParams(pathParams);
  } else {
    const url = buildRequestWithQueryParams(queryParams);
    requestUrl = url.href;
  }

  const { isLoading, error, data } = useQuery(requestUrl, () =>
    fetch(requestUrl).then((res) => res.json())
  );

  if (isLoading) return <div className="loading">Loading...</div>;

  if (error)
    return <div className="error">An error has occurred. Please retry</div>;

  return (
    <div className="tweets">
      {queryParams &&
        data.statuses &&
        data.statuses.map((status) => {
          return (
            <div key={status.id_str}>
              <TweetEmbed id={status.id_str} />
            </div>
          );
        })}
      {pathParams &&
        data &&
        data.map((status) => {
          return (
            <div key={status.id_str}>
              <TweetEmbed id={status.id_str} />
            </div>
          );
        })}
    </div>
  );
};

export default Tweets;
