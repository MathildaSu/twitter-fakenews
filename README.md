# Twitter Fake News

## Setup:

From the root folder:

```bash
cd frontent
cp .env.sample .env
```

Replace all the items, inside .env, with `TO_BE_REPLACED` as value.

From the root folder execute:

```bash
cd backend
cp .env.sample .env
```

Replace all the items, inside .env, with `TO_BE_REPLACED` as value.

Then, from the root folder execute:

```bash
docker-compose build
```

## Running the project:

From the root folder execute:

```bash
docker compose up
```

- To start using the web app go to http://localhost:3000
- To check which API endpoints are exposed go to http://localhost:8000/docs
- To check the status of celery tasks go to http://localhost:5556

To stop the docker you can just do `ctrl+c` and then execute `docker compose down`.
