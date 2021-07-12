import { useEffect, useState } from "react";

import TweetEmbed from "react-tweet-embed";

import "./Tweet.css";

const Tweet = ({ id }) => {
  const [result, setResult] = useState(null);
  const [isChecking, setIsChecking] = useState(false);
  const [taskId, setTaskId] = useState(null);
  const [pollCount, setPollCount] = useState(0);

  const checkTweet = async () => {
    const response = await fetch(process.env.REACT_APP_ADD_TASK_API_URL, {
      method: "POST",
      body: JSON.stringify({ id }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const json = await response.json();

    setIsChecking(true);
    setTaskId(json.task_id);
  };

  useEffect(() => {
    const checkTask = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_CHECK_TASK_API_URL}${taskId}`
      );
      const json = await response.json();
      const taskStatus = json.task_status;

      if (taskStatus === "SUCCESS") {
        setResult({
          tweetId: id,
          status: taskStatus,
          result: json.task_result,
        });
        setIsChecking(false);
      } else if (taskStatus === "FAILURE") {
        setResult({
          tweetId: id,
          status: taskStatus,
          result: {},
        });
        setIsChecking(false);
      } else {
        window.setTimeout(() => {
          setPollCount(pollCount + 1);
        }, 1000);
      }
    };

    if (taskId) {
      checkTask();
    }
  }, [taskId, pollCount, id]);

  return (
    <div id={`tweet-wrapper-${id}`} className="tweet-wrapper">
      <div id={`tweet-buttons-${id}`} className="tweet-buttons">
        <button
          id={`tweet-check-button-${id}`}
          className={`tweet-check-button ${isChecking ? "is-disabled" : ""}`}
          onClick={checkTweet}
        >
          {isChecking ? "Checking..." : "Check"}
        </button>
      </div>
      <div id={`tweet-container-${id}`} className="tweet-container">
        <div id={`tweet-${id}`} className="tweet">
          <TweetEmbed id={id} />
        </div>
        <div id={`tweet-results-${id}`} className="tweet-results">
          {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
        </div>
      </div>
    </div>
  );
};

export default Tweet;
