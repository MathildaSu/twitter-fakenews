import { QueryClient, QueryClientProvider, useQuery } from "react-query";

import "./App.css";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Example />
    </QueryClientProvider>
  );
}

function Example() {
  const { isLoading, error, data } = useQuery("root", () =>
    fetch("http://localhost:8000/").then((res) => res.json())
  );

  if (isLoading) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  return (
    <div>
      <pre>{JSON.stringify(data)}</pre>
    </div>
  );
}
