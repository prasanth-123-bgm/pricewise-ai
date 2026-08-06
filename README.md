# PriceWise AI

PriceWise AI is now split into two independently running apps:

- `backend/` contains the Express API for Amazon and Flipkart aggregation.
- `frontend/` contains the React + Tailwind + TypeScript experience.

## Structure

```text
.
|-- backend/
|   |-- src/
|   |-- .env.example
|   `-- package.json
|-- frontend/
|   |-- src/
|   |-- .env.example
|   `-- package.json
`-- package.json
```

## Backend setup

1. Copy `backend/.env.example` to `backend/.env`
2. Add your RapidAPI key.
3. Run `npm install` inside `backend/`
4. Start the API with `npm run dev`

Backend endpoints:

- `GET /api/health`
- `GET /api/search?product=iPhone 15`
- `POST /api/search` with `{ "product": "iPhone 15" }`

## Frontend setup

1. Copy `frontend/.env.example` to `frontend/.env` if you want to override the API URL.
2. Run `npm install` inside `frontend/`
3. Start the app with `npm run dev`

The frontend defaults to `http://localhost:3000` for API requests.

## Root helper scripts

From the repo root:

- `npm run dev:backend`
- `npm run dev:frontend`
- `npm run build:frontend`
- `npm run start:backend`
