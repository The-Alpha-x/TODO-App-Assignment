# To-Do List – Backend

A REST API for the to-do app, built with Express and MongoDB (via Mongoose).

## Tech stack

- Node.js (ES modules) + Express 4
- MongoDB with Mongoose 9
- cors, dotenv

## Prerequisites

- Node.js 20 or newer (recommended) and npm
- A MongoDB database: either a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster or a local MongoDB install

## Setup

1. Install dependencies. In the monorepo, run this **once from the repository root** (it installs both apps):

   ```bash
   npm install
   ```

2. Create your environment file:

   ```bash
   cp .env.example .env
   ```

   On Windows (cmd): `copy .env.example .env`

3. Fill in `.env`:

   | Variable      | Required | Description                                                          |
   | ------------- | -------- | -------------------------------------------------------------------- |
   | `MONGODB_URI` | Yes      | MongoDB connection string (see below)                                |
   | `PORT`        | No       | Port to listen on. Defaults to `5000`                                |
   | `NODE_ENV`    | No       | Defaults to `development`                                            |
   | `CLIENT_URL`  | No       | Listed in `.env.example` but **not currently read by the code** (see limitations) |

## Running the server

| Command       | What it does                                        |
| ------------- | --------------------------------------------------- |
| `npm run dev -w server` | Starts the server and restarts it when files change (run from the repo root) |
| `npm run start -w server` | Starts the server once (use this in production) |

On success you will see `Connected to MongoDB Atlas` followed by `Server running on port :5000`. Check it with:

```bash
curl http://localhost:5000/api/check
```

The server connects to MongoDB **before** it starts listening. If `MONGODB_URI` is missing or the connection fails, it exits with an error instead of starting.

## MongoDB connection notes

### Option A: MongoDB Atlas (cloud)

1. Create a cluster, then create a **database user** under *Database Access*.
2. Under *Network Access*, allow your current IP address. For quick local testing you can allow `0.0.0.0/0`, but don't leave that in place for anything real.
3. Click *Connect → Drivers* and copy the connection string.
4. Put it in `.env`, with your own values and a database name before the `?`:

   ```
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/<database>?retryWrites=true&w=majority
   ```

5. If the password contains special characters (`@`, `:`, `/`, `#`, `%`), **URL-encode** them (for example `@` becomes `%40`).

### Option B: Local MongoDB

Install and start MongoDB, then use:

```
MONGODB_URI=mongodb://127.0.0.1:27017/todo-app
```

### Troubleshooting

- **`MONGODB_URI is missing`**: `.env` isn't in the `server/` folder, or the variable name is misspelled.
- **Authentication failed**: wrong username or password, or the password isn't URL-encoded.
- **Timeout or `ECONNREFUSED` with Atlas**: your IP isn't in the Network Access list.
- **Database or collection doesn't exist yet**: that's fine. MongoDB creates them when the first task is saved.

## API reference

Base URL: `http://localhost:5000/api`

| Method | Endpoint              | Description                                   | Body                       |
| ------ | --------------------- | --------------------------------------------- | -------------------------- |
| GET    | `/check`              | Health check                                  | –                          |
| GET    | `/todos`              | List all tasks                                | –                          |
| POST   | `/todos`              | Create a task                                 | `{ title, description? }`  |
| PUT    | `/todos/:todoId`      | Update a task's title and/or description      | `{ title?, description? }` |
| PATCH  | `/todos/:todoId/done` | **Toggle** a task between done and pending    | –                          |
| DELETE | `/todos/:todoId`      | Delete a task (returns the deleted task)      | –                          |

A task looks like:

```json
{
  "_id": "665f...",
  "title": "Buy groceries",
  "description": "Buy groceries for the month of November",
  "done": false,
  "createdAt": "2026-11-19T10:00:00.000Z",
  "updatedAt": "2026-11-19T10:00:00.000Z"
}
```

Errors are returned as `{ "error": "message" }` with a matching status code: `400` for a missing title on create, `404` for an unknown or malformed id or an unknown route, and `500` for anything unexpected.

## Project structure

```
server.js              entry point: connects to MongoDB, then starts listening
src/
  app.js               Express setup, CORS, routes, error handling
  config/              environment config and database connection
  routes/              URL -> controller
  controllers/         request/response handling
  services/            business logic
  models/              Mongoose schemas (Task)
  middleware/          notFound, errorHandler
```

## Assumptions

- One shared task list for a single user: there is no authentication or per-user data.

## Limitations

- **CORS is open to every origin** (`cors()` with defaults).
- No authentication, rate limiting, or pagination: `GET /todos` returns every task.
- Validation is minimal: the server only checks that `title` exists on create. The 500-character description limit is enforced by the frontend only, and an update can set the title to an empty string.